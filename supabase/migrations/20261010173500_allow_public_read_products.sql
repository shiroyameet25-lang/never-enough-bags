-- 1. Allow unauthenticated (anon) and authenticated users to read the product catalog
GRANT SELECT ON public.products TO anon, authenticated;

DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Allow public read" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.products;

CREATE POLICY "Products viewable by everyone"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Protect private order data: Ensure anonymous visitors cannot read orders
REVOKE SELECT ON public.orders FROM anon;
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read" ON public.orders;
