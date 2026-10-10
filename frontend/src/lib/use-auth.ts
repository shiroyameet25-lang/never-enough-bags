import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}



export function useIsAdmin(user: User | null | undefined) {
  return useQuery({
    queryKey: ["is-admin", user?.id ?? "anon"],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return false;

      // એડમિન ઈમેઈલનું સિક્યોર લિસ્ટ
      const adminEmails = [
        "meetshiroya1712@gmail.com",
        "neevabag@gmail.com"
      ];

      // ડાયરેક્ટ ઈમેઈલ ચેક કરીને ટ્રુ કે ફોલ્સ રિટર્ન કરો
      const isMatch = user.email && adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase());
      return !!isMatch;
    },
  });
}