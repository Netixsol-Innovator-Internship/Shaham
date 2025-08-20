import { useEffect } from 'react'
import { useStore } from '../stores/useStore'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const { darkMode } = useStore()
  
  useEffect(() => {
    // Set initial theme based on stored preference
    if (darkMode && typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
    }
  }, [darkMode])
  
  return <Component {...pageProps} />
}

export default MyApp