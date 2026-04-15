import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminKegiatanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: kegiatan } = await supabase.from('kegiatan').select('*').order('tanggal', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kegiatan</h1>
          <Link href="/admin/kegiatan/tambah"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus size={16} /> Tambah
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Judul</th>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Tanggal</th>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Kategori</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {kegiatan?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3 text-gray-900 dark:text-white font-medium">{item.judul}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/kegiatan/${item.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <DeleteButton id={item.id} table="kegiatan" />
                    </div>
                  </td>
                </tr>
              ))}
              {!kegiatan?.length && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">Belum ada kegiatan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
