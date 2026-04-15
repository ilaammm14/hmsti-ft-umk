'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Image, Users, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Berhasil logout')
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-gray-900 text-gray-300 flex-col min-h-screen">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">H</div>
            <div>
              <p className="text-white font-semibold text-sm">HMSTI</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-gray-800 hover:text-white'
                }`}>
                <link.icon size={16} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-red-900/30 hover:text-red-400 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-2 safe-area-pb">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link key={link.href} href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-0 ${
                active ? 'text-amber-400' : 'text-gray-500'
              }`}>
              <link.icon size={20} />
              <span className="text-xs truncate">{link.label}</span>
            </Link>
          )
        })}
        <button onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-all">
          <LogOut size={20} />
          <span className="text-xs">Keluar</span>
        </button>
      </nav>
    </>
  )
}
