'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Galeri, GaleriImage } from '@/lib/types'

export default function GaleriDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [galeri, setGaleri] = useState<Galeri | null>(null)
  const [images, setImages] = useState<GaleriImage[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured() || !id) { setLoading(false); return }
    const supabase = createClient()
    Promise.all([
      supabase.from('galeri').select('*').eq('id', id).single(),
      supabase.from('galeri_images').select('*').eq('galeri_id', id).order('created_at'),
    ]).then(([{ data: g }, { data: imgs }]) => {
      setGaleri(g)
      setImages(imgs || [])
      setLoading(false)
    })
  }, [id])

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setActiveIdx(i => (i + 1) % images.length)

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!galeri) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-gray-500">
        Galeri tidak ditemukan
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-6 text-sm">
          <ArrowLeft size={16} /> Kembali ke Galeri
        </button>

        {/* Foto slider */}
        {images.length > 0 ? (
          <div className="relative mb-6">
            {/* Gambar utama */}
            <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[activeIdx]?.image_url}
                alt={`${galeri.judul} ${activeIdx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Navigasi panah */}
              {images.length > 1 && (
                <>
                  <button onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all">
                    <ChevronRight size={20} />
                  </button>
                  {/* Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {activeIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeIdx ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video rounded-2xl bg-gray-800 flex items-center justify-center mb-6">
            <Images className="text-gray-600" size={48} />
          </div>
        )}

        {/* Info galeri */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">{galeri.kategori}</span>
            {images.length > 0 && (
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Images size={12} /> {images.length} foto
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{galeri.judul}</h1>
          {galeri.deskripsi && (
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{galeri.deskripsi}</p>
          )}
        </div>
      </div>
    </div>
  )
}
