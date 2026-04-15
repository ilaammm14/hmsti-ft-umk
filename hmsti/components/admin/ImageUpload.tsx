'use client'

import { useState, useRef, useId } from 'react'
import { Upload, X, Link } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Props {
  value: string
  onChange: (url: string) => void
  folder?: string
  id?: string
}

async function convertToJpeg(file: File): Promise<File> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')

  if (!isHeic) return file

  try {
    // Dynamic import agar tidak error di SSR
    const heic2any = (await import('heic2any')).default
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 }) as Blob
    const converted = new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
    toast.success('File HEIC berhasil dikonversi ke JPEG')
    return converted
  } catch {
    toast.error('Gagal konversi HEIC, coba format lain')
    throw new Error('HEIC conversion failed')
  }
}

export default function ImageUpload({ value, onChange, folder = 'umum', id }: Props) {
  const [uploading, setUploading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  const fileRef = useRef<HTMLInputElement>(null)
  const reactId = useId()
  const stableId = `upload-${id || folder}-${reactId.replace(/:/g, '')}`

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isSupabaseConfigured()) {
      toast.error('Supabase belum dikonfigurasi')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 20MB')
      return
    }

    try {
      // Konversi HEIC jika perlu
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')

      if (isHeic) setConverting(true)
      const processedFile = await convertToJpeg(file)
      setConverting(false)

      setUploading(true)
      const supabase = createClient()
      const ext = processedFile.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}.${ext}`

      const { error } = await supabase.storage.from('media').upload(fileName, processedFile, { upsert: true })

      if (error) {
        toast.error('Gagal upload: ' + error.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('media').getPublicUrl(fileName)
      onChange(data.publicUrl)
      toast.success('Gambar berhasil diupload')
    } catch {
      // Error sudah ditampilkan di convertToJpeg
    } finally {
      setUploading(false)
      setConverting(false)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput.startsWith('http')) {
      toast.error('URL harus diawali https://')
      return
    }
    onChange(urlInput)
    toast.success('URL gambar disimpan')
  }

  const handleRemove = () => {
    onChange('')
    setUrlInput('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const isLoading = uploading || converting
  const loadingText = converting ? 'Mengkonversi HEIC...' : 'Mengupload...'

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}>
          <Upload size={12} /> Upload File
        </button>
        <button type="button" onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            mode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}>
          <Link size={12} /> Pakai URL
        </button>
      </div>

      {/* Upload mode */}
      {mode === 'upload' && (
        <div>
          <input ref={fileRef} type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFile}
            className="hidden"
            id={stableId}
          />
          <label htmlFor={stableId}
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              isLoading
                ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
            }`}>
            {isLoading ? (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {loadingText}
              </div>
            ) : (
              <>
                <Upload className="text-gray-400 mb-1" size={20} />
                <p className="text-xs text-gray-500 dark:text-gray-400">Klik untuk pilih gambar</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP, HEIC — maks 20MB</p>
              </>
            )}
          </label>
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            className="flex-1 px-3 py-2 text-sm border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="button" onClick={handleUrlSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            Pakai
          </button>
        </div>
      )}
    </div>
  )
}
