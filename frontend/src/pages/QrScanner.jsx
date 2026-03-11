export default function QrScanner({ file, onFileChange, onScan, isScanning }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="card p-4 md:p-5">
        <div className="card-header">
          <div>
            <h3 className="card-title">QR scanner</h3>
            <p className="text-xs text-slate-500">
              Upload QR codes and analyse decoded URLs or text for scam risk.
            </p>
          </div>
        </div>
        <div className="space-y-3 text-xs">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="block w-full text-[11px] text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
          />
          <button
            type="button"
            disabled={isScanning || !file}
            onClick={onScan}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isScanning ? 'Scanning…' : 'Scan QR'}
          </button>
          <p className="text-[11px] text-slate-500">
            Decode links encoded in QR codes before opening them on your phone.
          </p>
        </div>
      </div>
    </div>
  )
}

