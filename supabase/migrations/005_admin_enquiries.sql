ALTER TABLE public.inquiries
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.inquiries'::regclass
      AND conname = 'inquiries_status_allowed'
  ) THEN
    ALTER TABLE public.inquiries
    ADD CONSTRAINT inquiries_status_allowed
    CHECK (status IN ('new', 'read', 'archived'));
  END IF;
END;
$$;

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.inquiries FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT ON public.inquiries TO authenticated;
GRANT UPDATE (status) ON public.inquiries TO authenticated;

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
ON public.inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "HAVEN admins can read inquiries" ON public.inquiries;
CREATE POLICY "HAVEN admins can read inquiries"
ON public.inquiries
FOR SELECT
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');

DROP POLICY IF EXISTS "HAVEN admins can update inquiry status" ON public.inquiries;
CREATE POLICY "HAVEN admins can update inquiry status"
ON public.inquiries
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');