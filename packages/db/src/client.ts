import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "./env";

let serverClient: SupabaseClient | null = null;

/** Server-side Supabase client (secret key). Never import from client components. */
export function getSupabaseServer(): SupabaseClient {
  if (serverClient) return serverClient;

  const url = getSupabaseUrl();
  const key = getSupabaseSecretKey();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase config — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in apps/web/.env.local",
    );
  }

  serverClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serverClient;
}

/** @deprecated Use getSupabaseServer */
export const getSupabaseAdmin = getSupabaseServer;
