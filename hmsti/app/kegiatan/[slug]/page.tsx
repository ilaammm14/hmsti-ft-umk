import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ArrowLeft, Tag } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export default async function KegiatanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isSupabaseConfigured()) notFound()
  const supabase = await createClient()
  const { data: kegiatan } = await supabase.from('kegiatan').select('*').eq('slug', slug).single()

  if (!kegiatan) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/kegiatan" className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-6">
        <ArrowLeft size={16} /> Kembali ke Kegiatan
      </Link>
      {kegiatan.gambar && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 border border-gray-800">
          <Image src={kegiatan.gambar} alt={kegiatan.judul} fill className="object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-3 py-1 rounded-full">
          <Tag size={12} /> {kegiatan.kategori}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
          <Calendar size={14} />
          {new Date(kegiatan.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        {kegiatan.lokasi && (
          <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={14} /> {kegiatan.lokasi}
          </span>
        )}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{kegiatan.judul}</h1>
      <div className="text-gray-400 leading-relaxed whitespace-pre-wrap">{kegiatan.deskripsi}</div>
    </div>
  )
}
