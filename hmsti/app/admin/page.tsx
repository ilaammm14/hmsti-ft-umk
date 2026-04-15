import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Calendar, Image, Users } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [{ count: kegiatanCount }, { count: galeriCount }, { count: anggotaCount }] = await Promise.all([
    supabase.from('kegiatan').select('*', { count: 'exact', head: true }),
    supabase.from('galeri').select('*', { count: 'exact', head: true }),
    supabase.from('anggota').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Kegiatan', value: kegiatanCount || 0, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Foto Galeri', value: galeriCount || 0, icon: Image, color: 'bg-purple-500' },
    { label: 'Anggota', value: anggotaCount || 0, icon: Users, color: 'bg-green-500' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
