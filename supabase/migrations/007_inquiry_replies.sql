CREATE TABLE IF NOT EXISTS public.inquiry_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  to_email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  provider_message_id text,
  failure_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS inquiry_replies_inquiry_id_created_at_idx
ON public.inquiry_replies (inquiry_id, created_at DESC);

ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.inquiry_replies FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.inquiry_replies TO authenticated;
GRANT UPDATE (status, provider_message_id, failure_message, sent_at)
ON public.inquiry_replies TO authenticated;

DROP POLICY IF EXISTS "HAVEN admins can read inquiry replies" ON public.inquiry_replies;
CREATE POLICY "HAVEN admins can read inquiry replies"
ON public.inquiry_replies
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');

DROP POLICY IF EXISTS "HAVEN admins can create inquiry replies" ON public.inquiry_replies;
CREATE POLICY "HAVEN admins can create inquiry replies"
ON public.inquiry_replies
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');

DROP POLICY IF EXISTS "HAVEN admins can update inquiry replies" ON public.inquiry_replies;
CREATE POLICY "HAVEN admins can update inquiry replies"
ON public.inquiry_replies
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');