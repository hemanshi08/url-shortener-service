import { useState } from 'react'
import { Copy, CheckCircle2, Loader2 } from 'lucide-react'
import QRCode from 'qrcode.react'
import { urlService } from '../services/api'

interface HeroSectionProps {
  onUrlCreated: (shortId: string) => void
}

export default function HeroSection({ onUrlCreated }: HeroSectionProps) {
  const [longUrl, setLongUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState<{
    shortId: string
    shortUrl: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!longUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    try {
      setError('')
      setIsLoading(true)
      const result = await urlService.createShortUrl(longUrl)
      setSuccessData({
        shortId: result.shortId,
        shortUrl: result.shortUrl,
      })
      onUrlCreated(result.shortId)
      setLongUrl('')
    } catch (err) {
      setError('Failed to shorten URL. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyClick = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      {/* Input Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Shorten a Long URL</h2>
        <p className="text-slate-400 text-sm mb-6">
          Create a short, shareable link in seconds
        </p>

        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/path"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>
      </div>

      {/* Success Card */}
      {successData && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Success!</h3>
              <p className="text-slate-400 text-sm">Your link is ready to share</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6 p-4 bg-white rounded-lg">
            <QRCode
              value={successData.shortUrl}
              size={120}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Short URL Display */}
          <div className="space-y-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Short URL
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={successData.shortUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm font-mono"
              />
              <button
                onClick={handleCopyClick}
                className="p-2 hover:bg-slate-700 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-400 hover:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
