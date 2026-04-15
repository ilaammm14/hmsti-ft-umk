'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id, table }: { id: string; table: string }) {
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error('Gagal menghapus')
    } else {
      toast.success('Berhasil dihapus')
      router.refresh()
    }
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700">Ya</button>
        <button onClick={() => setConfirming(false)} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">Batal</button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
      <Trash2 size={15} />
    </button>
  )
}
