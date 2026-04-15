import { createClient } from '@supabase/supabase-js'

// Pakai anon key — RLS harus dimatikan untuk tabel galeri
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
