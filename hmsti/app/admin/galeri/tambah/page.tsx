'use client'

import { useState, useRef, useId } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Upload, X } from 'lucide-react'

async function convertToJpeg(file: File): Promise<File> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
  if (!isHeic) return file
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 }) as Blob
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
}

export default function TambahGaleriPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori: 'umum' })
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removePreview = (idx: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (previews.length < 2) { toast.error('Minimal upload 2 gambar'); return }

    setLoading(true)
    const supabase = createClient()

    // 1. Insert galeri
    const { data: galeri, error: galeriError } = await supabase
      .from('galeri')
      .insert([{ judul: form.judul, deskripsi: form.deskripsi, kategori: form.kategori }])
      .select().single()

    if (galeriError || !galeri) {
      toast.error('Gagal membuat galeri: ' + galeriError?.message)
      setLoading(false)
      return
    }

    // 2. Upload semua gambar
    let successCount = 0
    for (let i = 0; i < previews.length; i++) {
      try {
        const processed = await convertToJpeg(previews[i].file)
        if (processed.size > 10 * 1024 * 1024) { toast.error(`Foto ${i + 1} melebihi 10MB`); continue }
        const ext = processed.name.split('.').pop()
        const fileName = `galeri/${galeri.id}/${Date.now()}-${i}.${ext}`
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, processed, { upsert: true })
        if (uploadError) { toast.error(`Gagal upload foto ${i + 1}`); continue }
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName)
        await supabase.from('galeri_images').insert([{ galeri_id: galeri.id, image_url: urlData.publicUrl }])
        successCount++
      } catch { toast.error(`Error foto ${i + 1}`) }
    }

    setLoading(false)
    if (successCount > 0) {
      toast.success(`Galeri dibuat dengan ${successCount} foto`)
      router.push('/admin/galeri')
    } else {
      await supabase.from('galeri').delete().eq('id', galeri.id)
      toast.error('Tidak ada foto yang berhasil diupload')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tambah Galeri</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 max-w-2xl space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul *</label>
            <input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} required
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={3}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
            <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
              className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['umum', 'kegiatan', 'prestasi', 'dokumentasi'].map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          {/* Upload area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foto * <span className="text-gray-400 font-normal">(minimal 2, maks 2MB/foto, JPG/PNG/WEBP/HEIC)</span>
            </label>
            <input ref={fileRef} id={inputId} type="file" accept="image/*,.heic,.heif" multiple onChange={handleFiles} className="hidden" />
            <label htmlFor={inputId}
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
              <Upload className="text-gray-400 mb-1" size={20} />
              <p className="text-xs text-gray-500">Klik untuk pilih foto (JPG/PNG/WEBP/HEIC, maks 10MB)</p>
            </label>
          </div>

          {/* Preview grid */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePreview(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-xl transition-colors">
              {loading ? 'Menyimpan...' : `Simpan (${previews.length} foto)`}
            </button>
            <button type="button" onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Batal
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
