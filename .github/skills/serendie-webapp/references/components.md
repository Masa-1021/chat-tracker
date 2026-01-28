# Serendie コンポーネントAPI

## Button

```tsx
import { Button } from '@serendie/ui'

<Button
  styleType="filled"  // filled | outlined | ghost | rectangle
  size="medium"       // small | medium (largeは存在しない)
  leftIcon={<Icon />} // 左アイコン（rightIconと排他）
  rightIcon={<Icon />} // 右アイコン
  isLoading={false}   // ローディング状態
  disabled={false}
>
  Label
</Button>
```

## Badge

```tsx
import { Badge } from '@serendie/ui'

<Badge size="small">Label</Badge>  // small | medium | large
```

## Switch

```tsx
import { Switch } from '@serendie/ui'

<Switch
  label="ラベル"           // 必須
  helperText="説明"        // オプション
  checked={value}
  onCheckedChange={(e) => setValue(e.checked)}
/>
```

## TextField

```tsx
import { TextField } from '@serendie/ui'

<TextField
  label="ラベル"
  placeholder="プレースホルダー"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  fullwidth         // 親要素の幅いっぱいに広がる (v2.2.5+)
  invalid={false}   // エラー状態
  invalidMessage="エラーメッセージ"
/>
```

## TextArea

```tsx
import { TextArea } from '@serendie/ui'

<TextArea
  label="ラベル"
  placeholder="プレースホルダー"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={4}
  fullwidth         // 親要素の幅いっぱいに広がる (v2.2.5+)
  invalid={false}   // エラー状態
  invalidMessage="エラーメッセージ"
/>
```

## Tabs / TabItem

```tsx
import { Tabs, TabItem } from '@serendie/ui'

<Tabs value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
  <TabItem title="Tab 1" value="tab1" />
  <TabItem title="Tab 2" value="tab2" badge={3} />  // バッジ付き
  <TabItem title="Tab 3" value="tab3" dot />        // ドット付き
  <TabItem title="Tab 4" value="tab4" disabled />
</Tabs>

{/* タブコンテンツは手動で切り替え */}
{activeTab === 'tab1' && <div>Content 1</div>}
```

## Accordion / AccordionGroup

```tsx
import { Accordion, AccordionGroup } from '@serendie/ui'

<AccordionGroup>
  <Accordion
    value="item1"
    title="タイトル"
    description="説明コンテンツ"
  />
  <Accordion
    value="item2"
    title="タイトル2"
    description="説明コンテンツ2"
    isLeftIcon  // アイコンを左に配置
  />
</AccordionGroup>
```

## Divider

```tsx
import { Divider } from '@serendie/ui'

<Divider />
```

## アイコン

```tsx
import {
  SerendieSymbolHome,
  SerendieSymbolHomeFilled,
  SerendieSymbolGear,
  SerendieSymbolGearFilled,
  SerendieSymbolStar,
  SerendieSymbolStarFilled,
  // ... 300以上のアイコン
} from '@serendie/symbols'

<SerendieSymbolHome style={{ width: 24, height: 24 }} />
```

命名規則: `SerendieSymbol` + PascalCase + (オプション)`Filled`

利用可能アイコン一覧: https://serendie.design/foundations/icon-list

## CheckBox

```tsx
import { CheckBox } from '@serendie/ui'

<CheckBox
  label="同意する"           // 必須: 空文字禁止、スクリーンリーダーで読み上げられる
  checked={value}
  onCheckedChange={(e) => setValue(e.checked)}
  disabled={false}
/>
```

**アクセシビリティ要件（WCAG 2.2）:**
- `label` は**必須**。空文字列 `""` は禁止（スクリーンリーダーが読み上げない）
- ラベルを視覚的に非表示にしたい場合も、意味のあるラベルテキストを設定すること
- グループ化する場合は `fieldset` と `legend` を使用

**アンチパターン:**
```tsx
// NG: labelが空文字
<CheckBox label="" checked={value} onCheckedChange={...} />

// OK: 意味のあるラベル
<CheckBox label={todo.text} checked={value} onCheckedChange={...} />
```

## IconButton

```tsx
import { IconButton } from '@serendie/ui'
import { SerendieSymbolTrash } from '@serendie/symbols'

<IconButton
  icon={<SerendieSymbolTrash style={{ width: 20, height: 20 }} />}
  aria-label="削除"         // 必須: アクセシビリティ用ラベル
  onClick={handleClick}
  shape="circle"            // circle | rectangle（必須）
  styleType="ghost"         // filled | outlined | ghost
  size="small"              // small | medium（circleの場合はlargeも可）
/>
```

**注意:** `label`プロパティは存在しません。標準の`aria-label`属性を使用してください。

**shapeによるサイズ制約:**
- `shape="circle"`: small | medium | large
- `shape="rectangle"`: small | medium のみ（largeは不可）

**アクセシビリティ要件（WCAG 2.2）:**
- `aria-label` は**必須**。アイコンのみのボタンには必ず意味のあるラベルを設定
- 破壊的アクション（削除等）の場合は確認ダイアログを併用すること

## TopAppBar

```tsx
import { TopAppBar } from '@serendie/ui'
import { IconButton } from '@serendie/ui'
import { SerendieSymbolMenu, SerendieSymbolSearch, SerendieSymbolNotification } from '@serendie/symbols'

// Navbar タイプ（ナビゲーションバー）
<TopAppBar
  type="navbar"
  title="アプリ名"                    // オプション
  headingIconButton={               // 左側アイコン（メニューなど）
    <IconButton
      icon={<SerendieSymbolMenu style={{ width: 24, height: 24 }} />}
      aria-label="メニューを開く"
      shape="circle"
      styleType="ghost"
    />
  }
  trailingIconButtons={             // 右側アイコン（複数可）
    <>
      <IconButton
        icon={<SerendieSymbolSearch style={{ width: 24, height: 24 }} />}
        aria-label="検索"
        shape="circle"
        styleType="ghost"
      />
      <IconButton
        icon={<SerendieSymbolNotification style={{ width: 24, height: 24 }} />}
        aria-label="通知"
        shape="circle"
        styleType="ghost"
      />
    </>
  }
  badge={3}                         // 通知バッジ数
/>

// TitleBar タイプ（タイトルバー）
<TopAppBar
  type="titleBar"
  title="ページタイトル"              // 必須
  headingIconButton={...}
/>
```

**内部実装:** `<nav>`要素として実装されている

**必須スタイル（スクロール時の重なり防止）:**
```css
/* TopAppBarを含むheaderには必ず背景色を設定 */
header {
  background-color: var(--sds-color-surface-default);
}

/* position: sticky/fixedの場合は特に重要 */
header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--sds-color-surface-default); /* 必須 */
}
```

**レスポンシブ対応:**
```tsx
// デスクトップのみ表示
<header className="hidden md:block" style={{ backgroundColor: 'var(--sds-color-surface-default)' }}>
  <TopAppBar type="navbar" title="アプリ名" />
</header>
```

## BottomNavigation / BottomNavigationItem

```tsx
import { BottomNavigation, BottomNavigationItem } from '@serendie/ui'
import { SerendieSymbolHome, SerendieSymbolSearch, SerendieSymbolPerson } from '@serendie/symbols'

<BottomNavigation>
  <BottomNavigationItem
    icon={<SerendieSymbolHome style={{ width: 24, height: 24 }} />}
    label="ホーム"
    selected={currentTab === 'home'}
    onClick={() => setCurrentTab('home')}
  />
  <BottomNavigationItem
    icon={<SerendieSymbolSearch style={{ width: 24, height: 24 }} />}
    label="検索"
    selected={currentTab === 'search'}
    onClick={() => setCurrentTab('search')}
  />
  <BottomNavigationItem
    icon={<SerendieSymbolPerson style={{ width: 24, height: 24 }} />}
    label="マイページ"
    selected={currentTab === 'profile'}
    onClick={() => setCurrentTab('profile')}
  />
</BottomNavigation>
```

**内部実装:** `<nav>`要素として実装されている

**必須スタイル:**
```css
/* BottomNavigationは通常fixed配置で使用 */
/* 必ず背景色を設定すること */
.bottom-nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--sds-color-surface-default); /* 必須 */
  /* iOS safe area対応 */
  padding-bottom: env(safe-area-inset-bottom);
}
```

**レスポンシブ対応:**
```tsx
// モバイルのみ表示
<div className="md:hidden bottom-nav-container">
  <BottomNavigation>
    {/* ... */}
  </BottomNavigation>
</div>
```

**TopAppBar + BottomNavigation の組み合わせ（推奨パターン）:**
```tsx
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* スキップリンク */}
      <a href="#main-content" className="skip-link">
        メインコンテンツへスキップ
      </a>

      {/* デスクトップ用ヘッダー */}
      <header className="hidden md:block" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--sds-color-surface-default)'
      }}>
        <TopAppBar type="navbar" title="アプリ名" />
      </header>

      {/* モバイル用ヘッダー（タイトルのみ） */}
      <header className="md:hidden" style={{
        backgroundColor: 'var(--sds-color-surface-default)'
      }}>
        <TopAppBar type="titleBar" title="アプリ名" />
      </header>

      {/* メインコンテンツ */}
      <main id="main-content" style={{ paddingBottom: '80px' }}>
        {children}
      </main>

      {/* モバイル用下部ナビ */}
      <div className="md:hidden" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--sds-color-surface-default)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <BottomNavigation>
          {/* ナビゲーションアイテム */}
        </BottomNavigation>
      </div>
    </>
  )
}
```

## Avatar

```tsx
import { Avatar } from '@serendie/ui'

// 画像アバター
<Avatar src="/path/to/image.jpg" size="medium" />

// テキストアバター（イニシャル）
<Avatar text="田中" size="medium" />

// プレースホルダー
<Avatar placeholder="filled" size="medium" />  // filled | outlined
```

**サイズ:** `small` | `medium` | `large`

## Banner

**用途:** エラーや警告など重要なメッセージを目立つように表示

```tsx
import { Banner } from '@serendie/ui'

<Banner
  type="error"           // information | error | warning
  title="エラーが発生しました"
  description="入力内容を確認してください"
/>
```

**使い分け:**
| type | 用途 |
|------|------|
| `information` | 一般的な情報通知 |
| `error` | エラー通知（赤系） |
| `warning` | 警告通知（黄系） |

**注意:** 同じ種類のBannerを1画面に複数表示しない

## Toast

**用途:** アクション結果を一時的に通知（自動で消える）

```tsx
import { Toaster, createToaster } from '@serendie/ui'

// 1. Toasterインスタンスを作成
const toaster = createToaster({
  placement: 'top-end',  // 表示位置
  duration: 3000,        // 表示時間（ms）
})

// 2. コンポーネントを配置
<Toaster toaster={toaster} />

// 3. トーストを表示
toaster.create({
  title: '保存しました',
  type: 'success',       // success | error | (default)
  duration: 1500,
})
```

**使い分け:**
| type | 用途 |
|------|------|
| (default) | 一般的な情報 |
| `success` | 成功通知（緑系） |
| `error` | エラー通知（赤系） |

## ModalDialog

**用途:** ユーザーの操作を一時停止し、確認や入力を求める

```tsx
import { ModalDialog } from '@serendie/ui'

<ModalDialog
  isOpen={isOpen}
  onOpenChange={(e) => setIsOpen(e.open)}
  title="確認"
  submitButtonLabel="削除する"
  cancelButtonLabel="キャンセル"
  onSubmit={() => handleDelete()}
  // v2.4.0+ submitボタンのProps拡張
  submitButtonProps={{
    styleType: "filled",  // ボタンスタイル
    disabled: isLoading,  // 無効化
  }}
  portalled           // Portal使用 (Modal内Dropdown問題の解決, v2.4.0+)
>
  <p>本当に削除しますか？この操作は取り消せません。</p>
</ModalDialog>
```

**必須要件:**
- 閉じるボタンを必ず配置
- 背景クリックで閉じる機能

**破壊的アクション（削除など）の場合:**
```tsx
<ModalDialog
  title="削除の確認"
  submitButtonLabel="削除する"
  cancelButtonLabel="キャンセル"
  submitButtonProps={{
    styleType: "filled",
    // 危険なアクションであることを視覚的に表現
  }}
>
  <p>この操作は取り消せません。</p>
</ModalDialog>
```

**Modal内でDropdownが背面に隠れる問題 (v2.4.0で修正):**
```tsx
// portalled プロパティを使用
<ModalDialog portalled>
  <DropdownMenu>
    {/* Menuが正しくModalの前面に表示される */}
  </DropdownMenu>
</ModalDialog>
```

## Drawer

**用途:** モバイル・タブレットでメニューやナビゲーションを格納

```tsx
import { Drawer } from '@serendie/ui'

<Drawer
  isOpen={isOpen}
  onOpenChange={(e) => setIsOpen(e.open)}
  placement="left"       // left | right | full
>
  <List>
    <ListItem title="ホーム" onClick={() => navigate('/')} />
    <ListItem title="設定" onClick={() => navigate('/settings')} />
  </List>
</Drawer>
```

**placement:**
| 値 | 説明 |
|------|------|
| `left` | 左からスライド |
| `right` | 右からスライド |
| `full` | 全画面（デスクトップでは非推奨） |

## DropdownMenu

**用途:** 複数のアクションを格納（クリックでイベント発火）

```tsx
import { DropdownMenu } from '@serendie/ui'
import { SerendieSymbolEdit, SerendieSymbolTrash } from '@serendie/symbols'

<DropdownMenu
  title="操作"
  items={[
    { label: '編集', value: 'edit', icon: <SerendieSymbolEdit /> },
    { label: '削除', value: 'delete', icon: <SerendieSymbolTrash /> },
  ]}
  onSelect={(value) => handleAction(value)}
/>

// アイコンボタン版
<DropdownMenu
  styleType="iconButton"
  items={[...]}
  onSelect={(value) => handleAction(value)}
/>
```

**注意:** 選択肢から1つ選ぶ場合は `Select` を使用

## List / ListItem

**用途:** 関連する項目を縦に並べてメニューやリストを構成

```tsx
import { List, ListItem } from '@serendie/ui'
import { SerendieSymbolPerson, SerendieSymbolChevronRight } from '@serendie/symbols'

<List>
  <ListItem
    title="プロフィール"
    description="名前やメールアドレスを変更"
    leftIcon={<SerendieSymbolPerson />}
    rightIcon={<SerendieSymbolChevronRight />}
    onClick={() => navigate('/profile')}
  />
  <ListItem
    title="通知設定"
    badge={3}              // 通知バッジ
    selected={true}        // 選択状態
    disabled={false}
  />
</List>
```

**状態:** `enabled` | `focused` | `disabled` | `selected`

## Select

**用途:** 複数の選択肢から1つを選択

```tsx
import { Select } from '@serendie/ui'

<Select
  label="都道府県"
  placeholder="選択してください"
  size="medium"          // small | medium
  items={[
    { label: '東京都', value: 'tokyo' },
    { label: '大阪府', value: 'osaka' },
    { label: '愛知県', value: 'aichi' },
  ]}
  value={selected}
  onValueChange={(e) => setSelected(e.value)}
  invalid={hasError}
  invalidMessage="選択してください"
/>
```

**注意:** アクションを実行する場合は `DropdownMenu` を使用

## Search

**用途:** 検索入力（候補サジェスト機能付き）

```tsx
import { Search } from '@serendie/ui'

<Search
  size="medium"          // small | medium
  items={['React', 'Vue', 'Angular', 'Svelte']}  // サジェスト候補
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  disabled={false}
/>
```

## RadioButton / RadioGroup

**用途:** 複数の選択肢から1つを排他的に選択

```tsx
import { RadioButton, RadioGroup } from '@serendie/ui'

<RadioGroup value={selected} onValueChange={(e) => setSelected(e.value)}>
  <RadioButton label="オプション1" value="option1" />
  <RadioButton label="オプション2" value="option2" helperText="補足説明" />
  <RadioButton label="オプション3" value="option3" disabled />
</RadioGroup>
```

## Pagination

**用途:** 複数ページのコンテンツをナビゲート

```tsx
import { Pagination } from '@serendie/ui'

<Pagination
  count={10}             // 総ページ数
  page={currentPage}
  onPageChange={(page) => setCurrentPage(page)}
  siblingCount={2}       // 現在ページの前後に表示するページ数
/>
```

## ProgressIndicator

**用途:** 処理中・読み込み中を視覚的に表示

```tsx
import { ProgressIndicator } from '@serendie/ui'

// 不定（処理時間不明）- スピナー
<ProgressIndicator type="circular" size="medium" />

// 不定 - 線形
<ProgressIndicator type="linear" size="medium" />

// 確定（進捗表示）
<ProgressIndicator
  type="circular"
  size="medium"
  value={progress}       // 0-100
  max={100}
/>
```

**type:** `circular`（円形） | `linear`（線形）
**size:** `small` | `medium` | `large`

**使い分け:**
- 処理時間不明 → 不定（value指定なし）
- 処理時間既知 → 確定（value指定あり）

## NotificationBadge

**用途:** 未読通知や新着情報をアラート

```tsx
import { NotificationBadge } from '@serendie/ui'

// 数字付き
<NotificationBadge count={5} size="medium" variant="primary" />

// 100以上は "99+" と表示される
<NotificationBadge count={150} />

// 数字なし（ドットのみ）
<NotificationBadge size="small" variant="secondary" />
```

**size:** `small` | `medium`
**variant:** `primary` | `secondary`（テーマカラー）

## DatePicker

**用途:** カレンダー形式で日付を選択

```tsx
import { DatePicker, parseDate } from '@serendie/ui'

// 単一日付
<DatePicker
  label="開始日"
  placeholder="日付を選択"
  value={date}
  onValueChange={(e) => setDate(e.value)}
  invalid={hasError}
  invalidMessage="日付を選択してください"
/>

// 範囲選択
<DatePicker
  selectionMode="range"
  label="期間"
  value={dateRange}
  onValueChange={(e) => setDateRange(e.value)}
/>

// カレンダーのみ（入力フィールドなし）
<DatePicker isCalendarOnly />
```

## DataTable

**用途:** 構造化データを表形式で表示（ソート・選択機能付き）

```tsx
import { DataTable } from '@serendie/ui'

type User = { id: number; name: string; email: string }

const columnHelper = DataTable.createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: '名前',
    enableSorting: true,
  }),
  columnHelper.accessor('email', {
    header: 'メールアドレス',
    enableSorting: true,
  }),
]

<DataTable
  data={users}
  columns={columns}
  enableRowSelection={true}
  onRowSelectionChange={(selection) => setSelected(selection)}
  onSortingChange={(sorting) => setSorting(sorting)}
/>
```

## Tooltip

**用途:** ホバー/フォーカス時に補足情報を表示

```tsx
import { Tooltip } from '@serendie/ui'

<Tooltip content="この操作は取り消せません">
  <Button>削除</Button>
</Tooltip>

// 表示位置指定
<Tooltip content="説明" placement="top">  // top | bottom | left | right など8方向
  <IconButton ... />
</Tooltip>

// 無効化
<Tooltip content="説明" disabled={true}>
  <Button>操作</Button>
</Tooltip>
```

## Chart

**用途:** データビジュアライゼーション（Nivoライブラリベース）

```tsx
import { usePieChartProps, useLineChartProps, useBarChartProps } from '@serendie/ui'
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

// 円グラフ
const pieProps = usePieChartProps({ data: pieData })
<ResponsivePie {...pieProps} />

// 折れ線グラフ
const lineProps = useLineChartProps({ data: lineData })
<ResponsiveLine {...lineProps} />

// 棒グラフ（縦/横/積み上げ）
const barProps = useBarChartProps({ data: barData })
<ResponsiveBar {...barProps} />
```

**依存パッケージ:** `@nivo/pie`, `@nivo/line`, `@nivo/bar`

## DashboardWidget

**用途:** ダッシュボード画面でデータをサマライズ表示

```tsx
import { DashboardWidget } from '@serendie/ui'

// 単一値
<DashboardWidget
  values={[
    { label: '売上', value: '1,234,567', unit: '円' }
  ]}
/>

// 複数値
<DashboardWidget
  values={[
    { label: '売上', value: '1,234,567', unit: '円' },
    { label: '前月比', value: '+12.3', unit: '%' }
  ]}
/>

// プレースホルダー（チャート用）
<DashboardWidget>
  <Chart ... />
</DashboardWidget>
```

## ChoiceBox

**用途:** ラベルなしのCheckBox/RadioButton（カードやリストと組み合わせ）

```tsx
import { ChoiceBox, RadioGroup } from '@serendie/ui'

// チェックボックス型
<ChoiceBox
  type="checkbox"
  checked={checked}
  onCheckedChange={(e) => setChecked(e.checked)}
  indeterminate={isPartial}  // 部分選択状態
/>

// ラジオボタン型（RadioGroupで囲む）
<RadioGroup value={selected} onValueChange={(e) => setSelected(e.value)}>
  <ChoiceBox type="radio" value="option1" />
  <ChoiceBox type="radio" value="option2" />
</RadioGroup>
```

**注意:** 単体での使用は非推奨。カードやリストと組み合わせて使用

## TextField（バリデーション詳細）

```tsx
import { TextField } from '@serendie/ui'

<TextField
  label="メールアドレス"
  placeholder="example@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required                 // 必須マーク表示
  invalid={hasError}       // エラー状態
  invalidMessage="有効なメールアドレスを入力してください"
  description="お知らせの送信に使用します"  // ヘルパーテキスト
  disabled={false}
/>
```

**状態:** `enabled` | `filled` | `error` | `focus` | `disabled`

## PasswordField

```tsx
import { PasswordField } from '@serendie/ui'

<PasswordField
  label="パスワード"
  placeholder="8文字以上"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  invalid={hasError}
  invalidMessage="8文字以上で入力してください"
/>
```

パスワードの表示/非表示切り替えボタン付き

---

## コンポーネント一覧（全35種）

| カテゴリ | コンポーネント |
|---------|--------------|
| **ボタン** | Button, IconButton |
| **入力** | TextField, TextArea, PasswordField, Search, Select, DatePicker, CheckBox, RadioButton, Switch, ChoiceBox |
| **表示** | Badge, NotificationBadge, Avatar, Tooltip, ProgressIndicator |
| **フィードバック** | Toast, Banner, ModalDialog |
| **ナビゲーション** | TopAppBar, BottomNavigation, Tabs, Pagination, Drawer, DropdownMenu |
| **レイアウト** | Accordion, Divider, List |
| **データ** | DataTable, Chart, DashboardWidget |

詳細・インタラクティブデモ: https://storybook.serendie.design
