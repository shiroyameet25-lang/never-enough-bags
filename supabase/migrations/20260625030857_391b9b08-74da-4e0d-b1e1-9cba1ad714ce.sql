
-- Restrict profiles SELECT to the authenticated owner only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Lock down SECURITY DEFINER functions from direct execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role must remain executable by authenticated users so RLS policies that
-- reference it (e.g. admin checks on products and user_roles) continue to work.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
