import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: settings } = await supabase.from('settings').select('*').single()

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Pengaturan Website</h1>
        <SettingsForm settings={settings} />
      </main>
    </div>
  )
}
