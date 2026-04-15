import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Images } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminGaleriPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: galeri } = await supabase
    .from('galeri')
    .select('*, images:galeri_images(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Galeri</h1>
          <Link href="/admin/galeri/tambah"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus size={16} /> Tambah Galeri
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {galeri?.map((item) => {
            const images = (item.images as { id: string; image_url: string }[]) || []
            const cover = images[0]?.image_url
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border dark:border-gray-700">
                <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={item.judul} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Images className="text-gray-300" size={36} />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {images.length} foto
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.judul}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{item.kategori}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Link href={`/admin/galeri/${item.id}`}
                      className="flex-1 text-center text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      Kelola Foto
                    </Link>
                    <DeleteButton id={item.id} table="galeri" />
                  </div>
                </div>
              </div>
            )
          })}
          {!galeri?.length && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <Images size={48} className="mx-auto mb-3 opacity-20" />
              <p>Belum ada galeri</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
