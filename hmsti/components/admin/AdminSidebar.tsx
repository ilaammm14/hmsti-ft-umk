'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Image, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kegiatan', label: 'Kegiatan', icon: Calendar },
  { href: '/admin/galeri', label: 'Galeri', icon: Image },
  { href: '/admin/anggota', label: 'Anggota', icon: Users },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname.startsWith(href)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Berhasil logout')
    router.push('/admin/login')
    router.refresh()
  }

  const currentPage = links.find(l => isActive(l.href))

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-60 bg-gray-900 text-gray-300 flex-col min-h-screen shrink-0">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-sm shrink-0">H</div>
            <div>
              <p className="text-white font-semibold text-sm">HMSTI</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive(link.href) ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-gray-800 hover:text-white'
              }`}>
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-red-900/30 hover:text-red-400 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-xs shrink-0">H</div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">HMSTI Admin</p>
            {currentPage && (
              <p className="text-amber-400 text-xs leading-tight">{currentPage.label}</p>
            )}
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg" aria-label="Menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Drawer Menu ── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <div className="md:hidden fixed top-14 right-0 bottom-0 z-50 w-64 bg-gray-900 border-l border-gray-800 flex flex-col">
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {links.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive(link.href)
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}>
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-800">
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Spacer untuk mobile top bar */}
      <div className="md:hidden h-14 shrink-0" />
    </>
  )
}
