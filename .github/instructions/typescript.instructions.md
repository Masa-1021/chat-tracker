---
applyTo: "**/*.ts"
---

# TypeScript コーディングルール

## 型安全性

- `any` 型は使用禁止
- `unknown` 型は使用禁止（型ガードで絞り込む場合のみ許可）
- `as` によるtype assertionは避け、type guardまたはsatisfiesを使用
- 関数の戻り値型は明示する
- `strictNullChecks` を前提としたコードを書く

## 禁止パターン

```typescript
// ❌ 禁止
const data: any = fetchData();
const result = value as SomeType;
export default function() {}

// ✅ 推奨
const data: FetchResponse = fetchData();
const isString = (value: unknown): value is string => typeof value === 'string';
export const myFunction = () => {};
```

## クラスの使用制限

- `class` は以下の場合のみ使用可
  - `instanceof` チェックが必要なカスタムエラー
  - 外部ライブラリがクラスを要求する場合
- それ以外は関数とオブジェクトリテラルを使用

## コード品質

- ハードコーディングを避け、定数または環境変数を使用
- マジックナンバーは禁止（名前付き定数を使用）
- `const` を優先、`let` は必要な場合のみ、`var` は禁止
- nullish coalescing (`??`) と optional chaining (`?.`) を活用
- barrel exports (`index.ts`) は循環参照に注意して使用

## モジュール

- ESM (`import`/`export`) を使用
- `export default` より named export を優先
- 型のみのインポートは `import type` を使用

## エラーハンドリング

- `try-catch` では具体的なエラー型を扱う
- Result型パターン（`{ success: true, data } | { success: false, error }`）を検討
