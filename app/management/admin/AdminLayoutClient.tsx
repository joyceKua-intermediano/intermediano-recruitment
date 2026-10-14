'use client'

import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth'
import { AdminLogin } from '@/features/admin/components/AdminLogin'
import { AdminNavbar } from '@/features/admin/components/AdminNavbar'
import { Spinner } from '@/components/ui/loading'
import { AdminStatsProvider } from '@/components/providers/AdminStatsProvider'

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    )
  }

  if (!admin) {
    return <AdminLogin />
  }

  return (
    <AdminStatsProvider>
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
    </AdminStatsProvider>
  )
}

export default AdminLayoutClient
