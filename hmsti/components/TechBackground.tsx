'use client'

// Fixed — benar-benar tidak bergerak saat scroll
// top-16 = bawah navbar, bottom-20 = atas footer (estimasi tinggi footer)
export default function TechBackground() {
  return (
    <div
      className="fixed left-0 right-0 pointer-events-none z-[1] overflow-hidden"
      style={{ top: '64px', bottom: '320px' }}
      aria-hidden="true"
    >
      {/* Grid digital */}
      <svg className="absolute inset-0 w-full h-full opacity-[1.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-main" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f59e0b" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid-small-main" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#f59e0b" strokeWidth="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-small-main)" />
        <rect width="100%" height="100%" fill="url(#grid-main)" />
      </svg>

      {/* Code snippet — kiri */}
      <div className="absolute left-6 top-16 opacity-[1.08] font-mono text-xs text-amber-400 leading-6 select-none">
        <div>const hmsti = {'{'}</div>
        <div>&nbsp;&nbsp;name: <span className="text-amber-300">"HMSTI"</span>,</div>
        <div>&nbsp;&nbsp;year: <span className="text-amber-300">2024</span>,</div>
        <div>&nbsp;&nbsp;members: <span className="text-amber-300">200</span>,</div>
        <div>{'}'}</div>
        <div className="mt-3">function <span className="text-amber-300">innovate</span>() {'{'}</div>
        <div>&nbsp;&nbsp;return <span className="text-amber-300">true</span>;</div>
        <div>{'}'}</div>
      </div>

      {/* Code snippet — kanan */}
      <div className="absolute right-6 top-20 opacity-[1.08] font-mono text-xs text-amber-400 leading-6 select-none text-right">
        <div><span className="text-amber-300">import</span> {'{ Tech }'} from <span className="text-amber-300">"future"</span></div>
        <div className="mt-2">{'<'}<span className="text-amber-300">HMSTI</span></div>
        <div>&nbsp;&nbsp;role=<span className="text-amber-300">"innovator"</span></div>
        <div>&nbsp;&nbsp;campus=<span className="text-amber-300">"UMK"</span></div>
        <div>{'/>'}
        </div>
      </div>

      {/* Binary — kiri bawah */}
      <div className="absolute left-8 bottom-16 opacity-[1.06] font-mono text-xs text-amber-500 leading-5 select-none tracking-widest">
        <div>01001000 01001101</div>
        <div>01010011 01010100</div>
        <div>01001001 00100000</div>
      </div>

      {/* Binary — kanan bawah */}
      <div className="absolute right-8 bottom-16 opacity-[1.06] font-mono text-xs text-amber-500 leading-5 select-none tracking-widest text-right">
        <div>10110100 11001010</div>
        <div>00101101 10110011</div>
        <div>11010010 01011010</div>
      </div>

      {/* Terminal prompt — bawah kiri */}
      <div className="absolute left-6 bottom-4 opacity-[1.10] font-mono text-xs text-amber-400 select-none">
        <span className="text-amber-500">hmsti@umk</span>
        <span className="text-gray-500">:</span>
        <span className="text-amber-300">~</span>
        <span className="text-gray-500">$ </span>
        <span>npm run build</span>
        <span className="animate-pulse ml-0.5">▋</span>
      </div>

      {/* Network — bawah kanan */}
      <div className="absolute right-6 bottom-4 opacity-[1.07] font-mono text-xs text-amber-500 select-none">
        192.168.1.1 → 10.0.0.1
      </div>

      {/* Corner brackets */}
      <svg className="absolute top-2 left-2 w-12 h-12 opacity-[1.18]" viewBox="0 0 48 48" fill="none">
        <path d="M16 4 H4 V16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg className="absolute top-2 right-2 w-12 h-12 opacity-[1.18]" viewBox="0 0 48 48" fill="none">
        <path d="M32 4 H44 V16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg className="absolute bottom-2 left-2 w-12 h-12 opacity-[1.18]" viewBox="0 0 48 48" fill="none">
        <path d="M16 44 H4 V32" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <svg className="absolute bottom-2 right-2 w-12 h-12 opacity-[1.18]" viewBox="0 0 48 48" fill="none">
        <path d="M32 44 H44 V32" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      </svg>

      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-amber-600/[0.02] rounded-full blur-[80px]" />
    </div>
  )
}
