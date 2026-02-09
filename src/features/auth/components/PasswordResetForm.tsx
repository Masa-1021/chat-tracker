import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { TextField, PasswordField, Button } from '@serendie/ui'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { ROUTES } from '@/shared/constants/config'

type Step = 'request' | 'confirm'

export function PasswordResetForm() {
  const navigate = useNavigate()
  const { resetPassword, confirmResetPassword } = useAuth()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('メールアドレスを入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await resetPassword(email)
      if (
        result.nextStep.resetPasswordStep ===
        'CONFIRM_RESET_PASSWORD_WITH_CODE'
      ) {
        setStep('confirm')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(getRequestErrorMessage(err.name))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!code || !newPassword) {
      setError('確認コードと新しいパスワードを入力してください。')
      return
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      await confirmResetPassword(email, code, newPassword)
      navigate(ROUTES.login, { replace: true })
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
      <AuthLayout title="パスワードリセット">
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
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            autoComplete="one-time-code"
            required
            fullWidth
            disabled={isSubmitting}
          />
          <PasswordField
            label="新しいパスワード"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            {isSubmitting ? 'リセット中...' : 'パスワードをリセット'}
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="パスワードリセット">
      <p className="auth-description">
        登録済みのメールアドレスに確認コードを送信します。
      </p>
      <form onSubmit={handleRequest} className="auth-form" noValidate>
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
        <Button
          styleType="filled"
          type="submit"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? '送信中...' : '確認コードを送信'}
        </Button>
        <div className="auth-links">
          <Link to={ROUTES.login}>ログインに戻る</Link>
        </div>
      </form>
    </AuthLayout>
  )
}

function getRequestErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'UserNotFoundException':
      return 'アカウントが見つかりません。'
    case 'LimitExceededException':
      return '試行回数が上限に達しました。しばらく待ってから再試行してください。'
    default:
      return 'リクエストに失敗しました。再度お試しください。'
  }
}

function getConfirmErrorMessage(errorName: string): string {
  switch (errorName) {
    case 'CodeMismatchException':
      return '確認コードが正しくありません。'
    case 'ExpiredCodeException':
      return '確認コードの有効期限が切れています。'
    case 'InvalidPasswordException':
      return '新しいパスワードが要件を満たしていません。'
    default:
      return 'パスワードリセットに失敗しました。再度お試しください。'
  }
}
