---
name: adr-manager
description: |
  アーキテクチャの決定事項(ADR)を管理するスキル。
  設計変更、技術選定、ライブラリ変更、アーキテクチャパターンの変更時に使用。
  design.mdへの大規模変更前に必ず起動すること。
---

# ADR Manager Skill

## 目的

設計上の重要な決定（技術選定、構造変更など）を `docs/adr/NNNN-title.md` 形式で記録し、AIと人間の認識を同期させる。

## 実行トリガー

1. ユーザーが「設計を変えたい」「新しい技術を使いたい」と言ったとき
2. `design.md` に大規模な修正を加えようとするとき
3. 技術スタックの変更や新しいライブラリの導入時
4. アーキテクチャパターンの変更時

## ワークフロー

### 1. 番号の特定

`docs/adr/` 内の最新の4桁番号を確認し、次を採番する。

```
docs/adr/
├── 0001-use-typescript.md
├── 0002-adopt-clean-architecture.md
└── 0003-switch-to-react-query.md  ← 最新
```

次のADRは `0004-xxx.md` となる。

### 2. ドラフト作成

以下のテンプレートでADRを作成する:

```markdown
# ADR-NNNN: タイトル

## Status

Proposed | Accepted | Deprecated | Superseded by [ADR-XXXX](./XXXX-title.md)

## Date

YYYY-MM-DD

## Context

なぜこの決定が必要なのか？
- 現在の課題や制約
- 検討した選択肢

## Decision

具体的に何をするのか？
- 採用する技術・パターン
- 実装方針

## Consequences

### メリット
- ...

### デメリット
- ...

### 影響範囲
- 変更が必要なファイル・モジュール

## References

- 関連ADR: [ADR-XXXX](./XXXX-title.md)
- 関連Issue: #123
- 参考資料: URL
```

### 3. レビュー

- ユーザーにドラフトを提示し、確認を求める
- フィードバックを反映
- 承認後、Statusを `Accepted` に変更

### 4. 関連ドキュメントの同期

ADRが `Accepted` になったら:

1. **design.md の更新** - 設計ドキュメントに決定事項を反映
2. **requirements.md の更新** - 必要に応じて要件を更新
3. **tasks.md への追加** - 実装タスクを追加
4. **CLAUDE.md の更新** - プロジェクトルールに影響がある場合

## ステータスの定義

| Status | 説明 |
|--------|------|
| Proposed | 提案中。レビュー待ち |
| Accepted | 承認済み。この決定に従う |
| Deprecated | 非推奨。もう使用しないが、置換はなし |
| Superseded | 置換済み。新しいADRに置き換えられた |

## 注意事項

- 過去のADRを覆す場合は、新しいADRを作成し、古い方のステータスを `Superseded by [ADR-XXXX]` に変更すること
- ADRは削除しない。履歴として残す
- 小さな変更（バグ修正、リファクタリング）にはADRは不要
- 判断に迷う場合は「この決定を半年後に見返したとき、理由を思い出せるか？」で判断

## 使用例

```
User: React QueryからTanStack Queryに移行したい