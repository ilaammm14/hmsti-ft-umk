import Image from 'next/image'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import type { Anggota } from '@/lib/types'
import PageHeader from '@/components/PageHeader'
import OrgChart from '@/components/OrgChart'
import DivisiChart from '@/components/DivisiChart'
import InternalChart from '@/components/InternalChart'
import ExternalChart from '@/components/ExternalChart'

export const metadata = { title: 'Struktur Organisasi - HMSTI' }

function IconInstagram({ size = 12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function AnggotaCard({ anggota }: { anggota: Anggota }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-800 hover:border-amber-500/30">
      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700">
        {anggota.foto ? (
          <Image src={anggota.foto} alt={anggota.nama} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-amber-400 text-2xl font-bold">
            {anggota.nama.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-semibold text-white text-sm">{anggota.nama}</h3>
      <p className="text-amber-400 text-xs font-medium mt-0.5">{anggota.jabatan}</p>
      {anggota.divisi !== '-' && <p className="text-gray-600 text-xs mt-0.5">{anggota.divisi}</p>}
      {anggota.instagram && (
        <a href={anggota.instagram} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-gray-500 hover:text-amber-400 transition-colors">
          <IconInstagram size={12} /> Instagram
        </a>
      )}
    </div>
  )
}

export default async function StrukturPage() {
  let pengurus: Anggota[] = []
  let dewanPengawas: Anggota[] = []
  let demisioner: Anggota[] = []

  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const [p, d, dm] = await Promise.all([
      supabase.from('anggota').select('*').eq('tipe', 'pengurus').order('urutan'),
      supabase.from('anggota').select('*').eq('tipe', 'dewan_pengawas').order('urutan'),
      supabase.from('anggota').select('*').eq('tipe', 'demisioner').order('periode', { ascending: false }).order('urutan'),
    ])
    pengurus = p.data || []
    dewanPengawas = d.data || []
    demisioner = dm.data || []
  }

  const j = (a: Anggota) => a.jabatan.toLowerCase()

  // Parse bagian dari field divisi (format: "bagian:NamaDivisi")
  const getBagian = (a: Anggota) => {
    const dv = a.divisi || ''
    if (dv.startsWith('internal:') || dv === 'internal:-') return 'internal'
    if (dv.startsWith('external:') || dv === 'external:-') return 'external'
    return 'inti' // default: semua data lama masuk inti
  }

  // Pengurus inti
  const pengurusInti = pengurus.filter(a => getBagian(a) === 'inti')

  // Divisi Internal
  const internal = pengurus.filter(a => getBagian(a) === 'internal')
  const ketuaInternal = internal.find(a => j(a).includes('ketua'))
  const kordMinatBakat = internal.find(a => j(a).includes('kordinator') || j(a).includes('koordinator'))
  const anggotaMinatBakat = internal.filter(a => j(a) === 'anggota')

  // Divisi External
  const external = pengurus.filter(a => getBagian(a) === 'external')

  const periodeList = [...new Set(demisioner.map((dm) => dm.periode))]

  return (
    <>
      <PageHeader label="Organisasi" title="Struktur Organisasi" description="Kepengurusan HMSTI periode aktif" />
      <div className="bg-gray-950 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Bagan Pengurus Inti */}
          {pengurusInti.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-8">
                <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">Kepengurusan Aktif</span>
                <h2 className="text-2xl font-bold text-white mt-1">Pengurus Inti HMSTI</h2>
              </div>
              <OrgChart pengurus={pengurusInti} />
            </section>
          )}

          {/* Divisi Internal — pakai InternalChart */}
          {internal.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider px-3 border border-amber-500/30 rounded-full py-1">
                  Divisi Internal
                </span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              <InternalChart internal={internal} />
            </section>
          )}

          {/* Divisi External */}
          {external.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider px-3 border border-amber-500/30 rounded-full py-1">
                  Divisi External
                </span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              <ExternalChart external={external} />
            </section>
          )}

          {/* Dewan Pengawas */}
          {dewanPengawas.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-800" />
                <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider">Dewan Pengawas</h2>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {dewanPengawas.map((a) => <AnggotaCard key={a.id} anggota={a} />)}
              </div>
            </section>
          )}

          {/* Demisioner */}
          {periodeList.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-800" />
                <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider">Pengurus Demisioner</h2>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              {periodeList.map((periode) => (
                <div key={periode} className="mb-10">
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" /> Periode {periode}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {demisioner.filter((d) => d.periode === periode).map((a) => <AnggotaCard key={a.id} anggota={a} />)}
                  </div>
                </div>
              ))}
            </section>
          )}

          {!pengurus.length && !dewanPengawas.length && !demisioner.length && (
            <div className="text-center py-20 text-gray-600">
              <p>Data struktur organisasi belum tersedia</p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
