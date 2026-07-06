
-- 1) Restrict has_role EXECUTE: revoke from public/anon, keep only authenticated + service_role
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2) Orders: enforce non-null user_id and add admin DELETE policy
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;
CREATE POLICY "Admins delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Drop duplicate storage SELECT policy for product-images
DROP POLICY IF EXISTS "Product images public read" ON storage.objects;
