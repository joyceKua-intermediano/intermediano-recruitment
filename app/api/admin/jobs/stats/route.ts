import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const result = await verifyAdminAccess(request)

  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [total, totalMonth, lastMonthCount] = await Promise.all([
    prisma.job.count({
      where: {
        isActive: true,
      },
    }),

    prisma.job.count({
      where: {
        isActive: true,
        createdAt: {
          gte: currentMonth,
        },
      },
    }),
    prisma.job.count({
      where: {
        isActive: true,
        createdAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
      },
    }),
  ])

  const changeFromLastMonth =
    lastMonthCount === 0
      ? totalMonth > 0
        ? 100
        : 0 
      : ((totalMonth - lastMonthCount) / lastMonthCount) * 100

  return NextResponse.json({
    total,
    totalMonth,
    changeFromLastMonth: Math.round(changeFromLastMonth * 10) / 10,
  })
}
