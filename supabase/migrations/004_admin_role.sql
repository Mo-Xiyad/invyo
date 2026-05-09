-- Add role to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Set current known user as admin
UPDATE public.profiles
SET role = 'admin'
WHERE id = '6dfe5d88-5909-4256-b46e-d7b795e9baab';

-- Admin bypass functions (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_get_stats()
RETURNS TABLE(
  total_users BIGINT,
  published_invitations BIGINT,
  draft_invitations BIGINT,
  total_revenue BIGINT,
  total_rsvps BIGINT
) LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH authorized AS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  SELECT
    (SELECT COUNT(*) FROM public.profiles) AS total_users,
    (SELECT COUNT(*) FROM public.invitations WHERE status = 'published') AS published_invitations,
    (SELECT COUNT(*) FROM public.invitations WHERE status = 'draft') AS draft_invitations,
    (SELECT COALESCE(SUM(amount_paid), 0) FROM public.invitations WHERE status = 'published') AS total_revenue,
    (SELECT COUNT(*) FROM public.rsvp_responses) AS total_rsvps
  FROM authorized;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_invitations()
RETURNS TABLE(
  id UUID,
  user_id UUID,
  user_email TEXT,
  template_id TEXT,
  slug TEXT,
  status TEXT,
  amount_paid INTEGER,
  currency TEXT,
  rsvp_count BIGINT,
  created_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
) LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH authorized AS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  SELECT
    i.id,
    i.user_id,
    p.email AS user_email,
    i.template_id,
    i.slug,
    i.status,
    i.amount_paid,
    i.currency,
    (SELECT COUNT(*) FROM public.rsvp_responses r WHERE r.invitation_id = i.id) AS rsvp_count,
    i.created_at,
    i.published_at
  FROM public.invitations i
  LEFT JOIN public.profiles p ON p.id = i.user_id
  CROSS JOIN authorized
  ORDER BY i.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_rsvps()
RETURNS TABLE(
  id UUID,
  guest_name TEXT,
  attending BOOLEAN,
  guests_count INTEGER,
  message TEXT,
  invitation_slug TEXT,
  invitation_id UUID,
  created_at TIMESTAMPTZ
) LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH authorized AS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  SELECT
    r.id,
    r.guest_name,
    r.attending,
    r.guests_count,
    r.message,
    i.slug AS invitation_slug,
    r.invitation_id,
    r.created_at
  FROM public.rsvp_responses r
  LEFT JOIN public.invitations i ON i.id = r.invitation_id
  CROSS JOIN authorized
  ORDER BY r.created_at DESC
  LIMIT 100;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE(
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  invitation_count BIGINT,
  created_at TIMESTAMPTZ
) LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH authorized AS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    (SELECT COUNT(*) FROM public.invitations i WHERE i.user_id = p.id) AS invitation_count,
    p.created_at
  FROM public.profiles p
  CROSS JOIN authorized
  ORDER BY p.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.admin_get_stats() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_get_invitations() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_get_rsvps() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_get_users() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.admin_get_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_invitations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_rsvps() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_users() TO authenticated;
