import { createClient, SupabaseClient } from "@supabase/supabase-js";

// https://supabase.com/docs/reference/javascript/initializing

export class SupabaseConnection {
  public readonly connection: SupabaseClient;

  public constructor(key: string, url: string, options?: any) {
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
        headers: {},
      },
    };
    options = options ?? defaultOptions;
    this.connection = createClient(url, key, options ?? {});
  }
}
