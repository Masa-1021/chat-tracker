---
description: 匁E��皁E��キュメント生戁E
---

# Docs - ドキュメント生戁E

## 概要E

プロジェクト構造を�E析し、包括皁E��統一されたドキュメントを自動生成します、E

## 入劁E

対象: {{input}}

## 生�EドキュメンチE

### 1. API ドキュメンチE
- **エンド�Eイント仕槁E*
- **リクエスチEレスポンス**侁E
- **認証方況E*
- **エラーハンドリング**

### 2. コーチEドキュメンチE
- **関数/クラス**の詳細説昁E
- **パラメータ仕槁E*
- **戻り値説昁E*
- **使用侁E*

### 3. ユーザーガイチE
- **セチE��アチE�E手頁E*
- **基本皁E��使用方況E*
- **高度な機�E**
- **トラブルシューチE��ング**

### 4. 開発老E��けドキュメンチE
- **アーキチE��チャ概要E*
- **コーチE��ング規紁E*
- **コントリビューションガイチE*
- **チE�Eロイメント手頁E*

## 特徴

### 自動生成機�E
- **コメント解极E*からの自動生戁E
- **型定義**からの仕様抽出
- **チE��トケース**からの使用例生戁E

### 多形式対忁E
- **Markdown**
- **HTML**
- **PDF**
- **OpenAPI/Swagger**
- **JSDoc/TypeDoc**

## 出力構造

```
docs/
├── api/
━E  ├── endpoints.md
━E  └── authentication.md
├── user-guide/
━E  ├── getting-started.md
━E  └── tutorials.md
├── developer/
━E  ├── architecture.md
━E  └── contributing.md
└── technical/
    └── specifications.md
```
