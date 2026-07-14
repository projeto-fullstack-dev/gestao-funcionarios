import { useEffect, useState } from 'react'
import { clearSession, restoreSession, saveSession } from '../utils/authSession'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    restoreSession().then((token) => { setAuthenticated(Boolean(token)); setLoading(false) })
    const expire = () => { clearSession(); setAuthenticated(false) }
    window.addEventListener('auth:unauthorized', expire)
    return () => window.removeEventListener('auth:unauthorized', expire)
  }, [])

  async function startSession(response) {
    await saveSession(response.token, response.expiresIn)
    setAuthenticated(true)
  }

  function logout() {
    clearSession()
    setAuthenticated(false)
  }

  return <AuthContext.Provider value={{ authenticated, loading, startSession, logout }}>{children}</AuthContext.Provider>
}
