---
name: serendie-webapp
description: |
  Serendie Design Systemを使用したWebアプリケーション開発スキル。
  Webアプリ、HP、ランディングページ、ダッシュボードなどのフロントエンド開発時に必ず使用する。
  React + TypeScript + Viteプロジェクトで、@serendie/uiコンポーネントと@serendie/symbolsアイコンを活用。
  開発後は必ずPlaywrightでスクリーンショットを撮影し、正しく表示されているか検証する。

  使用タイミング:
  - 新規Webアプリ/HP/ランディングページの作成
  - React UIコンポーネントの実装
  - フロントエンドのスタイリング
  - UIの検証・デバッグ

  対応バージョン: @serendie/ui ^2.4.2 (2026/1時点最新)
---

# Serendie Webapp Development

Serendie Design Systemを使用したWebアプリ開発の標準ワークフロー。

## 必須要件

### WCAG 2.2 準拠（必須）

すべてのUI開発はWCAG 2.2 Level AAに準拠すること。

**主要な準拠項目:**
- **知覚可能**: テキストの代替、時間依存メディア、適応可能、識別可能
- **操作可能**: キーボードアクセス、十分な時間、発作防止、ナビゲーション可能、入力モダリティ
- **理解可能**: 読みやすさ、予測可能、入力支援
- **堅牢**: 互換性、支援技術との適合

**具体的なチェック項目:**
- コントラスト比: テキスト4.5:1以上、大きなテキスト3:1以上
- フォーカス表示: すべてのインタラクティブ要素で視認可能
- キーボード操作: Tabキーでの移動、Enterで実行、Escapeで閉じる
- スクリーンリーダー: aria-label、aria-describedby、role属性の適切な使用
- フォーム: ラベルの関連付け、エラーメッセージの明示

### ナビゲーション・ランドマーク（WCAG 2.4.1 必須）

**ページ構造の必須要件:**

```tsx
// 必須のランドマーク構造
<>
  {/* スキップリンク（最初のフォーカス可能要素） */}
  <a href="#main-content" className="skip-link">
    メインコンテンツへスキップ
  </a>

  <header>
    <TopAppBar type="navbar" title="アプリ名" />
  </header>

  <main id="main-content">
    {/* メインコンテンツ */}
  </main>

  <footer>
    {/* フッター */}
  </footer>

  {/* モバイル用 */}
  <BottomNavigation>
    {/* ナビゲーションアイテム */}
  </BottomNavigation>
</>
```

**スキップリンクのCSS（必須）:**
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--sds-color-primary-default);
  color: var(--sds-color-on-primary-default);
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

**ナビゲーションバーの必須ルール:**

| ルール | 理由 |
|--------|------|
| **背景色は必ず有色にする** | スクロール時にmainコンテンツと重なって読めなくなる |
| **position: fixed/stickyの場合、背景色必須** | 透明だとコンテンツが透けて視認性が低下 |
| **レスポンシブ対応必須** | モバイル（320px+）とデスクトップ両対応 |

**ナビゲーション背景色の例:**
```css
/* 必須: navの背景は有色にする */
header {
  background-color: var(--sds-color-surface-default);
  /* または */
  background-color: var(--sds-color-surface-container);
}

/* position: fixedの場合は特に重要 */
header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--sds-color-surface-default); /* 必須 */
}
```

**レスポンシブナビゲーション:**
```tsx
// モバイル: BottomNavigation、デスクトップ: TopAppBar内リンク
<header className="hidden md:block">
  <TopAppBar type="navbar" title="アプリ名" />
</header>

<BottomNavigation className="md:hidden">
  {/* モバイル用ナビゲーション */}
</BottomNavigation>
```

詳細なAPI: [references/components.md](references/components.md) の TopAppBar / BottomNavigation セクション

### UI状態パターン（必須）

すべてのWebアプリで以下の状態を適切に処理すること。

#### エラー状態

**フォームエラー（フィールド単位）:**
```tsx
<TextField
  label="メールアドレス"
  invalid={!!errors.email}
  invalidMessage={errors.email}
/>
```

**ページ全体のエラー（Banner）:**
```tsx
{error && (
  <Banner
    type="error"
    title="エラーが発生しました"
    description={error.message}
  />
)}
```

**APIエラー後の通知（Toast）:**
```tsx
toaster.create({
  title: '保存に失敗しました',
  type: 'error',
})
```

#### ローディング状態

**ボタンのローディング:**
```tsx
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  保存
</Button>
```

**ページ全体のローディング:**
```tsx
{isLoading ? (
  <div className="loading-container">
    <ProgressIndicator type="circular" size="large" />
  </div>
) : (
  <Content />
)}
```

**進捗表示（処理時間既知）:**
```tsx
<ProgressIndicator type="linear" value={progress} max={100} />
```

#### 空状態（Empty State）

**Serendieに専用コンポーネントなし。以下のパターンを使用:**

```tsx
function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  )
}

// 使用例
<EmptyState
  icon={<SerendieSymbolInbox style={{ width: 48, height: 48 }} />}
  title="データがありません"
  description="新しいアイテムを追加してください"
  action={<Button onClick={handleAdd}>追加する</Button>}
/>
```

**Empty State CSS:**
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state-icon {
  color: var(--sds-color-on-surface-low);
  margin-bottom: 16px;
}

.empty-state-title {
  font-size: var(--sds-typography-heading-small-font-size);
  color: var(--sds-color-on-surface-default);
  margin: 0 0 8px 0;
}

.empty-state-description {
  font-size: var(--sds-typography-body-medium-font-size);
  color: var(--sds-color-on-surface-low);
  margin: 0 0 24px 0;
}
```

#### 成功フィードバック

**操作完了後（Toast）:**
```tsx
const handleSave = async () => {
  try {
    await saveData()
    toaster.create({
      title: '保存しました',
      type: 'success',
    })
  } catch (error) {
    toaster.create({
      title: '保存に失敗しました',
      type: 'error',
    })
  }
}
```

#### 確認ダイアログ（破壊的アクション）

**削除などの取り消せない操作前:**
```tsx
const [isConfirmOpen, setIsConfirmOpen] = useState(false)

<Button onClick={() => setIsConfirmOpen(true)}>削除</Button>

<ModalDialog
  isOpen={isConfirmOpen}
  onOpenChange={(e) => setIsConfirmOpen(e.open)}
  title="削除の確認"
  submitButtonLabel="削除する"
  cancelButtonLabel="キャンセル"
  onSubmit={handleDelete}
>
  <p>この操作は取り消せません。本当に削除しますか？</p>
</ModalDialog>
```

#### 状態パターン使い分け表

| 状況 | 使用コンポーネント |
|------|------------------|
| フォーム入力エラー | TextField/Select の `invalid` + `invalidMessage` |
| API通信エラー（軽微） | Toast (`type="error"`) |
| API通信エラー（重大） | Banner (`type="error"`) |
| 操作成功 | Toast (`type="success"`) |
| 処理中（時間不明） | ProgressIndicator (indeterminate) |
| 処理中（時間既知） | ProgressIndicator (determinate) |
| ボタン処理中 | Button `isLoading` |
| データなし | Empty State パターン |
| 削除確認 | ModalDialog |
| 警告 | Banner (`type="warning"`) |

### 連携必須スキル

UI開発時は以下のスキルのルールを**必ず適用**すること:

| スキル | 適用タイミング | 主な内容 |
|--------|---------------|---------|
| `/fixing-accessibility` | 全UI開発 | アクセシブルな名前、キーボードアクセス、フォーカス管理、セマンティクス |
| `/baseline-ui` | 全UI開発 | Tailwind CSS、アニメーション制約、コンポーネント選択、パフォーマンス |
| `/fixing-metadata` | ページ作成時 | title、description、OGP、canonical、構造化データ |
| `/fixing-motion-performance` | アニメーション追加時 | compositor props、測定バッチ、スクロール連動 |

**適用方法:**
1. UI実装前に上記スキルのルールを確認
2. 実装中はルールに違反していないか随時チェック
3. 実装後にスキルを実行してレビュー（例: `/fixing-accessibility src/components/`）

## Quick Start

### 1. プロジェクト作成

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install @serendie/ui @serendie/symbols
```

詳細なセットアップ手順: [references/setup.md](references/setup.md)

### 2. スタイル設定（重要）

`src/index.css`:
```css
@layer reset, base, tokens, recipes, utilities;
@import "@serendie/ui/styles.css";

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
}

body {
  background-color: var(--sds-color-surface-default);
  color: var(--sds-color-on-surface-default);
}
```

**警告**: `* { padding: 0; margin: 0; }` のようなグローバルリセットは使用禁止。Serendieのコンポーネントスタイルを破壊する。

CSS変数・デザイントークンの詳細: [references/design-tokens.md](references/design-tokens.md)

### 3. テーマ設定

`index.html`に`data-panda-theme`属性を追加:
```html
<html lang="ja" data-panda-theme="konjo">
```

利用可能なテーマ: `konjo`（紺青）, `asagi`（浅葱）, `sumire`（菫）, `kurikawa`（栗皮）, `tsutsuji`（躑躅）

テーマ・カラーパレットの詳細: [references/design-tokens.md](references/design-tokens.md)

### 4. コンポーネント使用

```tsx
import { Button, Badge, TextField, Tabs, TabItem, Accordion, AccordionGroup } from '@serendie/ui'
import { SerendieSymbolHome, SerendieSymbolGearFilled } from '@serendie/symbols'

// Button: styleType = filled | outlined | ghost | rectangle
// Button: size = small | medium（largeは存在しない）
<Button styleType="filled" size="medium">Click</Button>

// Switch: labelは必須
<Switch label="ダークモード" checked={value} onCheckedChange={(e) => setValue(e.checked)} />

// Tabs + TabItem
<Tabs value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
  <TabItem title="Tab 1" value="tab1" />
  <TabItem title="Tab 2" value="tab2" />
</Tabs>

// Accordion + AccordionGroup
<AccordionGroup>
  <Accordion value="item1" title="質問1" description="回答1" />
</AccordionGroup>
```

**全32コンポーネントのAPI詳細**: [references/components.md](references/components.md)

### 5. アイコン使用

```tsx
import { SerendieSymbolHome, SerendieSymbolStarFilled } from '@serendie/symbols'

<SerendieSymbolHome style={{ width: 24, height: 24 }} />
```

**300以上のアイコン一覧**: [references/icons.md](references/icons.md)

## 必須要件

1. **WCAG 2.2 Level AA準拠** - すべての違反は欠陥
2. **レスポンシブデザイン** - モバイル(320px+)とデスクトップ両対応

実装完了後は `/fixing-accessibility` でレビューを実行し、違反を検出・修正すること。

## UI検証（必須）

開発後は必ずPlaywrightでスクリーンショットを撮影して検証する。

```bash
pip install playwright
playwright install chromium
python scripts/verify_ui.py --url http://localhost:5173/
```

検証スクリプト: [scripts/verify_ui.py](scripts/verify_ui.py)

### 視覚検証項目:
1. コンポーネントのpadding/marginが正しいか
2. テーマカラーが適用されているか
3. レイアウトが崩れていないか

### WCAG 2.2 / アクセシビリティ検証項目:
1. **キーボード操作**: Tabキーですべてのインタラクティブ要素に到達できるか
2. **フォーカス表示**: フォーカス時に視覚的なインジケーターがあるか
3. **aria属性**: icon-onlyボタンにaria-labelがあるか、フォームにラベルがあるか
4. **コントラスト**: テキストと背景のコントラスト比が十分か
5. **セマンティクス**: 適切なHTML要素（button、input、label等）を使用しているか

### 連携スキルによるレビュー:
実装完了後、以下のスキルでレビューを実行:
```
/fixing-accessibility src/components/
/baseline-ui src/components/
/fixing-metadata index.html
```

## トラブルシューティング

エラーや表示崩れが発生した場合: [references/troubleshooting.md](references/troubleshooting.md)

よくある問題:
- ボタンのパディングがない → グローバルリセット問題
- テーマカラーが適用されない → data-panda-theme属性
- `variant`が無効 → `styleType`を使用
- `size="large"`が無効 → small/mediumのみ

## 参照一覧

| リファレンス | 内容 | 参照タイミング |
|-------------|------|---------------|
| [components.md](references/components.md) | 全32コンポーネントAPI | コンポーネント実装時 |
| [icons.md](references/icons.md) | 300+アイコン一覧 | アイコン選択時 |
| [design-tokens.md](references/design-tokens.md) | カラー・スペーシング・CSS変数 | スタイリング時 |
| [setup.md](references/setup.md) | 詳細セットアップ手順 | プロジェクト作成時 |
| [troubleshooting.md](references/troubleshooting.md) | エラー解決 | 問題発生時 |
| [verify_ui.py](scripts/verify_ui.py) | UI検証スクリプト | 開発完了後 |
