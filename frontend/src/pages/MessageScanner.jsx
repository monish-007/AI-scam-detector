export default function MessageScanner({
  value,
  onChange,
  onScan,
  isScanning,
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card p-4 md:p-5">
        <div className="card-header">
          <div>
            <h3 className="card-title">Message scanner</h3>
            <p className="text-xs text-slate-500">
              Paste emails, SMS, DMs or chat text to analyse scam risk.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            placeholder="Paste suspicious message content here..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/80 focus:border-sky-500/80"
          />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              We never store content; analysis runs locally against your
              backend.
            </p>
            <button
              type="button"
              disabled={isScanning || !value.trim()}
              onClick={onScan}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  Scanning…
                </span>
              ) : (
                <span>Scan message</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

