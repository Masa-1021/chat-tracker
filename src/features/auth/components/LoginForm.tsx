import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { TextField, PasswordField, Button } from '@serendie/ui'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { ROUTES } from '@/shared/constants/config'

const SAMPLE_USER = {
  email: 'demo@chat-tracker.sample',
  password: 'DemoUser1!',
}

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

  const doSignIn = async (signInEmail: string, signInPassword: string) => {
    setError('')
    setIsSubmitting(true)
    try {
      const result = await signIn(signInEmail, signInPassword)

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。')
      return
    }
    await doSignIn(email, password)
  }

  const handleSampleLogin = async () => {
    await doSignIn(SAMPLE_USER.email, SAMPLE_USER.password)
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

        <div className="auth-sample-divider">
          <span>または</span>
        </div>

        <Button
          styleType="outlined"
          type="button"
          onClick={handleSampleLogin}
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          サンプルユーザーで試す
        </Button>
        <p className="auth-sample-note">
          気軽に動作を確認できるデモアカウントでログインします
        </p>

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
