ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS media jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.properties'::regclass
      AND conname = 'properties_media_is_array'
  ) THEN
    ALTER TABLE public.properties
    ADD CONSTRAINT properties_media_is_array
    CHECK (jsonb_typeof(media) = 'array');
  END IF;
END;
$$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'haven-property-media',
  'haven-property-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view HAVEN property media" ON storage.objects;
CREATE POLICY "Public can view HAVEN property media"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'haven-property-media');

DROP POLICY IF EXISTS "HAVEN admins can upload property media" ON storage.objects;
CREATE POLICY "HAVEN admins can upload property media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'haven-property-media'
  AND name LIKE 'properties/%'
  AND (auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true'
);

DROP POLICY IF EXISTS "HAVEN admins can delete property media" ON storage.objects;
CREATE POLICY "HAVEN admins can delete property media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'haven-property-media'
  AND name LIKE 'properties/%'
  AND (auth.jwt() -> 'app_metadata' ->> 'haven_admin') = 'true'
);