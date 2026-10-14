import crypto from 'crypto'

export class Auth0ManagementError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'Auth0ManagementError'
    this.status = status
  }
}

interface CreateAuth0UserInput {
  email: string
  name: string
  password: string
}

interface Auth0User {
  user_id: string
  email: string
}

function getAuth0Domain(): string {
  const raw =
    process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL || ''
  return raw.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function getDbConnection() {
  return process.env.AUTH0_DB_CONNECTION || 'Username-Password-Authentication'
}

function hasManagementCredentials() {
  return Boolean(
    getAuth0Domain() &&
      process.env.AUTH0_MANAGEMENT_CLIENT_ID &&
      process.env.AUTH0_MANAGEMENT_CLIENT_SECRET
  )
}

function getManagementCredentials() {
  const domain = getAuth0Domain()
  const clientId = process.env.AUTH0_MANAGEMENT_CLIENT_ID
  const clientSecret = process.env.AUTH0_MANAGEMENT_CLIENT_SECRET
  const connection = getDbConnection()

  if (!domain || !clientId || !clientSecret) {
    throw new Auth0ManagementError(
      'Auth0 Management API is not configured',
      500
    )
  }

  return { domain, clientId, clientSecret, connection }
}

async function getManagementToken(): Promise<{
  domain: string
  token: string
  connection: string
}> {
  const { domain, clientId, clientSecret, connection } =
    getManagementCredentials()

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
    }),
  })

  if (!response.ok) {
    throw new Auth0ManagementError(
      'Failed to obtain Auth0 Management API token',
      502
    )
  }

  const data = (await response.json()) as { access_token?: string }
  if (!data.access_token) {
    throw new Auth0ManagementError(
      'Auth0 Management API token was empty',
      502
    )
  }

  return { domain, token: data.access_token, connection }
}

function randomFromCharset(charset: string, length: number): string {
  const bytes = crypto.randomBytes(length)
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length]
  }
  return result
}

export function generateTemporaryPassword(): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lowercase = 'abcdefghijkmnopqrstuvwxyz'
  const numbers = '23456789'
  const symbols = '!@#$%^&*-_'
  const all = uppercase + lowercase + numbers + symbols

  const required = [
    randomFromCharset(uppercase, 1),
    randomFromCharset(lowercase, 1),
    randomFromCharset(numbers, 1),
    randomFromCharset(symbols, 1),
    randomFromCharset(all, 12),
  ].join('')

  const chars = required.split('')
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomBytes(1)[0] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}

async function parseAuth0Error(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  let message = fallbackMessage
  try {
    const errorBody = (await response.json()) as {
      message?: string
      description?: string
      error?: string
      code?: string
    }
    const details = `${errorBody.message || ''} ${errorBody.description || ''} ${errorBody.error || ''} ${errorBody.code || ''}`.toLowerCase()
    if (
      response.status === 409 ||
      details.includes('already exists') ||
      details.includes('user_exists')
    ) {
      throw new Auth0ManagementError(
        'An account with this email already exists',
        409
      )
    }
  } catch (error) {
    if (error instanceof Auth0ManagementError) {
      throw error
    }
  }
  throw new Auth0ManagementError(message, response.status === 409 ? 409 : 502)
}

async function createAuth0UserWithManagementApi(
  input: CreateAuth0UserInput
): Promise<Auth0User> {
  const { domain, token, connection } = await getManagementToken()

  const response = await fetch(`https://${domain}/api/v2/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.email,
      name: input.name,
      password: input.password,
      connection,
      email_verified: true,
      verify_email: false,
    }),
  })

  if (!response.ok) {
    await parseAuth0Error(response, 'Failed to create applicant account')
  }

  const user = (await response.json()) as Auth0User
  if (!user.user_id) {
    throw new Auth0ManagementError('Auth0 user was created without an id', 502)
  }

  return user
}

async function createAuth0UserWithSignupApi(
  input: CreateAuth0UserInput
): Promise<Auth0User> {
  const domain = getAuth0Domain()
  const clientId = process.env.AUTH0_CLIENT_ID
  const connection = getDbConnection()

  if (!domain || !clientId) {
    throw new Auth0ManagementError(
      'Auth0 is not configured. Set AUTH0_DOMAIN and AUTH0_CLIENT_ID.',
      500
    )
  }

  const response = await fetch(`https://${domain}/dbconnections/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      email: input.email,
      password: input.password,
      connection,
      name: input.name,
    }),
  })

  if (!response.ok) {
    await parseAuth0Error(response, 'Failed to create applicant account')
  }

  const created = (await response.json()) as {
    _id?: string
    user_id?: string
    email?: string
  }
  const userId =
    created.user_id || (created._id ? `auth0|${created._id}` : '')

  if (!userId) {
    throw new Auth0ManagementError('Auth0 user was created without an id', 502)
  }

  return {
    user_id: userId,
    email: created.email || input.email,
  }
}

export async function createAuth0User(
  input: CreateAuth0UserInput
): Promise<Auth0User> {
  if (hasManagementCredentials()) {
    return createAuth0UserWithManagementApi(input)
  }

  return createAuth0UserWithSignupApi(input)
}

export async function deleteAuth0User(userId: string): Promise<void> {
  if (!userId || !hasManagementCredentials()) {
    return
  }

  try {
    const { domain, token } = await getManagementToken()
    await fetch(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error('Failed to roll back Auth0 user')
  }
}
