# Project Guidelines

このドキュメントはプロジェクトのルール、目標、進捗管理方法を定義します。
言語固有のルールは `.github/instructions/` を参照。

## 基本ルール

- **回答は日本語で行う**
- 効率を最大化するため、**複数の独立したプロセスを実行する必要がある場合は、順次ではなく同時に実行する**
- 設計用の一時的なメモは `.tmp` にマークダウンとして保存する
- 批判的に回答し、意見に迎合しないこと。ただし批判が強引にならないように

## 品質基準

### アクセシビリティ

- **WCAG 2.2 Level AA に準拠すること** - すべての違反は欠陥
- 実装後にアクセシビリティチェックを実行する

### レスポンシブデザイン

- **必須**: モバイル (320px+) からデスクトップまで対応
- ブレークポイント: 320px / 768px / 1024px

### Serendie Design System

- **公式標準**: Serendie Standardを必ず採用
- **定義場所**: `.github/instructions/serendie-ui.instructions.md` の「⭐ Serendie Standard（必須採用）」セクション
- 配色、レイアウト、カード、タイポグラフィ、ボタン、アイコンの詳細仕様を含む完全な実装ガイド
- 以下のデザインスタイルへの逸脱は禁止
  - ❌ ミニマリストスタイル（過度にシンプル、装飾不足）
  - ❌ マキシマリストスタイル（グラデーション、過度な装飾）
  - ❌ フラットデザインスタイル（シャドウなし、極端な装飾）
- テーマカラーはソリッドカラーのみ（グラデーション禁止）
- カードは`bg-white`に`rounded-xl`と`shadow-sm`が標準

## 開発スタイル - 仕様駆動開発 (SDD)

### 4段階ワークフロー

複雑なタスクや新機能開発には以下のワークフローを使用：

#### Stage 1: Requirements（要件定義）
- ユーザーリクエストを分析し、明確な機能要件に変換
- 要件を `.tmp/requirements.md` に記録

#### Stage 2: Design（設計）
- 要件に基づいた技術設計を作成
- 設計を `.tmp/design.md` に記録

#### Stage 3: Task List（タスク分割）
- 設計を実装可能な単位に分割
- タスクを `.tmp/tasks.md` に記録

#### Stage 4: Implementation（実装）
- タスクリストに従って実装
- 各タスク: 実装 → テスト → lint/typecheck

### 重要事項

- 各ステージは前のステージの成果物に依存
- 次のステージに進む前にユーザーの確認を得る
- シンプルな修正や明確なバグ修正は直接実装可能

## 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite 7
- **UIライブラリ**: @serendie/ui, @serendie/symbols
- **スタイリング**: Tailwind CSS v4（`@tailwindcss/vite` プラグイン）
- **テスト**: Vitest, Playwright
- **インフラ**: AWS (CDK, Lambda, DynamoDB)

### ⚠️ 重要: プロジェクトセットアップ

新規プロジェクト作成時は `.github/instructions/project-setup.instructions.md` を参照。

**必須ルール:**
- `tailwind.config.js` は**作成しない**（Tailwind v4 では不要）
- `@tailwindcss/vite` プラグインを `vite.config.ts` で使用
- `@serendie/ui/styles.css` を `main.tsx` でインポート（`dist/style.css` ではない）
- `index.css` で `@import "tailwindcss"` と `@layer` を設定

## コーディング規約

### コミットメッセージ形式

```
<type>(<scope>): <subject> <emoji>
```

例：
- `feat: ユーザー認証機能を追加 ✨`
- `fix: ログイン時のエラーハンドリングを修正 🐛`
- `docs: APIドキュメントを更新 📝`

## 利用可能なスキル

開発タスクに応じて以下のスキルを活用してください。

### アーキテクチャ & 設計
- `#software-architecture` - Clean Architecture、SOLID原則、設計パターン
- `#prompt-engineering` - プロンプト設計・最適化
- `#brainstorming` - アイデア整理・設計
- `#adr-manager` - アーキテクチャ決定記録（ADR）の管理

### 開発プロセス
- `#test-driven-development` - TDD（テスト駆動開発）
- `#subagent-driven-development` - 並列タスク実行・品質管理
- `#kaizen` - 継続的改善（小さな改善の積み重ね）
- `#ship-learn-next` - 学習・開発の優先順位付け

### フロントエンド開発
- `#serendie-webapp` - Serendie Design Systemを使用したWebアプリケーション開発
- `#canvas-design` - ビジュアルコンテンツ作成
- `#artifacts-builder` - Webアーティファクト作成
- `#theme-factory` - テーマ作成
- `#webapp-testing` - Webアプリテスト

### デバッグ & 品質
- `#root-cause-tracing` - デバッグ・根本原因追跡
- `#changelog-generator` - 変更履歴の自動生成

### ドキュメント処理
- `#docx` - Word文書の作成・編集
- `#pdf` - PDF抽出・結合・注釈
- `#pptx` - PowerPointスライド操作
- `#xlsx` - Excelスプレッドシート操作
- `#image-enhancer` - 画像品質向上

### インフラ & データベース
- `#aws-agentic-ai` - AWS Bedrock AgentCore
- `#aws-cdk-development` - AWS CDK開発
- `#aws-cost-operations` - AWSコスト管理
- `#aws-serverless-eda` - AWSサーバーレス・イベント駆動アーキテクチャ
- `#postgres` - PostgreSQL操作

### スキル管理
- `#skill-creator` - 新しいスキルの作成
