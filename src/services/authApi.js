import axios from 'axios'

const API_URL = 'http://localhost:5001'
const SESSION_KEY = 'newsintel_session'
const HASH_PEPPER = 'newsintel_local_auth_v1'
const HASH_ITERATIONS = 12000

const textEncoder = new TextEncoder()

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function createSalt(length = 16) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}

async function sha256(value) {
  const data = textEncoder.encode(value)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return toHex(hash)
}

async function derivePasswordHash(password, salt, iterations = HASH_ITERATIONS) {
  let derived = `${password}:${salt}:${HASH_PEPPER}`

  // Stretching adds extra cost to brute-force attempts.
  for (let i = 0; i < iterations; i += 1) {
    derived = await sha256(derived)
  }

  return derived
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function normalizeApiError(err) {
  if (err?.code === 'ERR_NETWORK') {
    return new Error('Auth server is unreachable. Start the app using `npm run dev` and keep both JSON servers running.')
  }

  return err instanceof Error ? err : new Error('Authentication request failed.')
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  }
}

function storeSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: user.id,
      loginAt: new Date().toISOString()
    })
  )
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    clearSession()
    return null
  }
}

export async function getCurrentUser() {
  const session = getStoredSession()
  if (!session?.userId) return null

  try {
    const response = await axios.get(`${API_URL}/users/${session.userId}`)
    return sanitizeUser(response.data)
  } catch {
    clearSession()
    return null
  }
}

export async function signUpWithJsonServer({ name, email, password }) {
  try {
    const normalizedEmail = normalizeEmail(email)

    const existingResponse = await axios.get(`${API_URL}/users`, {
      params: { email: normalizedEmail }
    })

    const exactMatches = existingResponse.data || []

    // Fallback scan prevents duplicate signup even if old records used mixed-case emails.
    let hasExistingAccount = exactMatches.length > 0
    if (!hasExistingAccount) {
      const allUsersResponse = await axios.get(`${API_URL}/users`)
      hasExistingAccount = (allUsersResponse.data || []).some(
        (user) => normalizeEmail(user.email || '') === normalizedEmail
      )
    }

    if (hasExistingAccount) {
      throw new Error('An account with this email already exists.')
    }

    const salt = createSalt()
    const passwordHash = await derivePasswordHash(password, salt, HASH_ITERATIONS)

    const createResponse = await axios.post(`${API_URL}/users`, {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      salt,
      hashMethod: 'sha256+salt+iterations+pepper',
      iterations: HASH_ITERATIONS,
      createdAt: new Date().toISOString()
    })

    return sanitizeUser(createResponse.data)
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function signInWithJsonServer({ email, password }) {
  try {
    const normalizedEmail = normalizeEmail(email)

    const response = await axios.get(`${API_URL}/users`, {
      params: { email: normalizedEmail }
    })

    const userRecord = response.data[0]
    if (!userRecord) {
      throw new Error('Invalid email or password.')
    }

    const attemptedHash = await derivePasswordHash(
      password,
      userRecord.salt,
      userRecord.iterations || HASH_ITERATIONS
    )

    if (attemptedHash !== userRecord.passwordHash) {
      throw new Error('Invalid email or password.')
    }

    const user = sanitizeUser(userRecord)
    storeSession(user)
    return user
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export function signOutJsonSession() {
  clearSession()
}
