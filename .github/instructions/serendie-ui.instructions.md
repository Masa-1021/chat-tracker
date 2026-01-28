---
applyTo: "src/components/**/*.tsx,src/pages/**/*.tsx,src/app/**/*.tsx"
---

# Serendie Design System 使用規約

## クイックリファレンス（最重要ルール）

> **この文書は長いため、以下の要約を最優先で確認すること。**

### 必須設定

| 項目 | 必須 | 禁止 |
|------|------|------|
| CSS Import | `@serendie/ui/styles.css` | `/dist/styles.css` |
| Tailwind v4 | `@tailwindcss/vite` + `@import "tailwindcss"` | `tailwind.config.js` |
| アイコン | `@serendie/symbols` のみ | react-icons, heroicons |

### Pattern 3（Serendie Standard）デザインルール

| カテゴリ | 使用する | 使用しない |
|---------|----------|------------|
| カード | `bg-white rounded-xl shadow-sm border border-gray-100` | グラデーション、blur効果 |
| ホバー | `hover:shadow-md` | `hover:scale-*` |
| 角丸 | `rounded-xl`, `rounded-2xl` | `rounded-3xl` |
| アイコン背景 | `bg-{color}-50` (薄い色) | 濃い色の背景 |

### よくあるエラーと対策

```tsx
// ❌ エラーになる
import "@serendie/ui/dist/styles.css";     // パスが違う
import { SerendieSymbolTemplate } from "@serendie/symbols";  // 存在しない

// ✅ 正しい
import "@serendie/ui/styles.css";
import { SerendieSymbolCheck, SerendieSymbolPlus } from "@serendie/symbols";
```

**詳細は以下の各セクションを参照。**

---

## プロジェクトセットアップ（必須）

新規プロジェクトを作成する際は、以下の設定を必ず行うこと。

### 1. 依存関係（package.json）

```json
{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@serendie/symbols": "^1.0.2",
    "@serendie/ui": "^2.4.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.1.18",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^27.4.0",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4",
    "vitest": "^4.0.18"
  }
}
```

詳細な設定ファイル（tsconfig、eslint等）は `.github/instructions/project-setup.instructions.md` を参照。

### 2. Vite設定（vite.config.ts）

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**重要**: Tailwind CSS v4 は `tailwind.config.js` を**使用しない**。`@tailwindcss/vite` プラグインで設定する。

### 3. エントリーポイント（src/main.tsx）

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@serendie/ui/styles.css'  // ← 必須: Serendieスタイル
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**重要**: `@serendie/ui/styles.css` を `index.css` より前にインポートすること。

### 4. グローバルCSS（src/index.css）

```css
@import "tailwindcss";
@layer reset, base, tokens, recipes, utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--sds-color-surface-default);
}

#root {
  min-height: 100vh;
}
```

**重要**:
- `@import "tailwindcss"` で Tailwind v4 を読み込む
- `@layer` ディレクティブで Serendie のレイヤー順序を定義
- `var(--sds-color-surface-default)` は Serendie のデザイントークン

### 5. セットアップチェックリスト

- [ ] `@serendie/ui` と `@serendie/symbols` をインストール
- [ ] `@tailwindcss/vite` と `tailwindcss` v4 をインストール
- [ ] `vite.config.ts` に `tailwindcss()` プラグインを追加
- [ ] `main.tsx` で `@serendie/ui/styles.css` をインポート
- [ ] `index.css` で `@import "tailwindcss"` と `@layer` を設定
- [ ] `tailwind.config.js` は**作成しない**（v4では不要）

---

## UIライブラリ

- `@serendie/ui` コンポーネントを優先使用
- `@serendie/symbols` でアイコン
- カスタムコンポーネントは Serendie の上に構築

## スタイリング戦略（3層構造）

| 層 | 責務 | 技術 |
|---|-----|-----|
| コンポーネント | UI要素のスタイル | `@serendie/ui` |
| レイアウト | 配置・余白・グリッド | Tailwind CSS |
| カラー | 色指定 | Serendie Design Tokens |

## スタイリングルール

1. **Serendie コンポーネントの内部スタイルは変更しない**
2. **レイアウトは Tailwind のユーティリティクラスを使用**
   ```tsx
   <div className="flex gap-4 p-6">
     <Button variant="filled">送信</Button>
   </div>
   ```
3. **色は Design Token 経由で指定**
   ```tsx
   <div className="bg-sd-system-color-impression-primary">
   ```
4. **カスタムCSSは最終手段**

## アクセシビリティ

- Serendie コンポーネントのアクセシビリティ機能を活用
- `aria-*` 属性は必要に応じて追加
- フォーカス管理は Serendie のデフォルトに従う

## レスポンシブデザイン

- モバイルファースト（`sm:`, `md:`, `lg:` で拡張）
- ブレークポイント:
  - 320px: 最小サポート幅
  - 768px: タブレット
  - 1024px: デスクトップ

## デザイントークン（Design Tokens）

プロジェクト内で統一的に使用する標準値を定義。これにより数値のブレを防止。

### スペーシング（Spacing）

```typescript
// 推奨: src/constants/design-tokens.ts
// テンプレートファイル: .github/templates/serendie/design-tokens.ts
export const SPACING = {
  card: {
    padding: 'p-6',        // カード内パディング
    paddingSmall: 'p-4',   // 小カード
    gap: 'gap-6',          // カード間
  },
  section: {
    paddingY: 'py-8',      // セクション縦
    paddingX: 'px-4',      // セクション横（モバイル）
    paddingXLarge: 'sm:px-6', // セクション横（PC）
  },
  list: {
    gap: 'space-y-3',      // リストアイテム間
  },
} as const;
```

### 角丸（Border Radius）

```typescript
export const RADIUS = {
  card: 'rounded-xl',      // 標準カード
  cardSmall: 'rounded-lg', // 小カード
  button: 'rounded-lg',    // ボタン
  avatar: 'rounded-full',  // アバター
  input: 'rounded-lg',     // 入力欄
} as const;
```

### シャドウ（Shadow）

```typescript
export const SHADOW = {
  card: 'shadow-sm',           // 標準カード
  cardHover: 'hover:shadow-md', // ホバー時
  header: 'shadow-sm',          // ヘッダー
} as const;
```

### コンテナ幅（Container Width）

```typescript
export const CONTAINER = {
  form: 'max-w-3xl',      // フォーム・記事
  dashboard: 'max-w-7xl', // ダッシュボード
  narrow: 'max-w-2xl',    // 狭いコンテンツ
} as const;
```

### タイポグラフィ（Typography）

```typescript
export const TYPOGRAPHY = {
  pageTitle: 'text-lg font-semibold text-white',
  sectionTitle: 'text-base font-semibold text-gray-700',
  subTitle: 'text-sm font-medium text-gray-600',
  body: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
} as const;
```

### 使用例

```tsx
import { SPACING, RADIUS, SHADOW, TYPOGRAPHY } from '@/constants/design-tokens';

// ✅ 推奨: トークン使用
<div className={`bg-white ${RADIUS.card} ${SHADOW.card} ${SPACING.card.padding}`}>
  <h2 className={TYPOGRAPHY.sectionTitle}>セクション</h2>
</div>

// ❌ 非推奨: 直接指定（ブレの原因）
<div className="bg-white rounded-2xl shadow-lg p-8">
  <h2 className="text-xl font-bold text-gray-900">セクション</h2>
</div>
```

## 命名規則（Naming Conventions）

### ファイル名

```
components/
  ├── Button.tsx              # Serendieコンポーネント（そのまま）
  ├── TodoForm.tsx            # カスタムコンポーネント（PascalCase）
  ├── TodoList.tsx
  └── StatCard.tsx

pages/
  ├── DashboardPage.tsx       # ページコンポーネント（〜Page）
  ├── ChatPage.tsx
  └── TodoPage.tsx

hooks/
  ├── useTodos.ts             # カスタムフック（use〜）
  └── useTheme.ts

constants/
  ├── design-tokens.ts        # デザイントークン
  └── theme-colors.ts         # テーマカラー定義
```

### コンポーネント命名

```tsx
// ✅ 推奨: 明確で統一的な命名
export function TodoForm() { }       // フォーム
export function TodoList() { }       // リスト
export function TodoItem() { }       // リストアイテム
export function StatCard() { }       // 統計カード
export function DashboardPage() { }  // ページ

// ❌ 非推奨: 不明瞭・不統一
export function Form() { }           // 何のフォーム？
export function List() { }           // 何のリスト？
export function Card1() { }          // 数字サフィックス
export function Dashboard() { }      // Pageサフィックスなし
```

### 変数・関数命名

```tsx
// ✅ 推奨: 意図が明確
const [todos, setTodos] = useState<Todo[]>([]);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const handleSubmit = () => { };
const handleDeleteTodo = (id: string) => { };

// ❌ 非推奨: 不明瞭
const [data, setData] = useState([]);
const [flag, setFlag] = useState(false);
const submit = () => { };
const delete = (id: string) => { }; // 予約語
```

## 状態管理パターン（State Management）

### ローカル状態

```tsx
// ✅ 推奨: useStateで管理
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<FilterType>('all');

// 複雑な状態はuseReducerも可
const [state, dispatch] = useReducer(todoReducer, initialState);
```

### 永続化状態

```tsx
// ✅ 推奨: カスタムフック化
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// 使用例
const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
```

### グローバル状態

```tsx
// シンプルなアプリ: Context API
// 複雑なアプリ: Zustand, Jotai などの軽量ライブラリ推奨
// ❌ 非推奨: Redux（過度に複雑）
```

## 標準デザインパターン（公式）

### ⭐ Serendie Standard（必須採用）

**重要**: Serendie Design Systemを使用するすべてのアプリケーションは、この標準パターンを採用すること。
以下に示す逸脱スタイルは禁止。

#### 1. 配色原則（Color Guidelines）

| 要素 | 設定 | 備考 |
|-----|------|------|
| ヘッダー背景 | テーマカラー（solid） | ✅ `bg-sd-*` or `style={{ backgroundColor: THEME_COLOR }}` |
| ❌ グラデーション | 禁止 | `bg-gradient-*` は使用しない |
| メイン背景 | `bg-gray-50` または `bg-white` | 清潔な印象 |
| カード背景 | `bg-white` | 常に白 |
| テキスト（ヘッダー） | `text-white` | テーマカラー背景上 |
| テキスト（本文） | `text-gray-700` ~ `text-gray-800` | 読みやすさ優先 |
| アクセント | テーマカラー | ボタン、リンク、重要要素のみ |

#### 2. レイアウト構造（Layout Structure）

```tsx
// ページ全体構造（標準テンプレート）
<div className="min-h-screen flex flex-col bg-gray-50">
  {/* ヘッダー */}
  <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: THEME_COLOR }}>
    <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
    </div>
  </header>
  
  {/* メインコンテンツ */}
  <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
    {/* コンテンツ */}
  </main>
</div>
```

**必須設定:**
- コンテナ幅: `max-w-2xl` ~ `max-w-3xl` (フォーム、記事) または `max-w-7xl` (ダッシュボード)
- 縦スペーシング: `py-6` ~ `py-8` (セクション間), `gap-6` (カード間)
- 横スペーシング: `px-4` (モバイル), `sm:px-6` (タブレット以上)

#### 3. カードデザイン（Card Design）

```tsx
// 標準カード
<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
  <h2 className="text-base font-semibold text-gray-700 mb-4">{title}</h2>
  {content}
</div>

// 小さいカード（StatCard、フィルター等）
<div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
  {/* アイコン + 数値 */}
</div>
```

**必須仕様:**
- 背景: `bg-white` （固定）
- 角丸: `rounded-xl` (小カード), `rounded-2xl` (標準カード)
- シャドウ: `shadow-sm` (小カード), `shadow-md` (標準カード)
- ボーダー: `border border-gray-100`
- パディング: `p-4` (小), `p-6` (標準), `p-8` (大)

**❌ 禁止:**
- `rounded-none`, `rounded-3xl` （極端な角丸）
- `border-4`, `border-8` （太すぎるボーダー）
- `shadow-lg`, `shadow-xl` （過度なシャドウ）
- カラフルな背景色（テーマカラー以外）

#### 4. タイポグラフィ（Typography）

| 要素 | クラス | 例 |
|-----|--------|-----|
| ページタイトル | `text-lg font-semibold text-white` | ヘッダー内 |
| セクション見出し | `text-base font-semibold text-gray-700` | カード内タイトル |
| サブ見出し | `text-sm font-medium text-gray-600` | 小見出し |
| 本文 | `text-sm text-gray-600` | 説明文 |
| 補足 | `text-xs text-gray-500` | ヘルプテキスト |

**原則:**
- ✅ `font-semibold` を基本使用
- ❌ `font-bold` は特別な強調時のみ
- ❌ `uppercase`, `tracking-wider` は避ける（読みにくい）
- ❌ `text-2xl`, `text-3xl` はランディングページ以外使用禁止

#### 5. ボタン・インタラクション（Buttons & Interactions）

```tsx
// Serendieコンポーネントを使用
<Button
  variant="filled"  // テーマカラー
  size="medium"
>
  アクション
</Button>

<Button
  variant="outlined"  // 副次的なアクション
  size="medium"
>
  キャンセル
</Button>
```

**ホバー効果:**
- カード: `hover:shadow-md` （シャドウ変化のみ）
- ボタン: Serendieのデフォルト効果を使用
- ❌ `scale`, `translate` などの変形は避ける

#### 6. アイコン（Icons）

```tsx
import { SerendieSymbolCheck, SerendieSymbolPlus } from '@serendie/symbols';

// 標準サイズ
<SerendieSymbolCheck className="w-5 h-5" />  // 20px
<SerendieSymbolPlus className="w-6 h-6" />   // 24px (ボタン内)

// カラー
<SerendieSymbolCheck 
  className="w-5 h-5"
  style={{ color: THEME_COLOR }}  // テーマカラー
/>
```

**サイズガイドライン:**
- ボタン内: `w-5 h-5` ~ `w-6 h-6`
- アイコンボタン: `w-6 h-6`
- 装飾的アイコン: `w-8 h-8` ~ `w-10 h-10`
- ❌ `w-12 h-12` 以上は避ける（大きすぎる）

#### 7. 完全な実装例（Full Example）

```tsx
import { Button } from '@serendie/ui';
import { SerendieSymbolPlus } from '@serendie/symbols';

const THEME_COLOR = '#003f8e'; // konjo

export function TodoApp() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header 
        className="sticky top-0 z-50 shadow-sm" 
        style={{ backgroundColor: THEME_COLOR }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-lg font-semibold text-white">Todo管理</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* フォームカード */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            新しいタスク
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
              placeholder="タスクを入力..."
            />
            <Button
              variant="filled"
              size="medium"
              leftIcon={<SerendieSymbolPlus className="w-5 h-5" />}
            >
              追加
            </Button>
          </div>
        </div>

        {/* リストカード */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            タスクリスト
          </h2>
          <div className="space-y-3">
            {/* タスクアイテム */}
          </div>
        </div>
      </main>
    </div>
  );
}
```

#### 8. 具体的コンポーネントパターン

**重要: コンポーネント選択の自由度**

以下のコンポーネントパターンは、**アプリケーションの要件に応じて選択的に使用**してください。
- 全てのアプリが全コンポーネントを必要とするわけではない
- **使用するコンポーネントについては、必ずこのパターンに従うこと**
- 内容・データ・構成はアプリごとにアレンジ可能
- スタイル（角丸、シャドウ、色、間隔等）は統一すること

例: タスク管理アプリ → Todo + Table + Dashboard が必要
例: チャットボット → Chat のみが必要
例: 分析ツール → Dashboard + Report + Charts が必要

##### 8.1 テーブル（Table）

```tsx
import { Button, TextField } from '@serendie/ui';

// 標準テーブルページ
<div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
  {/* ヘッダーセクション */}
  <div className="p-6 border-b border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-700">全タスク一覧</h2>
      <div className="flex gap-2">
        <Button styleType="outlined" size="small">エクスポート</Button>
        <Button styleType="filled" size="small">新規作成</Button>
      </div>
    </div>
    <div className="max-w-md">
      <TextField
        placeholder="タスク名、担当者、IDで検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
      />
    </div>
  </div>

  {/* テーブル */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
            タスク名
          </th>
          {/* 他のヘッダー */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 text-sm font-medium text-gray-900">T-001</td>
          <td className="px-6 py-4 text-sm text-gray-900">タスク名</td>
          {/* ステータスバッジ */}
          <td className="px-6 py-4">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: statusColor }}
            >
              進行中
            </span>
          </td>
          {/* プログレスバー */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: THEME_COLOR,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 w-10 text-right">{progress}%</span>
            </div>
          </td>
          {/* 操作 */}
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">編集</button>
              <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">削除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* フッター（ページネーション） */}
  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{count}件のタスクを表示中</span>
      <div className="flex gap-2">
        <Button styleType="outlined" size="small" disabled>前へ</Button>
        <Button styleType="outlined" size="small" disabled>次へ</Button>
      </div>
    </div>
  </div>
</div>
```

**必須仕様:**
- コンテナ: `bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden`
- ヘッダーセクション: `p-6 border-b border-gray-200`、検索とアクションボタン配置
- テーブルヘッダー: `bg-gray-50 border-b border-gray-200`
- ヘッダーセル: `px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide`
- ボディ: `divide-y divide-gray-200`
- ボディセル: `px-6 py-4 text-sm`
- ID/重要項目: `font-medium text-gray-900`
- 通常項目: `text-gray-900` または `text-gray-700`
- ホバー: `hover:bg-gray-50 transition-colors`
- ステータスバッジ: `rounded-full text-xs font-medium text-white px-2.5 py-0.5`
- プログレスバー: `bg-gray-200 rounded-full h-2`
- フッター: `px-6 py-4 border-t border-gray-200 bg-gray-50`

##### 8.2 グラフ・チャート（Charts）

###### 8.2.1 水平バーチャート（Horizontal Bar Chart）

```tsx
// カテゴリ別データ表示用
interface BarChartData {
  label: string;
  value: number;
  color: string;
}

function SimpleBarChart({ data }: { data: BarChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 text-right">{item.label}</div>
          <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
            <div
              className="h-full rounded-full flex items-center px-3 text-xs font-semibold text-white transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            >
              {item.value > 0 && item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 使用例
<div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-base font-semibold text-gray-700">カテゴリ別タスク数</h2>
    <Button styleType="outlined" size="small">詳細</Button>
  </div>
  <SimpleBarChart data={categoryData} />
</div>
```

###### 8.2.2 折れ線グラフ（Line Chart - SVG）

```tsx
// 推移データ表示用
interface LineChartData {
  label: string;
  value: number;
}

function SimpleLineChart({ data, color }: { data: LineChartData[]; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 400;
  const height = 120;

  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * (width - 20) + 10;
    const y = height - 20 - (item.value / maxValue) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative" style={{ height: '180px' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* グリッド線 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = height - 20 - ratio * 80;
          return (
            <line
              key={idx}
              x1="10" y1={y} x2={width - 10} y2={y}
              stroke="#e5e7eb" strokeWidth="1"
            />
          );
        })}
        {/* ライン */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
        {/* ドット */}
        {data.map((item, idx) => {
          const x = (idx / (data.length - 1)) * (width - 20) + 10;
          const y = height - 20 - (item.value / maxValue) * 80;
          return <circle key={idx} cx={x} cy={y} r="4" fill={color} />;
        })}
      </svg>
      {/* ラベル */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around px-3">
        {data.map((item, idx) => (
          <div key={idx} className="text-xs text-gray-500 text-center">{item.label}</div>
        ))}
      </div>
    </div>
  );
}

// 使用例
<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
  <h3 className="text-base font-semibold text-gray-700 mb-6">完了タスク数推移</h3>
  <SimpleLineChart data={completionData} color={THEME_COLOR} />
</div>
```

###### 8.2.3 垂直バーチャート（週間進捗等）

```tsx
// 週間進捗表示
<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
  <h2 className="text-base font-semibold text-gray-700 mb-6">週間進捗</h2>
  <div className="grid grid-cols-7 gap-2">
    {['月', '火', '水', '木', '金', '土', '日'].map((day, idx) => {
      const values = [12, 15, 10, 18, 14, 8, 5];
      const height = (values[idx] / 20) * 100;
      return (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div className="w-full bg-gray-100 rounded-lg h-32 relative overflow-hidden flex items-end">
            <div
              className="w-full rounded-lg transition-all duration-500"
              style={{
                height: `${height}%`,
                backgroundColor: idx < 5 ? THEME_COLOR : '#e5e7eb',
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 font-medium">{day}</div>
          <div className="text-xs text-gray-500">{values[idx]}</div>
        </div>
      );
    })}
  </div>
</div>
```

**必須仕様:**
- グラフカード: `bg-white rounded-xl shadow-md p-5 border border-gray-100` または `rounded-2xl p-6`
- バー背景: `bg-gray-100 rounded-full`（水平）、`bg-gray-100 rounded-lg`（垂直）
- バー色: テーマカラー（ソリッド）、完了時は `#33a1c9` 等
- ラベル: `text-sm text-gray-600`（ラベル）、`text-xs text-gray-500`（サブラベル）
- グリッド線: `stroke="#e5e7eb"`
- アニメーション: `transition-all duration-500`
- ❌ 禁止: グラデーション、複雑なアニメーション、3Dエフェクト

##### 8.3 ダッシュボード統計カード（StatCard）

```tsx
import { SerendieSymbolCheck, SerendieSymbolPlus } from '@serendie/symbols';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  color: string;
}

function StatCard({ label, value, change, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1 text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        {/* アイコン: テーマカラー20%透明度の背景 */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div className="w-6 h-6 flex items-center justify-center" style={{ color }}>
            {label.includes('完了') ? (
              <SerendieSymbolCheck className="w-full h-full" />
            ) : (
              <SerendieSymbolPlus className="w-full h-full" />
            )}
          </div>
        </div>
      </div>
      {change && (
        <p className="text-xs mt-2 text-gray-600">{change}</p>
      )}
    </div>
  );
}

// 使用例
const statsData = [
  { label: '総タスク数', value: 142, change: '先月比 +12%', color: THEME_COLOR },
  { label: '完了タスク', value: 98, change: '達成率 69%', color: '#33a1c9' },
  { label: '進行中', value: 32, change: '23%', color: '#7058a3' },
  { label: '未着手', value: 12, change: '8%', color: '#e95295' },
];

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {statsData.map((stat, idx) => (
    <StatCard key={idx} {...stat} />
  ))}
</div>
```

**必須仕様:**
- カード: `bg-white rounded-xl shadow-sm p-5 border border-gray-100`
- アイコンコンテナ: `w-12 h-12 rounded-2xl`
- アイコン背景: テーマカラー20%透明度 `${color}20`
- アイコンサイズ: `w-6 h-6`
- 数値: `text-2xl font-semibold text-gray-900`
- ラベル: `text-sm font-medium text-gray-600`
- 変化テキスト: `text-xs text-gray-600`
- グリッド: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`

##### 8.4 入力フォーム（Form Components）

```tsx
import { TextField, Button } from '@serendie/ui';

// 標準フォームレイアウト
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
  <h2 className="text-base font-semibold text-gray-700 mb-4">入力フォーム</h2>

  <div className="space-y-4">
    {/* TextField使用（Serendieコンポーネント） */}
    <TextField
      label="項目名"
      placeholder="入力してください..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fullWidth
    />

    {/* ボタングループ */}
    <div className="flex gap-3 justify-end">
      <Button styleType="outlined" size="medium">
        キャンセル
      </Button>
      <Button styleType="filled" size="medium">
        送信
      </Button>
    </div>
  </div>
</div>
```

**必須仕様:**
- ✅ `<TextField>` コンポーネント使用（Serendie UI）
- ❌ 素の `<input>` は避ける（デザイン統一のため）
- スペーシング: `space-y-4`
- ボタン配置: `justify-end`（右寄せ）

##### 8.5 チャット画面（Chat Interface）

```tsx
import { useState, useRef, useEffect } from 'react';
import { Button, TextField } from '@serendie/ui';
import {
  SerendieSymbolSend,
  SerendieSymbolUser,
  SerendieSymbolStar,
  SerendieSymbolStarFilled,
  SerendieSymbolChatCircleFilled,
  SerendieSymbolPlus,
  SerendieSymbolMenu
} from '@serendie/symbols';

// チャット画面構造
<div className="h-screen flex flex-col bg-gray-50">
  <Header
    title="チャット"
    rightContent={
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
        aria-label="メニューを開く"
      >
        <SerendieSymbolMenu className="w-5 h-5" />
      </button>
    }
  />

  <div className="flex-1 flex relative overflow-hidden">
    {/* モバイル用オーバーレイ */}
    {isSidebarOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* サイドバー: 履歴 */}
    <aside
      className={`
        w-64 border-r border-gray-200 bg-white flex-col
        fixed top-[57px] bottom-0 left-0 z-40
        transform transition-transform duration-300
        ${isSidebarOpen ? 'flex translate-x-0' : 'hidden md:flex -translate-x-full md:translate-x-0'}
      `}
    >
      <div className="p-4 border-b border-gray-200">
        <Button
          styleType="filled"
          size="small"
          leftIcon={<SerendieSymbolPlus className="w-4 h-4" />}
          className="w-full"
        >
          新しいチャット
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatHistories.map((history) => (
          <button
            key={history.id}
            onClick={() => setIsSidebarOpen(false)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              currentChatId === history.id ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-start gap-2">
              <SerendieSymbolChatCircleFilled
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: THEME_COLOR }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{history.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {history.lastMessage.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>

    {/* メインチャットエリア */}
    <main className="flex-1 w-full flex flex-col overflow-hidden md:ml-64">
      <div className="flex-1 max-w-4xl w-full mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col overflow-hidden">

        {/* クイックアクション */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 mb-3 sm:mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 sm:mb-3">クイックアクション</p>
          <div className="flex flex-wrap gap-2">
            {['タスクを追加', 'レポートを見る', 'ヘルプ', '使い方'].map((action) => (
              <button
                key={action}
                onClick={() => setInputValue(action)}
                className="px-3 py-1.5 text-xs font-medium rounded-full border text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* メッセージ表示エリア */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 mb-3 sm:mb-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* アバター */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: message.sender === 'user' ? THEME_COLOR : '#f3f4f6' }}
                >
                  {message.sender === 'user' ? (
                    <SerendieSymbolUser className="w-4 h-4 text-white" />
                  ) : (
                    <SerendieSymbolChatCircleFilled
                      className="w-4 h-4"
                      style={{ color: THEME_COLOR }}
                    />
                  )}
                </div>

                {/* メッセージバブル */}
                <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      message.sender === 'user'
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    style={{ backgroundColor: message.sender === 'user' ? THEME_COLOR : undefined }}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>

                    {/* 評価（ボットメッセージのみ） */}
                    {message.sender === 'bot' && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isHovered = hoveredStar?.messageId === message.id && hoveredStar.star >= star;
                          const isRated = (message.rating ?? 0) >= star;
                          const shouldFill = isHovered || isRated;

                          return (
                            <button
                              key={star}
                              onClick={() => handleRating(message.id, star)}
                              onMouseEnter={() => setHoveredStar({ messageId: message.id, star })}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="transition-transform hover:scale-110"
                            >
                              {shouldFill ? (
                                <SerendieSymbolStarFilled
                                  className="w-3.5 h-3.5"
                                  style={{ color: THEME_COLOR }}
                                />
                              ) : (
                                <SerendieSymbolStar className="w-3.5 h-3.5 text-gray-300" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 入力エリア */}
        <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
          <div className="flex gap-2 sm:gap-3 items-end">
            <div className="flex-1">
              <TextField
                placeholder="メッセージを入力..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
              />
            </div>
            <Button
              styleType="filled"
              size="medium"
              onClick={handleSend}
              disabled={!inputValue.trim()}
              leftIcon={<SerendieSymbolSend className="w-5 h-5" />}
            >
              送信
            </Button>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>
```

**必須仕様:**
- 履歴サイドバー: `w-64 border-r border-gray-200 bg-white`、モバイルでは非表示 + オーバーレイ
- メインエリア: `md:ml-64`（デスクトップでサイドバー分の余白）
- クイックアクション: `bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100`
- メッセージエリア: `bg-gray-50 rounded-xl p-4 border border-gray-100`
- メッセージバブル: `max-w-[85%] sm:max-w-[70%]`（レスポンシブ幅制限）
- ユーザーメッセージ: テーマカラー背景、`text-white`、`rounded-2xl px-4 py-2.5`
- ボットメッセージ: `bg-gray-100 text-gray-900`、`rounded-2xl px-4 py-2.5`
- ボットアバター: `SerendieSymbolChatCircleFilled`（テーマカラー）
- 評価（★）: テーマカラー、`w-3.5 h-3.5`、`hover:scale-110`、ホバープレビュー対応
- アバター: `w-8 h-8 rounded-full`
- 入力エリア: `border-t border-gray-200 p-3 sm:p-4 bg-gray-50`
- ボタン: `styleType="filled"`（`variant`ではなく`styleType`を使用）
- 新しいチャットボタン: サイドバー上部に配置

##### 8.6 ナビゲーション（Navigation）

```tsx
// ヘッダーナビゲーション
<header 
  className="sticky top-0 z-50 shadow-sm" 
  style={{ backgroundColor: THEME_COLOR }}
>
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <h1 className="text-lg font-semibold text-white">アプリ名</h1>
    
    {/* デスクトップメニュー */}
    <nav className="hidden md:flex gap-6">
      <a 
        href="#"
        className="text-sm text-white/90 hover:text-white transition-colors"
      >
        メニュー1
      </a>
      {/* 他のリンク */}
    </nav>
    
    {/* モバイルハンバーガーボタン */}
    <button
      onClick={() => setIsMenuOpen(true)}
      className="md:hidden text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
      aria-label="メニューを開く"
    >
      <SerendieSymbolMenu className="w-5 h-5" />
    </button>
  </div>
</header>

{/* モバイルメニュー */}
{isMenuOpen && (
  <>
    {/* オーバーレイ */}
    <div
      className="md:hidden fixed inset-0 bg-black/50 z-40"
      onClick={() => setIsMenuOpen(false)}
    />
    
    {/* サイドメニュー */}
    <aside className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-xl">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-700">メニュー</h2>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-gray-600 hover:text-gray-800 p-1"
        >
          <SerendieSymbolX className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        <a 
          href="#"
          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          メニュー1
        </a>
        {/* 他のリンク */}
      </nav>
    </aside>
  </>
)}
```

**必須仕様:**
- ヘッダー: `sticky top-0 z-50 shadow-sm`、テーマカラー背景
- デスクトップメニュー: `hidden md:flex`
- モバイルボタン: `md:hidden`、`SerendieSymbolMenu`使用
- オーバーレイ: `bg-black/50 z-40`
- サイドメニュー: `w-64 bg-white z-50 shadow-xl`、右から出現
- ❌ 禁止: 左側からのサイドバー、複雑なドロップダウン

##### 8.7 アイコン使用規則

```tsx
import { 
  SerendieSymbolCheck,
  SerendieSymbolPlus,
  SerendieSymbolMenu,
  SerendieSymbolX,
  SerendieSymbolSend,
  SerendieSymbolUser,
  SerendieSymbolStar,
  SerendieSymbolStarFilled,
  // ... 他のSerendieアイコン
} from '@serendie/symbols';

// ✅ 必須: Serendieアイコンを使用
<SerendieSymbolCheck className="w-5 h-5" />

// ❌ 禁止: 他のアイコンライブラリ（react-icons、heroiconsなど）
import { FaCheck } from 'react-icons/fa'; // NG
```

**必須ルール:**
- ✅ `@serendie/symbols` のみ使用
- ❌ `react-icons`, `heroicons`, `lucide-react` などは禁止
- サイズ: `w-5 h-5`（標準）、`w-6 h-6`（大）、`w-4 h-4`（小）
- カラー: テーマカラーまたはグレースケール

**⚠️ 重要: アイコン名の確認**

Serendie Symbolsのアイコン名は `SerendieSymbol<IconName>` 形式（PascalCase）。
**存在しないアイコン名を使用するとランタイムエラーになる。**

```tsx
// ✅ 存在するアイコン例
SerendieSymbolCheck, SerendieSymbolPlus, SerendieSymbolMenu, SerendieSymbolX,
SerendieSymbolSend, SerendieSymbolUser, SerendieSymbolStar, SerendieSymbolStarFilled,
SerendieSymbolChatCircleFilled, SerendieSymbolTrendingUp, SerendieSymbolAlertTriangle,
SerendieSymbolArticle, SerendieSymbolCheckCircle

// ❌ 存在しないアイコン例（エラーになる）
SerendieSymbolTemplate  // ← 存在しない
SerendieSymbolLogo      // ← 存在しない
```

**確認方法:** `node_modules/@serendie/symbols/dist/index.d.ts` で利用可能なアイコンを確認

##### 8.8 ダッシュボードレイアウト（Dashboard Layout）

```tsx
// ダッシュボードページ構造
<div className="min-h-screen flex flex-col bg-gray-50">
  <Header title="ダッシュボード" rightContent={period} />

  <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
    {/* 統計カード行 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>

    {/* 2カラムグリッド（グラフ + アクティビティ） */}
    <div className="grid lg:grid-cols-2 gap-4 mb-8">
      {/* グラフカード */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-700">カテゴリ別タスク数</h2>
          <Button styleType="outlined" size="small">詳細</Button>
        </div>
        <SimpleBarChart data={categoryData} />
      </div>

      {/* アクティビティカード */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <h2 className="text-base font-semibold text-gray-700 mb-6">最近のアクティビティ</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
              <div className="text-xs text-gray-500 w-12 flex-shrink-0 mt-0.5">{activity.time}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium mb-0.5">{activity.user}</p>
                <p className="text-xs text-gray-600">{activity.action}</p>
              </div>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ backgroundColor: activityColor }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 全幅カード */}
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-base font-semibold text-gray-700 mb-6">週間進捗</h2>
      {/* グラフコンテンツ */}
    </div>
  </main>
</div>
```

**必須仕様:**
- ページ背景: `bg-gray-50`
- コンテナ: `max-w-6xl` または `max-w-7xl`
- 統計カード: 4カラムグリッド `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- セクション間隔: `mb-8`
- カード内グリッド: `lg:grid-cols-2 gap-4`
- カードスタイル: `bg-white rounded-xl shadow-md p-5 border border-gray-100`
- 全幅カード: `rounded-2xl shadow-md p-6`

##### 8.9 レポート・分析画面（Report/Analytics）

```tsx
import { Button } from '@serendie/ui';
import { SerendieSymbolTrendingUp, SerendieSymbolCheck, SerendieSymbolAlertTriangle } from '@serendie/symbols';

// レポートページ構造
<div className="min-h-screen flex flex-col bg-gray-50">
  <Header title="週次レポート" />

  <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
    {/* 期間選択 */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">2026年1月第4週</h2>
        <p className="text-sm text-gray-600 mt-1">2026/01/20 - 2026/01/26</p>
      </div>
      <div className="flex gap-2">
        <Button styleType={period === 'week' ? 'filled' : 'outlined'} size="small">週次</Button>
        <Button styleType={period === 'month' ? 'filled' : 'outlined'} size="small">月次</Button>
        <Button styleType={period === 'year' ? 'filled' : 'outlined'} size="small">年次</Button>
      </div>
    </div>

    {/* サマリーカード */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {summaryData.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-2">{item.label}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <p className="text-sm text-gray-500">{item.unit}</p>
          </div>
        </div>
      ))}
    </div>

    {/* グラフ2カラム */}
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-base font-semibold text-gray-700 mb-6">完了タスク数推移</h3>
        <SimpleLineChart data={completionData} color={THEME_COLOR} />
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="text-base font-semibold text-gray-700 mb-6">生産性推移 (%)</h3>
        <SimpleLineChart data={productivityData} color="#33a1c9" />
      </div>
    </div>

    {/* トップパフォーマー */}
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-700">トップパフォーマー</h3>
        <span className="text-xs text-gray-500">完了タスク数</span>
      </div>
      <div className="space-y-4">
        {topPerformers.map((performer, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="w-8 text-sm font-semibold text-gray-600">{idx + 1}位</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{performer.name}</span>
                <span className="text-sm font-semibold text-gray-900">{performer.tasks}件</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(performer.tasks / topPerformers[0].tasks) * 100}%`,
                    backgroundColor: performer.color,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* インサイトカード */}
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-base font-semibold text-gray-700 mb-4">主要なインサイト</h3>
      <div className="space-y-3">
        {/* 成功インサイト */}
        <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
            <SerendieSymbolTrendingUp className="w-5 h-5" style={{ color: '#3b82f6' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">生産性が向上</p>
            <p className="text-xs text-gray-600">説明テキスト</p>
          </div>
        </div>
        {/* 達成インサイト */}
        <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}>
            <SerendieSymbolCheck className="w-5 h-5" style={{ color: '#22c55e' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">目標達成</p>
            <p className="text-xs text-gray-600">説明テキスト</p>
          </div>
        </div>
        {/* 警告インサイト */}
        <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fef3c7' }}>
            <SerendieSymbolAlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">注意点</p>
            <p className="text-xs text-gray-600">説明テキスト</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
```

**必須仕様:**
- 期間選択: `flex justify-between items-center mb-6`
- 見出し: `text-xl font-semibold text-gray-900`、サブ: `text-sm text-gray-600 mt-1`
- サマリーカード: `grid-cols-2 md:grid-cols-4 gap-4`、カード: `rounded-xl shadow-sm p-5`
- グラフカード: `rounded-2xl shadow-md p-6`
- トップパフォーマー: プログレスバー `bg-gray-100 rounded-full h-2`、順位 `text-sm font-semibold text-gray-600`
- インサイトカード: アイコン背景色で種類を区別
  - 成功（青）: `#dbeafe`、アイコン `#3b82f6`
  - 達成（緑）: `#dcfce7`、アイコン `#22c55e`
  - 警告（黄）: `#fef3c7`、アイコン `#f59e0b`

##### 8.10 アクティビティリスト（Activity List）

```tsx
// アクティビティリスト
<div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
  <h2 className="text-base font-semibold text-gray-700 mb-6">最近のアクティビティ</h2>
  <div className="space-y-4">
    {activities.map((activity, idx) => (
      <div key={idx} className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
        {/* 時刻 */}
        <div className="text-xs text-gray-500 w-12 flex-shrink-0 mt-0.5">
          {activity.time}
        </div>
        {/* 内容 */}
        <div className="flex-1">
          <p className="text-sm text-gray-900 font-medium mb-0.5">{activity.user}</p>
          <p className="text-xs text-gray-600">{activity.action}</p>
        </div>
        {/* ステータスドット */}
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          style={{
            backgroundColor:
              activity.type === 'complete' ? '#33a1c9' :
              activity.type === 'start' ? '#7058a3' :
              activity.type === 'comment' ? '#e95295' : '#956F29'
          }}
        ></div>
      </div>
    ))}
  </div>
</div>
```

**必須仕様:**
- コンテナ: `bg-white rounded-xl shadow-md p-5 border border-gray-100`
- タイトル: `text-base font-semibold text-gray-700 mb-6`
- リスト: `space-y-4`
- アイテム: `flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0`
- 時刻: `text-xs text-gray-500 w-12 flex-shrink-0`
- ユーザー名: `text-sm text-gray-900 font-medium`
- アクション: `text-xs text-gray-600`
- ステータスドット: `w-2 h-2 rounded-full`、タイプ別カラー

## 禁止事項

### 基本禁止事項
- `!important` の使用
- インラインスタイル（`style={}`）※テーマカラー適用時を除く
- Serendie トークン外の直接カラー指定（`#fff`, `rgb()` 等）
- 過度なグラデーション、blur効果、アニメーション

### ❌ 禁止スタイル（Serendie Standardからの逸脱）

#### ミニマリストスタイル（過度にシンプル）の禁止
```tsx
// ❌ 禁止: ボーダーが細すぎ、パディングが小さすぎ
<div className="rounded-sm border p-3 shadow-xs">

// ✅ 正: 適切なサイズ
<div className="rounded-xl border border-gray-100 p-6 shadow-sm">
```

#### マキシマリストスタイル（過度に装飾的）の禁止
```tsx
// ❌ 禁止: グラデーション背景
<header className="bg-gradient-to-r from-blue-500 to-purple-600">

// ❌ 禁止: 太いボーダー
<div className="border-4 rounded-3xl shadow-2xl">

// ❌ 禁止: glassmorphism
<div className="bg-white/20 backdrop-blur-lg">

// ✅ 正: ソリッドカラー
<header style={{ backgroundColor: THEME_COLOR }}>

// ✅ 正: 標準ボーダー
<div className="border border-gray-100 rounded-xl shadow-sm">
```

#### フラットデザインスタイル（シャドウなし／極端な装飾）の禁止
```tsx
// ❌ 禁止: シャドウなし（フラットデザイン）
<div className="rounded-2xl border-2">

// ❌ 禁止: 極端な角丸
<div className="rounded-none"> または <div className="rounded-3xl">

// ❌ 禁止: スケール変形
<button className="hover:scale-105">

// ✅ 正: 標準シャドウあり
<div className="rounded-xl border border-gray-100 shadow-sm">

// ✅ 正: 標準的な角丸
<div className="rounded-xl">

// ✅ 正: シャドウ変化
<div className="hover:shadow-md">
```

### デザインレビューチェックリスト

新しいコンポーネントを作成する際は、以下をチェック:

- [ ] ヘッダー背景はテーマカラーのソリッド（グラデーションなし）
- [ ] カード背景は`bg-white`（テーマカラー背景禁止）
- [ ] 角丸は`rounded-xl`(小) ~ `rounded-2xl`(標準)
- [ ] シャドウは`shadow-sm`(小) ~ `shadow-md`(標準)
- [ ] ボーダーは`border border-gray-100`（太いボーダー禁止）
- [ ] フォントサイズは`text-sm` ~ `text-lg`の範囲内
- [ ] ホバー効果はシャドウ変化のみ（scale/translate禁止）
- [ ] グラデーション、blur、過度なアニメーション禁止
