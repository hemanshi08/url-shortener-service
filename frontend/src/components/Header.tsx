import { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { urlService } from '../services/api'
import type { IUrl } from '../types'

interface HeaderProps {
  selectedUrl: string | null
  onSelectUrl: (url: string | null) => void
}

export default function Header({ selectedUrl, onSelectUrl }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [urls, setUrls] = useState<IUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setIsLoading(true)
        const data = await urlService.getAllUrls()
        setUrls(data)
      } catch (error) {
        console.error('Failed to fetch URLs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (searchQuery.length > 0) {
      fetchUrls()
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchQuery])

  const filteredUrls = urls.filter(
    (url) =>
      url.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.longUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:bg-slate-800 rounded-lg">
          <Menu className="w-6 h-6 text-slate-300" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search short links or original URLs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />

            {/* Dropdown Results */}
            {showDropdown && filteredUrls.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredUrls.map((url) => (
                  <button
                    key={url._id}
                    onClick={() => {
                      onSelectUrl(url.shortId)
                      setSearchQuery('')
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 border-b border-slate-700 last:border-b-0 transition-colors"
                  >
                    <div className="font-medium text-slate-100 text-sm">
                      {url.shortId}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {url.longUrl}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create New Button */}
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 md:px-6 py-2 rounded-lg transition-colors whitespace-nowrap">
          Create New
        </button>
      </div>
    </header>
  )
}
