import { createContext, useState, useEffect, useContext } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Lazy initializer: lee localStorage una sola vez al montar, evita re-render inicial
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    // Fallback: preferencia del sistema operativo
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  // Efecto 1: sincroniza theme → <body> y localStorage
  // Se ejecuta cada vez que `theme` cambia
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Efecto 2: escucha cambios de storage desde otras pestañas (cross-tab sync)
  // Array de dependencias vacío → solo se registra/limpia al montar/desmontar
  // El return cleanup evita memory leaks al desmontar el Provider
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook: encapsula useContext + lanza error si se usa fuera del Provider
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
