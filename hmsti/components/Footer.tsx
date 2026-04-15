import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

function IconInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
    </svg>
  )
}

export default async function Footer() {
  let settings = null
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data } = await supabase.from('settings').select('*').single()
    settings = data
  }

  return (
    <footer className="bg-black border-t border-amber-500/20 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {settings?.logo_himpunan ? (
                <Image src={settings.logo_himpunan} alt="Logo HMSTI" width={44} height={44} className="object-contain" />
              ) : (
                <div className="w-11 h-11 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-amber-400 font-bold">H</div>
              )}
              {settings?.logo_kampus && (
                <Image src={settings.logo_kampus} alt="Logo Kampus" width={36} height={36} className="object-contain opacity-80" />
              )}
            </div>
            <h3 className="text-amber-400 font-bold text-lg">HMSTI</h3>
            <p className="text-sm text-gray-500 mt-1">Himpunan Mahasiswa Sistem dan Teknologi Informasi</p>
            <p className="text-sm text-gray-600 mt-1">{settings?.nama_kampus || 'Universitas Muhammadiyah Kendari'}</p>
            {settings?.alamat && (
              <div className="flex items-start gap-2 mt-3 text-sm text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0 text-amber-500/50" />
                <span>{settings.alamat}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/kegiatan', label: 'Kegiatan' },
                { href: '/galeri', label: 'Galeri' },
                { href: '/struktur-organisasi', label: 'Struktur Organisasi' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-amber-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">Hubungi Kami</h4>
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors mb-3">
                <Mail size={16} className="text-amber-500/60" />
                {settings.email}
              </a>
            )}
            <div className="flex gap-3 mt-2">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all" aria-label="Instagram">
                  <IconInstagram />
                </a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all" aria-label="Facebook">
                  <IconFacebook />
                </a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer"
                  className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all" aria-label="YouTube">
                  <IconYoutube />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-10 pt-6 text-center text-sm text-gray-700">
          © {new Date().getFullYear()} <span className="text-amber-500/70">HMSTI</span> — Himpunan Mahasiswa Sistem dan Teknologi Informasi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
