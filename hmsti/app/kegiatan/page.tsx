import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Search } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'Kegiatan - HMSTI' }

const ITEMS_PER_PAGE = 9

export default async function KegiatanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; page?: string }>
}) {
  const params = await searchParams
  const q = params.q || ''
  const kategori = params.kategori || ''
  const page = parseInt(params.page || '1')
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const supabase = isSupabaseConfigured() ? await createClient() : null
  let kegiatan = null, count = 0, uniqueKategori: string[] = []

  if (supabase) {
    let query = supabase.from('kegiatan').select('*', { count: 'exact' }).order('tanggal', { ascending: false })
    if (q) query = query.ilike('judul', `%${q}%`)
    if (kategori) query = query.eq('kategori', kategori)
    const result = await query.range(from, to)
    kegiatan = result.data
    count = result.count || 0
    const { data: kategoriList } = await supabase.from('kegiatan').select('kategori').order('kategori')
    uniqueKategori = [...new Set(kategoriList?.map((k) => k.kategori) || [])]
  }

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE)

  return (
    <>
      <PageHeader label="Dokumentasi" title="Kegiatan" description="Dokumentasi seluruh kegiatan HMSTI" />
    <div className="bg-gray-950 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <form className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input name="q" defaultValue={q} placeholder="Cari kegiatan..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-800 rounded-xl bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm" />
        </div>
        <select name="kategori" defaultValue={kategori}
          className="px-4 py-2.5 border border-gray-800 rounded-xl bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50">
          <option value="">Semua Kategori</option>
          {uniqueKategori.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-colors font-semibold">
          Filter
        </button>
      </form>
      {kegiatan && kegiatan.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {kegiatan.map((item) => (
              <Link key={item.id} href={`/kegiatan/${item.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 transition-all hover:-translate-y-1">
                <div className="relative h-48 bg-gray-800">
                  {item.gambar ? (
                    <Image src={item.gambar} alt={item.judul} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Calendar className="text-amber-500/20" size={40} />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">{item.kategori}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                    <Calendar size={12} />
                    {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {item.lokasi && (<><span>·</span><MapPin size={12} /><span className="truncate">{item.lokasi}</span></>)}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">{item.judul}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{item.deskripsi}</p>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={`/kegiatan?q=${q}&kategori=${kategori}&page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page ? 'bg-amber-500 text-black font-bold' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-amber-500/40 hover:text-amber-400'
                  }`}>{p}</Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-600">
          <Calendar size={56} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Tidak ada kegiatan ditemukan</p>
        </div>
      )}
    </div>
    </div>
    </>
  )
}
