import { createContext, useContext, useState, useEffect } from 'react'

const GodModeContext = createContext()

export const GodModeProvider = ({ children }) => {
  const [godMode, setGodMode] = useState(false)

  // Load God Mode state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('god_mode_active')
    if (saved === 'true') {
      setGodMode(true)
    }
  }, [])

  // Save God Mode state to localStorage
  const activateGodMode = () => {
    setGodMode(true)
    localStorage.setItem('god_mode_active', 'true')
    localStorage.setItem('aiUnlimitedKey', 'unlimited2024') // Unlimited AI
  }

  const deactivateGodMode = () => {
    setGodMode(false)
    localStorage.removeItem('god_mode_active')
    localStorage.removeItem('aiUnlimitedKey')
  }

  return (
    <GodModeContext.Provider value={{ godMode, activateGodMode, deactivateGodMode }}>
      {children}
    </GodModeContext.Provider>
  )
}

export const useGodMode = () => {
  const context = useContext(GodModeContext)
  if (!context) {
    throw new Error('useGodMode must be used within GodModeProvider')
  }
  return context
}
