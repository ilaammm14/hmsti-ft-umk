'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Kegiatan } from '@/lib/types'
import ImageUpload from './ImageUpload'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
}

export default function KegiatanForm({ kegiatan }: { kegiatan?: Kegiatan }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    judul: kegiatan?.judul || '',
    deskripsi: kegiatan?.deskripsi || '',
    tanggal: kegiatan?.tanggal || '',
    lokasi: kegiatan?.lokasi || '',
    kategori: kegiatan?.kategori || 'umum',
    gambar: kegiatan?.gambar || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    if (kegiatan) {
      const { error } = await supabase.from('kegiatan').update(form).eq('id', kegiatan.id)
      if (error) toast.error('Gagal update'); else { toast.success('Berhasil diupdate'); router.push('/admin/kegiatan') }
    } else {
      const { error } = await supabase.from('kegiatan').insert([{ ...form, slug: slugify(form.judul) }])
      if (error) toast.error('Gagal menyimpan'); else { toast.success('Berhasil disimpan'); router.push('/admin/kegiatan') }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 max-w-2xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul *</label>
        <input name="judul" value={form.judul} onChange={handleChange} required
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal *</label>
          <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} required
            className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
          <select name="kategori" value={form.kategori} onChange={handleChange}
            className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['umum', 'akademik', 'sosial', 'olahraga', 'seni', 'teknologi'].map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lokasi</label>
        <input name="lokasi" value={form.lokasi} onChange={handleChange}
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gambar</label>
        <ImageUpload
          value={form.gambar}
          onChange={(url) => setForm({ ...form, gambar: url })}
          folder="kegiatan"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
        <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={5}
          className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl transition-colors">
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Batal
        </button>
      </div>
    </form>
  )
}
