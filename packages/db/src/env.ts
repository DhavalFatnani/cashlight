export function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  );
}

/** Secret key — bypasses RLS; use only in API routes and server code. */
export function getSupabaseSecretKey(): string {
  return process.env.SUPABASE_SECRET_KEY ?? "";
}
