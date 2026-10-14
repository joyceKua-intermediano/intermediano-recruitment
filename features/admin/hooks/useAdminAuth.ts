import { useState, useEffect } from 'react'

interface Admin {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
}

interface UseAdminAuthReturn {
  admin: Admin | null
  loading: boolean
  error: string | null
  login: () => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Authentication failed')
        setAdmin(null)
      }
    } catch (err) {
      setError('Network error')
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = '/api/auth/login?returnTo=/management/admin/dashboard'
  }

  const logout = () => {
    window.location.href = '/api/auth/logout?returnTo=/management/admin'
  }

  useEffect(() => {
    if (mounted) {
      checkAuth()
    }
  }, [mounted])

  return {
    admin,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
}
