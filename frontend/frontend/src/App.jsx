import { useState } from 'react'

const API_BASE = 'http://localhost:8000'

const initialRiskState = {
  risk_score: 0,
  scam_type: 'unknown',
  explanation: 'Run a scan to see detailed analysis.',
}

function App() {
  const [activeSection, setActiveSection] = useState('overview')
  const [isScanning, setIsScanning] = useState(false)

  const [currentRisk, setCurrentRisk] = useState(initialRiskState)
  const [lastScanType, setLastScanType] = useState(null)
  const [lastScanTime, setLastScanTime] = useState(null)
  const [recentScans, setRecentScans] = useState([])

  const [messageInput, setMessageInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [qrFile, setQrFile] = useState(null)
  const [error, setError] = useState(null)

  const addScanToHistory = (payload) => {
    setRecentScans((prev) => {
      const next = [payload, ...prev]
      return next.slice(0, 8)
    })
  }

  const handleScanResponse = (type, response) => {
    const timestamp = new Date().toISOString()
    setCurrentRisk(response)
    setLastScanType(type)
    setLastScanTime(timestamp)
    addScanToHistory({
      id: `${type}-${timestamp}`,
      type,
      risk: response.risk_score,
      scamType: response.scam_type,
      timestamp,
    })
  }

  const handleScan = async (type) => {
    try {
      setError(null)
      setIsScanning(true)

      let url = ''
      let options = {}

      if (type === 'message') {
        url = `${API_BASE}/scan-message`
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageInput }),
        }
      } else if (type === 'link') {
        url = `${API_BASE}/scan-link`
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: linkInput }),
        }
      } else if (type === 'image') {
        url = `${API_BASE}/scan-image`
        const form = new FormData()
        if (!imageFile) {
          throw new Error('Please select an image file to scan.')
        }
        form.append('file', imageFile)
        options = {
          method: 'POST',
          body: form,
        }
      } else if (type === 'qr') {
        url = `${API_BASE}/scan-qr`
        const form = new FormData()
        if (!qrFile) {
          throw new Error('Please select an image containing a QR code.')
        }
        form.append('file', qrFile)
        options = {
          method: 'POST',
          body: form,
        }
      }

      const res = await fetch(url, options)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(
          `Scan failed (${res.status}): ${
            text || 'Unexpected error from server.'
          }`,
        )
      }
      const data = await res.json()
      handleScanResponse(type, data)
    } catch (err) {
      setError(err.message || 'Scan failed.')
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (score) => {
    if (score >= 75) return 'text-red-400'
    if (score >= 40) return 'text-amber-300'
    return 'text-emerald-400'
  }

  const getRiskBg = (score) => {
    if (score >= 75) return 'from-red-500/30 via-red-500/10 to-transparent'
    if (score >= 40) return 'from-amber-400/30 via-amber-400/10 to-transparent'
    return 'from-emerald-400/30 via-emerald-400/10 to-transparent'
  }

  const totalScans = recentScans.length
  const highRisk = recentScans.filter((s) => s.risk >= 75).length
  const mediumRisk = recentScans.filter(
    (s) => s.risk >= 40 && s.risk < 75,
  ).length
  const lowRisk = totalScans - highRisk - mediumRisk

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-800/80 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-800/80">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center shadow-glow-blue">
                <div className="h-6 w-6 rounded-lg bg-sky-400/80 blur-[1px]" />
              </div>
              <div className="absolute inset-0 rounded-xl border border-sky-400/40 animate-ping opacity-40" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-400">
                AI SECURITY
              </p>
              <p className="text-lg font-semibold tracking-tight">
                AI Scam Shield
              </p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
            {[
              { id: 'overview', label: 'Overview', icon: '' },
              { id: 'scanners', label: 'Scanners', icon: '' },
              { id: 'analytics', label: 'Threat Analytics', icon: '' },
              { id: 'settings', label: 'Settings', icon: '' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-sky-500/20 text-sky-100 border border-sky-500/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-900/80 text-[11px] text-sky-300 ring-1 ring-slate-700/60">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="px-4 pb-5 pt-2 border-t border-slate-800/80 text-xs text-slate-500">
            <p className="font-medium text-slate-400 mb-1">
              Realtime Threat Monitor
            </p>
            <p className="leading-snug">
              Backend at <span className="text-sky-400">{API_BASE}</span>
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 md:px-8 py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                AI Scam Detector
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Analyse messages, links, images and QR codes for scam risk in
                real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-400">Current risk level</span>
                <span
                  className={`text-sm font-semibold ${getRiskColor(
                    currentRisk.risk_score,
                  )}`}
                >
                  {currentRisk.risk_score >= 75
                    ? 'Critical'
                    : currentRisk.risk_score >= 40
                    ? 'Elevated'
                    : 'Low'}
                </span>
              </div>
              <div className="relative h-10 w-10">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-radial ${getRiskBg(
                    currentRisk.risk_score,
                  )} opacity-70 blur-md`}
                />
                <div className="absolute inset-[3px] rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-sky-400/80 border-t-transparent animate-spin-slow" />
                </div>
              </div>
            </div>
          </header>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
            {/* Analytics cards */}
            <section className="grid gap-4 md:gap-6 md:grid-cols-4">
              <div className="card p-4 md:p-5 col-span-2 relative overflow-hidden">
                <div className="card-header">
                  <div>
                    <p className="card-title">Risk Score</p>
                    <p className="text-xs text-slate-500">
                      Based on latest scan
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-950/80 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                    {currentRisk.scam_type || 'unknown'}
                  </span>
                </div>
                <div className="relative flex items-end justify-between">
                  <div className="space-y-1">
                    <p
                      className={`text-4xl md:text-5xl font-semibold leading-tight ${getRiskColor(
                        currentRisk.risk_score,
                      )}`}
                    >
                      {currentRisk.risk_score}
                      <span className="text-base ml-1 text-slate-500">/</span>
                      <span className="text-base text-slate-400">100</span>
                    </p>
                    <p className="text-xs text-slate-400 max-w-xs">
                      {currentRisk.explanation}
                    </p>
                  </div>
                  <div className="relative h-20 w-20 md:h-24 md:w-24">
                    <div className="absolute inset-0 rounded-full bg-slate-950 border border-slate-700/80" />
                    <div
                      className={`absolute inset-0 rounded-full border-2 border-slate-800 border-t-sky-400 border-r-transparent animate-spin-slow`}
                    />
                    <div className="absolute inset-3 rounded-full bg-slate-950 flex items-center justify-center">
                      <span className="text-xs text-slate-400">
                        {lastScanType ? lastScanType.toUpperCase() : 'IDLE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4 md:p-5">
                <div className="card-header">
                  <h3 className="card-title">Scan Volume</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-semibold">{totalScans}</p>
                    <p className="text-xs text-slate-500">
                      Total scans this session
                    </p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-emerald-300">
                      <span>Low risk</span>
                      <span>{lowRisk}</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-300">
                      <span>Elevated</span>
                      <span>{mediumRisk}</span>
                    </div>
                    <div className="flex items-center justify-between text-red-400">
                      <span>Critical</span>
                      <span>{highRisk}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-4 md:p-5">
                <div className="card-header">
                  <h3 className="card-title">Last Scan</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300">
                    Type:{' '}
                    <span className="font-medium text-sky-300">
                      {lastScanType || '—'}
                    </span>
                  </p>
                  <p className="text-slate-400">
                    Time:{' '}
                    <span className="font-mono">
                      {lastScanTime
                        ? new Date(lastScanTime).toLocaleTimeString()
                        : '—'}
                    </span>
                  </p>
                  <p className="text-slate-500 leading-snug">
                    Use the scanners below to evaluate messages, links,
                    screenshots, and QR codes before you trust them.
                  </p>
                </div>
              </div>
            </section>

            {/* Error banner */}
            {error && (
              <div className="card border-red-500/40 bg-red-950/40 px-4 py-3 text-xs flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
                <div>
                  <p className="font-medium text-red-200 mb-0.5">
                    Scan error
                  </p>
                  <p className="text-red-200/90">{error}</p>
                </div>
              </div>
            )}

            {/* Scanners + live radar */}
            <section className="grid gap-4 md:gap-6 lg:grid-cols-3">
              {/* Scanners column */}
              <div className="space-y-4 md:space-y-5 lg:col-span-2">
                {/* Message scanner */}
                <div className="card p-4 md:p-5">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">Message scanner</h3>
                      <p className="text-xs text-slate-500">
                        Paste emails, SMS, DMs or chat text to analyse scam
                        risk.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      rows={4}
                      placeholder="Paste suspicious message content here..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/80 focus:border-sky-500/80"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500">
                        We never store content; analysis runs locally against
                        your backend.
                      </p>
                      <button
                        type="button"
                        disabled={isScanning || !messageInput.trim()}
                        onClick={() => handleScan('message')}
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

                {/* Link scanner */}
                <div className="card p-4 md:p-5">
                  <div className="card-header">
                    <div>
                      <h3 className="card-title">Link scanner</h3>
                      <p className="text-xs text-slate-500">
                        Check shortened or suspicious URLs for phishing
                        indicators.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/80 focus:border-sky-500/80"
                      />
                      <button
                        type="button"
                        disabled={isScanning || !linkInput.trim()}
                        onClick={() => handleScan('link')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {isScanning ? 'Scanning…' : 'Scan link'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Heuristics based on domain structure, protocol and
                      suspicious keywords.
                    </p>
                  </div>
                </div>

                {/* Image & QR scanners */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="card p-4 md:p-5">
                    <div className="card-header">
                      <h3 className="card-title">Image OCR scanner</h3>
                    </div>
                    <div className="space-y-3 text-xs">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0])}
                        className="block w-full text-[11px] text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                      />
                      <button
                        type="button"
                        disabled={isScanning || !imageFile}
                        onClick={() => handleScan('image')}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {isScanning ? 'Scanning…' : 'Scan image'}
                      </button>
                      <p className="text-[11px] text-slate-500">
                        Extracts text from screenshots of chats, emails, or web
                        pages and runs full scam analysis.
                      </p>
                    </div>
                  </div>

                  <div className="card p-4 md:p-5">
                    <div className="card-header">
                      <h3 className="card-title">QR code scanner</h3>
                    </div>
                    <div className="space-y-3 text-xs">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setQrFile(e.target.files?.[0])}
                        className="block w-full text-[11px] text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
                      />
                      <button
                        type="button"
                        disabled={isScanning || !qrFile}
                        onClick={() => handleScan('qr')}
                        className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {isScanning ? 'Scanning…' : 'Scan QR'}
                      </button>
                      <p className="text-[11px] text-slate-500">
                        Decodes QR payloads and analyses URLs or text for scam
                        indicators before you scan with your phone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat radar / loader */}
              <div className="card p-4 md:p-5 relative overflow-hidden">
                <div className="card-header">
                  <h3 className="card-title">Live threat radar</h3>
                </div>
                <div className="relative mt-2 flex flex-col items-center justify-center gap-4">
                  <div className="relative h-56 w-56">
                    <div className="absolute inset-0 rounded-full border border-slate-800/80" />
                    <div className="absolute inset-6 rounded-full border border-slate-800/80" />
                    <div className="absolute inset-12 rounded-full border border-slate-800/80" />
                    <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-3xl" />
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#38bdf8_0deg,transparent_90deg,transparent_360deg)] animate-spin-slow opacity-80" />
                    <div className="absolute inset-[30%] rounded-full bg-slate-950 flex items-center justify-center">
                      <span className="text-[11px] text-slate-400">
                        {isScanning ? 'Scanning…' : 'Idle'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full space-y-2 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Real-time scan pipeline</span>
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-900">
                        <span
                          className={`block h-full w-1/2 rounded-full bg-sky-400 ${
                            isScanning ? 'animate-[pulse_0.9s_ease-in-out_infinite]' : ''
                          }`}
                        />
                      </span>
                    </div>
                    <p className="leading-snug">
                      Combines NLP, URL heuristics, OCR and QR analysis to
                      compute a unified risk score between 0–100.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent scans table */}
            <section className="card p-4 md:p-5">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Recent scans</h3>
                  <p className="text-xs text-slate-500">
                    Most recent activity in this browser session.
                  </p>
                </div>
              </div>
              <div className="mt-2 overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-900/60 text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Time</th>
                      <th className="px-3 py-2 text-left font-medium">Type</th>
                      <th className="px-3 py-2 text-left font-medium">
                        Scam type
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Risk score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScans.length === 0 ? (
                      <tr>
                        <td
                          className="px-3 py-4 text-center text-slate-500"
                          colSpan={4}
                        >
                          No scans yet. Run your first analysis using the
                          scanners above.
                        </td>
                      </tr>
                    ) : (
                      recentScans.map((scan) => (
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
                          <td className="px-3 py-2 text-slate-300">
                            {scan.scamType}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span
                              className={`inline-flex items-center justify-end gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                scan.risk >= 75
                                  ? 'bg-red-500/10 text-red-300'
                                  : scan.risk >= 40
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
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
