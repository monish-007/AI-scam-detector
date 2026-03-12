import { Card, CardHeader, CardContent } from '../components/Card.jsx'

export default function Settings({ apiBase }) {
  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-4 md:p-5">
        <CardHeader>
          <div>
            <p className="card-title">System settings</p>
            <p className="text-xs text-slate-500">
              Deployment and API configuration for AI Scam Detector.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 uppercase tracking-wide">
                API base URL
              </dt>
              <dd className="font-mono text-[11px] text-slate-200 truncate max-w-[220px] md:max-w-xs">
                {apiBase}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 uppercase tracking-wide">
                Voice alerts
              </dt>
              <dd className="text-emerald-400 font-medium">Enabled &gt; 70</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 uppercase tracking-wide">
                Frontend theme
              </dt>
              <dd className="text-slate-200">Dark cybersecurity dashboard</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

