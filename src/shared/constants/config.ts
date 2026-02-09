export const APP_NAME = 'Chat Tracker'
export const APP_VERSION = '0.1.0'

export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
} as const

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_IMAGE_COUNT = 5

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
] as const

export const STALE_TIME = 5 * 60 * 1000 // 5 minutes

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  passwordReset: '/password-reset',
  chat: '/chat',
  chatSession: '/chat/:sessionId',
  history: '/history',
  data: '/data',
  dataDetail: '/data/:id',
  themes: '/themes',
  themeEdit: '/themes/:id',
  profile: '/profile',
  admin: '/admin',
  adminUsers: '/admin/users',
  adminThemes: '/admin/themes',
} as const
