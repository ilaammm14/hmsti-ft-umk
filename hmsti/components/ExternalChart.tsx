'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

function MemberCard({ a, size = 'md' }: { a: Anggota; size?: 'lg' | 'md' | 'sm' }) {
  const photoSize = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-14 h-14' : 'w-10 h-10'
  return (
    <div className={`flex flex-col items-center text-center bg-gray-800/80 border-2 border-amber-500/50 rounded-2xl p-3 ${size === 'sm' ? 'w-24 sm:w-28' : 'w-32 sm:w-36'}`}>
      <div className={`${photoSize} rounded-full overflow-hidden bg-gray-700 border-2 border-amber-500/40 mb-2 shrink-0`}>
        {a.foto
          ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold">{a.nama.charAt(0)}</div>
        }
      </div>
      <p className="text-white font-semibold leading-tight text-xs">{a.nama}</p>
      <p className="text-amber-400 text-xs mt-0.5">{a.jabatan}</p>
      {a.instagram && (
        <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 text-gray-500 hover:text-amber-400">
          <IconInstagram />
        </a>
      )}
    </div>
  )
}

const DEPARTEMEN = ['Pengabdian Masyarakat', 'Hubungan Luar', 'Ekonomi Kreatif']

interface Props { external: Anggota[] }

export default function ExternalChart({ external }: Props) {
  const [activeDept, setActiveDept] = useState<string | null>(null)

  const j = (a: Anggota) => a.jabatan.toLowerCase()
  const pemimpin = external.find(a =>
    j(a).includes('ketua') || j(a).includes('kordinator') || j(a).includes('koordinator')
  )

  const getAnggotaDept = (dept: string) => {
    const deptLower = dept.toLowerCase()
    return external.filter(a => {
      const divisi = a.divisi.includes(':') ? a.divisi.split(':').slice(1).join(':') : a.divisi
      return divisi.toLowerCase().includes(deptLower) || a.divisi.toLowerCase().includes(deptLower)
    })
  }
  const getKordDept = (dept: string) =>
    getAnggotaDept(dept).find(a => j(a).includes('kordinator') || j(a).includes('koordinator'))
  const getAnggotaSajaDept = (dept: string) =>
    getAnggotaDept(dept).filter(a => j(a) === 'anggota')

  if (!external.length) return null

  return (
    <div className="w-full">
      {pemimpin && (
        <div className="flex justify-center mb-2">
          <MemberCard a={pemimpin} size="lg" />
        </div>
      )}

      <div className="flex justify-center mb-2">
        <div className="w-px h-8 bg-amber-500/30" />
      </div>

      <div className="flex justify-center mb-0">
        <div className="h-px bg-amber-500/30 w-3/4 max-w-lg" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6 mt-0">
        {DEPARTEMEN.map((dept) => {
          const isActive = activeDept === dept
          const count = getAnggotaDept(dept).length
          return (
            <div key={dept} className="flex flex-col items-center">
              <div className="w-px h-6 bg-amber-500/30" />
              <button
                onClick={() => setActiveDept(isActive ? null : dept)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border touch-manipulation ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-amber-500/50 active:bg-amber-500/20'
                }`}
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <span>{dept}</span>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/20' : 'bg-amber-500/20 text-amber-400'}`}>
                    {count}
                  </span>
                )}
                {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )
        })}
      </div>

      {activeDept && (
        <div className="mt-2 p-4 sm:p-6 bg-gray-900/60 border border-amber-500/20 rounded-2xl">
          <h3 className="text-center text-amber-400 font-bold text-base sm:text-lg mb-6">
            Departemen {activeDept}
          </h3>
          {getKordDept(activeDept) && (
            <>
              <div className="flex justify-center mb-6">
                <MemberCard a={getKordDept(activeDept)!} size="md" />
              </div>
              {getAnggotaSajaDept(activeDept).length > 0 && (
                <div className="flex justify-center mb-2">
                  <div className="w-px h-6 bg-amber-500/30" />
                </div>
              )}
            </>
          )}
          {getAnggotaSajaDept(activeDept).length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {getAnggotaSajaDept(activeDept).map(a => <MemberCard key={a.id} a={a} size="sm" />)}
            </div>
          ) : getAnggotaDept(activeDept).length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">Belum ada data anggota</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
