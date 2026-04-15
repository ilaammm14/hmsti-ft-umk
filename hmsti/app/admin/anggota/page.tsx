import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminAnggotaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: anggota } = await supabase.from('anggota').select('*').order('tipe').order('urutan')

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Anggota</h1>
          <Link href="/admin/anggota/tambah"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus size={16} /> Tambah
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Nama</th>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Jabatan</th>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Tipe</th>
                <th className="text-left px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">Periode</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {anggota?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900/30 shrink-0">
                        {item.foto ? (
                          <Image src={item.foto} alt={item.nama} width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-blue-400 text-xs font-bold">{item.nama.charAt(0)}</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{item.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{item.jabatan}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.tipe === 'pengurus' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      item.tipe === 'dewan_pengawas' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>{item.tipe}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{item.periode}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/anggota/${item.id}`}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-xs px-2">
                        Edit
                      </Link>
                      <DeleteButton id={item.id} table="anggota" />
                    </div>
                  </td>
                </tr>
              ))}
              {!anggota?.length && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">Belum ada anggota</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
