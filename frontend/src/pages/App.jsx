import { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Dashboard from './Dashboard.jsx'
import MessageScanner from './MessageScanner.jsx'
import LinkScanner from './LinkScanner.jsx'
import ImageScanner from './ImageScanner.jsx'
import QrScanner from './QrScanner.jsx'
import ScanHistory from '../components/ScanHistory.jsx'

const API_BASE = 'http://127.0.0.1:8000'

const initialRiskState = {
  risk_score: 0,
  scam_type: 'unknown',
  explanation: 'Run a scan to see detailed analysis.',
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isScanning, setIsScanning] = useState(false)

  const [currentRisk, setCurrentRisk] = useState(initialRiskState)
  const [lastScanType, setLastScanType] = useState(null)
  const [recentScans, setRecentScans] = useState([])

  const [messageInput, setMessageInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [qrFile, setQrFile] = useState(null)
  const [error, setError] = useState(null)

  const lastAnnouncedScoreRef = useRef(0)

  const addScanToHistory = (payload) => {
    setRecentScans((prev) => {
      const next = [payload, ...prev]
      return next.slice(0, 50)
    })
  }

  const speakWarningIfHighRisk = (score) => {
    if (typeof window === 'undefined') return
    if (!('speechSynthesis' in window)) return

    if (score > 70 && lastAnnouncedScoreRef.current !== score) {
      const utterance = new SpeechSynthesisUtterance(
        'Warning. This message appears to be a scam.',
      )
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
      lastAnnouncedScoreRef.current = score
    }
  }

  useEffect(() => {
    speakWarningIfHighRisk(currentRisk.risk_score)
  }, [currentRisk.risk_score])

  const handleScanResponse = (type, response, inputLabel) => {
    const timestamp = new Date().toISOString()
    setCurrentRisk(response)
    setLastScanType(type)
    addScanToHistory({
      id: `${type}-${timestamp}`,
      type,
      input: inputLabel,
      risk: response.risk_score,
      scamType: response.scam_type,
      timestamp,
    })
  }

  const performScan = async (type) => {
    try {
      setError(null)
      setIsScanning(true)

      let url = ''
      let options = {}
      let inputLabel = ''

      if (type === 'message') {
        url = `${API_BASE}/scan-message`
        inputLabel = messageInput.trim().slice(0, 80) || '(empty message)'
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageInput }),
        }
      } else if (type === 'link') {
        url = `${API_BASE}/scan-link`
        inputLabel = linkInput.trim() || '(empty url)'
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: linkInput }),
        }
      } else if (type === 'image') {
        url = `${API_BASE}/scan-image`
        if (!imageFile) {
          throw new Error('Please select an image file to scan.')
        }
        inputLabel = imageFile.name || 'Image upload'
        const form = new FormData()
        form.append('file', imageFile)
        options = {
          method: 'POST',
          body: form,
        }
      } else if (type === 'qr') {
        url = `${API_BASE}/scan-qr`
        if (!qrFile) {
          throw new Error('Please select an image containing a QR code.')
        }
        inputLabel = qrFile.name || 'QR image upload'
        const form = new FormData()
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
      handleScanResponse(type, data, inputLabel)
    } catch (err) {
      setError(err.message || 'Scan failed.')
    } finally {
      setIsScanning(false)
    }
  }

  const getHeaderRiskLevel = () => {
    const score = currentRisk.risk_score
    if (score >= 71) return 'High'
    if (score >= 41) return 'Suspicious'
    return 'Safe'
  }

  const headerRiskColor = () => {
    const score = currentRisk.risk_score
    if (score >= 71) return 'text-red-400'
    if (score >= 41) return 'text-amber-300'
    return 'text-emerald-400'
  }

  const headerRingBg = () => {
    const score = currentRisk.risk_score
    if (score >= 71) return 'from-red-500/30 via-red-500/10 to-transparent'
    if (score >= 41) return 'from-amber-400/30 via-amber-400/10 to-transparent'
    return 'from-emerald-400/30 via-emerald-400/10 to-transparent'
  }

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <Dashboard
          currentRisk={currentRisk}
          lastScanType={lastScanType}
          scans={recentScans}
        />
      )
    }
    if (activeSection === 'message') {
      return (
        <MessageScanner
          value={messageInput}
          onChange={setMessageInput}
          onScan={() => performScan('message')}
          isScanning={isScanning}
        />
      )
    }
    if (activeSection === 'link') {
      return (
        <LinkScanner
          value={linkInput}
          onChange={setLinkInput}
          onScan={() => performScan('link')}
          isScanning={isScanning}
        />
      )
    }
    if (activeSection === 'image') {
      return (
        <ImageScanner
          file={imageFile}
          onFileChange={setImageFile}
          onScan={() => performScan('image')}
          isScanning={isScanning}
        />
      )
    }
    if (activeSection === 'qr') {
      return (
        <QrScanner
          file={qrFile}
          onFileChange={setQrFile}
          onScan={() => performScan('qr')}
          isScanning={isScanning}
        />
      )
    }
    if (activeSection === 'history') {
      return <ScanHistory scans={recentScans} />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          active={activeSection}
          onChange={setActiveSection}
          apiBase={API_BASE}
        />

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 md:px-8 py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                AI Scam Shield
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Analyse messages, links, screenshots and QR codes for scam risk
                in real time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="text-slate-400">Current risk level</span>
                <span className={`text-sm font-semibold ${headerRiskColor()}`}>
                  {getHeaderRiskLevel()}
                </span>
              </div>
              <div className="relative h-10 w-10">
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-radial ${headerRingBg()} opacity-70 blur-md`}
                />
                <div className="absolute inset-[3px] rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-sky-400/80 border-t-transparent animate-spin-slow" />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 space-y-6 md:space-y-8">
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

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

