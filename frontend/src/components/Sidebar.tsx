import { Link2, BarChart3, Shield, Settings, List } from 'lucide-react'

type PageType = 'dashboard' | 'analytics' | 'security' | 'settings' | 'all-links'

interface SidebarProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Link2 },
    { id: 'all-links' as const, label: 'All Links', icon: List },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'security' as const, label: 'Security/Rate Limits', icon: Shield },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">LinkPulse</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-400">© 2024 LinkPulse</p>
      </div>
    </aside>
  )
}
