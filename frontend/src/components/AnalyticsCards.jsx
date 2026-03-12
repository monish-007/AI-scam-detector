import { Card, CardHeader, CardContent } from './Card.jsx'

function getRiskLevel(score) {
  if (score >= 71) return 'high'
  if (score >= 41) return 'suspicious'
  return 'safe'
}

export default function AnalyticsCards({ scans }) {
  const totalScans = scans.length
  const highRisk = scans.filter((s) => getRiskLevel(s.risk) === 'high').length
  const safe = scans.filter((s) => getRiskLevel(s.risk) === 'safe').length
  const avg =
    totalScans === 0
      ? 0
      : Math.round(scans.reduce((sum, s) => sum + (s.risk || 0), 0) / totalScans)

  return (
    <>
      <Card className="p-4 md:p-5">
        <CardHeader>
          <h3 className="card-title">Total scans</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{totalScans}</p>
            <p className="text-xs text-slate-500">This browser session</p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 md:p-5">
        <CardHeader>
          <h3 className="card-title">High-risk scans</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-red-400">{highRisk}</p>
            <p className="text-xs text-slate-500">Risk score ≥ 71</p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 md:p-5">
        <CardHeader>
          <h3 className="card-title">Safe scans</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-emerald-400">{safe}</p>
            <p className="text-xs text-slate-500">Risk score ≤ 40</p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 md:p-5">
        <CardHeader>
          <h3 className="card-title">Average risk score</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{avg}</p>
            <p className="text-xs text-slate-500">Across all scans</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

