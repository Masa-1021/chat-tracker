---
applyTo: "**/*.tsx"
---

# React/TSX コーディングルール

## コンポーネント設計

- 関数コンポーネントのみ使用（クラスコンポーネント禁止）
- Props には必ず型定義（`interface` または `type`）
- `children` を受け取る場合は `React.PropsWithChildren<T>` または明示的に定義
- コンポーネント名はPascalCase

```typescript
// ✅ 推奨パターン
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant, onClick, children }: ButtonProps) => {
  return (
    <button className={variant} onClick={onClick}>
      {children}
    </button>
  );
};
```

## Hooks ルール

- カスタムフックは `use` プレフィックスで開始
- `useEffect` の依存配列は正確に指定
- `useMemo` / `useCallback` は計測に基づいて使用（過度な最適化を避ける）

## アクセシビリティ（必須）

- インタラクティブ要素には適切なARIA属性
- `<img>` には必ず `alt` 属性
- フォーム要素には `<label>` を紐付け
- キーボード操作可能であること（`tabIndex`, `onKeyDown`）
- フォーカス管理を適切に行う
- 色だけに依存しない情報伝達

## イベントハンドラ

- `onClick` 等のハンドラは `handle` プレフィックス
- イベント型は `React.MouseEvent<HTMLButtonElement>` 等を使用

## 状態管理

- ローカル状態は `useState` / `useReducer`
- 複雑なフォームは React Hook Form を検討
- サーバー状態は TanStack Query を検討

## パフォーマンス

- リスト要素には一意の `key` を指定（indexは避ける）
- 大きなリストは仮想化（react-window等）を検討
- Code Splitting は `React.lazy` + `Suspense`
