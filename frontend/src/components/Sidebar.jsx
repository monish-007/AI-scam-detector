const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'message', label: 'Message Scanner' },
  { id: 'link', label: 'Link Scanner' },
  { id: 'image', label: 'Image Scanner' },
  { id: 'qr', label: 'QR Scanner' },
  { id: 'history', label: 'Scan History' },
]

export default function Sidebar({ active, onChange, apiBase }) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800/80 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-800/80">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center shadow-glow-blue">
            <div className="h-6 w-6 rounded-lg bg-sky-400/80 blur-[1px]" />
          </div>
          <div className="absolute inset-0 rounded-xl border border-sky-400/40 animate-ping opacity-40" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-400">
            AI SECURITY
          </p>
          <p className="text-lg font-semibold tracking-tight">AI Scam Shield</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
              active === item.id
                ? 'bg-sky-500/20 text-sky-100 border border-sky-500/50'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-900/80 text-[11px] text-sky-300 ring-1 ring-slate-700/60">
              ●
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 pb-5 pt-2 border-t border-slate-800/80 text-xs text-slate-500">
        <p className="font-medium text-slate-400 mb-1">Realtime Threat Monitor</p>
        <p className="leading-snug">
          Backend at <span className="text-sky-400">{apiBase}</span>
        </p>
      </div>
    </aside>
  )
}

