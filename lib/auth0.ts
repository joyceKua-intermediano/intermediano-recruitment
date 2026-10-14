import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { NextResponse } from 'next/server'

export const auth0 = new Auth0Client({
  async onCallback(error, context, session) {
    const APP_BASE_URL =
      process.env.AUTH0_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
      'http://localhost:3000'

    if (error) {
      return NextResponse.redirect(
        new URL(`/error?error=${error.message}`, APP_BASE_URL)
      )
    }
    const returnTo = context?.returnTo

    if (session?.user.email) {
      try {
        const data = {
          name: session?.user.nickname || '',
          email: session.user.email.toLowerCase().trim(),
        }

        const isAdminRoute = returnTo?.includes('/management/admin')

        if (isAdminRoute) {
          const adminApiUrl = `${APP_BASE_URL}/api/admin/auth`
          const response = await fetch(adminApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          if (!response.ok) {
            const errorBody = await response.text().catch(() => '')
            console.error(
              'Failed to save admin session data:',
              response.status,
              errorBody
            )
          }
        } else {
          const apiUrl = `${APP_BASE_URL}/api/auth`
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          if (!response.ok) {
            const errorBody = await response.text().catch(() => '')
            console.error(
              'Failed to save applicant session data:',
              response.status,
              errorBody
            )
          }
        }
      } catch (error) {
        console.error('Error saving session data:', error)
      }
    }

    if (returnTo) {
      return NextResponse.redirect(new URL(returnTo, APP_BASE_URL))
    } else {
      return NextResponse.redirect(new URL('/dashboard', APP_BASE_URL))
    }
  },
  session: {
    absoluteDuration: 24 * 60 * 60, // 24 hours
  },
})
