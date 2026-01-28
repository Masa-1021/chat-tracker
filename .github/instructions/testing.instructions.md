---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/tests/**"
---

# テストコード規約

## テストフレームワーク

- ユニットテスト: Vitest
- E2Eテスト: Playwright
- コンポーネントテスト: Testing Library

## 命名規則

- テストファイル: `{対象ファイル名}.test.ts(x)` または `{対象ファイル名}.spec.ts(x)`
- テストスイート: 対象の機能/コンポーネント名
- テストケース: 日本語で「〜の場合、〜すること」形式

```typescript
describe('Button', () => {
  it('クリック時にonClickが呼ばれること', () => {
    // ...
  });

  it('disabled時にクリックしても反応しないこと', () => {
    // ...
  });
});
```

## テスト構造

- AAA パターン（Arrange / Act / Assert）を使用
- 1テスト1アサーション（論理的に1つの検証）
- テスト間の依存を避ける

## モック

- 外部依存（API、DB）はモック化
- `vi.mock()` はファイルトップレベルで
- モックはテストごとにリセット（`beforeEach` で `vi.clearAllMocks()`）

## Testing Library

- `screen.getByRole` を優先（アクセシビリティ向上）
- `getByTestId` は最終手段
- `userEvent` を `fireEvent` より優先
- `waitFor` で非同期処理を待機

```typescript
// ✅ 推奨
const button = screen.getByRole('button', { name: '送信' });
await userEvent.click(button);

// ❌ 非推奨
const button = screen.getByTestId('submit-button');
fireEvent.click(button);
```

## Playwright E2E

- Page Object Model パターンを使用
- テストデータはフィクスチャで管理
- リトライロジックを活用
- スクリーンショットで失敗時のデバッグ支援
