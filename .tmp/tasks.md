# タスクリスト - AIチャット型情報管理システム（製造現場向け）

## 概要

- **対象スコープ**: Phase 1（MVP）のみ
- **総タスク数**: 39タスク（9ステージ）
- **技術基盤**: AWS Amplify Gen 2 + 既存Cognito User Pool
- **UIライブラリ**: Serendie Design System（@serendie/ui）

> Phase 2（音声・チーム・通知）は本タスクリストの対象外。MVP安定後に別途タスク化する。
>
> **注記**: 本タスクリストの「Stage 1〜9」は**実装ステージ**（作業順序）であり、要件定義書の「Phase 1（MVP）/ Phase 2」は**リリーススコープ**を指す。本タスクリストは要件定義書 Phase 1 の実装を対象とする。

## クリティカルパス

```
Stage 1 (基盤)
    ↓
Stage 2 (認証・RBAC)
    ↓
Stage 3 (テーマ・シードデータ) ← Stage 4と部分的に並行可能
    ↓
Stage 4 (AIチャット) ← コア機能
    ↓
Stage 5 (データ管理) ← Stage 4完了後
    ↓
Stage 6 (管理者パネル) ← Stage 5と並行可能
Stage 7 (オフラインフォールバック) ← Stage 5と並行可能
    ↓
Stage 8 (テスト・品質保証)
    ↓
Stage 9 (デプロイ・運用準備)
```

---

## Stage 1: プロジェクト基盤構築

### Task 1.1: プロジェクト初期化

- [ ] Vite 7 + React 19 + TypeScript 5 プロジェクト作成
- [ ] ESLint + Prettier設定（strict mode有効）
- [ ] package.json依存関係設定
- [ ] tsconfig.json設定（strict: true、paths設定）
- [ ] .gitignore、.env.example作成
- **完了条件**: `npm run dev`でアプリが起動し、`npm run lint`がエラーなく完了
- **依存**: なし

### Task 1.2: AWS Amplify Gen 2 初期化

- [ ] `npx ampx sandbox`でGen 2プロジェクト初期化
- [ ] `amplify/backend.ts`エントリポイント作成
- [ ] `amplify/auth/resource.ts`作成（既存Cognito User Pool参照: `referenceAuth`）
  - User Pool ID: `us-west-2_eaUOifAaZ`
- [ ] 認証フロー動作確認（サンドボックス環境）
- **完了条件**: 既存CognitoでAmplify Gen 2経由のログイン/ログアウトが動作する
- **依存**: Task 1.1

### Task 1.3: データスキーマ・API設定

- [ ] `amplify/data/resource.ts`作成（TypeScriptスキーマ定義）
  - User, Theme, FavoriteTheme, ChatSession, ChatMessage, StreamChunk, SavedData, EditHistory（8モデル）
- [ ] 認可ルール設定（`allow.authenticated()`）
- [ ] セカンダリインデックス設定（GSI）
- [ ] `npx ampx sandbox`でバックエンドデプロイ
- [ ] `amplify_outputs.json`生成確認
- [ ] AppSync ConsoleでGraphQL Query実行確認
- **完了条件**: AppSync ConsoleでCRUD操作が可能、8テーブルがDynamoDBに作成済み
- **依存**: Task 1.2

### Task 1.4: S3ストレージ設定

- [ ] `amplify/storage/resource.ts`作成
- [ ] アクセス権限設定（authenticated users: read/write）
- [ ] パス設定（`public/default/`, `protected/{entity_id}/images/`）
- [ ] CORS設定
- **完了条件**: フロントエンドからファイルアップロード/ダウンロード可能
- **依存**: Task 1.2

### Task 1.5: フロントエンド基盤構築

- [ ] ディレクトリ構造作成（Feature-Sliced Design）
- [ ] Serendie Design Systemインストール・設定
  - `@serendie/ui`（UIコンポーネント）
  - `@serendie/design-token`（デザイントークン）
  - `@serendie/ui-symbols`（アイコン）
- [ ] React Router 7設定（ルート定義）
- [ ] TanStack Query設定（QueryClient）
- [ ] Zustand設定（基本ストア）
- [ ] Amplify Gen 2設定（`amplify_outputs.json`連携）
- **完了条件**: 基本ルーティングとAmplify APIが動作する
- **依存**: Task 1.3

### Task 1.6: 共有コンポーネント作成

- [ ] AppLayout（ヘッダー、サイドバー、ナビゲーション）
- [ ] ErrorBoundary
- [ ] LoadingSpinner
- [ ] ConfirmDialog
- [ ] OfflineIndicator（ネットワーク状態表示）
- [ ] レスポンシブ対応（320px/768px/1024px）
- [ ] Serendie Design Systemのコンポーネント・トークンを使用
- **完了条件**: レイアウトが全ブレークポイントで正しく表示される
- **依存**: Task 1.5

---

## Stage 2: 認証・RBAC

### Task 2.1: 認証UI実装

- [ ] LoginFormコンポーネント（メール/パスワード）
- [ ] RegisterFormコンポーネント
- [ ] PasswordResetFormコンポーネント
- [ ] useAuthフック（Amplify Gen 2 Auth連携）
- [ ] 認証状態のグローバル管理（Zustand authStore）
- [ ] Serendie Formコンポーネント使用
- **完了条件**: ログイン/登録/パスワードリセットフローが動作
- **依存**: Task 1.6

### Task 2.2: 認証ガード・セッション管理

- [ ] ProtectedRouteコンポーネント
- [ ] AdminRouteコンポーネント（管理者専用ルートガード）
- [ ] 自動ログアウト機能（セッションタイムアウト）
- [ ] トークンリフレッシュ処理
- [ ] 未認証時リダイレクト
- **完了条件**: 未認証ユーザーがログイン画面にリダイレクト、非管理者が管理画面にアクセス不可
- **依存**: Task 2.1

### Task 2.3: ユーザープロファイル

- [ ] User DynamoDBレコード作成（Cognito認証後の初回アクセス時）
- [ ] ProfileSettingsコンポーネント
- [ ] 表示設定（言語、テーマ）
- [ ] useProfileフック
- **完了条件**: ユーザー設定が保存・読み込みできる
- **依存**: Task 2.1

### Task 2.4: RBAC実装

- [ ] ロールチェックロジック（フロントエンド: isAdmin判定）
- [ ] ロールに基づくUI表示制御
  - 管理者メニューの表示/非表示
  - テーマ削除ボタンの表示制御（Admin only）
  - データ削除ボタンの表示制御（作成者 or Admin）
- [ ] バックエンド: Lambda内でのロールチェックユーティリティ
- [ ] 権限不足時のエラーハンドリング（AUTHZ_*エラー）
- **完了条件**: Admin/Memberの権限分離が正しく動作する
- **依存**: Task 2.3

---

## Stage 3: テーマ・シードデータ

### Task 3.1: テーマ管理（CRUD）

- [ ] ThemeListコンポーネント（一覧表示、検索、フィルタ）
- [ ] ThemeFormコンポーネント（作成/編集フォーム、React Hook Form + Zod）
- [ ] ThemeFieldEditorコンポーネント（項目の追加/削除/並び替え）
- [ ] ThemeCardコンポーネント
- [ ] useThemeフック（CRUD操作）
- [ ] 削除時の警告ダイアログ（関連データ確認）
- [ ] 削除は管理者のみ（RBAC連携）
- **完了条件**: テーマの作成/編集/一覧表示が動作、削除は管理者のみ
- **依存**: Task 2.4

### Task 3.2: お気に入りテーマ機能

- [ ] FavoriteTheme GraphQL操作
- [ ] お気に入り登録/解除UI（トグルボタン）
- [ ] お気に入りテーマ優先表示
- **完了条件**: テーマのお気に入り登録/解除が動作
- **依存**: Task 3.1

### Task 3.3: シードデータ（デフォルトテーマ + 初回Admin）

- [ ] `amplify/functions/seed-data/resource.ts`作成（defineFunction）
- [ ] `amplify/functions/seed-data/handler.ts`実装
  - 初回Adminユーザー作成（環境変数: INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_USER_ID）
  - デフォルトテーマ「トラブルメンテナンス」作成
  - サンプルチャット履歴 + サンプル保存データ（2-3件）作成
- [ ] 冪等性の確保（既存データがあればスキップ）
- [ ] デプロイ時の自動実行設定
- **完了条件**: デプロイ後にAdmin、デフォルトテーマ、サンプルデータが存在する
- **依存**: Task 1.3

---

## Stage 4: AIチャット機能

### Task 4.1: chatHandler Lambda関数

- [ ] `amplify/functions/chat-handler/resource.ts`作成（defineFunction）
- [ ] `amplify/functions/chat-handler/handler.ts`実装
- [ ] Bedrock SDK設定（us-west-2、Claude Sonnet 4.5）
- [ ] `amplify/functions/chat-handler/prompt.ts`実装（buildSystemPrompt）
- [ ] メッセージフォーマッター実装（formatMessagesForBedrock）
- [ ] 収集済みデータ分析ロジック（analyzeCollectedData）
- [ ] エラーハンドリング（AI_*エラーコード）
- [ ] `$amplify/env/chat-handler`からの環境変数アクセス
- **完了条件**: AppSyncからLambda経由でBedrock呼び出しが成功
- **依存**: Task 1.3

### Task 4.2: AIストリーミング実装

- [ ] StreamChunkテーブル操作実装
- [ ] Bedrockストリーミングレスポンス処理（InvokeModelWithResponseStreamCommand）
- [ ] チャンクごとのDynamoDB書き込み
- [ ] 完了チャンク送信（isComplete: true）
- [ ] AppSync Subscription設定（onStreamChunk）
- [ ] ChatMessage完全メッセージの保存
- **完了条件**: AIレスポンスがリアルタイムでストリーミング表示される
- **依存**: Task 4.1

### Task 4.3: チャットタイトル自動生成

- [ ] タイトル生成プロンプト実装（buildTitleGenerationPrompt）
- [ ] 5メッセージ以内での自動更新ロジック
- [ ] titleLocked制御（5メッセージ後にロック）
- [ ] 手動編集機能
- **完了条件**: チャットタイトルが自動生成され、5メッセージ後にロック
- **依存**: Task 4.2

### Task 4.4: チャットUIコンポーネント

- [ ] ChatContainerコンポーネント
- [ ] MessageListコンポーネント（スクロール対応）
- [ ] MessageInputコンポーネント（テキスト入力）
- [ ] StreamingMessageコンポーネント（ストリーミング表示）
- [ ] ThemeSelectorコンポーネント（チャット開始時、お気に入り優先）
- [ ] useChatフック
- [ ] useChatStreamフック（AppSync Subscription）
- [ ] Serendie UIコンポーネント使用
- **完了条件**: テキストチャットが完全に動作（送信→ストリーミング→表示→保存）
- **依存**: Task 4.2, Task 3.2

### Task 4.5: 画像添付機能

- [ ] ImageAttachmentコンポーネント
- [ ] useImageUploadフック
- [ ] S3アップロード処理（最大5枚、10MB/枚）
- [ ] サムネイル表示
- [ ] プレビュー・拡大表示
- [ ] 対応形式バリデーション（JPEG, PNG, WebP, GIF, BMP）
- **完了条件**: チャット中に画像を添付・表示できる
- **依存**: Task 4.4, Task 1.4

---

## Stage 5: データ管理

### Task 5.1: データ保存機能

- [ ] データ保存Mutation実装（saveDataFromSession）
- [ ] 構造化データ保存ロジック（テーマフィールドに基づく）
- [ ] Markdown生成
- [ ] メタデータ自動付与（createdBy, createdAt, themeId, sessionId）
- [ ] EditHistory作成（CREATE action）
- [ ] 画像の永続保存（S3パス紐付け）
- [ ] 保存前確認UI（AIが必要項目の充足を判断、確認プロンプト表示、修正機能）
- [ ] 自動保存（下書き）: チャット中の収集情報をDRAFTステータスで一時保存
- [ ] セッション切断時のデータ保護（beforeunloadイベント）
- **完了条件**: チャットからデータが正しく保存され、EditHistoryが記録される。下書き自動保存が動作する。
- **依存**: Task 4.4

### Task 5.2: データ一覧・詳細表示

- [ ] DataListコンポーネント（カード/リスト形式切り替え）
- [ ] DataCardコンポーネント
- [ ] DataDetailコンポーネント
- [ ] ImageGalleryコンポーネント（ギャラリー形式）
- [ ] useDataフック
- [ ] フィルタリング（テーマ、作成者、日付範囲）
- [ ] 並び替え機能（日付、タイトル、作成者、テーマ）
- [ ] ページネーション（nextToken）
- [ ] Markdownレンダリング
- **完了条件**: データ一覧・詳細が表示される
- **依存**: Task 5.1

### Task 5.3: データ編集・削除機能

- [ ] DataFormコンポーネント（React Hook Form + Zod）
- [ ] 編集保存ロジック
- [ ] 削除機能（論理削除: isDeleted, deletedAt, deletedBy）
- [ ] 削除確認ダイアログ（「この操作は取り消せません」「他のユーザーも閲覧できなくなります」）
- [ ] 削除権限チェック（作成者 or Admin）
- [ ] EditHistory作成（UPDATE/DELETE action）
- **完了条件**: データの編集・削除が動作、履歴が記録される、権限チェックが正しい
- **依存**: Task 5.2

### Task 5.4: 編集履歴表示

- [ ] EditHistoryTimelineコンポーネント（タイムライン形式）
- [ ] 変更差分表示（誰が・いつ・何を変更したか）
- [ ] 削除データの閲覧機能（復元なし、閲覧のみ）
- **完了条件**: データ詳細画面で編集履歴が表示される
- **依存**: Task 5.3

### Task 5.5: 検索機能

- [ ] `amplify/functions/search-data/resource.ts`作成（defineFunction）
- [ ] `amplify/functions/search-data/handler.ts`実装（DynamoDB Scan）
- [ ] SearchFilterコンポーネント
- [ ] キーワード検索（title, markdownContent）
- [ ] テーマ・日付範囲フィルタ
- [ ] 論理削除データの除外
- **完了条件**: キーワード検索・フィルタリングが動作する
- **依存**: Task 5.2

### Task 5.6: チャット履歴管理

- [ ] HistoryListコンポーネント
- [ ] HistoryItemコンポーネント
- [ ] useHistoryフック
- [ ] 履歴検索（キーワード）・フィルタリング（テーマ、日付）
- [ ] セッション継続機能（過去チャットの再開）
- [ ] 履歴削除機能（確認ダイアログ）
- **完了条件**: 過去のチャットを一覧表示・検索・継続・削除できる
- **依存**: Task 4.4

---

## Stage 6: 管理者パネル

### Task 6.1: ユーザー管理

- [ ] UserListコンポーネント（全ユーザー一覧）
- [ ] UserRoleEditorコンポーネント（Admin ⇄ Member トグル）
- [ ] useAdminフック
- [ ] ロール変更のConfirmDialog
- [ ] Cognito Admin APIとの連携（ユーザー一覧取得）
- **完了条件**: 管理者がユーザー一覧を表示し、ロールを変更できる
- **依存**: Task 2.4

### Task 6.2: テーマ管理（管理者専用）

- [ ] ThemeManagerコンポーネント（全テーマ管理ビュー）
- [ ] テーマ削除機能（関連データ警告付き）
- [ ] テーマ統合・整理機能
- [ ] デフォルトテーマ変更機能
- **完了条件**: 管理者が全テーマの削除・統合・デフォルト変更が可能
- **依存**: Task 3.1, Task 2.4

### Task 6.3: 管理者ルーティング

- [ ] /admin ルート追加
- [ ] 管理者ダッシュボード（統計サマリー）
- [ ] サイドバーに管理者メニュー追加（Admin only表示）
- [ ] AdminRouteガードの適用
- **完了条件**: /admin が管理者のみアクセス可能で、全管理機能が操作できる
- **依存**: Task 6.1, Task 6.2

---

## Stage 7: オフラインフォールバック

### Task 7.1: IndexedDB設定

- [ ] `idb`パッケージインストール
- [ ] `src/shared/offline/db.ts`作成
  - ChatTrackerDB スキーマ定義
  - ストア: themes, chatSessions, chatMessages, savedData, syncQueue
  - インデックス設定
- [ ] DB初期化・バージョン管理
- **完了条件**: IndexedDBが正しく初期化され、CRUD操作が可能
- **依存**: Task 1.5

### Task 7.2: キャッシュマネージャー

- [ ] `src/shared/offline/cacheManager.ts`作成
- [ ] テーマ定義: アプリ起動時に全件キャッシュ（stale-while-revalidate）
- [ ] チャット履歴: セッション表示時に閲覧済みデータをキャッシュ
- [ ] 保存データ: 詳細表示時に閲覧済みデータをキャッシュ
- [ ] 画像はキャッシュ対象外
- [ ] TanStack Queryとの統合（オフライン時はIndexedDBから読み取り）
- **完了条件**: オフライン時にキャッシュ済みデータが表示される
- **依存**: Task 7.1, Task 5.2

### Task 7.3: 同期キュー

- [ ] `src/shared/offline/syncQueue.ts`作成
- [ ] オフライン時の操作をキューに保存（sendMessage, saveData, updateData）
- [ ] オンライン復帰時の自動送信（processSyncQueue）
- [ ] リトライロジック（最大3回、3回失敗でユーザー通知）
- [ ] コンフリクト検出・ユーザー通知
- **完了条件**: オフライン中の操作がオンライン復帰時に正しく同期される
- **依存**: Task 7.2

### Task 7.4: Service Worker・オンライン状態管理

- [ ] `src/shared/offline/serviceWorker.ts`作成（SW登録）
- [ ] `src/shared/hooks/useOnlineStatus.ts`作成
- [ ] ネットワーク状態のリアルタイム監視
- [ ] OfflineIndicatorコンポーネントとの連携
- [ ] オフライン⇄オンライン切り替え時のUI更新
- [ ] オフライン時のAIチャット・データ保存の無効化表示
- **完了条件**: オフライン検出が動作し、UIにオフライン状態が表示される
- **依存**: Task 7.3

---

## Stage 8: テスト・品質保証

### Task 8.1: テスト基盤設定

- [ ] Vitest設定
- [ ] React Testing Library設定
- [ ] MSW設定（AppSync APIモック）
- [ ] テストユーティリティ作成（レンダラー、モックプロバイダー）
- **完了条件**: テスト実行環境が動作する
- **依存**: Stage 5完了後

### Task 8.2: 単体テスト

- [ ] コンポーネントテスト（各feature module）
- [ ] フックテスト（useAuth, useChat, useTheme, useData, useAdmin）
- [ ] ユーティリティテスト（date, validation, markdown）
- [ ] オフラインロジックテスト（cacheManager, syncQueue）
- [ ] カバレッジ80%達成
- **完了条件**: 単体テストがすべてパス、カバレッジ80%以上
- **依存**: Task 8.1

### Task 8.3: 統合テスト

- [ ] 認証フローテスト（ログイン → ルーティング → ロールチェック）
- [ ] チャットフローテスト（テーマ選択 → メッセージ送信 → ストリーミング → 保存）
- [ ] データ管理フローテスト（作成 → 編集 → 削除 → 履歴確認）
- [ ] 管理者フローテスト（ユーザー管理 → テーマ管理）
- [ ] オフラインフローテスト（オフライン検出 → キャッシュ読み取り → オンライン復帰 → 同期）
- **完了条件**: 統合テストがすべてパス
- **依存**: Task 8.2

### Task 8.4: E2Eテスト

- [ ] Playwright設定
- [ ] 認証E2Eテスト
- [ ] チャットE2Eテスト
- [ ] データ管理E2Eテスト
- [ ] 管理者E2Eテスト
- [ ] オフラインE2Eテスト
- [ ] クリティカルパス網羅
- **完了条件**: E2Eテストがすべてパス
- **依存**: Task 8.3

### Task 8.5: アクセシビリティ・レスポンシブ確認

- [ ] WCAG 2.2 Level AAチェック
- [ ] キーボード操作確認
- [ ] スクリーンリーダー確認
- [ ] 全ブレークポイント確認（320px/768px/1024px）
- [ ] タブレット（iPad）での動作確認
- **完了条件**: アクセシビリティ違反なし、全デバイスで正常表示
- **依存**: Stage 7完了後

---

## Stage 9: デプロイ・運用準備

### Task 9.1: 環境設定・CI/CD

- [ ] Amplify Console設定
- [ ] 環境変数設定（dev/staging/prod）
  - INITIAL_ADMIN_EMAIL
  - INITIAL_ADMIN_USER_ID
- [ ] ブランチ別自動デプロイ設定（develop→dev、staging→staging、main→prod）
- [ ] `npx ampx pipeline-setup`実行
- **完了条件**: プッシュ時に自動デプロイが実行される
- **依存**: Stage 8完了後

### Task 9.2: モニタリング・エラートラッキング

- [ ] CloudWatch Logs設定（Lambda、AppSync）
- [ ] CloudWatch Alarms設定（エラー率、レイテンシ）
- [ ] Sentry設定（フロントエンドエラートラッキング）
- [ ] パフォーマンスモニタリング
- **完了条件**: エラーがSentryに記録、CloudWatchアラートが発火する
- **依存**: Task 9.1

### Task 9.3: 本番デプロイ

- [ ] シードデータ実行確認（Admin + デフォルトテーマ + サンプルデータ）
- [ ] 本番環境デプロイ
- [ ] 全機能動作確認
- [ ] パフォーマンス確認（応答時間、ページ読み込み時間）
- [ ] セキュリティ最終確認
- **完了条件**: 本番環境で全MVP（Phase 1）機能が正常動作
- **依存**: Task 9.2

---

## 並行実行可能なタスク

| グループ | 並行可能タスク | 備考 |
|----------|---------------|------|
| Stage 1 | Task 1.3, 1.4 | 両方ともTask 1.2完了後に並行可能 |
| Stage 3+4 | Task 3.3（シードデータ）, Task 4.1（Lambda） | 両方ともTask 1.3完了後に並行可能 |
| Stage 5 | Task 5.5（検索）, 5.6（履歴） | 独立性が高い |
| Stage 5+6 | Stage 5後半, Stage 6全体 | Stage 6はTask 2.4完了後に開始可能 |
| Stage 6+7 | Stage 6, Stage 7 | 独立した機能領域 |
| Stage 8 | Task 8.1 + 8.5 | テスト基盤とアクセシビリティは並行可能 |

---

## リスクと対策

| リスク | 対策 |
|--------|------|
| Bedrockのレイテンシ | ストリーミング実装で体感速度向上 |
| 既存Cognito連携の問題 | referenceAuthで参照、設定変更は最小限 |
| Amplify Gen 2の成熟度 | 公式ドキュメント確認、必要に応じてカスタムCDK |
| オフラインキャッシュの整合性 | サーバー側タイムスタンプ、3回リトライ、ユーザー通知 |
| Serendie Design Systemの互換性 | Storybookで事前確認、必要に応じてカスタマイズ |
| DynamoDB Scanの検索パフォーマンス | 100ユーザー規模では実用的、将来OpenSearch検討 |

---

## 注意事項

- 各タスクはコミット単位で完結させる
- TypeScript strictモード必須、`any`型禁止、`class`は最小限
- `@serendie/ui`コンポーネントを優先使用、ハードコーディング禁止
- レスポンシブ対応は各UIタスクに含める
- テストはタスク完了時に随時作成（Stage 8は最終確認）
- Lambda関数はTypeScriptで実装、`defineFunction`で定義
- `$amplify/env/`から環境変数にアクセス
- ロール情報はDynamoDB Userテーブルで管理（Cognitoグループは使用しない）

---

## 実装開始ガイド

1. このタスクリストに従って順次実装を進める
2. 各タスクの開始時にTaskUpdateでin_progressに更新
3. 完了時はcompletedに更新
4. 問題発生時は速やかに報告
5. 並行実行可能なタスクは積極的に並行で進める
6. 各Stageの最後にlint/typecheck/テスト実行

---

**作成日**: 2026-02-06
**バージョン**: 2.1
**ステータス**: レビュー待ち
**変更履歴**:
- 1.0: 初版作成（Gen 1ベース、全機能含む）
- 2.0: Gen 2対応、Phase 1（MVP）スコープに限定、音声/チーム/通知を除外、RBAC追加、オフラインフォールバック追加、管理者パネル追加、シードデータにAdmin作成追加
- 2.1: タスク数修正（42→39）、Phase→Stage名称変更（リリーススコープとの混同回避）、自動保存・保存前確認UIをTask 5.1に追加
