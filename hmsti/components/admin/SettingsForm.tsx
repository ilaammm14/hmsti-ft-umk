'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Settings } from '@/lib/types'
import ImageUpload from './ImageUpload'

export default function SettingsForm({ settings }: { settings: Settings | null }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nama_website: settings?.nama_website || 'HMSTI',
    nama_kampus: settings?.nama_kampus || '',
    logo_himpunan: settings?.logo_himpunan || '',
    logo_kampus: settings?.logo_kampus || '',
    instagram: settings?.instagram || '',
    facebook: settings?.facebook || '',
    youtube: settings?.youtube || '',
    email: settings?.email || '',
    alamat: settings?.alamat || '',
    video_url: settings?.video_url || '',
    video_judul: settings?.video_judul || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    if (settings?.id) {
      const { error } = await supabase.from('settings').update(form).eq('id', settings.id)
      if (error) toast.error('Gagal menyimpan'); else toast.success('Pengaturan disimpan!')
    } else {
      const { error } = await supabase.from('settings').insert([form])
      if (error) toast.error('Gagal menyimpan'); else toast.success('Pengaturan disimpan!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 max-w-2xl space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-gray-700">Identitas</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Website</label>
            <input name="nama_website" value={form.nama_website} onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kampus</label>
            <input name="nama_kampus" value={form.nama_kampus} onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-gray-700">Logo</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Himpunan</label>
            <ImageUpload
              value={form.logo_himpunan}
              onChange={(url) => setForm({ ...form, logo_himpunan: url })}
              folder="logos"
              id="logo-himpunan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Kampus</label>
            <ImageUpload
              value={form.logo_kampus}
              onChange={(url) => setForm({ ...form, logo_kampus: url })}
              folder="logos"
              id="logo-kampus"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-gray-700">Sosial Media & Kontak</h3>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
              <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..."
                className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook</label>
              <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..."
                className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube</label>
              <input name="youtube" value={form.youtube} onChange={handleChange} placeholder="https://youtube.com/..."
                className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
            <input name="alamat" value={form.alamat} onChange={handleChange}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Video */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b dark:border-gray-700">Video Profil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul Video</label>
            <input name="video_judul" value={form.video_judul} onChange={handleChange}
              placeholder="cth: Profil HMSTI 2024"
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL YouTube <span className="text-gray-400 font-normal text-xs">(paste link YouTube biasa)</span>
            </label>
            <input name="video_url" value={form.video_url} onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {form.video_url && (
              <p className="text-xs text-green-500 mt-1">✓ Video akan tampil di beranda</p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
        {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  )
}
