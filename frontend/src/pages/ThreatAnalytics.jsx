import RiskCard from '../components/RiskCard.jsx'
import AnalyticsCards from '../components/AnalyticsCards.jsx'
import ScanHistory from "../components/ScanHistory.jsx";
import { Card, CardHeader, CardContent } from '../components/Card.jsx'

export default function ThreatAnalytics({ currentRisk, lastScanType, scans }) {
  const lastTen = scans.slice(0, 10).reverse()

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid gap-4 md:gap-6 md:grid-cols-4">
        <RiskCard currentRisk={currentRisk} lastScanType={lastScanType} />
        <AnalyticsCards scans={scans} />
      </section>

      <section className="grid gap-4 md:gap-6 md:grid-cols-2">
        <Card className="p-4 md:p-5">
          <CardHeader>
            <div>
              <p className="card-title">Risk trend</p>
              <p className="text-xs text-slate-500">
                Visualisation of recent scan risk scores.
              </p>
            </div>
          </CardHeader>
          <CardContent className="!text-slate-200">
            {lastTen.length === 0 ? (
              <p className="text-xs text-slate-500">
                No data yet. Run some scans to see a trend.
              </p>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {lastTen.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full rounded-md bg-slate-900/80 border border-slate-800 overflow-hidden">
                      <div
                        className={`w-full ${
                          scan.risk >= 71
                            ? 'bg-red-500/80'
                            : scan.risk >= 41
                            ? 'bg-amber-400/80'
                            : 'bg-emerald-400/80'
                        }`}
                        style={{ height: `${Math.max(scan.risk, 8)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {scan.risk}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ScanHistory scans={scans} />
      </section>
    </div>
  )
}

