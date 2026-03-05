import { useState, useEffect } from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import AnalyticsGrid from './AnalyticsGrid'
import ChartsSection from './ChartsSection'
import RecentActivityTable from './RecentActivityTable'

type PageType = 'dashboard' | 'analytics' | 'security' | 'settings' | 'all-links'

interface DashboardProps {
  currentPage: PageType
}

export default function Dashboard({ currentPage }: DashboardProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

  useEffect(() => {
    // Reset selected URL when page changes
    if (currentPage !== 'dashboard') {
      setSelectedUrl(null)
    }
  }, [currentPage])

  return (
    <div className="min-h-screen bg-slate-950">
      <Header selectedUrl={selectedUrl} onSelectUrl={setSelectedUrl} />

      {currentPage === 'dashboard' && (
        <div className="p-4 md:p-8 space-y-8">
          {/* Hero Section */}
          <HeroSection onUrlCreated={setSelectedUrl} />

          {/* Analytics Grid */}
          <AnalyticsGrid selectedUrl={selectedUrl} />

          {/* Charts Section */}
          <ChartsSection selectedUrl={selectedUrl} />

          {/* Recent Activity Table */}
          <RecentActivityTable selectedUrl={selectedUrl} />
        </div>
      )}

      {currentPage === 'all-links' && (
        <div className="p-4 md:p-8">
          <RecentActivityTable selectedUrl={null} />
        </div>
      )}

      {currentPage === 'analytics' && (
        <div className="p-4 md:p-8 text-center text-slate-400">
          <p>Analytics page coming soon...</p>
        </div>
      )}

      {currentPage === 'security' && (
        <div className="p-4 md:p-8 text-center text-slate-400">
          <p>Security & Rate Limits configuration coming soon...</p>
        </div>
      )}

      {currentPage === 'settings' && (
        <div className="p-4 md:p-8 text-center text-slate-400">
          <p>Settings page coming soon...</p>
        </div>
      )}
    </div>
  )
}
