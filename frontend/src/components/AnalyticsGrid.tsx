import { useState, useEffect } from 'react'
import { Users, Mouse, Chrome, Monitor } from 'lucide-react'
import { urlService } from '../services/api'
import type { AnalyticsData } from '../types'

interface AnalyticsGridProps {
  selectedUrl: string | null
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ComponentType<{ className: string }>
  label: string
  value: string | number
  subtext?: string
}) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtext && <p className="text-xs text-slate-500 mt-2">{subtext}</p>}
      </div>
      <div className="p-3 bg-slate-800 rounded-lg">
        <Icon className="w-6 h-6 text-indigo-500" />
      </div>
    </div>
  </div>
)

export default function AnalyticsGrid({ selectedUrl }: AnalyticsGridProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedUrl) return

      try {
        setIsLoading(true)
        const data = await urlService.getUrlAnalytics(selectedUrl)
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [selectedUrl])

  // Mock data for demo
  const mockData: AnalyticsData = {
    totalClicks: 12400,
    uniqueVisitors: 4320,
    topBrowser: { name: 'Chrome', count: 6200 },
    topOS: { name: 'Windows', count: 5800 },
    clickData: [],
    browserDistribution: [],
    deviceDistribution: [],
  }

  const data = analytics || mockData

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
      <StatCard
        icon={Mouse}
        label="Total Clicks"
        value={data.totalClicks.toLocaleString()}
        subtext="All-time clicks"
      />
      <StatCard
        icon={Users}
        label="Unique Visitors"
        value={data.uniqueVisitors.toLocaleString()}
        subtext="Unique IP addresses"
      />
      <StatCard
        icon={Chrome}
        label="Top Browser"
        value={data.topBrowser.name}
        subtext={`${data.topBrowser.count} clicks`}
      />
      <StatCard
        icon={Monitor}
        label="Top OS"
        value={data.topOS.name}
        subtext={`${data.topOS.count} clicks`}
      />
    </div>
  )
}
