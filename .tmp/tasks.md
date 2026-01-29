# タスクリスト - AIチャット型情報管理システム（製造現場向け）

## 概要

- **総タスク数**: 45タスク（6フェーズ）
- **優先度**: 高
- **クリティカルパス**: Phase 1 → Phase 2 → Phase 3（AIチャット）→ Phase 4 → Phase 5 → Phase 6

## タスク一覧

---

### Phase 1: プロジェクト基盤構築

#### Task 1.1: プロジェクト初期化

- [ ] Vite 7 + React 19 + TypeScriptプロジェクト作成
- [ ] ESLint + Prettier設定（strict mode有効）
- [ ] package.json依存関係設定
- [ ] tsconfig.json設定（strict: true、paths設定）
- [ ] .gitignore、.env.example作成
- **完了条件**: `npm run dev`でアプリが起動し、`npm run lint`がエラーなく完了
- **依存**: なし

#### Task 1.2: AWS Amplify Gen 1 初期化

- [ ] `amplify init`でプロジェクト初期化（us-west-2リージョン）
- [ ] 既存Cognito User Pool（us-west-2_eaUOifAaZ）との連携設定
- [ ] amplify/backend/auth設定ファイル作成
- [ ] 認証フロー動作確認
- **完了条件**: 既存Cognitoでログイン/ログアウトが動作する
- **依存**: Task 1.1

#### Task 1.3: GraphQLスキーマ・API設定

- [ ] schema.graphql作成（設計書の全モデル定義）
- [ ] `amplify add api`でAppSync API追加
- [ ] `amplify push`でバックエンドデプロイ
- [ ] `amplify codegen`でTypeScript型生成
- [ ] DynamoDBテーブル作成確認（12テーブル）
- **完了条件**: AppSync ConsoleでGraphQL Queryが実行可能
- **依存**: Task 1.2

#### Task 1.4: S3ストレージ設定

- [ ] `amplify add storage`でS3バケット追加
- [ ] アクセス権限設定（protected/private）
- [ ] ライフサイクルポリシー設定（audio: 6時間削除）
- [ ] CORS設定
- **完了条件**: フロントエンドからファイルアップロード/ダウンロード可能
- **依存**: Task 1.2

#### Task 1.5: フロントエンド基盤構築

- [ ] ディレクトリ構造作成（Feature-Sliced Design）
- [ ] @serendie/uiインストール・設定
- [ ] React Router 7設定（ルート定義）
- [ ] TanStack Query設定（QueryClient）
- [ ] Zustand設定（基本ストア）
- [ ] Amplify設定（aws-exports.js連携）
- **完了条件**: 基本ルーティングとAmplify APIが動作する
- **依存**: Task 1.3

#### Task 1.6: 共有コンポーネント作成

- [ ] AppLayout（ヘッダー、サイドバー、ナビゲーション）
- [ ] ErrorBoundary
- [ ] LoadingSpinner
- [ ] ConfirmDialog
- [ ] レスポンシブ対応（320px/768px/1024px）
- **完了条件**: レイアウトが全ブレークポイントで正しく表示される
- **依存**: Task 1.5

---

### Phase 2: 認証・ユーザー管理

#### Task 2.1: 認証UI実装

- [ ] LoginFormコンポーネント（メール/パスワード）
- [ ] RegisterFormコンポーネント
- [ ] PasswordResetFormコンポーネント
- [ ] useAuthフック（Amplify Auth連携）
- [ ] 認証状態のグローバル管理（Zustand）
- **完了条件**: ログイン/登録/パスワードリセットフローが動作
- **依存**: Task 1.6

#### Task 2.2: 認証ガード・セッション管理

- [ ] ProtectedRouteコンポーネント
- [ ] 自動ログアウト機能（セッションタイムアウト）
- [ ] トークンリフレッシュ処理
- [ ] 未認証時リダイレクト
- **完了条件**: 未認証ユーザーがログイン画面にリダイレクトされる
- **依存**: Task 2.1

#### Task 2.3: ユーザープロファイル

- [ ] User DynamoDBレコード作成（Cognito連携）
- [ ] ProfileSettingsコンポーネント
- [ ] VoiceSettingsコンポーネント（無音検出時間設定）
- [ ] 表示設定（言語、テーマ）
- [ ] useProfileフック
- **完了条件**: ユーザー設定が保存・読み込みできる
- **依存**: Task 2.1

---

### Phase 3: コア機能実装

#### Task 3.1: テーマ管理（CRUD）

- [ ] ThemeListコンポーネント（一覧表示、検索、フィルタ）
- [ ] ThemeFormコンポーネント（作成/編集フォーム）
- [ ] ThemeFieldEditorコンポーネント（項目の追加/削除/並び替え）
- [ ] ThemeCardコンポーネント
- [ ] useThemeフック（CRUD操作）
- [ ] 削除時の警告ダイアログ（関連データ確認）
- **完了条件**: テーマの作成/編集/削除/一覧表示が動作
- **依存**: Task 1.6

#### Task 3.2: お気に入りテーマ機能

- [ ] FavoriteTheme GraphQL操作
- [ ] お気に入り登録/解除UI
- [ ] お気に入りテーマ優先表示
- **完了条件**: テーマのお気に入り登録/解除が動作
- **依存**: Task 3.1

#### Task 3.3: チーム管理

- [ ] TeamListコンポーネント
- [ ] TeamFormコンポーネント
- [ ] MemberListコンポーネント
- [ ] InviteDialogコンポーネント
- [ ] useTeamフック
- [ ] メンバー招待/削除機能
- [ ] チーム退出機能
- **完了条件**: チームの作成/編集/メンバー管理が動作
- **依存**: Task 1.6

#### Task 3.4: デフォルトテーマ・サンプルデータ

- [ ] seedData Lambda関数作成
- [ ] デフォルトテーマ定義（トラブルメンテナンス）
- [ ] サンプルデータ作成（2件）
- [ ] CloudFormationカスタムリソース設定
- [ ] デプロイ時の自動実行確認
- **完了条件**: デプロイ後にデフォルトテーマとサンプルデータが存在
- **依存**: Task 3.1

---

### Phase 4: AIチャット機能

#### Task 4.1: chatHandler Lambda関数

- [ ] Lambda関数作成（Node.js 20.x）
- [ ] Bedrock SDK設定（us-west-2、Claude Sonnet 4.5）
- [ ] プロンプトビルダー実装（buildSystemPrompt）
- [ ] メッセージフォーマッター実装
- [ ] 収集済みデータ分析ロジック
- [ ] エラーハンドリング
- **完了条件**: AppSyncからLambda経由でBedrock呼び出しが成功
- **依存**: Task 1.3

#### Task 4.2: AIストリーミング実装

- [ ] StreamChunkテーブル操作実装
- [ ] Bedrockストリーミングレスポンス処理
- [ ] チャンクごとのDynamoDB書き込み
- [ ] 完了チャンク送信
- [ ] AppSync Subscription設定（onStreamChunk）
- **完了条件**: AIレスポンスがリアルタイムでストリーミング表示される
- **依存**: Task 4.1

#### Task 4.3: チャットタイトル自動生成

- [ ] タイトル生成プロンプト実装
- [ ] 5メッセージ以内での自動更新ロジック
- [ ] titleLocked制御
- [ ] 手動編集機能
- **完了条件**: チャットタイトルが自動生成され、5メッセージ後にロック
- **依存**: Task 4.2

#### Task 4.4: チャットUIコンポーネント

- [ ] ChatContainerコンポーネント
- [ ] MessageListコンポーネント（スクロール対応）
- [ ] MessageInputコンポーネント
- [ ] StreamingMessageコンポーネント（ストリーミング表示）
- [ ] ThemeSelectorコンポーネント（チャット開始時）
- [ ] useChatフック
- [ ] useChatStreamフック
- **完了条件**: テキストチャットが完全に動作
- **依存**: Task 4.2

#### Task 4.5: 画像添付機能

- [ ] ImageAttachmentコンポーネント
- [ ] useImageUploadフック
- [ ] S3アップロード処理（最大5枚、10MB/枚）
- [ ] サムネイル表示
- [ ] プレビュー・拡大表示
- [ ] 対応形式バリデーション（JPEG, PNG, WebP, GIF, BMP）
- **完了条件**: チャット中に画像を添付・表示できる
- **依存**: Task 4.4, Task 1.4

---

### Phase 5: 音声機能

#### Task 5.1: API Gateway WebSocket設定

- [ ] WebSocket API作成（API Gateway）
- [ ] $connect/$disconnect/audioルート定義
- [ ] Lambda関数（transcribeConnect/Disconnect/Audio）
- [ ] 認証設定（Cognito Authorizer）
- [ ] CORS設定
- **完了条件**: WebSocket接続が確立できる
- **依存**: Task 1.2

#### Task 5.2: Transcribe Streaming実装

- [ ] transcribeHandler Lambda実装
- [ ] Amazon Transcribe Streaming SDK設定
- [ ] 音声データ受信・転送ロジック
- [ ] テキスト結果のWebSocket送信
- [ ] 日本語認識設定
- **完了条件**: 音声がテキストに変換されて返される
- **依存**: Task 5.1

#### Task 5.3: 音声入力UIコンポーネント

- [ ] VoiceInputコンポーネント
- [ ] useVoiceInputフック
- [ ] MediaRecorder API実装
- [ ] 無音検出ロジック（ユーザー設定対応）
- [ ] 音声入力中のビジュアルフィードバック
- [ ] 音量レベル表示
- **完了条件**: 音声入力してテキストがチャットに反映される
- **依存**: Task 5.2, Task 4.4

#### Task 5.4: Polly音声合成実装

- [ ] pollyHandler Lambda実装
- [ ] Amazon Polly SDK設定（Kazuha音声）
- [ ] S3一時保存（署名付きURL生成）
- [ ] GraphQL Mutation（synthesizeSpeech）
- **完了条件**: テキストから音声URLが生成される
- **依存**: Task 1.3

#### Task 5.5: 音声出力UIコンポーネント

- [ ] VoiceOutputコンポーネント
- [ ] useVoiceOutputフック
- [ ] Audio API再生実装
- [ ] 再生完了後の自動入力待機
- [ ] 再生キャンセル機能
- **完了条件**: AI応答が音声で再生される
- **依存**: Task 5.4, Task 4.4

#### Task 5.6: 入力モード切り替え

- [ ] テキスト/音声モード切り替えUI
- [ ] モード状態管理
- [ ] ワンタップ切り替え
- [ ] 現在モード表示
- **完了条件**: テキスト⇄音声モードがスムーズに切り替わる
- **依存**: Task 5.3, Task 5.5

---

### Phase 6: データ管理・通知

#### Task 6.1: データ保存機能

- [ ] dataProcessor Lambda実装
- [ ] saveDataFromSession Mutation
- [ ] 構造化データ保存ロジック
- [ ] Markdown生成
- [ ] メタデータ自動付与
- [ ] EditHistory作成（CREATE）
- **完了条件**: チャットからデータが正しく保存される
- **依存**: Task 4.4

#### Task 6.2: データ一覧・詳細表示

- [ ] DataListコンポーネント（カード/リスト形式）
- [ ] DataCardコンポーネント
- [ ] DataDetailコンポーネント
- [ ] ImageGalleryコンポーネント
- [ ] useDataフック
- [ ] フィルタリング（テーマ、作成者、日付）
- [ ] 並び替え機能
- [ ] ページネーション/無限スクロール
- **完了条件**: データ一覧・詳細が表示される
- **依存**: Task 6.1

#### Task 6.3: データ編集・削除機能

- [ ] DataFormコンポーネント
- [ ] 編集保存ロジック
- [ ] 削除機能（論理削除）
- [ ] 削除確認ダイアログ（警告表示）
- [ ] EditHistory作成（UPDATE/DELETE）
- **完了条件**: データの編集・削除が動作、履歴が記録される
- **依存**: Task 6.2

#### Task 6.4: 編集履歴表示

- [ ] EditHistoryTimelineコンポーネント
- [ ] 変更差分表示
- [ ] 削除データの閲覧機能
- **完了条件**: データ詳細画面で編集履歴が表示される
- **依存**: Task 6.3

#### Task 6.5: 検索機能

- [ ] searchDataHandler Lambda実装（DynamoDB Scan）
- [ ] SearchFilterコンポーネント
- [ ] キーワード検索
- [ ] テーマ・日付範囲フィルタ
- **完了条件**: キーワード検索が動作する
- **依存**: Task 6.2

#### Task 6.6: チャット履歴管理

- [ ] HistoryListコンポーネント
- [ ] HistoryItemコンポーネント
- [ ] useHistoryフック
- [ ] 履歴検索・フィルタリング
- [ ] セッション継続機能
- [ ] 履歴削除機能
- **完了条件**: 過去のチャットを一覧表示・継続できる
- **依存**: Task 4.4

#### Task 6.7: 通知システム基盤

- [ ] notifyTrigger Lambda（DynamoDB Streams）
- [ ] 通知判定ロジック実装
- [ ] Notificationテーブル書き込み
- [ ] AppSync Subscription（onNewNotification）
- **完了条件**: データ保存時に通知レコードが作成される
- **依存**: Task 6.1

#### Task 6.8: 通知UI

- [ ] NotificationListコンポーネント
- [ ] NotificationItemコンポーネント
- [ ] NotificationBadgeコンポーネント
- [ ] useNotificationフック
- [ ] 未読/既読管理
- [ ] 一括既読機能
- [ ] 通知からデータ詳細へのリンク
- **完了条件**: 通知一覧が表示され、既読管理が動作
- **依存**: Task 6.7

#### Task 6.9: 通知設定

- [ ] NotificationSettingsコンポーネント
- [ ] テーマごとの通知ON/OFF
- [ ] メール通知ON/OFF
- [ ] 設定保存ロジック
- **完了条件**: 通知設定が保存・反映される
- **依存**: Task 6.8

#### Task 6.10: メール通知バッチ

- [ ] emailBatch Lambda実装
- [ ] EventBridge設定（5分間隔）
- [ ] Amazon SES連携
- [ ] メールテンプレート
- [ ] バッチ集約ロジック
- **完了条件**: 5分ごとにメール通知がまとめて送信される
- **依存**: Task 6.7

---

### Phase 7: テスト・品質保証

#### Task 7.1: 単体テスト

- [ ] Vitest設定
- [ ] コンポーネントテスト（React Testing Library）
- [ ] フックテスト
- [ ] ユーティリティテスト
- [ ] カバレッジ80%達成
- **完了条件**: 単体テストがすべてパス、カバレッジ80%以上
- **依存**: Phase 1-6完了後

#### Task 7.2: 統合テスト

- [ ] MSW設定（API モック）
- [ ] 認証フローテスト
- [ ] チャットフローテスト
- [ ] データ保存フローテスト
- **完了条件**: 統合テストがすべてパス
- **依存**: Task 7.1

#### Task 7.3: E2Eテスト

- [ ] Playwright設定
- [ ] 認証E2Eテスト
- [ ] チャットE2Eテスト
- [ ] データ管理E2Eテスト
- [ ] クリティカルパス網羅
- **完了条件**: E2Eテストがすべてパス
- **依存**: Task 7.2

#### Task 7.4: アクセシビリティ・レスポンシブ確認

- [ ] WCAG 2.2 Level AAチェック
- [ ] キーボード操作確認
- [ ] スクリーンリーダー確認
- [ ] 全ブレークポイント（320px/768px/1024px）確認
- **完了条件**: アクセシビリティ違反なし、全デバイスで正常表示
- **依存**: Phase 1-6完了後

---

### Phase 8: デプロイ・運用準備

#### Task 8.1: 環境設定・CI/CD

- [ ] Amplify Console設定
- [ ] 環境変数設定（dev/staging/prod）
- [ ] ブランチ別自動デプロイ設定
- [ ] amplify.yml最適化
- **完了条件**: プッシュ時に自動デプロイが実行される
- **依存**: Phase 1-6完了後

#### Task 8.2: モニタリング・エラートラッキング

- [ ] CloudWatch Logs設定
- [ ] CloudWatch Alarms設定
- [ ] Sentry設定
- [ ] パフォーマンスモニタリング
- **完了条件**: エラーがSentryに記録、アラートが発火する
- **依存**: Task 8.1

#### Task 8.3: 本番デプロイ

- [ ] 本番環境デプロイ
- [ ] 動作確認
- [ ] パフォーマンス確認
- [ ] セキュリティ最終確認
- **完了条件**: 本番環境で全機能が正常動作
- **依存**: Task 7.3, Task 7.4, Task 8.2

---

## 実装順序

### クリティカルパス

```
Phase 1 (基盤)
    ↓
Phase 2 (認証)
    ↓
Phase 3 (テーマ・チーム) ← 並行可能
    ↓
Phase 4 (AIチャット) ← コア機能
    ↓
Phase 5 (音声) ← Phase 4完了後
    ↓
Phase 6 (データ管理・通知)
    ↓
Phase 7 (テスト)
    ↓
Phase 8 (デプロイ)
```

### 並行実行可能なタスク

| グループ | タスク |
|----------|--------|
| Phase 3 | Task 3.1, 3.3 を並行可能 |
| Phase 4+5 | Task 5.1〜5.2（WebSocket基盤）をPhase 4と並行可能 |
| Phase 6 | Task 6.5（検索）, 6.6（履歴）を並行可能 |
| Phase 7 | Task 7.1, 7.4 を並行可能 |

---

## リスクと対策

| リスク | 対策 |
|--------|------|
| Transcribe Streamingの音声認識精度 | テスト環境で事前検証、ノイズ対策の検討 |
| Bedrockのレイテンシ | ストリーミング実装で体感速度向上 |
| 既存Cognito連携の問題 | 設定変更は最小限、DynamoDBで追加属性管理 |
| Amplify Gen 1の制約 | カスタムリソースで対応、必要に応じてCDK追加 |
| 音声処理のブラウザ互換性 | 主要ブラウザでの動作確認、フォールバック実装 |

---

## 注意事項

- 各タスクはコミット単位で完結させる
- TypeScript strictモード必須、any型禁止
- @serendie/uiコンポーネントを優先使用
- レスポンシブ対応は各UIタスクに含める
- テストはタスク完了時に随時作成（Phase 7は最終確認）
- Lambda関数はTypeScriptで実装

---

## 実装開始ガイド

1. このタスクリストに従って順次実装を進めてください
2. 各タスクの開始時にTodoWriteでin_progressに更新
3. 完了時はcompletedに更新
4. 問題発生時は速やかに報告してください
5. 並行実行可能なタスクは積極的に並行で進める
6. 各Phaseの最後にlint/typecheck/テスト実行

---

**作成日**: 2026-01-29
**バージョン**: 1.0
**ステータス**: レビュー待ち
