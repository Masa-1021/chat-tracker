import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { TextField, PasswordField, Button } from '@serendie/ui'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { ROUTES } from '@/shared/constants/config'

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to the page the user was trying to access before login
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? ROUTES.home

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signIn(email, password)

      if (result.nextStep.signInStep === 'DONE') {
        navigate(from, { replace: true })
      } else if (result.nextStep.signInStep === 'RESET_PASSWORD') {
        navigate(ROUTES.passwordReset)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(getErrorMessage(err.name))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="ログイン">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}
        <TextField
          label="メールアドレス"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@company.com"
          autoComplete="email"
          required
          fullWidth
          disabled={isSubmitting}
        />
        <PasswordField
          label="パスワード"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
          disabled={isSubmitting}
        />
        <Button
          styleType="filled"
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </Button>
        <div className="auth-links">
          <Link to={ROUTES.passwordReset}>パスワードをお忘れですか？</Link>
          <Link to={ROUTES.register}>アカウント作成</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

function getErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'NotAuthorizedException':
      return 'メールアドレスまたはパスワードが正しくありません。'
    case 'UserNotFoundException':
      return 'アカウントが見つかりません。'
    case 'UserNotConfirmedException':
      return 'アカウントが確認されていません。メールを確認してください。'
    case 'TooManyRequestsException':
      return 'リクエスト数が上限に達しました。しばらく待ってから再試行してください。'
    default:
      return 'ログインに失敗しました。再度お試しください。'
  }
}
