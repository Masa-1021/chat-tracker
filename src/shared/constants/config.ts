export const APP_NAME = 'Chat Tracker'
export const APP_VERSION = '0.0.0'

export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
} as const

export const DEFAULT_VOICE_SILENCE_TIMEOUT = 3

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_IMAGE_COUNT = 5

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
] as const

export const AWS_CONFIG = {
  region: import.meta.env.VITE_AWS_REGION || 'us-west-2',
  userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
  userPoolWebClientId: import.meta.env.VITE_AWS_USER_POOL_WEB_CLIENT_ID || '',
  appSyncEndpoint: import.meta.env.VITE_AWS_APPSYNC_ENDPOINT || '',
  appSyncRegion: import.meta.env.VITE_AWS_APPSYNC_REGION || 'us-west-2',
  s3Bucket: import.meta.env.VITE_AWS_S3_BUCKET || '',
}
