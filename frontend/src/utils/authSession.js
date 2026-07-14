const COOKIE_NAME = 'gestao_session'
const KEY_NAME = 'gestao_session_key'
let cachedToken = null

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes))
const fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0))

function readCookie() {
  return document.cookie.split('; ').find((item) => item.startsWith(`${COOKIE_NAME}=`))?.split('=')[1]
}

function decodePayload(token) {
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')))
  } catch { return null }
}

export function isTokenValid(token) {
  const payload = decodePayload(token)
  return Boolean(payload?.exp && payload.exp * 1000 > Date.now())
}

export async function saveSession(token, expiresIn) {
  const key = crypto.getRandomValues(new Uint8Array(32))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt'])
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(token))
  const value = `${toBase64(iv)}.${toBase64(new Uint8Array(encrypted))}`
  const secure = location.protocol === 'https:' ? '; Secure' : ''

  sessionStorage.setItem(KEY_NAME, toBase64(key))
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${expiresIn}; SameSite=Strict${secure}`
  cachedToken = token
}

export async function restoreSession() {
  const cookie = readCookie()
  const savedKey = sessionStorage.getItem(KEY_NAME)
  if (!cookie || !savedKey) return clearSession()

  try {
    const [iv, encrypted] = cookie.split('.')
    const cryptoKey = await crypto.subtle.importKey('raw', fromBase64(savedKey), 'AES-GCM', false, ['decrypt'])
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(iv) }, cryptoKey, fromBase64(encrypted))
    const token = new TextDecoder().decode(decrypted)
    if (!isTokenValid(token)) return clearSession()
    cachedToken = token
    return token
  } catch { return clearSession() }
}

export function getSessionToken() { return cachedToken }

export function clearSession() {
  cachedToken = null
  sessionStorage.removeItem(KEY_NAME)
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Strict`
  return null
}
