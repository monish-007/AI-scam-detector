function getRiskLevel(score) {
  if (score >= 71) return 'high'
  if (score >= 41) return 'suspicious'
  return 'safe'
}

function riskLevelLabel(level) {
  if (level === 'high') return 'High risk'
  if (level === 'suspicious') return 'Suspicious'
  return 'Safe'
}

function riskColorClasses(level) {
  if (level === 'high') return 'text-red-400'
  if (level === 'suspicious') return 'text-amber-300'
  return 'text-emerald-400'
}

export default function RiskCard({ currentRisk, lastScanType }) {
  const level = getRiskLevel(currentRisk.risk_score)

  return (
    <div className="card p-4 md:p-5 col-span-2 relative overflow-hidden">
      <div className="card-header">
        <div>
          <p className="card-title">Risk score</p>
          <p className="text-xs text-slate-500">Based on latest scan</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
          {currentRisk.scam_type || 'unknown'}
        </span>
      </div>
      <div className="relative flex items-end justify-between">
        <div className="space-y-1">
          <p
            className={`text-4xl md:text-5xl font-semibold leading-tight ${riskColorClasses(
              level,
            )}`}
          >
            {currentRisk.risk_score}
            <span className="text-base ml-1 text-slate-500">/</span>
            <span className="text-base text-slate-400">100</span>
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            {riskLevelLabel(level)}. {currentRisk.explanation}
          </p>
        </div>
        <div className="relative h-20 w-20 md:h-24 md:w-24">
          <div className="absolute inset-0 rounded-full bg-slate-950 border border-slate-700/80" />
          <div className="absolute inset-0 rounded-full border-2 border-slate-800 border-t-sky-400 border-r-transparent animate-spin-slow" />
          <div className="absolute inset-3 rounded-full bg-slate-950 flex items-center justify-center">
            <span className="text-xs text-slate-400">
              {lastScanType ? lastScanType.toUpperCase() : 'IDLE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

