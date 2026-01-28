# Serendie デザイントークン

## カラーパレット（10色族 × 10段階）

| 色族 | 最淡 | 最濃 |
|------|------|------|
| Gray | #F0F0F0 | #232322 |
| Blue | #EFF2FC | #081E3F |
| SkyBlue | #D9F6FC | #04272A |
| Green | #DBF5EA | #0D271E |
| Purple | #F4ECF6 | #32183A |
| Pink | #FFF4F8 | #3E0F24 |
| Red | #FCEBEA | #400109 |
| Chestnut | #FAECE6 | #371B0B |
| Beige | #FDF5EC | #2B2013 |
| Yellow | #FAF4E3 | #292200 |

追加: White (#FFFFFF), Black (#000000)

## テーマ（5種類）

日本の伝統色ベース:

| テーマID | 名前 | 基調色 | 説明 |
|---------|------|--------|------|
| konjo | 紺青 | 深い青 | デフォルト |
| asagi | 浅葱 | 薄い青 | 爽やかな雰囲気 |
| sumire | 菫 | 紫 | 落ち着いた印象 |
| kurikawa | 栗皮 | 茶 | 温かみのある色調 |
| tsutsuji | 躑躅 | ピンク | エネルギッシュ |

## タイポグラフィ

### フォント（商用利用可能）
- Roboto（英語）
- Noto Sans JP（日本語）
- Noto Sans Mono（等幅）

### フォントサイズ
10px, 11px, 12px, 13px, 14px, 16px, 18px, 20px, 24px, 28px, 32px, 40px, 48px, 56px, 64px

### フォントウェイト
- Regular: 400
- Bold: 700

### 行高
- Normal: 160%
- Relaxed: 180%
- Tight: 140%
- None: 100%

### タイポグラフィロール
| ロール | サイズ | 用途 |
|--------|--------|------|
| Display | 2種 | 大規模インパクト見出し |
| Headline | 3種 | ページ主見出し |
| Title | 4種 | 副見出し（太字デフォルト） |
| Body | 4種 | 本文（mediumが基準） |
| Label | 4種 | コンポーネントテキスト |

## スペーシング（13段階）

| トークン名 | 値 |
|-----------|-----|
| twoExtraSmall | 2px |
| extraSmall | 4px |
| small | 8px |
| medium | 12px |
| large | 16px |
| extraLarge | 24px |
| twoExtraLarge | 32px |
| threeExtraLarge | 40px |
| fourExtraLarge | 48px |
| fiveExtraLarge | 64px |
| sixExtraLarge | 80px |

## ボーダー

### ボーダー幅
- medium: 1px（最一般的）
- thick: 2px
- extraThick: 3px

### ボーダーラジアス
- extraSmall: 4px
- small: 8px
- medium: 12px
- large: 16px
- extraLarge: 24px
- full: 9999px（ピル型）

## レスポンシブブレークポイント

- Compact/Expanded境界: **768px**
- アプローチ: モバイルファースト（min-width使用）

## エレベーション（5段階）

| レベル | 使用例 |
|--------|--------|
| Level 1 | ドロップダウンメニュー |
| Level 2 | カード |
| Level 3 | トースト通知 |
| Level 4 | ポップオーバー |
| Level 5 | モーダルダイアログ・ドロワー |

## 主なCSS変数

### サーフェス
```css
--sds-color-surface-default
--sds-color-surface-variant
--sds-color-surface-container
--sds-color-on-surface-default
--sds-color-on-surface-variant
```

### プライマリ
```css
--sds-color-primary-default
--sds-color-primary-container
--sds-color-on-primary-container
```

### インタラクション
```css
--sds-color-interaction-hovered
--sds-color-interaction-hoveredVariant
--sds-color-interaction-disabled
--sds-color-interaction-disabledOnSurface
```

### アウトライン
```css
--sds-color-outline-default
--sds-color-component-outlineDim
```

### インプレッション（テーマカラー）
```css
--sds-color-impression-primary
--sds-color-impression-primaryContainer
--sds-color-impression-onPrimaryContainer
```
