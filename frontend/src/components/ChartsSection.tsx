import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { urlService } from '../services/api'
import type { AnalyticsData } from '../types'

interface ChartsSectionProps {
  selectedUrl: string | null
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function ChartsSection({ selectedUrl }: ChartsSectionProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedUrl) return

      try {
        const data = await urlService.getUrlAnalytics(selectedUrl)
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }

    fetchAnalytics()
  }, [selectedUrl])

  // Mock data for demo
  const mockClickData = [
    { date: 'Mar 1', clicks: 240 },
    { date: 'Mar 5', clicks: 1221 },
    { date: 'Mar 10', clicks: 900 },
    { date: 'Mar 15', clicks: 1929 },
    { date: 'Mar 20', clicks: 2290 },
    { date: 'Mar 25', clicks: 2000 },
    { date: 'Mar 30', clicks: 2181 },
  ]

  const mockBrowserData = [
    { name: 'Chrome', value: 6200 },
    { name: 'Safari', value: 2900 },
    { name: 'Firefox', value: 1500 },
    { name: 'Edge', value: 800 },
    { name: 'Other', value: 1000 },
  ]

  const mockDeviceData = [
    { name: 'Mobile', value: 7200 },
    { name: 'Desktop', value: 4800 },
    { name: 'Tablet', value: 400 },
  ]

  const clickData = analytics?.clickData || mockClickData
  const browserData = analytics?.browserDistribution || mockBrowserData
  const deviceData = analytics?.deviceDistribution || mockDeviceData

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Line Chart - Click Volume */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Click Volume - Last 30 Days
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={clickData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Browser Distribution Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Browser Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={browserData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {browserData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Device Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Device Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {deviceData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Browser Details List */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Top Browsers
        </h3>
        <div className="space-y-3">
          {browserData.slice(0, 5).map((browser, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
            >
              <span className="text-slate-300 text-sm">{browser.name}</span>
              <span className="text-indigo-400 font-semibold">
                {browser.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
