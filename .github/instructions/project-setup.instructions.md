---
applyTo: "vite.config.ts,vite.config.js,src/main.tsx,src/main.ts,src/index.css,src/App.tsx,package.json,tsconfig.json,tsconfig.app.json,tsconfig.node.json,eslint.config.js"
---

# プロジェクトセットアップ（Serendie + Tailwind v4）

## 必須構成

このプロジェクトは **Serendie Design System** と **Tailwind CSS v4** を使用します。

### 重要な注意事項

1. **`tailwind.config.js` は作成しない** - Tailwind v4 では不要
2. **`@tailwindcss/vite` プラグイン** を使用する
3. **`@serendie/ui/styles.css`** を必ずインポートする（`dist/style.css` ではない）

---

## 1. 依存関係（package.json）

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

---

## 2. TypeScript設定

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### tsconfig.app.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

---

## 3. ESLint設定（eslint.config.js）

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

---

## 4. Vite設定（vite.config.ts）

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**❌ 禁止**: `tailwind.config.js` の作成（v4では不要）

---

## 5. エントリーポイント（src/main.tsx）

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@serendie/ui/styles.css'  // ← 必須（最初にインポート）
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**重要**:
- ✅ `@serendie/ui/styles.css` を使用
- ❌ `@serendie/ui/dist/style.css` は使用しない（古いパス）

---

## 6. グローバルCSS（src/index.css）

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

---

## 7. 推奨ディレクトリ構造

```
my-app/
├── src/
│   ├── components/     # UIコンポーネント
│   ├── pages/          # ページコンポーネント
│   ├── hooks/          # カスタムフック
│   ├── types/          # 型定義
│   ├── utils/          # ユーティリティ関数
│   ├── constants/      # 定数（デザイントークン等）
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── .gitignore
```

---

## セットアップチェックリスト

### 依存関係
- [ ] `@serendie/ui` と `@serendie/symbols` をインストール
- [ ] `@tailwindcss/vite` と `tailwindcss` v4 をインストール
- [ ] `@types/react` と `@types/react-dom` をインストール
- [ ] ESLint関連パッケージをインストール
- [ ] テスト関連パッケージをインストール（任意）

### 設定ファイル
- [ ] `package.json` に `"type": "module"` を設定
- [ ] `vite.config.ts` に `tailwindcss()` プラグインを追加
- [ ] `tsconfig.json` を3ファイル構成で作成
- [ ] `eslint.config.js` を作成
- [ ] `tailwind.config.js` は**作成しない**（v4では不要）

### ソースファイル
- [ ] `main.tsx` で `@serendie/ui/styles.css` をインポート
- [ ] `index.css` で `@import "tailwindcss"` と `@layer` を設定

---

## クイックスタート

```bash
# プロジェクト作成
npm create vite@latest my-app -- --template react-ts
cd my-app

# 依存関係インストール
npm install @serendie/ui @serendie/symbols
npm install -D @tailwindcss/vite tailwindcss

# 設定ファイルを上記の内容で更新
# vite.config.ts, main.tsx, index.css を編集

# 開発サーバー起動
npm run dev
```
