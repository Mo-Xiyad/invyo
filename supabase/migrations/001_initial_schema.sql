-- Invyo initial schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/zbcszqycbxlkrtqcjedu/sql

-- ── Profiles (extends auth.users) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT,
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── Invitations ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitations (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id  TEXT NOT NULL,
  slug         TEXT UNIQUE,
  title        TEXT,
  data         JSONB DEFAULT '{}',
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own invitations"
  ON public.invitations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invitations"
  ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations"
  ON public.invitations FOR UPDATE USING (auth.uid() = user_id);

-- Public invitations readable by anyone (for the published subdomain page)
CREATE POLICY "Published invitations are public"
  ON public.invitations FOR SELECT USING (status = 'published');

-- ── RSVP responses ─────────────────────────────────────────────────────────── 
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id  UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name     TEXT NOT NULL,
  email          TEXT,
  attending      BOOLEAN NOT NULL,
  guests_count   INTEGER DEFAULT 1,
  message        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Guests can submit RSVPs without auth
CREATE POLICY "Anyone can submit RSVP"
  ON public.rsvp_responses FOR INSERT WITH CHECK (true);

-- Only invitation owner can read RSVPs
CREATE POLICY "Owner can read RSVPs"
  ON public.rsvp_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_id
        AND invitations.user_id = auth.uid()
    )
  );

-- ── Auto-create profile on sign-up ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
