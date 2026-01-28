---
description: コードフォーマット�E整琁E�Elint修正
---

# Clean - コードクリーンアチE�E

## 概要E

プロジェクト�E体�Eコードを自動的にクリーンアチE�Eします。フォーマット、import整琁E��lintエラーの修正を行います、E

## 実行�E容

1. **コードフォーマッチE*
   - Prettier/ESLint での自動フォーマッチE
   - インチE��ト、改行、スペ�Eスの統一
   - 言語別フォーマッターの実衁E

2. **Import整琁E*
   - 未使用importの削除
   - import斁E�E並び替ぁE
   - 重複importの統吁E

3. **Lintエラー修正**
   - 自動修正可能なlintエラーを修正
   - コード品質ルールの適用
   - 不要なコメント�E空行�E削除

4. **ファイル整琁E*
   - 空ファイルの削除
   - 一時ファイルのクリーンアチE�E
   - 不要なログファイル削除

## 対応言語�EチE�Eル

- JavaScript/TypeScript (ESLint, Prettier)
- Python (Black, isort, flake8)
- Go (gofmt, goimports)
- Rust (rustfmt)
- CSS/SCSS (Prettier)

プロジェクト�E体を自動的にクリーンアチE�Eし、統一されたコードスタイルを適用します、E
