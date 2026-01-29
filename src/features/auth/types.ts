export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
}

export interface PasswordResetInput {
  email: string
}

export interface AuthUser {
  id: string
  email: string
  displayName: string
}
