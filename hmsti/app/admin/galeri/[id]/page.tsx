'use client'

import { useState, useEffect, useRef, useId } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ArrowLeft, Upload, X } from 'lucide-react'
import type { Galeri, GaleriImage } from '@/lib/types'

async function convertToJpeg(file: File): Promise<File> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
  if (!isHeic) return file
  const heic2any = (await import('heic2any')).default
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 }) as Blob
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
}

export default function KelolaGaleriPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [galeriId, setGaleriId] = useState('')
  const [galeri, setGaleri] = useState<Galeri | null>(null)
  const [images, setImages] = useState<GaleriImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [editForm, setEditForm] = useState({ judul: '', deskripsi: '', kategori: 'umum' })
  const [savingInfo, setSavingInfo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  useEffect(() => {
    params.then(({ id }) => {
      setGaleriId(id)
      const supabase = createClient()
      supabase.from('galeri').select('*').eq('id', id).single().then(({ data }) => {
        setGaleri(data)
        if (data) setEditForm({ judul: data.judul || '', deskripsi: data.deskripsi || '', kategori: data.kategori || 'umum' })
      })
      supabase.from('galeri_images').select('*').eq('galeri_id', id).order('created_at').then(({ data }) => setImages(data || []))
    })
  }, [params])

  const handleSaveInfo = async () => {
    if (!galeriId) return
    setSavingInfo(true)
    const supabase = createClient()
    const { error } = await supabase.from('galeri').update({
      judul: editForm.judul,
      deskripsi: editForm.deskripsi,
      kategori: editForm.kategori,
    }).eq('id', galeriId)
    setSavingInfo(false)
    if (error) toast.error('Gagal menyimpan: ' + error.message)
    else toast.success('Info galeri diperbarui')
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const supabase = createClient()
    const uploaded: GaleriImage[] = []

    for (let i = 0; i < files.length; i++) {
      try {
        const processed = await convertToJpeg(files[i])
        if (processed.size > 10 * 1024 * 1024) { toast.error(`Foto ${i + 1} melebihi 10MB`); continue }
        const ext = processed.name.split('.').pop()
        const fileName = `galeri/${galeriId}/${Date.now()}-${i}.${ext}`
        const { error } = await supabase.storage.from('media').upload(fileName, processed, { upsert: true })
        if (error) { toast.error(`Gagal upload foto ${i + 1}`); continue }
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName)
        const { data: imgData } = await supabase.from('galeri_images')
          .insert([{ galeri_id: galeriId, image_url: urlData.publicUrl }]).select().single()
        if (imgData) uploaded.push(imgData)
      } catch { toast.error(`Error foto ${i + 1}`) }
    }

    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
    if (uploaded.length > 0) toast.success(`${uploaded.length} foto ditambahkan`)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (imgId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('galeri_images').delete().eq('id', imgId)
    if (error) toast.error('Gagal hapus foto')
    else { setImages(prev => prev.filter(i => i.id !== imgId)); toast.success('Foto dihapus') }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/galeri" className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{galeri?.judul || 'Galeri'}</h1>
            <p className="text-sm text-gray-400">{images.length} foto</p>
          </div>
        </div>

        {/* Form edit info galeri */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border dark:border-gray-700 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Info Galeri</h2>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Judul</label>
            <input value={editForm.judul} onChange={e => setEditForm(f => ({ ...f, judul: e.target.value }))}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Deskripsi</label>
            <textarea value={editForm.deskripsi} onChange={e => setEditForm(f => ({ ...f, deskripsi: e.target.value }))}
              rows={3} placeholder="Tambahkan deskripsi galeri..."
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Kategori</label>
            <select value={editForm.kategori} onChange={e => setEditForm(f => ({ ...f, kategori: e.target.value }))}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['umum', 'kegiatan', 'prestasi', 'dokumentasi'].map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <button onClick={handleSaveInfo} disabled={savingInfo}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition-colors">
            {savingInfo ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {/* Upload */}
        <div className="mb-6">
          <input ref={fileRef} id={inputId} type="file" accept="image/*,.heic,.heif" multiple onChange={handleFiles} className="hidden" />
          <label htmlFor={inputId}
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              uploading ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
            }`}>
            {uploading ? (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Mengupload...
              </div>
            ) : (
              <>
                <Upload className="text-gray-400 mb-1" size={20} />
                <p className="text-xs text-gray-500">Klik untuk tambah foto (JPG/PNG/WEBP/HEIC, maks 10MB)</p>
              </>
            )}
          </label>
        </div>

        {/* Grid foto */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => handleDelete(img.id)}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>Belum ada foto. Upload di atas.</p>
          </div>
        )}
      </main>
    </div>
  )
}
