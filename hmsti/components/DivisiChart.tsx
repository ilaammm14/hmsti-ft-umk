'use client'

import { useRef, useEffect, useState } from 'react'
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

function CardMd({ a, id }: { a: Anggota; id: string }) {
  return (
    <div id={id} className="flex flex-col items-center text-center bg-gray-800/80 border-2 border-amber-500/50 rounded-2xl p-3 w-36 transition-all hover:-translate-y-1">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 border-2 border-amber-500/40 mb-2 shrink-0">
        {a.foto
          ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-lg">{a.nama.charAt(0)}</div>
        }
      </div>
      <p className="text-white text-xs font-semibold leading-tight">{a.nama}</p>
      <p className="text-amber-400 text-xs mt-0.5">{a.jabatan}</p>
      {a.divisi && a.divisi !== '-' && <p className="text-gray-400 text-xs mt-0.5">{a.divisi}</p>}
      {a.instagram && (
        <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 text-gray-500 hover:text-amber-400">
          <IconInstagram />
        </a>
      )}
    </div>
  )
}

function CardSm({ a, id }: { a: Anggota; id: string }) {
  return (
    <div id={id} className="flex flex-col items-center text-center bg-gray-900 border border-gray-800 hover:border-amber-500/20 rounded-xl p-2.5 w-28 transition-all">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border border-gray-600 mb-1.5 shrink-0">
        {a.foto
          ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-sm">{a.nama.charAt(0)}</div>
        }
      </div>
      <p className="text-gray-300 text-xs font-medium leading-tight">{a.nama}</p>
      <p className="text-gray-500 text-xs mt-0.5">{a.jabatan}</p>
      {a.instagram && (
        <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="mt-1 text-gray-600 hover:text-amber-400">
          <IconInstagram />
        </a>
      )}
    </div>
  )
}

interface Line { x1: number; y1: number; x2: number; y2: number }

function getCenter(el: HTMLElement, container: HTMLElement) {
  const er = el.getBoundingClientRect()
  const cr = container.getBoundingClientRect()
  return {
    top: er.top - cr.top,
    bottom: er.bottom - cr.top,
    cx: er.left - cr.left + er.width / 2,
  }
}

interface Props {
  label: string        // nama divisi, e.g. "Divisi Internal"
  ketua: Anggota | null
  kordinator: Anggota | null
  anggota: Anggota[]
}

export default function DivisiChart({ label, ketua, kordinator, anggota }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const calc = () => {
      const c = containerRef.current
      if (!c) return
      const newLines: Line[] = []
      setSize({ w: c.scrollWidth, h: c.scrollHeight })

      const getEl = (id: string) => c.querySelector(`#${id}`) as HTMLElement | null
      const gc = (el: HTMLElement) => getCenter(el, c)

      const ketuaEl = ketua ? getEl(`dc-ketua-${ketua.id}`) : null
      const kordEl = kordinator ? getEl(`dc-kord-${kordinator.id}`) : null
      const anggotaEls = anggota.map(a => getEl(`dc-anggota-${a.id}`)).filter(Boolean) as HTMLElement[]

      // Ketua → Kordinator
      if (ketuaEl && kordEl) {
        const k = gc(ketuaEl)
        const ko = gc(kordEl)
        newLines.push({ x1: k.cx, y1: k.bottom, x2: k.cx, y2: ko.top - 10 })
        newLines.push({ x1: k.cx, y1: ko.top - 10, x2: ko.cx, y2: ko.top - 10 })
        newLines.push({ x1: ko.cx, y1: ko.top - 10, x2: ko.cx, y2: ko.top })
      }

      // Kordinator → Anggota
      if (kordEl && anggotaEls.length > 0) {
        const ko = gc(kordEl)
        const anggotaCenters = anggotaEls.map(el => gc(el))
        const leftX = anggotaCenters[0].cx
        const rightX = anggotaCenters[anggotaCenters.length - 1].cx
        const anggotaMidX = (leftX + rightX) / 2
        const anggotaTopY = Math.min(...anggotaCenters.map(a => a.top))
        const junctionY = anggotaTopY - 20
        const midY = ko.bottom + (junctionY - ko.bottom) / 2

        newLines.push({ x1: ko.cx, y1: ko.bottom, x2: ko.cx, y2: midY })
        newLines.push({ x1: ko.cx, y1: midY, x2: anggotaMidX, y2: midY })
        newLines.push({ x1: anggotaMidX, y1: midY, x2: anggotaMidX, y2: junctionY })
        newLines.push({ x1: leftX, y1: junctionY, x2: rightX, y2: junctionY })
        anggotaCenters.forEach(a => {
          newLines.push({ x1: a.cx, y1: junctionY, x2: a.cx, y2: a.top })
        })
      }

      setLines(newLines)
    }

    const t = setTimeout(calc, 100)
    window.addEventListener('resize', calc)
    return () => { clearTimeout(t); window.removeEventListener('resize', calc) }
  }, [ketua, kordinator, anggota])

  return (
    <div className="mb-16">
      {/* Label divisi */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider px-3 border border-amber-500/30 rounded-full py-1">
          {label}
        </span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      <div ref={containerRef} className="relative w-full">
        <svg className="absolute inset-0 pointer-events-none" width={size.w} height={size.h}>
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
              stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeLinecap="round" />
          ))}
        </svg>

        <div className="flex flex-col items-center pb-4">
          {/* Ketua */}
          {ketua && (
            <div className="mb-20">
              <CardMd a={ketua} id={`dc-ketua-${ketua.id}`} />
            </div>
          )}

          {/* Kordinator */}
          {kordinator && (
            <div className="mb-20">
              <CardMd a={kordinator} id={`dc-kord-${kordinator.id}`} />
            </div>
          )}

          {/* Anggota */}
          {anggota.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {anggota.map(a => <CardSm key={a.id} a={a} id={`dc-anggota-${a.id}`} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
