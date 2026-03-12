export function Card({ className = '', children }) {
  return (
    <div className={`card bg-slate-900/80 border border-slate-800 rounded-xl shadow-lg shadow-slate-950/60 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children }) {
  return (
    <div className={`card-header flex items-center justify-between mb-3 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ className = '', children }) {
  return (
    <div className={`card-body text-sm text-slate-200 ${className}`}>
      {children}
    </div>
  )
}

