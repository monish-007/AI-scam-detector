import RiskCard from '../components/RiskCard.jsx'
import { Card, CardHeader, CardContent } from '../components/Card.jsx'

function getRiskLevel(score) {
  if (score >= 71) return 'High'
  if (score >= 41) return 'Elevated'
  return 'Low'
}

export default function Dashboard({ currentRisk, lastScanType, scans }) {
  const lastScan = scans[0]
  const riskLevel = getRiskLevel(currentRisk.risk_score)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top row: risk score + quick status cards */}
      <section className="grid gap-4 md:gap-6 md:grid-cols-4">
        <RiskCard currentRisk={currentRisk} lastScanType={lastScanType} />

        <Card className="p-4 md:p-5">
          <CardHeader>
            <div>
              <p className="card-title">Current risk level</p>
              <p className="text-xs text-slate-500">Aggregated from latest scan</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{riskLevel}</p>
            <p className="mt-1 text-xs text-slate-500">
              Latest computed risk score is {currentRisk.risk_score}/100.
            </p>
          </CardContent>
        </Card>

        <Card className="p-4 md:p-5">
          <CardHeader>
            <div>
              <p className="card-title">Last scan result</p>
              <p className="text-xs text-slate-500">Most recent input analysed</p>
            </div>
          </CardHeader>
          <CardContent>
            {lastScan ? (
              <>
                <p className="text-sm font-medium text-slate-100 capitalize">
                  {lastScan.type} · {lastScan.scamType}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Risk score {lastScan.risk}/100 at{' '}
                  {new Date(lastScan.timestamp).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-500">
                No scans yet. Run your first analysis from the Scanners section.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="p-4 md:p-5">
          <CardHeader>
            <div>
              <p className="card-title">System status</p>
              <p className="text-xs text-slate-500">Frontend & API connectivity</p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-emerald-400">Operational</p>
            <p className="mt-1 text-xs text-slate-500">
              UI rendered and backend endpoint configured. Any connection issues
              will be shown as scan errors.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

