'use client'

import type { Anggota } from '@/lib/types'

function IconInstagram() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function MobileCard({ a, level = 0, isLast = false }: { a: Anggota; level?: number; isLast?: boolean }) {
  const indent = level * 16
  const photoSize = level === 0 ? 'w-12 h-12' : level === 1 ? 'w-10 h-10' : 'w-8 h-8'
  const highlight = level === 0

  return (
    <div className="flex items-start gap-3" style={{ paddingLeft: indent }}>
      {/* Garis vertikal kiri */}
      {level > 0 && (
        <div className="flex flex-col items-center shrink-0 mt-1" style={{ width: 16 }}>
          <div className={`w-px ${isLast ? 'h-4' : 'h-full'} bg-amber-500/30`} />
          <div className="w-3 h-px bg-amber-500/30 mt-0" />
        </div>
      )}

      <div className={`flex items-center gap-3 flex-1 py-2 px-3 rounded-xl mb-1 ${
        highlight ? 'bg-gray-800 border-2 border-amber-500/60' : 'bg-gray-900 border border-gray-800'
      }`}>
        <div className={`${photoSize} rounded-full overflow-hidden bg-gray-700 border-2 ${highlight ? 'border-amber-500' : 'border-gray-600'} shrink-0`}>
          {a.foto
            ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-sm">{a.nama.charAt(0)}</div>
          }
        </div>
        <div className="min-w-0">
          <p className={`font-semibold leading-tight truncate ${highlight ? 'text-white text-sm' : 'text-gray-200 text-xs'}`}>{a.nama}</p>
          <p className="text-amber-400 text-xs mt-0.5">{a.jabatan}</p>
          {a.divisi && a.divisi !== '-' && !a.divisi.match(/^(inti|internal|external):?-?$/) && (
            <p className="text-gray-500 text-xs mt-0.5 truncate">
              {a.divisi.includes(':') ? a.divisi.split(':').slice(1).join(':') : a.divisi}
            </p>
          )}
        </div>
        {a.instagram && (
          <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 shrink-0 ml-auto">
            <IconInstagram />
          </a>
        )}
      </div>
    </div>
  )
}

interface Props { pengurus: Anggota[] }

export default function OrgChartMobile({ pengurus }: Props) {
  const j = (a: Anggota) => a.jabatan.toLowerCase()

  const ketua = pengurus.find(a => j(a) === 'ketua' || j(a).includes('ketua umum'))
  const wakil = pengurus.find(a => j(a).includes('wakil'))
  const sekretaris = pengurus.filter(a => j(a).includes('sekretaris') || j(a).includes('sektretaris'))
  const bendahara = pengurus.filter(a => j(a).includes('bendahara'))
  const kordinator = pengurus.filter(a => j(a).includes('kordinator') || j(a).includes('koordinator'))
  const anggota = pengurus.filter(a => j(a) === 'anggota')

  const level1 = [...(wakil ? [wakil] : []), ...sekretaris, ...bendahara, ...kordinator]

  if (!pengurus.length) return null

  return (
    <div className="w-full space-y-0">
      {/* Ketua */}
      {ketua && <MobileCard a={ketua} level={0} />}

      {/* Level 1: Wakil, Sekretaris, Bendahara, Kordinator */}
      {level1.map((a, i) => (
        <div key={a.id} className="relative">
          {/* Garis vertikal dari ketua */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-500/20" style={{ left: 8 }} />
          <div className="flex items-start gap-0 pl-4">
            <div className="flex flex-col items-center shrink-0 pt-3" style={{ width: 12 }}>
              <div className="w-3 h-px bg-amber-500/30" />
            </div>
            <div className="flex-1">
              <MobileCard a={a} level={0} />
            </div>
          </div>
        </div>
      ))}

      {/* Anggota — di bawah kordinator dengan indentasi lebih */}
      {anggota.length > 0 && (
        <div className="pl-8 mt-1">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 pl-2">Anggota Kominfo</p>
          <div className="grid grid-cols-2 gap-2">
            {anggota.map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl p-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 border border-gray-600 shrink-0">
                  {a.foto
                    ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" loading="lazy" />
                    : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xs">{a.nama.charAt(0)}</div>
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-gray-200 text-xs font-medium truncate">{a.nama}</p>
                  <p className="text-gray-500 text-xs">Anggota</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
