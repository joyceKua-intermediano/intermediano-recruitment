import { useGetApplicantsStats } from '@/features/admin/hooks/useApplicantsStats'

export function AdminStatsProvider({ children }: { children: React.ReactNode }) {
  useGetApplicantsStats()
  return <>{children}</>
}
