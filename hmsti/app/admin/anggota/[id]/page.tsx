import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AnggotaForm from '@/components/admin/AnggotaForm'

export default async function EditAnggotaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: anggota } = await supabase.from('anggota').select('*').eq('id', id).single()
  if (!anggota) notFound()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Anggota</h1>
        <AnggotaForm anggota={anggota} />
      </main>
    </div>
  )
}
