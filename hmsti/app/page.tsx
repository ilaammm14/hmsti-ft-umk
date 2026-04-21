import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Users, Image as ImageIcon, ChevronRight } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export default async function HomePage() {
  let kegiatan = null, galeri = null, settings = null

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const [k, g, s] = await Promise.all([
      supabase.from('kegiatan').select('*').order('tanggal', { ascending: false }).limit(3),
      supabase.from('galeri').select('*, images:galeri_images(image_url)').order('created_at', { ascending: false }).limit(6),
      supabase.from('settings').select('*').single(),
    ])
    kegiatan = k.data
    galeri = g.data
    settings = s.data
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full border-4 border-amber-500/20" />
          <div className="absolute bottom-10 -left-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full border-4 border-amber-500/10" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-xs sm:text-sm mb-6 text-amber-300">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shrink-0" />
            Himpunan Mahasiswa Aktif 2024/2025
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Himpunan Mahasiswa<br />
            <span className="text-amber-400">Sistem & Teknologi</span><br />
            Informasi
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10 px-2">
            Bersama membangun generasi teknologi yang inovatif, kolaboratif, dan berdampak nyata bagi masyarakat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            <Link href="/kegiatan"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 sm:px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-500/30 text-sm sm:text-base">
              Lihat Kegiatan <ArrowRight size={18} />
            </Link>
            <Link href="/galeri"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl hover:bg-white/20 transition-all text-sm sm:text-base">
              Lihat Galeri
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-500 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { label: 'Anggota Aktif', value: settings?.stat_anggota || '200+' },
              { label: 'Kegiatan/Tahun', value: settings?.stat_kegiatan || '30+' },
              { label: 'Divisi', value: settings?.stat_divisi || '6' },
              { label: 'Tahun Berdiri', value: settings?.stat_tahun || '2010' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 sm:p-4">
                <p className="text-2xl sm:text-3xl font-bold text-black">{stat.value}</p>
                <p className="text-xs sm:text-sm text-black/70 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section className="py-14 sm:py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-amber-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Tentang Kami</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 mb-4 sm:mb-6 text-white">
                Kami adalah wadah pengembangan mahasiswa STI
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-4">
                HMSTI adalah organisasi kemahasiswaan yang bergerak di bidang Sistem dan Teknologi Informasi. Kami hadir untuk memfasilitasi pengembangan akademik, soft skill, dan jaringan profesional mahasiswa.
              </p>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 sm:mb-8">
                Dengan berbagai program unggulan, kami berkomitmen mencetak lulusan yang siap bersaing di era digital.
              </p>
              <Link href="/struktur-organisasi" className="inline-flex items-center gap-2 text-amber-400 font-semibold hover:gap-3 transition-all text-sm sm:text-base">
                Lihat Struktur Organisasi <ChevronRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: Users, title: 'Komunitas Solid', desc: 'Jaringan mahasiswa yang kuat dan saling mendukung' },
                { icon: Calendar, title: 'Program Aktif', desc: 'Kegiatan rutin yang relevan dan bermanfaat' },
                { icon: ImageIcon, title: 'Dokumentasi', desc: 'Rekam jejak kegiatan yang terarsip dengan baik' },
                { icon: ArrowRight, title: 'Terbuka', desc: 'Informasi dan kegiatan terbuka untuk semua' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-900 border border-gray-800 hover:border-amber-500/50 p-4 sm:p-5 rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-500/5">
                  <item.icon className="text-amber-400 mb-2 sm:mb-3" size={22} />
                  <h3 className="font-semibold text-white text-xs sm:text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 hidden sm:block">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-14 sm:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-amber-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Kegiatan</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">Kegiatan Terbaru</h2>
            </div>
            <Link href="/kegiatan" className="text-amber-400 font-medium hover:underline flex items-center gap-1 text-sm">
              Lihat Semua <ChevronRight size={16} />
            </Link>
          </div>
          {kegiatan && kegiatan.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {kegiatan.map((item) => (
                <Link key={item.id} href={`/kegiatan/${item.slug}`}
                  className="group bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 transition-all hover:-translate-y-1">
                  <div className="relative h-44 sm:h-48 bg-gray-800">
                    {item.gambar ? (
                      <Image src={item.gambar} alt={item.judul} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Calendar className="text-amber-500/30" size={40} />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      {item.kategori}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2 text-sm sm:text-base">{item.judul}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2">{item.deskripsi}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-600">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>Belum ada kegiatan</p>
            </div>
          )}
        </div>
      </section>

      {/* Galeri Preview */}
      {galeri && galeri.length > 0 && (
        <section className="py-14 sm:py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div>
                <span className="text-amber-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Galeri</span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">Momen Terbaik</h2>
              </div>
              <Link href="/galeri" className="text-amber-400 font-medium hover:underline flex items-center gap-1 text-sm">
                Lihat Semua <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {galeri.map((item: { id: string; judul: string; images?: { image_url: string }[] }) => {
                const cover = item.images?.[0]?.image_url
                return (
                  <div key={item.id} className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group border border-gray-800">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt={item.judul} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No foto</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end p-3 sm:p-4 opacity-0 group-hover:opacity-100">
                      <p className="text-white text-xs sm:text-sm font-medium line-clamp-1">{item.judul}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Video Profil */}
      {settings?.video_url && getYouTubeEmbedUrl(settings.video_url) && (
        <section className="py-14 sm:py-20 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-amber-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Video</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                {settings.video_judul || 'Profil HMSTI'}
              </h2>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-amber-500/5"
              style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getYouTubeEmbedUrl(settings.video_url)!}
                title={settings.video_judul || 'Video HMSTI'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
