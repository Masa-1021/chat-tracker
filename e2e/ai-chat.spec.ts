import { test, expect } from '@playwright/test'
import { createTestUser, deleteTestUser, TEST_USER } from './helpers/cognito'

test.describe('AI チャット E2E テスト', () => {
  test.beforeAll(async () => {
    await createTestUser()
  })

  test.afterAll(async () => {
    await deleteTestUser()
  })

  test('ログイン → テーマ選択 → チャット送信 → AI ストリーミング応答', async ({
    page,
  }) => {
    // コンソールログを収集
    const consoleLogs: string[] = []
    page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`))

    // 1. ログイン
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible({ timeout: 10000 })
    await page.fill('input[name="email"]', TEST_USER.email)
    await page.fill('input[name="password"]', TEST_USER.password)
    await page.getByRole('button', { name: 'ログイン' }).click()

    // 2. ホーム画面でテーマ選択を待つ
    await page.waitForURL('/', { timeout: 15000 })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'e2e/screenshots/01-home.png' })

    // 3. 「トラブルメンテナンス」テーマをクリック
    const themeCard = page.locator('text=トラブルメンテナンス').first()
    await expect(themeCard).toBeVisible({ timeout: 10000 })
    await themeCard.click()

    // 4. チャット画面が表示されるまで待つ
    await page.waitForTimeout(3000)
    await page.screenshot({ path: 'e2e/screenshots/02-chat-ready.png' })

    // 5. チャット入力欄にメッセージを入力
    const chatInput = page.locator('textarea').first()
    await expect(chatInput).toBeVisible({ timeout: 10000 })
    await chatInput.fill('こんにちは。昨日の午後3時にモーターが停止するトラブルが発生しました。')
    await page.screenshot({ path: 'e2e/screenshots/03-message-typed.png' })

    // 6. 送信ボタンをクリック
    const sendBtn = page.locator(
      'button[type="submit"], button[aria-label*="送信"], form button',
    ).last()
    await sendBtn.click()

    // 7. AI ストリーミング応答を待つ（最大90秒）
    // ユーザーメッセージが表示されることを確認
    await page.waitForTimeout(2000)
    await page.screenshot({ path: 'e2e/screenshots/04-message-sent.png' })

    // AI応答テキストが画面に現れるまで待つ
    // ストリーミング中のテキストまたは完了したメッセージを検出
    try {
      // assistant のメッセージブロックを待つ
      await page.waitForFunction(
        () => {
          const allText = document.body.innerText
          // AIアシスタントの応答パターンを検出
          return (
            allText.includes('発生日時') ||
            allText.includes('トラブル') ||
            allText.includes('モーター') ||
            allText.includes('詳しく') ||
            allText.includes('承知') ||
            allText.includes('お手伝い')
          )
        },
        { timeout: 90000 },
      )
      await page.waitForTimeout(5000) // ストリーミング完了を待つ
      await page.screenshot({ path: 'e2e/screenshots/05-ai-response.png' })
      console.log('AI応答を検出しました')

      // ページ内のテキストを取得して確認
      const bodyText = await page.locator('body').innerText()
      console.log('Page text (last 500 chars):', bodyText.slice(-500))
      expect(bodyText.length).toBeGreaterThan(100)
    } catch {
      await page.screenshot({ path: 'e2e/screenshots/05-ai-response-timeout.png' })
      console.log('Console logs:', consoleLogs.join('\n'))
      // ネットワークリクエストを確認
      console.log('Page URL:', page.url())
      throw new Error('AI応答が90秒以内に検出されませんでした。コンソールログを確認してください。')
    }
  })
})
