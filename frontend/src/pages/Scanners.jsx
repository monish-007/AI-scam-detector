import { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/Card.jsx'
import MessageScanner from './MessageScanner.jsx'
import LinkScanner from './LinkScanner.jsx'
import ImageScanner from './ImageScanner.jsx'
import QrScanner from './QrScanner.jsx'

const tabs = [
  { id: 'message', label: 'Message', description: 'Email, SMS, chat text' },
  { id: 'link', label: 'Link', description: 'URLs and shortened links' },
  { id: 'image', label: 'Image', description: 'Screenshots with text' },
  { id: 'qr', label: 'QR', description: 'QR-encoded URLs or text' },
]

export default function Scanners({
  messageInput,
  setMessageInput,
  linkInput,
  setLinkInput,
  imageFile,
  setImageFile,
  qrFile,
  setQrFile,
  isScanning,
  performScan,
}) {
  const [activeTab, setActiveTab] = useState('message')

  const renderActiveScanner = () => {
    if (activeTab === 'message') {
      return (
        <MessageScanner
          value={messageInput}
          onChange={setMessageInput}
          onScan={() => performScan('message')}
          isScanning={isScanning}
        />
      )
    }
    if (activeTab === 'link') {
      return (
        <LinkScanner
          value={linkInput}
          onChange={setLinkInput}
          onScan={() => performScan('link')}
          isScanning={isScanning}
        />
      )
    }
    if (activeTab === 'image') {
      return (
        <ImageScanner
          file={imageFile}
          onFileChange={setImageFile}
          onScan={() => performScan('image')}
          isScanning={isScanning}
        />
      )
    }
    if (activeTab === 'qr') {
      return (
        <QrScanner
          file={qrFile}
          onFileChange={setQrFile}
          onScan={() => performScan('qr')}
          isScanning={isScanning}
        />
      )
    }
    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="p-3 md:p-4">
        <CardHeader className="mb-2">
          <div>
            <p className="card-title">Scanners</p>
            <p className="text-xs text-slate-500">
              Choose an input type and run a focused scam analysis.
            </p>
          </div>
        </CardHeader>
        <CardContent className="!p-0">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex flex-col items-start rounded-lg border px-3 py-2 text-xs transition-colors ${
                    isActive
                      ? 'border-sky-500/70 bg-sky-500/10 text-sky-100'
                      : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="font-medium">{tab.label}</span>
                  <span className="text-[10px] text-slate-500">
                    {tab.description}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {renderActiveScanner()}
    </div>
  )
}

