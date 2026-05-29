import { useEffect, useState } from 'react'
import { DatasetMapPage } from './pages/DatasetMapPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  const [page, setPage] = useState<'home' | 'map'>(() => {
    return window.location.hash === '#/map' ? 'map' : 'home'
  })

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved === 'light' || saved === 'dark') ? saved : 'dark'
  })

  useEffect(() => {
    const handleHashChange = () => {
      setPage(window.location.hash === '#/map' ? 'map' : 'home')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const navigateToMap = () => {
    window.location.hash = '#/map'
  }

  const navigateToHome = () => {
    window.location.hash = '#/'
  }

  if (page === 'map') {
    return (
      <DatasetMapPage 
        onBack={navigateToHome} 
        theme={theme} 
        setTheme={setTheme} 
      />
    )
  }

  return (
    <LandingPage 
      onLaunch={navigateToMap} 
      theme={theme} 
      setTheme={setTheme} 
    />
  )
}

export default App

