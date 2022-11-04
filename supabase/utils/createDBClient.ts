import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

export default function createDBClient(authorization: string, options?: any) {
  const defaultOptions = {
    db: {
      schema: "public",
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  };

  return createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    options ?? defaultOptions
  );
}
