export default function LinkScanner({ value, onChange, onScan, isScanning }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card p-4 md:p-5">
        <div className="card-header">
          <div>
            <h3 className="card-title">Link scanner</h3>
            <p className="text-xs text-slate-500">
              Check shortened or suspicious URLs for phishing indicators.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/80 focus:border-sky-500/80"
            />
            <button
              type="button"
              disabled={isScanning || !value.trim()}
              onClick={onScan}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? 'Scanning…' : 'Scan link'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Heuristics based on domain structure, protocol and suspicious
            keywords.
          </p>
        </div>
      </div>
    </div>
  )
}

