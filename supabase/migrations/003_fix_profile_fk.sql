-- Backfill profiles for any auth users that signed up before the trigger was created
INSERT INTO public.profiles (id, email, full_name)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Change invitations.user_id FK to reference auth.users directly
-- This means invitations are never blocked by a missing profile row
ALTER TABLE public.invitations
  DROP CONSTRAINT IF EXISTS invitations_user_id_fkey;

ALTER TABLE public.invitations
  ADD CONSTRAINT invitations_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
