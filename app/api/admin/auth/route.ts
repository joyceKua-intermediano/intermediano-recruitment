import { auth0 } from '@/lib/auth0'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { cache, CACHE_KEYS } from '@/lib/cache'
import { isAdminSuccess, verifyAdminAccess } from '@/lib/verifyAdminAccess'

export async function POST(req: NextRequest) {
  try {
    const result = await verifyAdminAccess(req)

    if (!isAdminSuccess(result)) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error('Error authenticating admin:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth0.getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cacheKey = CACHE_KEYS.ADMIN_USER(session.user.email)
    const cachedAdmin = cache.get(cacheKey)

    if (cachedAdmin) {
      return NextResponse.json(
        {
          admin: cachedAdmin,
        },
        { status: 200 }
      )
    }

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
      },
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    cache.set(cacheKey, admin, 300000)

    return NextResponse.json(
      {
        admin,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error getting admin session:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
