-- Add payment tracking fields to invitations
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS amount_paid INTEGER, -- in cents
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';

-- Index for webhook lookup
CREATE INDEX IF NOT EXISTS invitations_stripe_session_idx ON public.invitations (stripe_session_id);
