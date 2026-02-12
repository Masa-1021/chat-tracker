# Chat Tracker

製造現場向け AI チャット型情報管理システム。

AIとの対話を通じて、トラブル対応・品質異常・改善提案などの業務データを効率的に収集・保存・共有します。従来のフォーム入力と異なり、自然な会話で情報を入力するだけで、AIが内容を整理し適切な項目へ自動で振り分けます。

## 主な機能

- **AIチャットによる情報収集** — テーマ（記録テンプレート）に沿って、AIが不足情報を自動で質問し、構造化データを作成
- **音声対話モード** — 話すだけで記録が完了するハンズフリー対応（音声認識 → AI応答 → 音声読み上げの自動ループ）
- **画像添付** — 現場写真をチャット中に添付（最大5枚）
- **テーマ管理** — 記録の種類ごとにカスタムテンプレートを作成・編集
- **保存データ管理** — 蓄積データの一覧・検索・編集・編集履歴の追跡
- **ユーザー認証** — サインアップ / ログイン / ロール管理（Admin / Member）
- **オフライン対応** — IndexedDB によるローカルキャッシュと同期キュー

## 技術スタック

### フロントエンド

| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 19 + TypeScript 5 |
| ビルドツール | Vite 7 |
| UIライブラリ | [Serendie Design System](https://github.com/serendie/serendie-ui)（Ark UI + Panda CSS） |
| 状態管理 | Zustand / TanStack Query |
| フォーム | React Hook Form + Zod |
| ルーティング | React Router 7 |
| テスト | Vitest + Testing Library + Playwright |

### バックエンド（AWS Amplify Gen 2）

| カテゴリ | 技術 |
|---|---|
| 認証 | Amazon Cognito |
| API | AWS AppSync (GraphQL) |
| データベース | Amazon DynamoDB |
| AI | Amazon Bedrock (Claude Sonnet) |
| ストリーミング | Lambda Function URL (NDJSON) |
| ホスティング | AWS Amplify Hosting |

## プロジェクト構造

```
src/
├── app/              # アプリのエントリポイント・ルーティング
├── features/
│   ├── auth/         # 認証（ログイン・登録・プロフィール）
│   ├── chat/         # AIチャット・音声入力・音声対話
│   ├── data/         # 保存データ管理
│   ├── theme/        # テーマ管理
│   └── admin/        # 管理者機能
├── shared/           # 共通コンポーネント・ユーティリティ
└── lib/              # Amplify設定

amplify/
├── auth/             # Cognito設定
├── data/             # AppSyncスキーマ・データモデル
├── storage/          # S3ストレージ設定
└── functions/
    ├── chat-handler/     # AI応答（AppSync mutation）
    ├── streaming-chat/   # ストリーミング応答（Function URL）
    └── seed-data/        # 初期データ投入
```

## セットアップ

### 前提条件

- Node.js 20+
- AWS アカウント + AWS CLI（プロファイル設定済み）

### インストール

```bash
npm install
```

### ローカル開発

```bash
# バックエンド（Amplify sandbox）
npx ampx sandbox

# フロントエンド
npm run dev
```

### ビルド・チェック

```bash
npm run build       # TypeScript コンパイル + Vite ビルド
npm run typecheck   # 型チェックのみ
npm run lint        # ESLint
npm run test        # Vitest
npm run check       # 上記すべて
```

## ライセンス

Private
