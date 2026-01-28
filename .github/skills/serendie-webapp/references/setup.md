# Serendie セットアップ詳細

## 新規プロジェクト作成

### 1. Vite + React + TypeScript

**新規ディレクトリの場合:**
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

**既存ディレクトリ（カレント）に作成する場合:**
```bash
# 方法1: 別ディレクトリに作成してコピー
npm create vite@latest temp-app -- --template react-ts
cp -r temp-app/* .
rm -rf temp-app

# 方法2: 手動でpackage.jsonを作成（推奨）
# 下記「手動セットアップ」セクションを参照
```

### 手動セットアップ（既存ディレクトリ向け）

**package.json:**
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
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@serendie/ui": "^2.4.2",
    "@serendie/symbols": "^1.0.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "typescript": "~5.6.2",
    "typescript-eslint": "^8.18.2",
    "vite": "^6.0.5"
  }
}
```

**vite.config.ts:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 2. Serendieパッケージインストール

```bash
npm install @serendie/ui @serendie/symbols
```

## Next.js App Router での使用

### Server Component からの使用

Next.js App RouterのServer Componentでは `@serendie/ui/client` からインポート:

```tsx
// app/page.tsx - Server Component
import { Button } from "@serendie/ui/client";

export default function Page() {
  return <Button size="medium">Login</Button>;
}
```

### Client Component での使用

```tsx
// app/client-component.tsx
"use client";
import { Tabs, TabItem, ModalDialog } from "@serendie/ui/client";

export default function ClientComponent() {
  return <Tabs defaultValue="tab1">...</Tabs>;
}
```

## 多言語対応 (v2.3.0+)

### SerendieProvider

アプリケーション全体の言語を設定:

```tsx
import { SerendieProvider } from "@serendie/ui";

function App() {
  return (
    <SerendieProvider lang="ja">
      {/* アプリケーション全体 */}
    </SerendieProvider>
  );
}
```

対応言語: `ja` (日本語、デフォルト), `en` (英語)

### Next.js App Router での多言語対応

```tsx
// app/layout.tsx
import { SerendieProvider } from "@serendie/ui";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "ja" | "en" };
}) {
  return (
    <html lang={params.lang}>
      <body>
        <SerendieProvider lang={params.lang}>
          {children}
        </SerendieProvider>
      </body>
    </html>
  );
}
```

### useTranslations フック

コンポーネント内で翻訳テキストを取得:

```tsx
import { useTranslations } from "@serendie/ui";

function MyComponent() {
  const t = useTranslations();
  return (
    <div>
      <label>{t("common.required")}</label>
      <span>{t("pagination.page", { page: 5 })}</span>
    </div>
  );
}
```

## ファイル設定

### index.html

```html
<!doctype html>
<html lang="ja" data-panda-theme="konjo">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <!-- Google Fonts (推奨) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/index.css

```css
@layer reset, base, tokens, recipes, utilities;
@import "@serendie/ui/styles.css";

@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-family: 'Noto Sans JP', 'Roboto', sans-serif;
  }

  body {
    margin: 0;
    min-height: 100vh;
  }
}

body {
  background-color: var(--sds-color-surface-default);
  color: var(--sds-color-on-surface-default);
}

#root {
  width: 100%;
}
```

### src/main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## テーマ

### 利用可能テーマ

| テーマID | 名前 | 説明 |
|---------|------|------|
| konjo | 紺青 | デフォルト。深い青 |
| asagi | 浅葱 | 爽やかな薄い青 |
| sumire | 菫 | 落ち着いた紫 |
| kurikawa | 栗皮 | 温かみのある茶 |
| tsutsuji | 躑躅 | エネルギッシュなピンク |

### テーマ切り替え（JavaScript）

```tsx
const changeTheme = (theme: string) => {
  document.documentElement.setAttribute('data-panda-theme', theme)
}

// 使用例
changeTheme('asagi')
```

## Serendie CSS変数

主なCSS変数:

```css
/* カラー */
--sds-color-primary-default
--sds-color-primary-container
--sds-color-on-primary-container
--sds-color-surface-default
--sds-color-surface-variant
--sds-color-surface-container
--sds-color-on-surface-default
--sds-color-on-surface-variant
--sds-color-outline-default

/* インタラクション */
--sds-color-interaction-hovered
--sds-color-interaction-disabled
--sds-color-interaction-disabledOnSurface
```

## 開発サーバー

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## UI検証

```bash
pip install playwright
playwright install chromium
python path/to/verify_ui.py --url http://localhost:5173/
```
