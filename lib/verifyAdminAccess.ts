import { auth0 } from '@/lib/auth0'
import prisma from '@/lib/prisma'
import { cache, CACHE_KEYS } from '@/lib/cache'
import { NextRequest } from 'next/server'

type AdminResult =
  | { success: true; admin: { id: string; email: string; name: string; role: string; permissions: string[]; isActive: boolean } }
  | { success: false; error: string }

export const verifyAdminAccess = async (req?: NextRequest): Promise<AdminResult> => {
  try {
    const session = await auth0.getSession()
    if (!session?.user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { email, name } = session.user

    if (!name || !email) {
      return { success: false, error: 'All fields are required' }
    }

    const cacheKey = CACHE_KEYS.ADMIN_USER(email)
    const cachedAdmin = cache.get(cacheKey)

    if (cachedAdmin) {
      return { success: true, admin: cachedAdmin }
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
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
      return { success: false, error: 'Admin access denied' }
    }

    cache.set(cacheKey, admin, 300000)

    return { success: true, admin }
  } catch (error) {
    console.error('Admin verification error:', error)
    return { success: false, error: 'Verification failed' }
  }
}

export const isAdminSuccess = (
  result: AdminResult
): result is { success: true; admin: any } => {
  return result.success === true
}
