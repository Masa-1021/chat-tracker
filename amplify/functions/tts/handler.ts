import { PollyClient, SynthesizeSpeechCommand, Engine, OutputFormat, VoiceId } from '@aws-sdk/client-polly'

interface FunctionUrlEvent {
  requestContext: {
    http: { method: string; path: string }
  }
  headers: Record<string, string | undefined>
  body?: string
  isBase64Encoded: boolean
}

interface TtsRequestBody {
  text: string
  voiceId?: string
}

// --- JWT Validation (same as streaming-chat) ---

interface JwkKey {
  kid: string
  kty: string
  n: string
  e: string
  alg: string
  use: string
}

interface JwksResponse {
  keys: JwkKey[]
}

interface JwtHeader {
  kid: string
  alg: string
}

interface JwtPayload {
  sub: string
  iss: string
  client_id?: string
  token_use: string
  exp: number
}

let cachedJwks: JwksResponse | null = null

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

async function getJwks(): Promise<JwksResponse> {
  if (cachedJwks) return cachedJwks
  const userPoolId = getEnv('USER_POOL_ID')
  const region = userPoolId.split('_')[0]
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`)
  cachedJwks = (await res.json()) as JwksResponse
  return cachedJwks
}

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = Buffer.from(padded, 'base64')
  return new Uint8Array(binary)
}

function decodeJwtParts(token: string): {
  header: JwtHeader
  payload: JwtPayload
  signatureInput: string
  signature: Uint8Array
} {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT format')
  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString()) as JwtHeader
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as JwtPayload
  const signatureInput = `${parts[0]}.${parts[1]}`
  const signature = base64UrlDecode(parts[2])
  return { header, payload, signatureInput, signature }
}

async function importJwk(jwk: JwkKey) {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: jwk.alg, ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
}

async function verifyJwt(token: string): Promise<string> {
  const { header, payload, signatureInput, signature } = decodeJwtParts(token)

  const userPoolId = getEnv('USER_POOL_ID')
  const clientId = getEnv('USER_POOL_CLIENT_ID')
  const region = userPoolId.split('_')[0]
  const expectedIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

  if (payload.iss !== expectedIssuer) throw new Error('Invalid issuer')
  if (payload.token_use !== 'id') throw new Error('Invalid token_use')
  if (payload.client_id && payload.client_id !== clientId) throw new Error('Invalid client_id')
  if (payload.exp * 1000 < Date.now()) throw new Error('Token expired')

  const jwks = await getJwks()
  const jwk = jwks.keys.find((k) => k.kid === header.kid)
  if (!jwk) throw new Error('No matching JWK found')

  const cryptoKey = await importJwk(jwk)
  const encoder = new TextEncoder()
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    encoder.encode(signatureInput),
  )
  if (!valid) throw new Error('Invalid JWT signature')

  return payload.sub
}

// --- Polly voice mapping ---

const VALID_VOICES: Record<string, VoiceId> = {
  Kazuha: VoiceId.Kazuha,
  Tomoko: VoiceId.Tomoko,
  Mizuki: VoiceId.Mizuki,
  Takumi: VoiceId.Takumi,
}

const DEFAULT_VOICE = VoiceId.Kazuha

// --- Main Handler ---

const pollyClient = new PollyClient({ region: 'us-west-2' })

export const handler = async (event: FunctionUrlEvent) => {
  const responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (event.requestContext.http.method !== 'POST') {
    return { statusCode: 405, headers: responseHeaders, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  // Authenticate
  const authHeader = event.headers['authorization'] ?? event.headers['Authorization']
  if (!authHeader?.startsWith('Bearer ')) {
    return { statusCode: 401, headers: responseHeaders, body: JSON.stringify({ error: 'Missing Authorization' }) }
  }

  try {
    await verifyJwt(authHeader.slice(7))
  } catch (err) {
    return {
      statusCode: 401,
      headers: responseHeaders,
      body: JSON.stringify({ error: `JWT verification failed: ${(err as Error).message}` }),
    }
  }

  // Parse body
  let body: TtsRequestBody
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString()
      : event.body ?? ''
    body = JSON.parse(rawBody) as TtsRequestBody
  } catch {
    return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  const { text, voiceId } = body

  if (!text || text.length === 0) {
    return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: 'text is required' }) }
  }

  // Limit text length to prevent abuse (Polly max is 3000 chars for neural)
  if (text.length > 3000) {
    return { statusCode: 400, headers: responseHeaders, body: JSON.stringify({ error: 'text too long (max 3000)' }) }
  }

  const resolvedVoice = (voiceId && VALID_VOICES[voiceId]) ? VALID_VOICES[voiceId] : DEFAULT_VOICE
  // Kazuha and Tomoko are neural-only; Mizuki is standard-only; Takumi supports both
  const engine: Engine = (resolvedVoice === VoiceId.Mizuki) ? Engine.STANDARD : Engine.NEURAL

  try {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: OutputFormat.MP3,
      VoiceId: resolvedVoice,
      Engine: engine,
      LanguageCode: 'ja-JP',
    })

    const result = await pollyClient.send(command)

    if (!result.AudioStream) {
      return { statusCode: 500, headers: responseHeaders, body: JSON.stringify({ error: 'No audio stream' }) }
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    const stream = result.AudioStream as AsyncIterable<Uint8Array>
    for await (const chunk of stream) {
      chunks.push(chunk)
    }
    const audioBuffer = Buffer.concat(chunks)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
      isBase64Encoded: true,
      body: audioBuffer.toString('base64'),
    }
  } catch (err) {
    console.error('Polly error:', err)
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ error: `TTS failed: ${(err as Error).message}` }),
    }
  }
}
