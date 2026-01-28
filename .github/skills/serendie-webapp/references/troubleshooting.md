# トラブルシューティング

## ボタンのパディングがない / レイアウトが崩れる

**症状**: ボタンの文字が詰まっている、コンポーネントのレイアウトが崩れている

**原因**: グローバルCSSリセットがSerendieのスタイルを上書きしている

**問題のあるコード**:
```css
* {
  margin: 0;
  padding: 0;  /* これがSerendieのスタイルを破壊 */
}
```

**解決策**: グローバルリセットを削除し、必要最小限のリセットのみ使用

```css
@layer reset, base, tokens, recipes, utilities;
@import "@serendie/ui/styles.css";

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
  }
}
```

## テーマカラーが適用されない

**症状**: コンポーネントがデフォルトカラーで表示される

**原因**: `data-panda-theme`属性がない

**解決策**: `index.html`の`<html>`タグにテーマ属性を追加

```html
<html lang="ja" data-panda-theme="konjo">
```

## CSS変数が機能しない

**症状**: `var(--sds-color-*)` が解決されない

**原因**: Serendieのスタイルシートがインポートされていない

**解決策**: `index.css`の先頭に追加

```css
@layer reset, base, tokens, recipes, utilities;
@import "@serendie/ui/styles.css";
```

## Switchコンポーネントがエラーになる

**症状**: `Property 'label' is missing`エラー

**原因**: `label`プロパティが必須

**解決策**:
```tsx
// NG
<Switch checked={value} onChange={...} />

// OK
<Switch label="ダークモード" checked={value} onCheckedChange={(e) => setValue(e.checked)} />
```

## Buttonの`variant`プロパティが無効

**症状**: `Property 'variant' does not exist`エラー

**原因**: Serendie UIでは`variant`ではなく`styleType`を使用

**解決策**:
```tsx
// NG
<Button variant="filled">Click</Button>

// OK
<Button styleType="filled">Click</Button>
```

## Buttonの`size="large"`が無効

**症状**: `Type '"large"' is not assignable`エラー

**原因**: Serendie Buttonは`small`と`medium`のみサポート

**解決策**:
```tsx
// NG
<Button size="large">Click</Button>

// OK
<Button size="medium">Click</Button>
```

## Tabs.Root / Tabs.List が存在しない

**症状**: `Property 'Root' does not exist on type`エラー

**原因**: Serendieは`Tabs`と`TabItem`を別々にエクスポート

**解決策**:
```tsx
// NG (Ark UI形式)
<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content</Tabs.Content>
</Tabs.Root>

// OK (Serendie形式)
<Tabs value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
  <TabItem title="Tab 1" value="tab1" />
</Tabs>
{activeTab === 'tab1' && <div>Content</div>}
```

## Accordion.Root / Accordion.Item が存在しない

**症状**: `Property 'Root' does not exist on type`エラー

**原因**: Serendieは`AccordionGroup`と`Accordion`を使用

**解決策**:
```tsx
// NG
<Accordion.Root>
  <Accordion.Item value="item1">
    <Accordion.ItemTrigger>Title</Accordion.ItemTrigger>
    <Accordion.ItemContent>Content</Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>

// OK
<AccordionGroup>
  <Accordion value="item1" title="Title" description="Content" />
</AccordionGroup>
```

## アイコンが見つからない

**症状**: `has no exported member named 'SerendieSymbolXxx'`

**原因**: アイコン名が間違っている

**解決策**:
1. アイコン一覧を確認: https://serendie.design/foundations/icon-list
2. 命名規則: `SerendieSymbol` + PascalCase + (オプション)`Filled`
3. 例: `home` → `SerendieSymbolHome`, `SerendieSymbolHomeFilled`

## ビルドエラー: SerendieProviderが存在しない

**症状**: `Module has no exported member 'SerendieProvider'`

**原因**: SerendieProviderは@serendie/uiにエクスポートされていない

**解決策**: SerendieProviderは不要。テーマは`data-panda-theme`属性で設定

```tsx
// main.tsx - SerendieProviderは不要
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
