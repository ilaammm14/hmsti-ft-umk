'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Anggota } from '@/lib/types'

const DEPARTEMEN = ['Pengabdian Masyarakat', 'Hubungan Luar', 'Ekonomi Kreatif']

interface Props { external: Anggota[] }

export default function ExternalChartMobile({ external }: Props) {
  const [openDept, setOpenDept] = useState<string | null>(null)

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
    <div className="w-full space-y-2">
      {pemimpin && (
        <div className="flex items-center gap-3 bg-gray-800 border-2 border-amber-500/60 rounded-xl p-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 border-2 border-amber-500 shrink-0">
            {pemimpin.foto
              ? <img src={pemimpin.foto} alt={pemimpin.nama} className="w-full h-full object-cover" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold">{pemimpin.nama.charAt(0)}</div>
            }
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{pemimpin.nama}</p>
            <p className="text-amber-400 text-xs">{pemimpin.jabatan}</p>
          </div>
        </div>
      )}

      <div className="pl-4 border-l-2 border-amber-500/20 space-y-2 ml-6">
        {DEPARTEMEN.map(dept => {
          const isOpen = openDept === dept
          const count = getAnggotaDept(dept).length
          const kord = getKordDept(dept)
          const anggota = getAnggotaSajaDept(dept)

          return (
            <div key={dept} className="rounded-xl overflow-hidden border border-gray-800">
              <button
                onClick={() => setOpenDept(isOpen ? null : dept)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors touch-manipulation ${
                  isOpen ? 'bg-amber-500/10 border-b border-amber-500/20' : 'bg-gray-900 hover:bg-gray-800'
                }`}
                style={{ minHeight: '48px' }}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isOpen ? 'text-amber-400' : 'text-gray-300'}`}>{dept}</span>
                  {count > 0 && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">{count}</span>
                  )}
                </div>
                {isOpen ? <ChevronUp size={16} className="text-amber-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
              </button>

              {isOpen && (
                <div className="bg-gray-900/50 p-3 space-y-2">
                  {count === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-2">Belum ada data</p>
                  ) : (
                    <>
                      {kord && (
                        <div className="flex items-center gap-2 bg-gray-800 border border-amber-500/30 rounded-lg p-2">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 border border-amber-500/40 shrink-0">
                            {kord.foto
                              ? <img src={kord.foto} alt={kord.nama} className="w-full h-full object-cover" loading="lazy" />
                              : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xs">{kord.nama.charAt(0)}</div>
                            }
                          </div>
                          <div>
                            <p className="text-white text-xs font-semibold">{kord.nama}</p>
                            <p className="text-amber-400 text-xs">{kord.jabatan}</p>
                          </div>
                        </div>
                      )}
                      {anggota.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {anggota.map(a => (
                            <div key={a.id} className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-2">
                              <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 border border-gray-700 shrink-0">
                                {a.foto
                                  ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" loading="lazy" />
                                  : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xs">{a.nama.charAt(0)}</div>
                                }
                              </div>
                              <div className="min-w-0">
                                <p className="text-gray-300 text-xs truncate">{a.nama}</p>
                                <p className="text-gray-600 text-xs">Anggota</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
