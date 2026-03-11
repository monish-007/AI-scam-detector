import RiskCard from '../components/RiskCard.jsx'
import AnalyticsCards from '../components/AnalyticsCards.jsx'

export default function Dashboard({ currentRisk, lastScanType, scans }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid gap-4 md:gap-6 md:grid-cols-4">
        <RiskCard currentRisk={currentRisk} lastScanType={lastScanType} />
        <AnalyticsCards scans={scans} />
      </section>
    </div>
  )
}

