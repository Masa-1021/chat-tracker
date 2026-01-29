# 詳細設計書 - AIチャット型情報管理システム（製造現場向け）

## 1. アーキテクチャ概要

### 1.1 システム構成図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              クライアント層                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite 7 + TypeScript)                   │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │   認証    │ │  チャット  │ │ データ管理 │ │   設定    │           │   │
│  │  │  モジュール │ │ モジュール │ │ モジュール │ │ モジュール │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │              @serendie/ui デザインシステム                    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AWS Amplify Gen 1                                    │
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
│   │  User Pool    │   │ │   ┌───────────┐   │ │  │  音声ファイル        │  │
│   │  us-west-2    │   │ │   │ Resolver  │   │ │  │  (自動削除)         │  │
│   │  _eaUOifAaZ   │   │ │   │  - Query  │   │ │  └─────────────────────┘  │
│   │  (既存)       │   │ │   │  - Mutation│   │ │  ┌─────────────────────┐  │
│   └───────────────┘   │ │   │  - Sub    │   │ │  │  画像ファイル        │  │
└───────────────────────┘ │   └───────────┘   │ │  │  (永続保存)         │  │
                          └─────────┬─────────┘ │  └─────────────────────┘  │
                                    │           └───────────────────────────┘
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────────┐
│   Amazon DynamoDB     │ │   AWS Lambda      │ │    Amazon Bedrock         │
│   ┌───────────────┐   │ │   ┌───────────┐   │ │    ┌─────────────────┐    │
│   │  Users        │   │ │   │ ChatHandler│   │ │    │ Claude Sonnet   │    │
│   │  Teams        │   │ │   │ NotifyBatch│   │ │    │ 4.5             │    │
│   │  Themes       │   │ │   │ VoiceProc  │   │ │    └─────────────────┘    │
│   │  ChatSessions │   │ │   └───────────┘   │ └───────────────────────────┘
│   │  SavedData    │   │ └───────────────────┘
│   │  Notifications│   │           │
│   │  EditHistory  │   │           ▼
│   └───────────────┘   │ ┌───────────────────┐ ┌───────────────────────────┐
└───────────────────────┘ │ Amazon Transcribe │ │    Amazon Polly           │
                          │ Streaming         │ │    (音声合成)              │
                          └───────────────────┘ └───────────────────────────┘
                                    │
                                    ▼
                          ┌───────────────────┐
                          │ API Gateway       │
                          │ WebSocket API     │
                          │ (音声ストリーミング) │
                          └───────────────────┘
```

### 1.2 技術スタック

#### フロントエンド
| カテゴリ | 技術 |
|----------|------|
| 言語 | TypeScript 5.x |
| フレームワーク | React 19.x |
| ビルドツール | Vite 7.x |
| UIライブラリ | @serendie/ui, @serendie/symbols |
| 状態管理 | TanStack Query (サーバー状態) + Zustand (クライアント状態) |
| ルーティング | React Router 7.x |
| フォーム | React Hook Form + Zod |
| GraphQLクライアント | AWS Amplify API (AppSync) |

> **UIガイドライン**: `.github/instructions/serendie-ui.instructions.md` に従うこと

#### バックエンド（AWS Amplify Gen 1）
| カテゴリ | 技術 |
|----------|------|
| フレームワーク | AWS Amplify Gen 1 (CLI) |
| API | AWS AppSync (GraphQL) |
| 認証 | Amazon Cognito (既存User Pool: us-west-2_eaUOifAaZ) |
| データベース | Amazon DynamoDB |
| ストレージ | Amazon S3 |
| コンピューティング | AWS Lambda (Node.js 20.x) |
| AI | Amazon Bedrock (Claude Sonnet 4.5) |
| 音声認識 | Amazon Transcribe Streaming |
| 音声合成 | Amazon Polly |
| WebSocket | API Gateway WebSocket API |

#### インフラストラクチャ
| カテゴリ | 技術 |
|----------|------|
| リージョン | us-west-2 |
| ホスティング | AWS Amplify Hosting |
| CI/CD | AWS Amplify Console |
| モニタリング | Amazon CloudWatch |
| エラートラッキング | Sentry |

### 1.3 Amplify Gen 1 プロジェクト構造

```
chat-tracker/
├── amplify/
│   ├── backend/
│   │   ├── api/
│   │   │   └── chattracker/
│   │   │       ├── schema.graphql          # GraphQLスキーマ
│   │   │       ├── resolvers/              # カスタムリゾルバー
│   │   │       │   ├── Mutation.sendMessage.req.vtl
│   │   │       │   ├── Mutation.sendMessage.res.vtl
│   │   │       │   └── ...
│   │   │       └── stacks/
│   │   │           └── CustomResources.json
│   │   ├── auth/
│   │   │   └── chattracker/
│   │   │       └── cli-inputs.json         # 既存Cognito連携設定
│   │   ├── function/
│   │   │   ├── chatHandler/
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── bedrock.ts
│   │   │   │   │   └── prompt.ts
│   │   │   │   └── package.json
│   │   │   ├── notificationBatch/
│   │   │   │   ├── src/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── email.ts
│   │   │   │   └── package.json
│   │   │   ├── transcribeHandler/
│   │   │   │   ├── src/
│   │   │   │   │   └── index.ts
│   │   │   │   └── package.json
│   │   │   └── pollyHandler/
│   │   │       ├── src/
│   │   │       │   └── index.ts
│   │   │       └── package.json
│   │   ├── storage/
│   │   │   └── s3chattracker/
│   │   │       └── cli-inputs.json
│   │   └── backend-config.json
│   ├── cli.json
│   └── team-provider-info.json
├── src/                                     # フロントエンド
│   └── ...
├── package.json
└── vite.config.ts
```

## 2. コンポーネント設計

### 2.1 フロントエンドコンポーネント一覧

| コンポーネント名 | 責務 | 依存関係 |
|---|---|---|
| AuthModule | 認証フロー全体の管理 | Cognito, Router |
| ChatModule | AIチャット機能（ストリーミング対応） | Bedrock, Transcribe, Polly |
| ThemeModule | テーマCRUD操作 | AppSync, DynamoDB |
| TeamModule | チーム管理 | AppSync, DynamoDB |
| DataModule | 保存データの閲覧・編集 | AppSync, S3 |
| NotificationModule | 通知の表示・管理 | AppSync |
| ProfileModule | ユーザー設定管理 | Cognito, DynamoDB |

### 2.2 フロントエンドディレクトリ構造

```
src/
├── app/                      # アプリケーションエントリ
│   ├── App.tsx
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
│   │   │   ├── VoiceInput.tsx
│   │   │   ├── VoiceOutput.tsx
│   │   │   ├── ImageAttachment.tsx
│   │   │   ├── StreamingMessage.tsx   # ストリーミング表示用
│   │   │   └── ThemeSelector.tsx
│   │   ├── hooks/
│   │   │   ├── useChat.ts
│   │   │   ├── useChatStream.ts       # AIストリーミング用
│   │   │   ├── useVoiceInput.ts
│   │   │   ├── useVoiceOutput.ts
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
│   ├── team/
│   │   ├── components/
│   │   │   ├── TeamList.tsx
│   │   │   ├── TeamForm.tsx
│   │   │   ├── MemberList.tsx
│   │   │   └── InviteDialog.tsx
│   │   ├── hooks/
│   │   │   └── useTeam.ts
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
│   ├── notification/
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   └── NotificationBadge.tsx
│   │   ├── hooks/
│   │   │   └── useNotification.ts
│   │   └── types.ts
│   ├── profile/
│   │   ├── components/
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── VoiceSettings.tsx
│   │   │   └── NotificationSettings.tsx
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
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ConfirmDialog.tsx
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   └── useDebounce.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── validation.ts
│   │   └── markdown.ts
│   └── constants/
│       └── config.ts
├── graphql/                  # 自動生成されるGraphQL
│   ├── queries.ts
│   ├── mutations.ts
│   ├── subscriptions.ts
│   └── API.ts
├── aws-exports.js            # Amplify自動生成
└── types/
    └── index.ts
```

### 2.3 各コンポーネントの詳細

#### ChatModule（ストリーミング対応）

- **目的**: AIとのリアルタイムチャット機能を提供（ストリーミングレスポンス対応）
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

// hooks/useVoiceInput.ts
interface UseVoiceInputReturn {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;  // リアルタイム途中結果
  startRecording: () => void;
  stopRecording: () => void;
  audioLevel: number;
}

// hooks/useVoiceOutput.ts
interface UseVoiceOutputReturn {
  isPlaying: boolean;
  play: (text: string) => Promise<void>;
  stop: () => void;
  onComplete: (callback: () => void) => void;
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
  deleteTheme: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

// types.ts
interface Theme {
  id: string;
  name: string;
  fields: ThemeField[];
  notificationEnabled: boolean;
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
  options: string[] | null;  // SELECTタイプの場合
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
  searchData: (keyword: string) => Promise<SavedData[]>;  // DynamoDB Scan
  updateData: (id: string, input: UpdateDataInput) => Promise<SavedData>;
  deleteData: (id: string) => Promise<void>;
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

interface EditHistoryEntry {
  id: string;
  userId: string;
  user: User;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  changes: string;  // JSON string
  timestamp: string;
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

## 3. データモデル設計（GraphQL Schema）

### 3.1 Amplify GraphQL Schema

```graphql
# amplify/backend/api/chattracker/schema.graphql

# ========== User ==========
type User
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  email: String!
  displayName: String!
  voiceInputSilenceTimeout: Int! @default(value: "3")
  language: String! @default(value: "ja")
  displayTheme: String! @default(value: "system")
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!

  # Relations
  teams: [TeamMember] @hasMany(indexName: "byUser", fields: ["id"])
  favoriteThemes: [FavoriteTheme] @hasMany(indexName: "byUser", fields: ["id"])
  notificationSettings: [NotificationSetting] @hasMany(indexName: "byUser", fields: ["id"])
}

# ========== Team ==========
type Team
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  name: String!
  createdBy: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!

  # Relations
  members: [TeamMember] @hasMany(indexName: "byTeam", fields: ["id"])
}

type TeamMember
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  teamId: ID! @index(name: "byTeam", sortKeyFields: ["joinedAt"])
  userId: ID! @index(name: "byUser", sortKeyFields: ["joinedAt"])
  joinedAt: AWSDateTime!

  # Relations
  team: Team @belongsTo(fields: ["teamId"])
  user: User @belongsTo(fields: ["userId"])
}

# ========== Theme ==========
type Theme
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  name: String!
  fields: [ThemeField!]!
  notificationEnabled: Boolean! @default(value: "true")
  createdBy: String! @index(name: "byCreator", sortKeyFields: ["createdAt"])
  usageCount: Int! @default(value: "0")
  isDefault: Boolean! @default(value: "false")
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!

  # Relations
  favorites: [FavoriteTheme] @hasMany(indexName: "byTheme", fields: ["id"])
}

type ThemeField {
  id: ID!
  name: String!
  type: FieldType!
  required: Boolean!
  options: [String!]
  order: Int!
}

enum FieldType {
  TEXT
  TEXTAREA
  DATE
  DATETIME
  NUMBER
  SELECT
}

type FavoriteTheme
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  userId: ID! @index(name: "byUser", sortKeyFields: ["addedAt"])
  themeId: ID! @index(name: "byTheme")
  addedAt: AWSDateTime!

  # Relations
  user: User @belongsTo(fields: ["userId"])
  theme: Theme @belongsTo(fields: ["themeId"])
}

# ========== Chat Session ==========
type ChatSession
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  userId: ID! @index(name: "byUser", sortKeyFields: ["updatedAt"])
  themeId: ID! @index(name: "byTheme", sortKeyFields: ["updatedAt"])
  title: String!
  titleLocked: Boolean! @default(value: "false")
  status: SessionStatus! @default(value: "ACTIVE")
  messageCount: Int! @default(value: "0")
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!

  # Relations
  messages: [ChatMessage] @hasMany(indexName: "bySession", fields: ["id"])
  theme: Theme @belongsTo(fields: ["themeId"])
}

enum SessionStatus {
  ACTIVE
  COMPLETED
  DRAFT
}

type ChatMessage
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  sessionId: ID! @index(name: "bySession", sortKeyFields: ["timestamp"])
  role: MessageRole!
  content: String!
  images: [String!]
  isStreaming: Boolean @default(value: "false")
  timestamp: AWSDateTime!

  # Relations
  session: ChatSession @belongsTo(fields: ["sessionId"])
}

enum MessageRole {
  USER
  ASSISTANT
}

# ストリーミング用の一時データ
type StreamChunk
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  sessionId: ID! @index(name: "bySession", sortKeyFields: ["chunkIndex"])
  messageId: ID!
  chunkIndex: Int!
  content: String!
  isComplete: Boolean! @default(value: "false")
  timestamp: AWSDateTime!
}

# ========== Saved Data ==========
type SavedData
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  themeId: ID! @index(name: "byTheme", sortKeyFields: ["createdAt"])
  sessionId: ID @index(name: "bySession")
  title: String!
  content: AWSJSON!
  markdownContent: String!
  images: [String!]!
  createdBy: String! @index(name: "byCreator", sortKeyFields: ["createdAt"])
  isDeleted: Boolean! @default(value: "false")
  deletedAt: AWSDateTime
  deletedBy: String
  createdAt: AWSDateTime! @index(name: "byCreatedAt", sortKeyFields: ["id"])
  updatedAt: AWSDateTime!

  # Relations
  theme: Theme @belongsTo(fields: ["themeId"])
  editHistory: [EditHistory] @hasMany(indexName: "byData", fields: ["id"])
}

type EditHistory
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  dataId: ID! @index(name: "byData", sortKeyFields: ["timestamp"])
  userId: String!
  action: EditAction!
  changes: AWSJSON!
  snapshot: AWSJSON!
  timestamp: AWSDateTime!
}

enum EditAction {
  CREATE
  UPDATE
  DELETE
}

# ========== Notification ==========
type Notification
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  userId: ID! @index(name: "byUser", sortKeyFields: ["createdAt"])
  type: NotificationType!
  title: String!
  message: String!
  relatedDataId: ID
  relatedTeamId: ID
  isRead: Boolean! @default(value: "false")
  createdAt: AWSDateTime!
  ttl: AWSTimestamp  # 30日後に自動削除
}

enum NotificationType {
  NEW_DATA
  DATA_UPDATED
  TEAM_INVITE
}

type NotificationSetting
  @model
  @auth(rules: [{ allow: private }]) {
  id: ID!
  userId: ID! @index(name: "byUser")
  targetType: NotificationTargetType!
  targetId: ID  # themeId or teamId
  enabled: Boolean!
  updatedAt: AWSDateTime!
}

enum NotificationTargetType {
  THEME
  TEAM
  EMAIL
}

# ========== Queries & Mutations (Custom) ==========

type Query {
  # 検索（DynamoDB Scan）
  searchSavedData(
    keyword: String!
    themeId: ID
    limit: Int
    nextToken: String
  ): SavedDataConnection @function(name: "searchDataHandler-${env}")
}

type SavedDataConnection {
  items: [SavedData!]!
  nextToken: String
  totalCount: Int
}

type Mutation {
  # AIチャット
  sendChatMessage(
    sessionId: ID!
    content: String!
    images: [String!]
  ): ChatMessage @function(name: "chatHandler-${env}")

  # データ保存
  saveDataFromSession(sessionId: ID!): SavedData
    @function(name: "dataProcessor-${env}")

  # 音声合成
  synthesizeSpeech(text: String!): SpeechResult
    @function(name: "pollyHandler-${env}")

  # 通知一括既読
  markAllNotificationsAsRead: Boolean
    @function(name: "notificationHandler-${env}")
}

type SpeechResult {
  audioUrl: String!
  expiresAt: AWSDateTime!
}

type Subscription {
  # AIレスポンスのストリーミング
  onStreamChunk(sessionId: ID!): StreamChunk
    @aws_subscribe(mutations: ["createStreamChunk"])

  # 新規メッセージ
  onNewMessage(sessionId: ID!): ChatMessage
    @aws_subscribe(mutations: ["createChatMessage"])

  # 通知
  onNewNotification(userId: ID!): Notification
    @aws_subscribe(mutations: ["createNotification"])
}
```

### 3.2 DynamoDB テーブル設計サマリー

| テーブル名 | パーティションキー | ソートキー | GSI |
|------------|-------------------|-----------|-----|
| User | id | - | - |
| Team | id | - | - |
| TeamMember | id | - | byTeam, byUser |
| Theme | id | - | byCreator |
| FavoriteTheme | id | - | byUser, byTheme |
| ChatSession | id | - | byUser, byTheme |
| ChatMessage | id | - | bySession |
| StreamChunk | id | - | bySession |
| SavedData | id | - | byTheme, bySession, byCreator, byCreatedAt |
| EditHistory | id | - | byData |
| Notification | id | - | byUser |
| NotificationSetting | id | - | byUser |

### 3.3 S3バケット設計

```
chat-tracker-storage-{env}/
├── public/
│   └── default/                # デフォルトアセット
├── protected/{identityId}/     # ユーザー別保護領域
│   └── images/                 # 画像ファイル（永続保存）
│       └── {dataId}/{filename}
└── private/{identityId}/       # ユーザー別プライベート領域
    └── audio/                  # 音声ファイル（6時間後自動削除）
        └── {timestamp}-{uuid}.webm

# ライフサイクルポリシー
- private/*/audio/*: 6時間後に削除
```

## 4. AIチャット設計

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
// amplify/backend/function/chatHandler/src/prompt.ts

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
    const optionsDesc = f.options ? ` (選択肢: ${f.options.join(', ')})` : '';
    return `- ${f.name} ${requiredLabel}: ${typeDesc}${optionsDesc}`;
  })
  .join('\n')}

## 現在収集済みの情報:
${Object.entries(existingData)
  .map(([key, value]) => `- ${key}: ${value ?? '未入力'}`)
  .join('\n')}

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

${theme.fields.map((f) => `【${f.name}】: {収集した値}`).join('\n')}

「はい」と答えていただければ保存します。修正が必要な場合はお知らせください。
"""

## 重要な制約:
- 収集した情報は正確に記録し、勝手に改変しない
- ユーザーが明示的に訂正した場合のみ情報を更新
- 不明な点は推測せず、必ず確認を取る
`;

const getFieldTypeDescription = (type: FieldType): string => {
  const descriptions: Record<FieldType, string> = {
    TEXT: 'テキスト（短文）',
    TEXTAREA: 'テキスト（長文）',
    DATE: '日付（YYYY-MM-DD）',
    DATETIME: '日時（YYYY-MM-DD HH:mm）',
    NUMBER: '数値',
    SELECT: '選択式',
  };
  return descriptions[type];
};
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
  .map((m) => `${m.role === 'USER' ? 'ユーザー' : 'AI'}: ${m.content.slice(0, 200)}`)
  .join('\n')}

## 出力
見出しのみを1行で出力してください。説明は不要です。
`;
```

### 4.3 Lambda実装（chatHandler）

```typescript
// amplify/backend/function/chatHandler/src/index.ts

import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { buildSystemPrompt } from './prompt';

const bedrockClient = new BedrockRuntimeClient({ region: 'us-west-2' });
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface SendMessageEvent {
  arguments: {
    sessionId: string;
    content: string;
    images?: string[];
  };
  identity: {
    sub: string;
  };
}

export const handler = async (event: SendMessageEvent) => {
  const { sessionId, content, images } = event.arguments;
  const userId = event.identity.sub;

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

          // StreamChunkテーブルに保存（Subscriptionトリガー）
          await dynamoClient.send(
            new PutCommand({
              TableName: process.env.STREAMCHUNK_TABLE,
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
      TableName: process.env.STREAMCHUNK_TABLE,
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

## 5. 音声処理設計

### 5.1 音声入力（Transcribe Streaming）

API Gateway WebSocket API + Lambda で実装。

```
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│   ブラウザ    │───▶│  API Gateway  │───▶│   Lambda     │
│  MediaRecorder│    │  WebSocket    │    │  transcribe  │
└──────────────┘    └───────────────┘    └──────────────┘
       │                    │                    │
       │   $connect         │                    │
       │ ──────────────────▶│───────────────────▶│
       │                    │   接続確立          │
       │                    │                    │
       │   音声データ        │                    │
       │ ──────────────────▶│───────────────────▶│
       │                    │                    │
       │                    │    Transcribe      │
       │                    │    Streaming       │
       │                    │◀───────────────────│
       │   テキスト結果      │                    │
       │◀──────────────────│                    │
       │                    │                    │
       │   $disconnect      │                    │
       │ ──────────────────▶│───────────────────▶│
       │                    │   接続終了          │
```

#### WebSocket API ルート定義

| ルート | Lambda | 説明 |
|--------|--------|------|
| $connect | transcribeConnect | 接続確立、Transcribeセッション開始 |
| $disconnect | transcribeDisconnect | 接続終了、リソースクリーンアップ |
| audio | transcribeAudio | 音声データ受信、Transcribeへ転送 |

#### フロントエンド実装

```typescript
// src/features/chat/hooks/useVoiceInput.ts

interface UseVoiceInputConfig {
  silenceTimeout: number;  // ユーザー設定（1-10秒）
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (error: Error) => void;
}

export const useVoiceInput = (config: UseVoiceInputConfig): UseVoiceInputReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 音量監視の設定
    audioContextRef.current = new AudioContext();
    const analyser = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyser);

    // WebSocket接続
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_API_URL}?token=${await getAuthToken()}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'transcript') {
        if (data.isFinal) {
          setTranscript((prev) => prev + data.text);
          setInterimTranscript('');
          config.onTranscript(data.text, true);
          resetSilenceTimer();
        } else {
          setInterimTranscript(data.text);
          config.onTranscript(data.text, false);
        }
      }
    };

    // MediaRecorder設定
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(event.data);
      }
    };

    mediaRecorderRef.current.start(100);  // 100msごとにデータ送信
    setIsRecording(true);

    // 音量監視ループ
    monitorAudioLevel(analyser);
  }, [config]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    wsRef.current?.close();
    audioContextRef.current?.close();
    setIsRecording(false);
    clearSilenceTimer();
  }, []);

  // 無音検出
  const resetSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      stopRecording();
    }, config.silenceTimeout * 1000);
  }, [config.silenceTimeout, stopRecording]);

  return {
    isRecording,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    audioLevel,
  };
};
```

### 5.2 音声出力（Polly）

```typescript
// amplify/backend/function/pollyHandler/src/index.ts

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const pollyClient = new PollyClient({ region: 'us-west-2' });
const s3Client = new S3Client({ region: 'us-west-2' });

interface SynthesizeSpeechEvent {
  arguments: {
    text: string;
  };
  identity: {
    sub: string;
  };
}

export const handler = async (event: SynthesizeSpeechEvent) => {
  const { text } = event.arguments;
  const userId = event.identity.sub;

  // Pollyで音声合成
  const pollyCommand = new SynthesizeSpeechCommand({
    Engine: 'neural',
    LanguageCode: 'ja-JP',
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: 'Kazuha',  // 日本語ニューラル音声
    TextType: 'text',
  });

  const pollyResponse = await pollyClient.send(pollyCommand);

  // S3に一時保存
  const key = `private/${userId}/audio/${Date.now()}-speech.mp3`;
  const audioBuffer = await streamToBuffer(pollyResponse.AudioStream);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
    })
  );

  // 署名付きURL生成（15分有効）
  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
    }),
    { expiresIn: 900 }
  );

  return {
    audioUrl: signedUrl,
    expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
  };
};
```

#### フロントエンド実装

```typescript
// src/features/chat/hooks/useVoiceOutput.ts

export const useVoiceOutput = (): UseVoiceOutputReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const play = useCallback(async (text: string) => {
    // Polly APIを呼び出し
    const result = await API.graphql(
      graphqlOperation(synthesizeSpeech, { text })
    );
    const { audioUrl } = result.data.synthesizeSpeech;

    // 音声再生
    audioRef.current = new Audio(audioUrl);
    audioRef.current.onended = () => {
      setIsPlaying(false);
      onCompleteRef.current?.();
    };

    setIsPlaying(true);
    await audioRef.current.play();
  }, []);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsPlaying(false);
  }, []);

  const onComplete = useCallback((callback: () => void) => {
    onCompleteRef.current = callback;
  }, []);

  return { isPlaying, play, stop, onComplete };
};
```

## 6. 通知システム設計

### 6.1 通知フロー

```
┌──────────────┐
│  データ保存   │
│  Mutation    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  SavedData   │
│  テーブル更新 │
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌───────────────┐
│  DynamoDB    │───▶│    Lambda     │
│  Streams     │    │ notifyTrigger │
└──────────────┘    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ 通知判定ロジック │
                    │ - テーマ設定確認 │
                    │ - ユーザー設定確認│
                    └───────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│ Notification │    │  EventBridge  │    │   AppSync    │
│  テーブル     │    │  (5分バッチ)   │    │ Subscription │
│  即時保存    │    │  メール集約    │    │  即時配信    │
└──────────────┘    └───────┬───────┘    └──────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Lambda       │
                    │ emailBatch    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Amazon SES   │
                    │  メール送信    │
                    └───────────────┘
```

### 6.2 通知判定ロジック

```typescript
// amplify/backend/function/notifyTrigger/src/index.ts

interface NotificationDecision {
  shouldNotify: boolean;
  recipients: Array<{
    userId: string;
    channels: ('app' | 'email')[];
  }>;
}

export const determineNotificationRecipients = async (
  themeId: string,
  creatorId: string
): Promise<NotificationDecision> => {
  // 1. テーマの通知設定を確認
  const theme = await getTheme(themeId);
  if (!theme.notificationEnabled) {
    return { shouldNotify: false, recipients: [] };
  }

  // 2. 全ユーザーを取得（100ユーザー規模なので全件取得可能）
  const allUsers = await getAllUsers();

  // 3. 各ユーザーの通知設定を確認
  const recipients: NotificationDecision['recipients'] = [];

  for (const user of allUsers) {
    // 作成者は除外
    if (user.id === creatorId) continue;

    // ユーザーのテーマ通知設定を確認
    const themeSetting = await getNotificationSetting(user.id, 'THEME', themeId);

    // テーマ通知がOFFなら、ユーザー設定に関わらず通知しない
    if (themeSetting && !themeSetting.enabled) continue;

    // メール通知設定を確認
    const emailSetting = await getNotificationSetting(user.id, 'EMAIL', null);
    const channels: ('app' | 'email')[] = ['app'];
    if (emailSetting?.enabled) {
      channels.push('email');
    }

    recipients.push({ userId: user.id, channels });
  }

  return {
    shouldNotify: recipients.length > 0,
    recipients,
  };
};
```

## 7. 検索機能設計（DynamoDB Scan）

### 7.1 検索Lambda実装

```typescript
// amplify/backend/function/searchDataHandler/src/index.ts

import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

interface SearchEvent {
  arguments: {
    keyword: string;
    themeId?: string;
    limit?: number;
    nextToken?: string;
  };
}

export const handler = async (event: SearchEvent) => {
  const { keyword, themeId, limit = 20, nextToken } = event.arguments;

  // フィルタ式を構築
  let filterExpression = 'contains(#title, :keyword) OR contains(#content, :keyword)';
  const expressionAttributeNames: Record<string, string> = {
    '#title': 'title',
    '#content': 'markdownContent',
    '#isDeleted': 'isDeleted',
  };
  const expressionAttributeValues: Record<string, unknown> = {
    ':keyword': { S: keyword },
    ':false': { BOOL: false },
  };

  // 削除済みを除外
  filterExpression = `(${filterExpression}) AND #isDeleted = :false`;

  // テーマフィルタ
  if (themeId) {
    filterExpression += ' AND #themeId = :themeId';
    expressionAttributeNames['#themeId'] = 'themeId';
    expressionAttributeValues[':themeId'] = { S: themeId };
  }

  const command = new ScanCommand({
    TableName: process.env.SAVEDDATA_TABLE,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
    ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined,
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

### 7.2 検索の制限事項

- **パフォーマンス**: 100ユーザー規模、数千件のデータであれば実用的
- **コスト**: 全件スキャンのため、データ量増加に伴いコスト増加
- **将来拡張**: データ量が増えた場合はOpenSearch導入を検討

## 8. デフォルトテーマ・サンプルデータ

### 8.1 初期データ投入

デプロイ時にLambdaで初期データを投入。

```typescript
// amplify/backend/function/seedData/src/index.ts

export const handler = async () => {
  // デフォルトテーマの存在確認
  const existingDefault = await findDefaultTheme();
  if (existingDefault) {
    console.log('Default theme already exists, skipping seed');
    return;
  }

  // デフォルトテーマ作成
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
    notificationEnabled: true,
    createdBy: 'SYSTEM',
    isDefault: true,
  });

  // サンプルデータ作成
  await createSampleData(defaultTheme.id);

  console.log('Seed data created successfully');
};

const createSampleData = async (themeId: string) => {
  const samples = [
    {
      title: '2026/01/15 ライン3 搬送ベルト停止',
      content: {
        発生日時: '2026-01-15 09:30',
        トラブル内容: 'ライン3の搬送ベルトが突然停止。センサーエラーが発生。',
        原因: '近接センサーの汚れによる誤検知',
        暫定対策: 'センサー清掃後、手動でライン再起動',
        恒久対策: '週次のセンサー清掃をメンテナンススケジュールに追加',
      },
    },
    {
      title: '2026/01/20 組立ロボット異常動作',
      content: {
        発生日時: '2026-01-20 14:15',
        トラブル内容: '組立ロボットのアーム動作が不安定。位置決め精度が低下。',
        原因: 'サーボモーターのエンコーダー劣化',
        暫定対策: '動作速度を50%に制限して運用',
        恒久対策: 'エンコーダー交換を発注済み。2月初旬に交換予定。',
      },
    },
  ];

  for (const sample of samples) {
    await createSavedData({
      themeId,
      title: sample.title,
      content: sample.content,
      markdownContent: formatAsMarkdown(sample.content),
      images: [],
      createdBy: 'SYSTEM',
    });
  }
};
```

### 8.2 CloudFormation カスタムリソース

```yaml
# amplify/backend/api/chattracker/stacks/CustomResources.json
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "SeedDataTrigger": {
      "Type": "Custom::SeedData",
      "Properties": {
        "ServiceToken": { "Fn::GetAtt": ["SeedDataFunction", "Arn"] }
      }
    }
  }
}
```

## 9. エラーハンドリング

### 9.1 エラー分類

| エラーカテゴリ | コード | 対処方法 |
|---|---|---|
| 認証エラー | AUTH_* | ログイン画面へリダイレクト |
| バリデーションエラー | VAL_* | フォームにエラー表示 |
| AI処理エラー | AI_* | リトライまたはフォールバックメッセージ |
| 音声処理エラー | VOICE_* | テキストモードへ切り替え提案 |
| ネットワークエラー | NET_* | リトライUIを表示 |
| システムエラー | SYS_* | エラーページ表示 + Sentry通知 |

### 9.2 AppSyncエラーレスポンス

```typescript
// Lambda内でのエラー返却
throw new Error(
  JSON.stringify({
    errorType: 'AI_TIMEOUT',
    message: 'AIの応答がタイムアウトしました。再度お試しください。',
    retryable: true,
  })
);
```

### 9.3 フロントエンドエラーハンドリング

```typescript
// src/shared/utils/errorHandler.ts

export const handleAppSyncError = (error: unknown) => {
  const appError = parseAppSyncError(error);

  switch (appError.code.split('_')[0]) {
    case 'AUTH':
      redirectToLogin();
      break;
    case 'VOICE':
      showVoiceFallbackDialog();
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

### 10.1 認証（既存Cognito連携）

```typescript
// amplify/backend/auth/chattracker/cli-inputs.json
{
  "cognitoConfig": {
    "userPoolId": "us-west-2_eaUOifAaZ",
    "userPoolClientId": "...",  // 既存クライアントIDを設定
    "identityPoolId": "..."      // 必要に応じて設定
  }
}
```

### 10.2 AppSync認証設定

```graphql
# schema.graphql
# 全モデルに @auth(rules: [{ allow: private }]) を適用
# = Cognito認証済みユーザーのみアクセス可能
```

### 10.3 S3アクセス制御

```json
// amplify/backend/storage/s3chattracker/cli-inputs.json
{
  "storageAccess": {
    "protected": {
      "owner": ["read", "write", "delete"]
    },
    "private": {
      "owner": ["read", "write", "delete"]
    }
  }
}
```

### 10.4 入力バリデーション

```typescript
// Zodスキーマによるバリデーション（フロント・Lambda両方で使用）
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
  notificationEnabled: z.boolean(),
});
```

## 11. パフォーマンス最適化

### 11.1 フロントエンド

| 最適化項目 | 手法 |
|---|---|
| 初期ロード | Code Splitting + React.lazy |
| 状態管理 | TanStack Queryキャッシュ（staleTime: 5分） |
| 画像 | 遅延読み込み + WebP変換 |
| バンドル | Tree Shaking + Dynamic Import |

### 11.2 バックエンド

| 最適化項目 | 手法 |
|---|---|
| DynamoDB | GSI活用、Query優先（Scanは検索のみ） |
| Lambda | レイヤー共有、環境変数キャッシュ |
| AppSync | レスポンスキャッシュ（TTL: 60秒） |
| Bedrock | ストリーミングで体感速度向上 |

## 12. テスト戦略

### 12.1 テスト構成

```
tests/
├── unit/                     # Vitest
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/              # Vitest + MSW
│   └── api/
└── e2e/                      # Playwright
    ├── auth.spec.ts
    ├── chat.spec.ts
    └── data.spec.ts
```

### 12.2 カバレッジ目標

- 単体テスト: 80%以上
- E2Eテスト: クリティカルパス網羅

## 13. デプロイメント

### 13.1 環境構成

| 環境 | ブランチ | 用途 |
|------|----------|------|
| dev | develop | 開発・テスト |
| staging | staging | QA・UAT |
| prod | main | 本番 |

### 13.2 Amplify Console設定

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## 14. 実装上の注意事項

### 14.1 一般的な注意事項

- TypeScript strict mode有効
- `any`型の使用禁止
- classは必要な場合のみ（Error継承など）
- ハードコーディング禁止（環境変数・定数を使用）

### 14.2 Amplify Gen 1 固有の注意事項

- `amplify push`実行後に`aws-exports.js`が更新される
- GraphQLスキーマ変更時は`amplify codegen`を実行
- Lambda関数の依存関係は各function内のpackage.jsonで管理

### 14.3 既存Cognito連携の注意事項

- 既存User Pool（us-west-2_eaUOifAaZ）の設定変更は最小限に
- 新規ユーザー属性が必要な場合はDynamoDB Userテーブルで管理

---

**作成日**: 2026-01-28
**バージョン**: 1.1
**ステータス**: レビュー待ち
**変更履歴**:
- 1.0: 初版作成
- 1.1: Gen 1ベースに変更、ストリーミング対応追加、既存Cognito連携
