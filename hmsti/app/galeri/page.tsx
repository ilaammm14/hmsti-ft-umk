'use client'

import { useState, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Galeri } from '@/lib/types'
import { SkeletonCard } from '@/components/SkeletonCard'
import { Images } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

type GaleriWithImages = Galeri & { images: { id: string; image_url: string }[] }

export default function GaleriPage() {
  const [galeri, setGaleri] = useState<GaleriWithImages[]>([])
  const [filtered, setFiltered] = useState<GaleriWithImages[]>([])
  const [kategori, setKategori] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return }
    const supabase = createClient()
    supabase
      .from('galeri')
      .select('*, images:galeri_images(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data || []) as GaleriWithImages[]
        setGaleri(list)
        setFiltered(list)
        setLoading(false)
      })
  }, [])

  const kategoriList = ['Semua', ...new Set(galeri.map(g => g.kategori))]

  const handleFilter = (k: string) => {
    setKategori(k)
    setFiltered(k === 'Semua' ? galeri : galeri.filter(g => g.kategori === k))
  }

  const openGaleri = (item: GaleriWithImages, startIdx = 0) => {
    setLightboxSlides(item.images.map(i => ({ src: i.image_url })))
    setLightboxIndex(startIdx)
    setLightboxOpen(true)
  }

  return (
    <>
      <PageHeader label="Dokumentasi" title="Galeri" description="Dokumentasi foto kegiatan HMSTI" />
      <div className="bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {kategoriList.map(k => (
              <button key={k} onClick={() => handleFilter(k)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  kategori === k
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-amber-500/40 hover:text-amber-400'
                }`}>
                {k}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map(item => {
                const cover = item.images?.[0]?.image_url
                const count = item.images?.length || 0
                return (
                  <button key={item.id} onClick={() => openGaleri(item, 0)}
                    className="group text-left bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 w-full">
                    {/* Cover */}
                    <div className="relative h-48 bg-gray-800">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt={item.judul} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" decoding="async" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Images className="text-amber-500/20" size={40} />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        {item.kategori}
                      </span>
                      {count > 1 && (
                        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Images size={10} /> {count}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{item.judul}</h3>
                      {item.deskripsi && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.deskripsi}</p>}

                      {/* Mini grid preview */}
                      {count > 1 && (
                        <div className="flex gap-1.5 mt-3">
                          {item.images.slice(1, 4).map((img, idx) => (
                            <div key={img.id} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {count > 4 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                              +{count - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600">
              <Images size={56} className="mx-auto mb-4 opacity-20" />
              <p>Belum ada galeri</p>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </>
  )
}
