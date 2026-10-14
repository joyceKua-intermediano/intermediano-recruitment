import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const result = await verifyAdminAccess(request)

  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [totalApplications, totalHired, totalMonthApplications, totalMonthHired, lastMonthApplications, lastMonthHired] = await Promise.all([
    prisma.application.count(),

    prisma.application.count({
      where: {
        status: 'hired',
      },
    }),

    prisma.application.count({
      where: {
        createdAt: {
          gte: currentMonth,
        },
      },
    }),

    prisma.application.count({
      where: {
        status: 'hired',
        createdAt: {
          gte: currentMonth,
        },
      },
    }),

    prisma.application.count({
      where: {
        createdAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
      },
    }),

    prisma.application.count({
      where: {
        status: 'hired',
        createdAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
      },
    }),
  ])

  const totalHireRate = totalApplications > 0 ? (totalHired / totalApplications) * 100 : 0
  const totalMonthHireRate = totalMonthApplications > 0 ? (totalMonthHired / totalMonthApplications) * 100 : 0
  const lastMonthHireRate = lastMonthApplications > 0 ? (lastMonthHired / lastMonthApplications) * 100 : 0

  const changeFromLastMonth = lastMonthHireRate === 0
    ? totalMonthHireRate > 0 ? 100 : 0
    : ((totalMonthHireRate - lastMonthHireRate) / lastMonthHireRate) * 100

  return NextResponse.json({
    total: Math.round(totalHireRate * 10) / 10,
    totalMonth: Math.round(totalMonthHireRate * 10) / 10,
    changeFromLastMonth: Math.round(changeFromLastMonth * 10) / 10,
  })
}
