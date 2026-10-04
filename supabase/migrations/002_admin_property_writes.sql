GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;

DROP POLICY IF EXISTS "HAVEN admins can insert properties" ON public.properties;
CREATE POLICY "HAVEN admins can insert properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');

DROP POLICY IF EXISTS "HAVEN admins can update properties" ON public.properties;
CREATE POLICY "HAVEN admins can update properties"
ON public.properties
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');

DROP POLICY IF EXISTS "HAVEN admins can delete properties" ON public.properties;
CREATE POLICY "HAVEN admins can delete properties"
ON public.properties
FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true');