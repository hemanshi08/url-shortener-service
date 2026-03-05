import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Sidebar from './components/Sidebar'

type PageType = 'dashboard' | 'analytics' | 'security' | 'settings' | 'all-links'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        <Dashboard currentPage={currentPage} />
      </main>
    </div>
  )
}

export default App
