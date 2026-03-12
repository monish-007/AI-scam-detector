import { Card, CardHeader, CardContent } from './Card.jsx'

export default function ScanHistory({ scans }) {
  return (
    <Card className="p-4 md:p-5">
      <CardHeader>
        <div>
          <h3 className="card-title">Scan history</h3>
          <p className="text-xs text-slate-500">
            Most recent activity in this browser session.
          </p>
        </div>
      </CardHeader>

      <CardContent className="!p-0">
        <div className="mt-2 overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/60 text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-left font-medium">Input</th>
                <th className="px-3 py-2 text-left font-medium">Scam type</th>
                <th className="px-3 py-2 text-right font-medium">Risk score</th>
              </tr>
            </thead>
            <tbody>
              {scans.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-500"
                    colSpan={5}
                  >
                    No scans yet. Run your first analysis using the scanners.
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-400">
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-2 capitalize text-slate-200">
                      {scan.type}
                    </td>
                    <td className="px-3 py-2 text-slate-300 max-w-xs truncate">
                      {scan.input}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {scan.scamType}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className={`inline-flex items-center justify-end gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          scan.risk >= 71
                            ? 'bg-red-500/10 text-red-300'
                            : scan.risk >= 41
                            ? 'bg-amber-400/10 text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-300'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                        {scan.risk}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

