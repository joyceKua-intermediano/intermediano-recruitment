import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function POST() {
  const session = await auth0.getSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  const { sub, email } = session.user

  // Database users have a sub starting with "auth0|"; social logins use "google-oauth2|", "github|", etc.
  if (!sub?.startsWith('auth0|')) {
    return NextResponse.json(
      {
        error:
          'Password reset is not available for social login accounts. Please manage your password through your identity provider.',
      },
      { status: 400 }
    )
  }

  const rawDomain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_CLIENT_ID

  if (!rawDomain || !clientId) {
    console.error('Missing Auth0 environment variables')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const auth0Domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')

  try {
    const response = await fetch(
      `https://${auth0Domain}/dbconnections/change_password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          email,
          connection: 'Username-Password-Authentication',
        }),
      }
    )

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      console.error('Auth0 change_password error:', errorBody)
      return NextResponse.json(
        { error: errorBody?.message || 'Failed to send password reset email' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { message: 'Password reset email sent successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error calling Auth0 change_password endpoint:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
