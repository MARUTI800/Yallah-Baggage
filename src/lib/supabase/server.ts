import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Server-only Supabase client.
// Prefer the service role key when available so RLS policies don't block writes.
export function getSupabaseServer(): SupabaseClient {
  const supabaseUrl = requireEnv("SUPABASE_URL", process.env.SUPABASE_URL);

  const anonKey = requireEnv(
    "SUPABASE_ANON_KEY",
    process.env.SUPABASE_ANON_KEY,
  );

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const keyToUse = serviceRoleKey ?? anonKey;

  return createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
    },
  });
}
