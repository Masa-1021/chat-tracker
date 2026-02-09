# 詳細設計書 - AIチャット型情報管理システム（製造現場向け）

## 1. アーキテクチャ概要

### 1.1 システム構成図（Phase 1）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              クライアント層                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite 7 + TypeScript)                   │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │   認証    │ │  チャット  │ │ データ管理 │ │   管理    │           │   │
│  │  │  モジュール │ │ モジュール │ │ モジュール │ │ モジュール │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  │  ┌─────────────────────────┐ ┌───────────────────────────────────┐ │   │
│  │  │ Serendie Design System  │ │  オフラインキャッシュ (IndexedDB)   │ │   │
│  │  │ (@serendie/ui)          │ │  + Service Worker                 │ │   │
│  │  └─────────────────────────┘ └───────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AWS Amplify Gen 2                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Amplify Hosting (CDN + SSL)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐
│   Amazon Cognito      │ │   AWS AppSync     │ │      Amazon S3            │
│   ┌───────────────┐   │ │   (GraphQL API)   │ │  ┌─────────────────────┐  │
│   │  User Pool    │   │ │   ┌───────────┐   │ │  │  画像ファイル        │  │
│   │  us-west-2    │   │ │   │ Resolver  │   │ │  │  (永続保存)         │  │
│   │  _eaUOifAaZ   │   │ │   │  - Query  │   │ │  └─────────────────────┘  │
│   │  (既存)       │   │ │   │  - Mutation│   │ └───────────────────────────┘
│   └───────────────┘   │ │   │  - Sub    │   │
└───────────────────────┘ │   └───────────┘   │
                          └─────────┬─────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐
│   Amazon DynamoDB     │ │   AWS Lambda      │ │    Amazon Bedrock         │
│   ┌───────────────┐   │ │   ┌───────────┐   │ │    ┌─────────────────┐    │
│   │  User         │   │ │   │ chatHandler│   │ │    │ Claude Sonnet   │    │
│   │  Theme        │   │ │   │ seedData   │   │ │    │ 4.5             │    │
│   │  ChatSession  │   │ │   │ searchData │   │ │    └─────────────────┘    │
│   │  ChatMessage  │   │ │   └───────────┘   │ └───────────────────────────┘
│   │  SavedData    │   │ └───────────────────┘
│   │  EditHistory  │   │
│   │  FavoriteTheme│   │
│   │  StreamChunk  │   │
│   └───────────────┘   │
└───────────────────────┘
```

### 1.2 技術スタック

#### フロントエンド
| カテゴリ | 技術 |
|----------|------|
| 言語 | TypeScript 5.x |
| フレームワーク | React 19.x |
| ビルドツール | Vite 7.x |
| UIライブラリ | @serendie/ui, @serendie/design-token, @serendie/serendie-symbols |
| 状態管理 | TanStack Query (サーバー状態) + Zustand (クライアント状態) |
| ルーティング | React Router 7.x |
| フォーム | React Hook Form + Zod |
| GraphQLクライアント | AWS Amplify API (AppSync) |
| オフライン | Service Worker + IndexedDB (idb) |

> **UIガイドライン**: Serendie Design System（serendie.design）に従うこと。コンポーネントは`@serendie/ui`（Ark UI + Panda CSS基盤）、デザイントークンは`@serendie/design-token`、アイコンは`@serendie/serendie-symbols`を使用。テーマ切替は`data-panda-theme`属性（konjo/asagi/sumire/tsutsuji/kurikawa）。

#### バックエンド（AWS Amplify Gen 2）
| カテゴリ | 技術 |
|----------|------|
| フレームワーク | AWS Amplify Gen 2 (TypeScriptファースト) |
| API | AWS AppSync (GraphQL) |
| 認証 | Amazon Cognito (既存User Pool: us-west-2_eaUOifAaZ) |
| データベース | Amazon DynamoDB |
| ストレージ | Amazon S3 |
| コンピューティング | AWS Lambda (Node.js 20.x) |
| AI | Amazon Bedrock (Claude Sonnet 4.5) |

#### インフラストラクチャ
| カテゴリ | 技術 |
|----------|------|
| IaC | AWS CDK (Amplify Gen 2内蔵) |
| リージョン | us-west-2 |
| ホスティング | AWS Amplify Hosting |
| CI/CD | AWS Amplify Console |
| モニタリング | Amazon CloudWatch |
| エラートラッキング | Sentry |

### 1.3 Amplify Gen 2 プロジェクト構造

```
chat-tracker/
├── amplify/
│   ├── auth/
│   │   └── resource.ts              # 既存Cognito User Pool参照
│   ├── data/
│   │   └── resource.ts              # GraphQLスキーマ (TypeScript)
│   ├── storage/
│   │   └── resource.ts              # S3設定
│   ├── functions/
│   │   ├── chat-handler/
│   │   │   ├── handler.ts
│   │   │   ├── prompt.ts
│   │   │   └── resource.ts
│   │   ├── search-data/
│   │   │   ├── handler.ts
│   │   │   └── resource.ts
│   │   └── seed-data/
│   │       ├── handler.ts
│   │       └── resource.ts
│   └── backend.ts                   # バックエンドエントリポイント
├── src/                              # フロントエンド
│   └── ...
├── amplify_outputs.json              # Amplify Gen 2 自動生成
├── package.json
└── vite.config.ts
```

## 2. UI設計

### 2.1 レイアウト構造

プロトタイプ（`.tmp/ui-prototype.html` v3）で承認されたレイアウト構造に従う。

```
┌──────────────────────────────────────────────────────────┐
│ <header>  [icon] Chat Tracker          田中太郎 [logout] │  Top App Bar
├────────────┬─────────────────────────────────────────────┤
│ <aside>    │ <main>                                      │
│  <nav>     │  ページタイトル + アクション                   │
│   チャット  │  コンテンツエリア                              │
│   + 新規   │                                             │
│   ⏱ 履歴  │                                             │
│            │                                             │
│   データ   │                                             │
│   📁 保存  │                                             │
│   🎨 テーマ │                                             │
│  </nav>    │                                             │
│ </aside>   │                                             │
└────────────┴─────────────────────────────────────────────┘
```

#### HTML要素の責務分離

| 要素 | セマンティクス | 含むもの | 含まないもの |
|------|-------------|---------|------------|
| `<header>` (Top App Bar) | アプリのアイデンティティ | アプリ名/ロゴ、ユーザー情報、ログアウト | ナビゲーションリンク |
| `<aside>` (Sidebar) | 補助的なコンテナ | `<nav>`を内包 | ブランド、ユーザー情報 |
| `<nav>` (Navigation) | ページナビゲーション | ナビリンクのみ（グループ化） | ブランド、ユーザー情報、アクション |
| `<main>` (Content) | 主要コンテンツ | ページタイトル、コンテンツ | グローバルナビゲーション |

#### コンポーネントマッピング

```
src/shared/components/Layout/
├── AppLayout.tsx    # <header> + <aside> + <main> の統合レイアウト
├── TopBar.tsx       # <header>: アプリ名、ユーザー情報、ログアウト
├── Sidebar.tsx      # <aside>: <nav>を内包するコンテナ
└── Navigation.tsx   # <nav>: グループ化されたナビリンク
```

### 2.2 ナビゲーション設計

#### サイドバーナビグループ

| グループ | セクションラベル | リンク | アイコン |
|---------|---------------|--------|---------|
| チャット | `チャット` | 新しいチャット | SerendieSymbolPlus |
| | | チャット履歴 | SerendieSymbolHistory |
| データ | `データ` | 保存データ | SerendieSymbolFolder |
| | | テーマ管理 | SerendieSymbolPalette |

#### 管理者パネル（AdminLayout）

| グループ | セクションラベル | リンク | アイコン |
|---------|---------------|--------|---------|
| （なし） | — | アプリに戻る | SerendieSymbolArrowLeft |
| 管理 | `管理` | ユーザー管理 | SerendieSymbolGroup |
| | | テーマ管理 | SerendieSymbolPalette |
| | | システム設定 | SerendieSymbolSettings |

#### チャット画面（ChatLayout）

チャット画面は独自レイアウト：Top App Bar + チャット履歴サイドバー + チャットメイン。
サイドバーの`<nav>`は使用せず、`<aside>`にチャット履歴リストを配置。

### 2.3 アクセシビリティ（WCAG 2.2準拠）

| 要件 | 実装方針 |
|------|---------|
| Skip-link | `<a href="#main-content">メインコンテンツへ</a>` を最初の要素に配置 |
| フォーカスリング | `focus-visible` で4px primary色リング（`box-shadow: 0 0 0 2px surface, 0 0 0 4px primary`） |
| ARIA属性 | `aria-current="page"`, `aria-label`, `aria-live="polite"`, `aria-modal`, `role="log"` 等 |
| セマンティックHTML | `<header>`, `<nav>`, `<aside>`, `<main>`, `<form>`, `<table>`, `<dialog>` |
| キーボード操作 | 全インタラクティブ要素にfocus可能、Escでモーダル閉じ |
| コントラスト比 | Serendie Design Tokenの色はAPCA準拠（Lc75+） |
| フォームラベル | `<label>` のfor/id紐付け必須 |

### 2.4 アイコン方針

- **モノクロSVGのみ使用**（カラーアイコン・絵文字は禁止）
- `@serendie/serendie-symbols` から個別インポート（Tree Shaking有効化）
- アイコンコンポーネント名: `SerendieSymbol` プレフィックス（例: `SerendieSymbolHome`, `SerendieSymbolClose`）
- Filled / Outlined バリアント: デフォルトはOutlined、選択状態でFilledを使い分け
- サイズ: 20px（ナビ）、16px（ボタン内）、24px（ヘッダー）

### 2.5 デザイントークン使用規則

- ハードコード値の禁止 — 必ずSerendie Design Tokenを参照
- CSS変数パターン: `--sd-system-color-*`, `--sd-system-dimension-*`
- Primary: `--sd-system-color-impression-primary` (#0353AA, Konjoテーマ)
- スペーシングスケール: 4/8/12/16/20/24/32/40/48/64/80px
- タイポグラフィ: display/headline/title/body/label（compact/expanded対応）
- テーマ切替: `data-panda-theme` 属性で5テーマ対応

## 3. コンポーネント設計

### 3.1 フロントエンドコンポーネント一覧（Phase 1）
> **注記**: レイアウト関連コンポーネント（AppLayout, TopBar, Sidebar, Navigation）は「2. UI設計」セクションを参照。

| コンポーネント名 | 責務 | 依存関係 |
|---|---|---|
| AuthModule | 認証フロー全体の管理 | Cognito, Router |
| ChatModule | AIチャット機能（テキスト + ストリーミング） | Bedrock, AppSync |
| ThemeModule | テーマCRUD操作 | AppSync, DynamoDB |
| DataModule | 保存データの閲覧・編集 | AppSync, S3 |
| ProfileModule | ユーザー設定管理 | DynamoDB |
| AdminModule | 管理者機能（ユーザー・テーマ管理） | AppSync, Cognito |
| OfflineModule | オフラインキャッシュ・同期 | IndexedDB, Service Worker |

### 2.2 フロントエンドディレクトリ構造

```
src/
├── app/                      # アプリケーションエントリ
│   ├── App.tsx
│   ├── Root.tsx
│   ├── routes.tsx
│   └── providers.tsx
├── features/                 # 機能モジュール（Feature-Sliced Design）
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── types.ts
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── ImageAttachment.tsx
│   │   │   ├── StreamingMessage.tsx
│   │   │   └── ThemeSelector.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   ├── useChatStream.ts
│   │   │   └── useImageUpload.ts
│   │   ├── stores/
│   │   │   └── chatStore.ts
│   │   └── types.ts
│   ├── theme/
│   │   ├── components/
│   │   │   ├── ThemeList.tsx
│   │   │   ├── ThemeForm.tsx
│   │   │   ├── ThemeFieldEditor.tsx
│   │   │   └── ThemeCard.tsx
│   │   ├── hooks/
│   │   │   └── useTheme.ts
│   │   └── types.ts
│   ├── data/
│   │   ├── components/
│   │   │   ├── DataList.tsx
│   │   │   ├── DataCard.tsx
│   │   │   ├── DataDetail.tsx
│   │   │   ├── DataForm.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── EditHistoryTimeline.tsx
│   │   │   └── SearchFilter.tsx
│   │   ├── hooks/
│   │   │   └── useData.ts
│   │   └── types.ts
│   ├── admin/
│   │   ├── components/
│   │   │   ├── UserList.tsx
│   │   │   ├── UserRoleEditor.tsx
│   │   │   └── ThemeManager.tsx
│   │   ├── hooks/
│   │   │   └── useAdmin.ts
│   │   └── types.ts
│   ├── profile/
│   │   ├── components/
│   │   │   └── ProfileSettings.tsx
│   │   ├── hooks/
│   │   │   └── useProfile.ts
│   │   └── types.ts
│   └── history/
│       ├── components/
│       │   ├── HistoryList.tsx
│       │   └── HistoryItem.tsx
│       ├── hooks/
│       │   └── useHistory.ts
│       └── types.ts
├── shared/                   # 共有コンポーネント・ユーティリティ
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx       # <header> + <aside> + <main> 統合
│   │   │   ├── TopBar.tsx          # <header>: ブランド + ユーザー情報
│   │   │   ├── Sidebar.tsx         # <aside>: <nav>コンテナ
│   │   │   └── Navigation.tsx      # <nav>: グループ化されたリンク
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── OfflineIndicator.tsx
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   └── useOnlineStatus.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── markdown.ts
│   ├── offline/
│   │   ├── db.ts                    # IndexedDB設定 (idb)
│   │   ├── cacheManager.ts          # キャッシュ読み書き
│   │   ├── syncQueue.ts             # オフライン操作キュー
│   │   └── serviceWorker.ts         # SW登録
│   └── constants/
│       └── config.ts
└── types/
    └── index.ts
```

### 2.3 各コンポーネントの詳細

#### ChatModule（ストリーミング対応）

- **目的**: AIとのテキストチャット機能を提供（ストリーミングレスポンス対応）
- **公開インターフェース**:

```typescript
// hooks/useChat.ts
interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string, images?: File[]) => Promise<void>;
  startNewSession: (themeId: string) => Promise<void>;
  resumeSession: (sessionId: string) => Promise<void>;
  saveData: () => Promise<SavedData>;
}

// hooks/useChatStream.ts
interface UseChatStreamReturn {
  streamingContent: string;
  isStreaming: boolean;
  startStream: (sessionId: string, message: string) => void;
  cancelStream: () => void;
}
```

- **ストリーミング実装方針**:
  - AppSync Subscriptionを使用してAIレスポンスをチャンク単位で受信
  - Lambda関数がBedrockのストリーミングAPIを呼び出し、チャンクごとにDynamoDBを更新
  - DynamoDB Streamsがトリガーとなり、AppSync Subscriptionで配信

#### ThemeModule

- **目的**: テーマ（保存項目の定義）のCRUD操作を提供
- **公開インターフェース**:

```typescript
// hooks/useTheme.ts
interface UseThemeReturn {
  themes: Theme[];
  favoriteThemes: Theme[];
  isLoading: boolean;
  createTheme: (input: CreateThemeInput) => Promise<Theme>;
  updateTheme: (id: string, input: UpdateThemeInput) => Promise<Theme>;
  deleteTheme: (id: string) => Promise<void>;  // Admin only
  toggleFavorite: (id: string) => Promise<void>;
}

// types.ts
interface Theme {
  id: string;
  name: string;
  fields: ThemeField[];
  createdBy: string;
  createdAt: string;
  usageCount: number;
  isDefault: boolean;
}

interface ThemeField {
  id: string;
  name: string;
  type: 'TEXT' | 'TEXTAREA' | 'DATE' | 'DATETIME' | 'NUMBER' | 'SELECT';
  required: boolean;
  options: string[] | null;
  order: number;
}
```

#### DataModule

- **目的**: 保存されたデータの閲覧・編集・削除・検索機能を提供
- **公開インターフェース**:

```typescript
// hooks/useData.ts
interface UseDataReturn {
  data: SavedData[];
  isLoading: boolean;
  totalCount: number;
  fetchData: (filters: DataFilters) => Promise<void>;
  searchData: (keyword: string) => Promise<SavedData[]>;
  updateData: (id: string, input: UpdateDataInput) => Promise<SavedData>;
  deleteData: (id: string) => Promise<void>;  // 作成者 or Admin only
}

// types.ts
interface SavedData {
  id: string;
  themeId: string;
  theme: Theme;
  title: string;
  content: Record<string, string | number>;
  markdownContent: string;
  images: string[];
  createdBy: string;
  createdByUser: User;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface DataFilters {
  themeId?: string;
  createdBy?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'ASC' | 'DESC';
  limit: number;
  nextToken?: string;
}
```

#### AdminModule

- **目的**: 管理者専用機能（ユーザー管理、テーマ管理）
- **公開インターフェース**:

```typescript
// hooks/useAdmin.ts
interface UseAdminReturn {
  users: User[];
  isLoading: boolean;
  updateUserRole: (userId: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  mergeThemes: (sourceId: string, targetId: string) => Promise<void>;
}
```

## 4. データモデル設計（Amplify Gen 2）

### 3.1 スキーマ定義

```typescript
// amplify/data/resource.ts

import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({

  // ========== User ==========
  User: a.model({
    email: a.string().required(),
    displayName: a.string().required(),
    role: a.enum(['ADMIN', 'MEMBER']),
    language: a.string().default('ja'),
    displayTheme: a.string().default('system'),
    favoriteThemes: a.hasMany('FavoriteTheme', 'userId'),
  }).authorization(allow => [allow.authenticated()]),

  // ========== Theme ==========
  Theme: a.model({
    name: a.string().required(),
    fields: a.json().required(),      // ThemeField[]
    createdBy: a.string().required(),
    usageCount: a.integer().default(0),
    isDefault: a.boolean().default(false),
    favorites: a.hasMany('FavoriteTheme', 'themeId'),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('createdBy').sortKeys(['createdAt']),
    ]),

  FavoriteTheme: a.model({
    userId: a.string().required(),
    themeId: a.string().required(),
    user: a.belongsTo('User', 'userId'),
    theme: a.belongsTo('Theme', 'themeId'),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('userId').sortKeys(['createdAt']),
      index('themeId'),
    ]),

  // ========== Chat Session ==========
  ChatSession: a.model({
    userId: a.string().required(),
    themeId: a.string().required(),
    title: a.string().required(),
    titleLocked: a.boolean().default(false),
    status: a.enum(['ACTIVE', 'COMPLETED', 'DRAFT']),
    messageCount: a.integer().default(0),
    messages: a.hasMany('ChatMessage', 'sessionId'),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('userId').sortKeys(['updatedAt']),
      index('themeId').sortKeys(['updatedAt']),
    ]),

  ChatMessage: a.model({
    sessionId: a.string().required(),
    role: a.enum(['USER', 'ASSISTANT']),
    content: a.string().required(),
    images: a.string().array(),
    isStreaming: a.boolean().default(false),
    timestamp: a.datetime().required(),
    session: a.belongsTo('ChatSession', 'sessionId'),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('sessionId').sortKeys(['timestamp']),
    ]),

  // ストリーミング用一時データ
  StreamChunk: a.model({
    sessionId: a.string().required(),
    messageId: a.string().required(),
    chunkIndex: a.integer().required(),
    content: a.string().required(),
    isComplete: a.boolean().default(false),
    timestamp: a.datetime().required(),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('sessionId').sortKeys(['chunkIndex']),
    ]),

  // ========== Saved Data ==========
  SavedData: a.model({
    themeId: a.string().required(),
    sessionId: a.string(),
    title: a.string().required(),
    content: a.json().required(),
    markdownContent: a.string().required(),
    images: a.string().array().required(),
    createdBy: a.string().required(),
    isDeleted: a.boolean().default(false),
    deletedAt: a.datetime(),
    deletedBy: a.string(),
    editHistory: a.hasMany('EditHistory', 'dataId'),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('themeId').sortKeys(['createdAt']),
      index('createdBy').sortKeys(['createdAt']),
      index('sessionId'),
    ]),

  EditHistory: a.model({
    dataId: a.string().required(),
    userId: a.string().required(),
    action: a.enum(['CREATE', 'UPDATE', 'DELETE']),
    changes: a.json().required(),
    snapshot: a.json().required(),
    timestamp: a.datetime().required(),
  }).authorization(allow => [allow.authenticated()])
    .secondaryIndexes(index => [
      index('dataId').sortKeys(['timestamp']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
```

### 3.2 DynamoDB テーブル設計サマリー（Phase 1）

| テーブル名 | パーティションキー | GSI |
|------------|-------------------|-----|
| User | id | - |
| Theme | id | byCreator |
| FavoriteTheme | id | byUser, byTheme |
| ChatSession | id | byUser, byTheme |
| ChatMessage | id | bySession |
| StreamChunk | id | bySession |
| SavedData | id | byTheme, byCreator, bySession |
| EditHistory | id | byData |

### 3.3 S3バケット設計

```
chat-tracker-storage-{env}/
├── public/
│   └── default/                # デフォルトアセット
└── protected/{identityId}/     # ユーザー別保護領域
    └── images/                 # 画像ファイル（永続保存）
        └── {dataId}/{filename}
```

## 5. AIチャット設計

### 4.1 ストリーミングアーキテクチャ

```
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   フロント    │───▶│   AppSync     │───▶│   Lambda     │
│   sendMessage │    │   Mutation    │    │  chatHandler │
└──────────────┘    └───────────────┘    └──────────────┘
       │                                        │
       │                                        ▼
       │                                ┌──────────────┐
       │                                │   Bedrock    │
       │                                │  Streaming   │
       │                                └──────┬───────┘
       │                                       │
       │                          ストリームチャンク
       │                                       │
       │                                       ▼
       │                                ┌──────────────┐
       │                                │  DynamoDB    │
       │                                │ StreamChunk  │
       │                                └──────┬───────┘
       │                                       │
       │            Subscription               │
       │◀──────────────────────────────────────│
       │         onStreamChunk                 │
       ▼                                       │
┌──────────────┐                               │
│  リアルタイム  │                               │
│  表示更新     │                               │
└──────────────┘                               │
                                               │
                          完了時               │
                                               ▼
                                        ┌──────────────┐
                                        │ ChatMessage  │
                                        │   作成       │
                                        └──────────────┘
```

### 4.2 プロンプト設計

#### システムプロンプト

```typescript
// amplify/functions/chat-handler/prompt.ts

export const buildSystemPrompt = (
  theme: Theme,
  existingData: Record<string, unknown>
): string => `
あなたは製造現場の情報収集を支援するAIアシスタントです。
ユーザーとの対話を通じて、必要な情報を収集し、構造化されたデータとして保存する手助けをします。

## 現在のテーマ: ${theme.name}

## 収集する情報項目:
${theme.fields
  .sort((a, b) => a.order - b.order)
  .map((f) => {
    const typeDesc = getFieldTypeDescription(f.type);
    const requiredLabel = f.required ? '【必須】' : '【任意】';
    const optionsDesc = f.options ? \` (選択肢: \${f.options.join(', ')})\` : '';
    return \`- \${f.name} \${requiredLabel}: \${typeDesc}\${optionsDesc}\`;
  })
  .join('\\n')}

## 現在収集済みの情報:
${Object.entries(existingData)
  .map(([key, value]) => \`- \${key}: \${value ?? '未入力'}\`)
  .join('\\n')}

## あなたの役割:
1. ユーザーが提供する情報を自然な対話で収集してください
2. 必須項目が不足している場合は、適切な質問で情報を引き出してください
3. 情報が曖昧な場合は、具体的に確認してください
4. 全ての必須項目が揃ったら、保存前の確認を行ってください

## 応答のガイドライン:
- 簡潔で分かりやすい日本語を使用
- 製造現場の専門用語を理解し適切に対応
- ユーザーの入力を尊重しつつ、必要な情報を漏れなく収集
- 確認時は箇条書きで情報を整理して表示

## 保存確認のフォーマット:
全ての必須情報が揃った場合、以下のフォーマットで確認:
"""
以下の内容で保存してよろしいですか？

${theme.fields.map((f) => \`【\${f.name}】: {収集した値}\`).join('\\n')}

「はい」と答えていただければ保存します。修正が必要な場合はお知らせください。
"""

## 重要な制約:
- 収集した情報は正確に記録し、勝手に改変しない
- ユーザーが明示的に訂正した場合のみ情報を更新
- 不明な点は推測せず、必ず確認を取る
`;
```

#### チャットタイトル自動生成プロンプト

```typescript
export const buildTitleGenerationPrompt = (
  messages: ChatMessage[]
): string => `
以下のチャット内容から、簡潔な見出しを生成してください。

## フォーマット
YYYY/MM/DD [内容の要約（15文字以内）]

## チャット内容:
${messages
  .slice(0, 5)
  .map((m) => \`\${m.role === 'USER' ? 'ユーザー' : 'AI'}: \${m.content.slice(0, 200)}\`)
  .join('\\n')}

## 出力
見出しのみを1行で出力してください。説明は不要です。
`;
```

### 4.3 Lambda実装（chatHandler）

```typescript
// amplify/functions/chat-handler/handler.ts

import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { buildSystemPrompt } from './prompt';
import { env } from '$amplify/env/chat-handler';

const bedrockClient = new BedrockRuntimeClient({ region: 'us-west-2' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event: {
  arguments: { sessionId: string; content: string; images?: string[] };
  identity: { sub: string };
}) => {
  const { sessionId, content, images } = event.arguments;

  // 1. セッションとテーマ情報を取得
  const session = await getSession(sessionId);
  const theme = await getTheme(session.themeId);
  const messages = await getMessages(sessionId);

  // 2. ユーザーメッセージを保存
  const userMessage = await saveUserMessage(sessionId, content, images);

  // 3. 収集済みデータを分析
  const collectedData = analyzeCollectedData(messages, theme);

  // 4. システムプロンプトを構築
  const systemPrompt = buildSystemPrompt(theme, collectedData);

  // 5. Bedrockストリーミング呼び出し
  const messageId = generateId();
  let fullContent = '';
  let chunkIndex = 0;

  const command = new InvokeModelWithResponseStreamCommand({
    modelId: 'anthropic.claude-sonnet-4-5-20250514',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      system: systemPrompt,
      messages: formatMessagesForBedrock(messages, content),
    }),
  });

  const response = await bedrockClient.send(command);

  // 6. ストリーミングレスポンスを処理
  if (response.body) {
    for await (const chunk of response.body) {
      if (chunk.chunk?.bytes) {
        const parsed = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));

        if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          fullContent += parsed.delta.text;

          await dynamoClient.send(
            new PutCommand({
              TableName: env.STREAMCHUNK_TABLE_NAME,
              Item: {
                id: `${messageId}-${chunkIndex}`,
                sessionId,
                messageId,
                chunkIndex,
                content: parsed.delta.text,
                isComplete: false,
                timestamp: new Date().toISOString(),
              },
            })
          );
          chunkIndex++;
        }
      }
    }
  }

  // 7. 完了チャンクを送信
  await dynamoClient.send(
    new PutCommand({
      TableName: env.STREAMCHUNK_TABLE_NAME,
      Item: {
        id: `${messageId}-complete`,
        sessionId,
        messageId,
        chunkIndex,
        content: '',
        isComplete: true,
        timestamp: new Date().toISOString(),
      },
    })
  );

  // 8. 完全なメッセージを保存
  const assistantMessage = await saveAssistantMessage(sessionId, messageId, fullContent);

  // 9. セッションタイトルの自動更新（5メッセージ以内の場合）
  if (!session.titleLocked && session.messageCount < 5) {
    await updateSessionTitle(sessionId, messages.concat([userMessage, assistantMessage]));
  }

  return assistantMessage;
};
```

## 5A. 自動保存（下書き）設計

### 4A.1 概要

チャット中に収集された情報を一時保存し、セッション切断時のデータ損失を防止する。

### 4A.2 実装方針

- ChatSessionの`status: DRAFT`を活用
- チャット中に収集された情報（analyzeCollectedData）をDRAFTステータスのSavedDataとして定期的に保存
- `beforeunload`イベントでセッション切断を検出し、未保存データを保護
- ユーザーがセッションを再開した場合、DRAFTデータを復元して続行可能

### 4A.3 自動保存タイミング

| トリガー | 動作 |
|----------|------|
| AIの応答完了後（毎回） | 収集済みデータをDRAFTとして更新 |
| beforeunload | 現在のチャット状態をDRAFTとして保存 |
| セッション再開時 | DRAFTデータがあれば復元して確認プロンプト表示 |
| 正式保存時 | DRAFTを削除し、本番SavedDataとして保存 |

---

## 6. オフラインフォールバック設計

### 5.1 アーキテクチャ

```
┌──────────────────────────────────────────────────────┐
│                   ブラウザ                              │
│                                                        │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  React App   │───▶│  Cache       │                  │
│  │              │◀───│  Manager     │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                          │
│         ┌───────────────────┼───────────────────┐      │
│         │                   │                   │      │
│         ▼                   ▼                   ▼      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │  IndexedDB   │    │  Sync Queue  │    │  Service  │  │
│  │  (idb)       │    │  (pending    │    │  Worker   │  │
│  │              │    │   actions)   │    │  (SW)     │  │
│  │  - themes    │    └──────┬───────┘    └──────────┘  │
│  │  - sessions  │           │                          │
│  │  - savedData │           │ オンライン復帰時           │
│  │  - messages  │           ▼                          │
│  └──────────────┘    ┌──────────────┐                  │
│                      │  AppSync     │                  │
│                      │  API送信     │                  │
│                      └──────────────┘                  │
└──────────────────────────────────────────────────────┘
```

### 5.2 IndexedDB スキーマ

```typescript
// src/shared/offline/db.ts

import { openDB, type DBSchema } from 'idb';

interface ChatTrackerDB extends DBSchema {
  themes: {
    key: string;
    value: Theme;
    indexes: { 'by-name': string };
  };
  chatSessions: {
    key: string;
    value: ChatSession;
    indexes: { 'by-updatedAt': string };
  };
  chatMessages: {
    key: string;
    value: ChatMessage;
    indexes: { 'by-sessionId': string };
  };
  savedData: {
    key: string;
    value: SavedData;
    indexes: {
      'by-themeId': string;
      'by-updatedAt': string;
    };
  };
  syncQueue: {
    key: number;
    value: {
      id: number;
      action: 'sendMessage' | 'saveData' | 'updateData';
      payload: Record<string, unknown>;
      createdAt: string;
      retryCount: number;
    };
  };
}

export const getDB = () =>
  openDB<ChatTrackerDB>('chat-tracker', 1, {
    upgrade(db) {
      const themeStore = db.createObjectStore('themes', { keyPath: 'id' });
      themeStore.createIndex('by-name', 'name');

      const sessionStore = db.createObjectStore('chatSessions', { keyPath: 'id' });
      sessionStore.createIndex('by-updatedAt', 'updatedAt');

      const messageStore = db.createObjectStore('chatMessages', { keyPath: 'id' });
      messageStore.createIndex('by-sessionId', 'sessionId');

      const dataStore = db.createObjectStore('savedData', { keyPath: 'id' });
      dataStore.createIndex('by-themeId', 'themeId');
      dataStore.createIndex('by-updatedAt', 'updatedAt');

      db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
    },
  });
```

### 5.3 キャッシュ戦略

| データ種別 | キャッシュタイミング | キャッシュ範囲 | 更新方針 |
|---|---|---|---|
| テーマ定義 | アプリ起動時 | 全件（軽量） | stale-while-revalidate |
| チャット履歴 | セッション表示時 | 閲覧済みのみ | 表示時に更新 |
| 保存データ | 詳細表示時 | 閲覧済みのみ | 表示時に更新 |
| 画像 | キャッシュ対象外 | - | - |

### 5.4 同期キュー

```typescript
// src/shared/offline/syncQueue.ts

export const processSyncQueue = async (): Promise<void> => {
  const db = await getDB();
  const queue = await db.getAll('syncQueue');

  for (const item of queue) {
    try {
      switch (item.action) {
        case 'sendMessage':
          await sendMessageToAPI(item.payload);
          break;
        case 'saveData':
          await saveDataToAPI(item.payload);
          break;
        case 'updateData':
          await updateDataToAPI(item.payload);
          break;
      }
      await db.delete('syncQueue', item.id);
    } catch (error) {
      if (item.retryCount >= 3) {
        // 3回失敗したらユーザーに通知
        notifyUser('同期に失敗しました。手動で再送信してください。');
        await db.delete('syncQueue', item.id);
      } else {
        await db.put('syncQueue', { ...item, retryCount: item.retryCount + 1 });
      }
    }
  }
};
```

## 7. 検索機能設計（DynamoDB Scan）

### 6.1 検索Lambda実装

```typescript
// amplify/functions/search-data/handler.ts

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { env } from '$amplify/env/search-data';

const dynamoClient = new DynamoDBClient({});

export const handler = async (event: {
  arguments: {
    keyword: string;
    themeId?: string;
    limit?: number;
    nextToken?: string;
  };
}) => {
  const { keyword, themeId, limit = 20, nextToken } = event.arguments;

  let filterExpression = 'contains(#title, :keyword) OR contains(#content, :keyword)';
  const expressionAttributeNames: Record<string, string> = {
    '#title': 'title',
    '#content': 'markdownContent',
    '#isDeleted': 'isDeleted',
  };
  const expressionAttributeValues: Record<string, { S: string } | { BOOL: boolean }> = {
    ':keyword': { S: keyword },
    ':false': { BOOL: false },
  };

  filterExpression = `(${filterExpression}) AND #isDeleted = :false`;

  if (themeId) {
    filterExpression += ' AND #themeId = :themeId';
    expressionAttributeNames['#themeId'] = 'themeId';
    expressionAttributeValues[':themeId'] = { S: themeId };
  }

  const command = new ScanCommand({
    TableName: env.SAVEDDATA_TABLE_NAME,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
    ExclusiveStartKey: nextToken
      ? JSON.parse(Buffer.from(nextToken, 'base64').toString())
      : undefined,
  });

  const result = await dynamoClient.send(command);
  const items = (result.Items ?? []).map((item) => unmarshall(item));

  return {
    items,
    nextToken: result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : null,
    totalCount: result.ScannedCount,
  };
};
```

### 6.2 検索の制限事項

- **パフォーマンス**: 100ユーザー規模、数千件のデータであれば実用的
- **コスト**: 全件スキャンのため、データ量増加に伴いコスト増加
- **将来拡張**: データ量が増えた場合はOpenSearch導入を検討

## 8. デフォルトテーマ・シードデータ

### 7.1 初期データ投入

デプロイ時にLambdaで初期データを投入（管理者アカウント含む）。

```typescript
// amplify/functions/seed-data/handler.ts

export const handler = async () => {
  // 1. 初回Adminユーザーの作成
  const adminExists = await findAdminUser();
  if (!adminExists) {
    await createUser({
      id: env.INITIAL_ADMIN_USER_ID,  // Cognito User PoolのSub
      email: env.INITIAL_ADMIN_EMAIL,
      displayName: 'システム管理者',
      role: 'ADMIN',
      language: 'ja',
      displayTheme: 'system',
    });
    console.log('Initial admin user created');
  }

  // 2. デフォルトテーマの作成
  const existingDefault = await findDefaultTheme();
  if (existingDefault) {
    console.log('Default theme already exists, skipping seed');
    return;
  }

  const defaultTheme = await createTheme({
    id: 'default-trouble-maintenance',
    name: 'トラブルメンテナンス',
    fields: [
      { id: 'f1', name: '発生日時', type: 'DATETIME', required: true, order: 1 },
      { id: 'f2', name: 'トラブル内容', type: 'TEXTAREA', required: true, order: 2 },
      { id: 'f3', name: '原因', type: 'TEXTAREA', required: true, order: 3 },
      { id: 'f4', name: '暫定対策', type: 'TEXTAREA', required: false, order: 4 },
      { id: 'f5', name: '恒久対策', type: 'TEXTAREA', required: false, order: 5 },
    ],
    createdBy: 'SYSTEM',
    isDefault: true,
  });

  // 3. サンプルチャット履歴 + サンプル保存データ作成
  await createSampleChatSession(defaultTheme.id);  // チュートリアル用チャット履歴
  await createSampleSavedData(defaultTheme.id);     // サンプル保存データ（2-3件）
  console.log('Seed data created successfully');
};
```

## 9. エラーハンドリング

### 8.1 エラー分類（Phase 1）

| エラーカテゴリ | コード | 対処方法 |
|---|---|---|
| 認証エラー | AUTH_* | ログイン画面へリダイレクト |
| 権限エラー | AUTHZ_* | 権限不足メッセージ表示 |
| バリデーションエラー | VAL_* | フォームにエラー表示 |
| AI処理エラー | AI_* | リトライまたはフォールバックメッセージ |
| ネットワークエラー | NET_* | オフラインモードへ切り替え |
| オフラインエラー | OFFLINE_* | オフラインインジケーター表示 |
| システムエラー | SYS_* | エラーページ表示 + Sentry通知 |

### 8.2 フロントエンドエラーハンドリング

```typescript
// src/shared/utils/errorHandler.ts

export const handleAppSyncError = (error: unknown) => {
  const appError = parseAppSyncError(error);

  switch (appError.code.split('_')[0]) {
    case 'AUTH':
      redirectToLogin();
      break;
    case 'AUTHZ':
      showPermissionDeniedToast(appError.message);
      break;
    case 'NET':
    case 'OFFLINE':
      enterOfflineMode();
      break;
    case 'AI':
      if (appError.retryable) {
        showRetryDialog(appError);
      } else {
        showErrorToast(appError.message);
      }
      break;
    default:
      showErrorToast(appError.message);
      Sentry.captureException(error);
  }
};
```

## 10. セキュリティ設計

### 9.1 認証（既存Cognito連携）

```typescript
// amplify/auth/resource.ts

import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-west-2_eaUOifAaZ',
  // 必要に応じてIdentity Pool IDも設定
});
```

### 9.2 RBAC実装

```typescript
// フロントエンド: ロールチェックフック
// src/features/auth/hooks/useAuth.ts

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// バックエンド: Lambda内でのロールチェック
const checkAdminRole = async (userId: string): Promise<boolean> => {
  const user = await getUser(userId);
  return user.role === 'ADMIN';
};

// 削除権限チェック
const canDeleteData = async (userId: string, data: SavedData): Promise<boolean> => {
  if (data.createdBy === userId) return true;
  return checkAdminRole(userId);
};
```

### 9.3 入力バリデーション

```typescript
// Zodスキーマ（フロント・Lambda共用）
export const createThemeSchema = z.object({
  name: z.string().min(1).max(100),
  fields: z
    .array(
      z.object({
        name: z.string().min(1).max(50),
        type: z.enum(['TEXT', 'TEXTAREA', 'DATE', 'DATETIME', 'NUMBER', 'SELECT']),
        required: z.boolean(),
        options: z.array(z.string().max(100)).max(20).optional(),
        order: z.number().int().min(0).max(100),
      })
    )
    .min(1)
    .max(20),
});
```

## 11. パフォーマンス最適化

### 10.1 フロントエンド

| 最適化項目 | 手法 |
|---|---|
| 初期ロード | Code Splitting + React.lazy |
| 状態管理 | TanStack Queryキャッシュ（staleTime: 5分） |
| 画像 | 遅延読み込み + WebP変換 |
| バンドル | Tree Shaking + Dynamic Import |
| オフライン | IndexedDBからの即時表示 → バックグラウンドで最新データ取得 |

### 10.2 バックエンド

| 最適化項目 | 手法 |
|---|---|
| DynamoDB | GSI活用、Query優先（Scanは検索のみ） |
| Lambda | レイヤー共有、環境変数キャッシュ |
| AppSync | レスポンスキャッシュ（TTL: 60秒） |
| Bedrock | ストリーミングで体感速度向上 |

## 12. テスト戦略

### 11.1 テスト構成

```
tests/
├── unit/                     # Vitest
│   ├── components/
│   ├── hooks/
│   ├── offline/              # オフラインロジック
│   └── utils/
├── integration/              # Vitest + MSW
│   └── api/
└── e2e/                      # Playwright
    ├── auth.spec.ts
    ├── chat.spec.ts
    ├── data.spec.ts
    ├── admin.spec.ts
    └── offline.spec.ts
```

### 11.2 カバレッジ目標

- 単体テスト: 80%以上
- E2Eテスト: クリティカルパス網羅（認証、チャット、データ管理、管理者機能、オフライン）

## 13. デプロイメント

### 12.1 環境構成

| 環境 | ブランチ | 用途 |
|------|----------|------|
| dev | develop | 開発・テスト |
| staging | staging | QA・UAT |
| prod | main | 本番 |

### 12.2 Amplify Gen 2 デプロイ

```bash
# ローカル開発（サンドボックス）
npx ampx sandbox

# デプロイ
npx ampx pipeline-setup  # CI/CDパイプライン設定
```

環境変数（Amplify Console で設定）:
- `INITIAL_ADMIN_EMAIL`: 初回管理者メールアドレス
- `INITIAL_ADMIN_USER_ID`: 初回管理者のCognito Sub

## 14. 実装上の注意事項

### 13.1 一般的な注意事項

- TypeScript strict mode有効
- `any`型の使用禁止
- classは必要な場合のみ（Error継承など）
- ハードコーディング禁止（環境変数・定数を使用）

### 13.2 Amplify Gen 2 固有の注意事項

- `amplify_outputs.json`はGen 2が自動生成（`aws-exports.js`の代替）
- スキーマ変更はTypeScriptファイルを直接編集
- Lambda関数はGen 2の`defineFunction`で定義
- `$amplify/env/`から環境変数にアクセス
- サンドボックス環境でリアルタイム開発が可能

### 13.3 既存Cognito連携の注意事項

- 既存User Pool（us-west-2_eaUOifAaZ）の設定変更は最小限に
- ロール情報はDynamoDB Userテーブルで管理（Cognitoグループは使用しない）
- `referenceAuth`でGen 2から既存リソースを参照

---

**作成日**: 2026-01-28
**バージョン**: 2.1
**ステータス**: レビュー中
**変更履歴**:
- 1.0: 初版作成
- 1.1: Gen 1ベースに変更、ストリーミング対応追加、既存Cognito連携
- 2.0: Amplify Gen 2へ移行、Phase 1スコープに限定（音声/チーム/通知を除外）、RBAC追加、オフラインフォールバック追加、シードデータにAdmin作成追加
- 2.1: 自動保存（下書き）設計追加、シードデータにサンプルチャット履歴を明示
