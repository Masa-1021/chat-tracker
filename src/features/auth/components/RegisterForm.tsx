import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { TextField, PasswordField, Button } from '@serendie/ui'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { ROUTES } from '@/shared/constants/config'

type Step = 'register' | 'confirm'

export function RegisterForm() {
  const navigate = useNavigate()
  const { signUp, confirmSignUp, signIn } = useAuth()
  const [step, setStep] = useState<Step>('register')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !displayName) {
      setError('すべての項目を入力してください。')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signUp(email, password, displayName)
      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setStep('confirm')
      } else if (result.nextStep.signUpStep === 'DONE') {
        navigate(ROUTES.home, { replace: true })
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(getRegisterErrorMessage(err.name))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!confirmationCode) {
      setError('確認コードを入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      await confirmSignUp(email, confirmationCode)
      // Auto sign-in after confirmation
      await signIn(email, password)
      navigate(ROUTES.home, { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setError(getConfirmErrorMessage(err.name))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'confirm') {
    return (
      <AuthLayout title="メール確認">
        <p className="auth-description">
          {email} に確認コードを送信しました。
        </p>
        <form onSubmit={handleConfirm} className="auth-form" noValidate>
          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}
          <TextField
            label="確認コード"
            name="confirmationCode"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="123456"
            autoComplete="one-time-code"
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
            {isSubmitting ? '確認中...' : '確認'}
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="アカウント作成">
      <form onSubmit={handleRegister} className="auth-form" noValidate>
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}
        <TextField
          label="表示名"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="田中太郎"
          autoComplete="name"
          required
          fullWidth
          disabled={isSubmitting}
        />
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
          autoComplete="new-password"
          required
          fullWidth
          disabled={isSubmitting}
        />
        <p className="auth-hint">パスワードは8文字以上</p>
        <Button
          styleType="filled"
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? '登録中...' : 'アカウント作成'}
        </Button>
        <div className="auth-links">
          <Link to={ROUTES.login}>すでにアカウントをお持ちですか？</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

function getRegisterErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'UsernameExistsException':
      return 'このメールアドレスは既に登録されています。'
    case 'InvalidPasswordException':
      return 'パスワードが要件を満たしていません。'
    case 'TooManyRequestsException':
      return 'リクエスト数が上限に達しました。しばらく待ってから再試行してください。'
    default:
      return '登録に失敗しました。再度お試しください。'
  }
}

function getConfirmErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'CodeMismatchException':
      return '確認コードが正しくありません。'
    case 'ExpiredCodeException':
      return '確認コードの有効期限が切れています。'
    default:
      return '確認に失敗しました。再度お試しください。'
  }
}
