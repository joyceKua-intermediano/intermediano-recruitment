'use client'
import { useEffect } from 'react'
import { useAdminAuth } from '../hooks/useAdminAuth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  useAdminApplicantsStore,
  useAdminJobsStore,
  useAdminApplicationsStore,
  useAdminHireRateStore,
} from '@/lib/stores/admin/applicantsStore'
import {
  useGetApplicantsStats,
  useGetJobsStats,
  useGetApplicationsStats,
  useGetHireRateStats,
} from '../hooks/useApplicantsStats'
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  User,
  Kanban,
} from 'lucide-react'
import Link from 'next/link'

export function AdminDashboard() {
  const { admin } = useAdminAuth()

  useGetApplicantsStats()
  useGetJobsStats()
  useGetApplicationsStats()
  useGetHireRateStats()

  const { applicantsStats } = useAdminApplicantsStore()
  const { jobsStats } = useAdminJobsStore()
  const { applicationsStats } = useAdminApplicationsStore()
  const { hireRateStats } = useAdminHireRateStore()
  const {
    total: applicantsTotal = 0,
    totalMonth: applicantsTotalMonth = 0,
    changeFromLastMonth: applicantsChangeFromLastMonth = 0,
  } = applicantsStats || {}

  const {
    total: jobsTotal = 0,
    totalMonth: jobsTotalMonth = 0,
    changeFromLastMonth: jobsChangeFromLastMonth = 0,
  } = jobsStats || {}

  const {
    total: applicationsTotal = 0,
    totalMonth: applicationsTotalMonth = 0,
    changeFromLastMonth: applicationsChangeFromLastMonth = 0,
  } = applicationsStats || {}

  const {
    total: hireRateTotal = 0,
    totalMonth: hireRateTotalMonth = 0,
    changeFromLastMonth: hireRateChangeFromLastMonth = 0,
  } = hireRateStats || {}

  if (!admin) {
    return null
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Applicants
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{applicantsTotal}</div>
            <div className='space-y-1'>
              <div className='text-sm text-muted-foreground'>
                This Month: {applicantsTotalMonth}
              </div>
              <div
                className={
                  applicantsChangeFromLastMonth > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {applicantsChangeFromLastMonth > 0 ? '+' : ''}
                {applicantsChangeFromLastMonth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Jobs</CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{jobsTotal}</div>
            <div className='space-y-1'>
              <div className='text-sm text-muted-foreground'>
                This Month: {jobsTotalMonth}
              </div>
              <div
                className={
                  jobsChangeFromLastMonth > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {jobsChangeFromLastMonth > 0 ? '+' : ''}
                {jobsChangeFromLastMonth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Applications</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{applicationsTotal}</div>
            <div className='space-y-1'>
              <div className='text-sm text-muted-foreground'>
                This Month: {applicationsTotalMonth}
              </div>
              <div
                className={
                  applicationsChangeFromLastMonth > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {applicationsChangeFromLastMonth > 0 ? '+' : ''}
                {applicationsChangeFromLastMonth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Hire Rate</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{hireRateTotal}%</div>
            <div className='space-y-1'>
              <div className='text-sm text-muted-foreground'>
                This Month: {hireRateTotalMonth}%
              </div>
              <div
                className={
                  hireRateChangeFromLastMonth > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {hireRateChangeFromLastMonth > 0 ? '+' : ''}
                {hireRateChangeFromLastMonth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Link href='/management/admin/applicants'>
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <User className='w-5 h-5' />
                <span>Manage Applicants</span>
              </CardTitle>
              <CardDescription>
                View and manage all applicant profiles
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href='/management/admin/jobs'>
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Briefcase className='w-5 h-5' />
                <span>Job Postings</span>
              </CardTitle>
              <CardDescription>Create and manage job openings</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href='/management/admin/kanban'>
          <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Kanban className='w-5 h-5' />
                <span>Kanban</span>
              </CardTitle>
              <CardDescription>
                Manage  Applicant progress Status
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
