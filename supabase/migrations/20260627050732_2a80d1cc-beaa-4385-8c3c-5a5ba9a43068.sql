
ALTER TABLE public.products
  DROP COLUMN IF EXISTS material,
  DROP COLUMN IF EXISTS color,
  DROP COLUMN IF EXISTS stock_quantity,
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS in_stock boolean NOT NULL DEFAULT true;

-- Backfill image_urls from existing image_url for legacy rows
UPDATE public.products
SET image_urls = ARRAY[image_url]
WHERE (image_urls IS NULL OR cardinality(image_urls) = 0) AND coalesce(image_url, '') <> '';

-- Allow public read on storage objects in the product-images bucket
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
