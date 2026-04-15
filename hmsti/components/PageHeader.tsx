interface Props {
  label: string
  title: string
  description: string
}

export default function PageHeader({ label, title, description }: Props) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-1000 overflow-hidden py-16">
      {/* Decorative circles — sama seperti hero beranda */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-4 border-amber-500/20" />
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full border-2 border-amber-500/10" />
        <div className="absolute bottom-0 -left-12 w-56 h-56 rounded-full border-4 border-amber-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-amber-500/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          {label}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
        <p className="text-gray-400 mt-2 max-w-xl mx-auto">{description}</p>
      </div>
    </section>
  )
}
