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

function CardLg({ a, id }: { a: Anggota; id: string }) {
  return (
    <div id={id} className="flex flex-col items-center text-center bg-gray-800 border-2 border-amber-500/60 rounded-2xl p-4 w-40 shadow-lg shadow-amber-500/10">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-amber-500 mb-2 shrink-0">
        {a.foto
          ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-xl">{a.nama.charAt(0)}</div>
        }
      </div>
      <p className="text-white text-xs font-bold leading-tight">{a.nama}</p>
      <p className="text-amber-400 text-xs mt-0.5 font-semibold">{a.jabatan}</p>
      {a.instagram && (
        <a href={a.instagram} target="_blank" rel="noopener noreferrer" className="mt-1.5 text-gray-500 hover:text-amber-400">
          <IconInstagram />
        </a>
      )}
    </div>
  )
}

function CardMd({ a, id }: { a: Anggota; id: string }) {
  return (
    <div id={id} className="flex flex-col items-center text-center bg-gray-800/80 border-2 border-amber-500/50 hover:border-amber-500/80 rounded-2xl p-3 w-36 transition-all hover:-translate-y-1">
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-700 border-2 border-amber-500/40 mb-2 shrink-0">
        {a.foto
          ? <img src={a.foto} alt={a.nama} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-amber-400 font-bold text-lg">{a.nama.charAt(0)}</div>
        }
      </div>
      <p className="text-white text-xs font-semibold leading-tight">{a.nama}</p>
      <p className="text-amber-400 text-xs mt-0.5">{a.jabatan}</p>
      {a.divisi && a.divisi !== '-' && (
        <p className="text-gray-400 text-xs mt-0.5">
          {a.divisi.includes(':') ? a.divisi.split(':').slice(1).join(':') : a.divisi}
        </p>
      )}
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
    <div id={id} className="flex flex-col items-center text-center bg-gray-900 border border-gray-800 hover:border-amber-500/20 rounded-xl p-2.5 w-28">
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

interface Props { pengurus: Anggota[] }

export default function OrgChart({ pengurus }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<Line[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const j = (a: Anggota) => a.jabatan.toLowerCase()

  const ketua = pengurus.find(a => j(a) === 'ketua' || j(a).includes('ketua umum'))
  const wakil = pengurus.find(a => j(a).includes('wakil'))
  const sekretaris = pengurus.filter(a => j(a).includes('sekretaris') || j(a).includes('sektretaris'))
  const bendahara = pengurus.filter(a => j(a).includes('bendahara'))
  const kordinator = pengurus.filter(a => j(a).includes('kordinator') || j(a).includes('koordinator'))
  const anggota = pengurus.filter(a => j(a) === 'anggota')

  const baris1 = [...(ketua ? [ketua] : []), ...(wakil ? [wakil] : [])]
  const baris2 = [...sekretaris, ...bendahara, ...kordinator]

  useEffect(() => {
    const calc = () => {
      const c = containerRef.current
      if (!c) return
      const newLines: Line[] = []
      setSize({ w: c.scrollWidth, h: c.scrollHeight })

      const getEl = (id: string) => c.querySelector(`#${id}`) as HTMLElement | null
      const gc = (el: HTMLElement) => getCenter(el, c)

      const ketuaEl = ketua ? getEl(`node-${ketua.id}`) : null
      const wakilEl = wakil ? getEl(`node-${wakil.id}`) : null
      const b2Els = baris2.map(a => getEl(`node-${a.id}`)).filter(Boolean) as HTMLElement[]
      const kordEls = kordinator.map(a => getEl(`node-${a.id}`)).filter(Boolean) as HTMLElement[]
      const anggotaEls = anggota.map(a => getEl(`node-${a.id}`)).filter(Boolean) as HTMLElement[]

      let originX = 0
      let originY = 0

      if (ketuaEl && wakilEl) {
        const k = gc(ketuaEl)
        const w = gc(wakilEl)
        originX = (k.cx + w.cx) / 2
        originY = Math.max(k.bottom, w.bottom)
        newLines.push({ x1: k.cx, y1: k.bottom, x2: k.cx, y2: originY + 20 })
        newLines.push({ x1: w.cx, y1: w.bottom, x2: w.cx, y2: originY + 20 })
        newLines.push({ x1: k.cx, y1: originY + 20, x2: w.cx, y2: originY + 20 })
        originY = originY + 20
      } else if (ketuaEl) {
        const k = gc(ketuaEl)
        originX = k.cx
        originY = k.bottom
      }

      if (b2Els.length > 0 && originX > 0) {
        const b2Centers = b2Els.map(el => gc(el))
        const b2TopY = Math.min(...b2Centers.map(b => b.top))
        const junctionY = b2TopY - 20

        newLines.push({ x1: originX, y1: originY, x2: originX, y2: junctionY })

        const leftX = b2Centers[0].cx
        const rightX = b2Centers[b2Centers.length - 1].cx
        newLines.push({ x1: leftX, y1: junctionY, x2: rightX, y2: junctionY })

        b2Centers.forEach(b => {
          newLines.push({ x1: b.cx, y1: junctionY, x2: b.cx, y2: b.top })
        })
      }

      if (kordEls.length > 0 && anggotaEls.length > 0) {
        const kordCenters = kordEls.map(el => gc(el))
        const anggotaCenters = anggotaEls.map(el => gc(el))

        const kordMidX = (kordCenters[0].cx + kordCenters[kordCenters.length - 1].cx) / 2
        const kordBottomY = Math.max(...kordCenters.map(k => k.bottom))

        const leftX = anggotaCenters[0].cx
        const rightX = anggotaCenters[anggotaCenters.length - 1].cx
        const anggotaMidX = (leftX + rightX) / 2
        const anggotaTopY = Math.min(...anggotaCenters.map(a => a.top))
        const junctionY = anggotaTopY - 20
        const midY = kordBottomY + (junctionY - kordBottomY) / 2

        newLines.push({ x1: kordMidX, y1: kordBottomY, x2: kordMidX, y2: midY })
        newLines.push({ x1: kordMidX, y1: midY, x2: anggotaMidX, y2: midY })
        newLines.push({ x1: anggotaMidX, y1: midY, x2: anggotaMidX, y2: junctionY })
        newLines.push({ x1: leftX, y1: junctionY, x2: rightX, y2: junctionY })
        anggotaCenters.forEach(a => {
          newLines.push({ x1: a.cx, y1: junctionY, x2: a.cx, y2: a.top })
        })
      }

      setLines(newLines)
    }

    const t = setTimeout(calc, 300)
    window.addEventListener('resize', calc)
    return () => { clearTimeout(t); window.removeEventListener('resize', calc) }
  }, [pengurus])

  if (!pengurus.length) return null

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto">
      <svg className="absolute inset-0 pointer-events-none" width={size.w} height={size.h}>
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="rgba(245,158,11,0.5)" strokeWidth="2" strokeLinecap="round" />
        ))}
      </svg>

      <div className="flex flex-col items-center pb-8 px-2 min-w-max mx-auto">

        {baris1.length > 0 && (
          <div className="flex justify-center gap-8 mb-20">
            {baris1.map(a => <CardLg key={a.id} a={a} id={`node-${a.id}`} />)}
          </div>
        )}

        {baris2.length > 0 && (
          <div className="flex justify-center gap-8 mb-20">
            {baris2.map(a => <CardMd key={a.id} a={a} id={`node-${a.id}`} />)}
          </div>
        )}

        {anggota.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {anggota.map(a => <CardSm key={a.id} a={a} id={`node-${a.id}`} />)}
          </div>
        )}

      </div>
    </div>
  )
}
