'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Settings } from '@/lib/types'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/kegiatan', label: 'Kegiatan' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/struktur-organisasi', label: 'Struktur' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.from('settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data)
    })
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/50 border-b border-amber-500/20'
        : 'bg-black border-b border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            {settings?.logo_himpunan ? (
              <Image src={settings.logo_himpunan} alt="Logo HMSTI" width={40} height={40}
                className="object-contain transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center text-amber-400 font-bold text-sm">H</div>
            )}
            {settings?.logo_kampus && (
              <Image src={settings.logo_kampus} alt="Logo Kampus" width={32} height={32}
                className="object-contain opacity-80 transition-all group-hover:opacity-100 group-hover:scale-105" />
            )}
            <div className="block">
              <p className="font-bold text-amber-400 text-xs sm:text-sm leading-tight line-clamp-1">Himpunan Mahasiswa Sistem dan Teknologi Informasi</p>
              <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                {settings?.nama_kampus || 'Universitas Muhammadiyah Kendari'}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                {link.label}
              </Link>
            ))}
          </div>

          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-amber-400 relative z-50" aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
