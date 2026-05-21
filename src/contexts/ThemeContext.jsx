import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

// TODO (Ingeniero de Efectos): completar sync con localStorage + cleanup
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  // TODO: useEffect para aplicar clase al <body> y persistir en localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
