import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Globe } from 'lucide-react'
import { urlService } from '../services/api'
import type { IUrlHistory } from '../types'

interface RecentActivityTableProps {
  selectedUrl: string | null
}

const getBrowserIcon = (browser: string) => {
  const lower = browser.toLowerCase()
  if (lower.includes('chrome')) return '🔵'
  if (lower.includes('safari')) return '🧭'
  if (lower.includes('firefox')) return '🦊'
  if (lower.includes('edge')) return '🌊'
  return '🌐'
}

const getDeviceIcon = (device: string) => {
  const lower = device.toLowerCase()
  if (lower.includes('mobile')) return <Smartphone className="w-4 h-4" />
  if (lower.includes('tablet')) return <Tablet className="w-4 h-4" />
  return <Monitor className="w-4 h-4" />
}

function Tablet({ className }: { className: string }) {
  return <Globe className={className} />
}

const calculateTTL = (createdAt: string) => {
  const created = new Date(createdAt)
  const expiresAt = new Date(created.getTime() + 90 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  return Math.max(0, daysLeft)
}

const formatTimestamp = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RecentActivityTable({
  selectedUrl,
}: RecentActivityTableProps) {
  const [history, setHistory] = useState<IUrlHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedUrl) return

      try {
        setIsLoading(true)
        const data = await urlService.getUrlHistory(selectedUrl)
        setHistory(data)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [selectedUrl])

  // Mock data for demo
  const mockHistory: IUrlHistory[] = [
    {
      _id: '1',
      urlId: 'url1',
      shortId: 'abc123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      os: 'Windows',
      browser: 'Chrome',
      device: 'Desktop',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      _id: '2',
      urlId: 'url1',
      shortId: 'abc123',
      ipAddress: '192.168.1.2',
      userAgent: 'Mozilla/5.0',
      os: 'iOS',
      browser: 'Safari',
      device: 'Mobile',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      _id: '3',
      urlId: 'url1',
      shortId: 'abc123',
      ipAddress: '192.168.1.3',
      userAgent: 'Mozilla/5.0',
      os: 'macOS',
      browser: 'Chrome',
      device: 'Desktop',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      _id: '4',
      urlId: 'url1',
      shortId: 'abc123',
      ipAddress: '192.168.1.4',
      userAgent: 'Mozilla/5.0',
      os: 'Android',
      browser: 'Chrome',
      device: 'Mobile',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      _id: '5',
      urlId: 'url1',
      shortId: 'abc123',
      ipAddress: '192.168.1.5',
      userAgent: 'Mozilla/5.0',
      os: 'Windows',
      browser: 'Firefox',
      device: 'Desktop',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ]

  const displayData = history.length > 0 ? history : mockHistory

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-fade-in overflow-hidden">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                IP Address
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Short ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Browser/OS
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                Device
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">
                TTL
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((entry) => (
              <tr
                key={entry._id}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-slate-300">
                  {formatTimestamp(entry.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-300 font-mono text-xs">
                  {entry.ipAddress}
                </td>
                <td className="px-4 py-3 text-indigo-400 font-semibold">
                  {entry.shortId}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>{getBrowserIcon(entry.browser)}</span>
                    <span>{entry.browser} / {entry.os}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(entry.device)}
                    <span>{entry.device}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-medium">
                    {calculateTTL(entry.createdAt)} days
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {displayData.map((entry) => (
          <div
            key={entry._id}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-1">Time</p>
                  <p className="text-sm text-slate-100 font-medium">
                    {formatTimestamp(entry.createdAt)}
                  </p>
                </div>
                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-medium">
                  {calculateTTL(entry.createdAt)}d
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Browser</p>
                  <p className="text-sm text-slate-100">
                    {getBrowserIcon(entry.browser)} {entry.browser}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Device</p>
                  <p className="text-sm text-slate-100">{entry.device}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">IP Address</p>
                <p className="text-sm text-slate-100 font-mono">
                  {entry.ipAddress}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayData.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>No activity data available yet.</p>
        </div>
      )}
    </div>
  )
}
