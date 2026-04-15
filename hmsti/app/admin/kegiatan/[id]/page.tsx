import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import KegiatanForm from '@/components/admin/KegiatanForm'

export default async function EditKegiatanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: kegiatan } = await supabase.from('kegiatan').select('*').eq('id', id).single()
  if (!kegiatan) notFound()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Kegiatan</h1>
        <KegiatanForm kegiatan={kegiatan} />
      </main>
    </div>
  )
}
