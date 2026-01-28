# Serendie Symbols（アイコン一覧）

## 使用方法

```tsx
import { SerendieSymbolHome, SerendieSymbolHomeFilled } from '@serendie/symbols'

<SerendieSymbolHome style={{ width: 24, height: 24 }} />
```

命名規則: `SerendieSymbol` + PascalCase + (オプション)`Filled`

## 利用可能アイコン（300+）

すべてのアイコンに outlined（デフォルト）と filled バリエーションがある。

### A-C
- activity
- airplay
- alert-circle
- alert-octagon
- alert-triangle
- align-center
- align-justify
- align-left
- align-right
- anchor
- apps-circle
- apps-square
- archive
- arrow-down-circle
- arrow-down-left
- arrow-down-right
- arrow-down
- arrow-left-circle
- arrow-left
- arrow-right-circle
- arrow-right
- arrow-turn-down
- arrow-turn-left
- arrow-turn-right
- arrow-turn-up
- arrow-up-circle
- arrow-up-left
- arrow-up-right
- arrow-up
- article
- at-symbol
- attachment
- award
- battery-charging
- battery
- bed
- bell-off
- bell
- bicycle
- bike
- bluetooth
- bold
- book-open
- book
- bookmark
- briefcase
- bug
- bus
- calendar
- camera-off
- camera
- car
- cast
- chat-circle
- chat-rectangle
- check-circle
- check-shield
- check-square
- check
- chevron-double-down
- chevron-double-left
- chevron-double-right
- chevron-double-up
- chevron-down
- chevron-left-right
- chevron-left
- chevron-right
- chevron-up-down
- chevron-up
- circle
- clipboard
- clock
- close-circle
- close-octagon
- close-square
- close
- cloud-off
- cloud
- coffee
- collapse-diagonal-alt
- collapse-diagonal
- collapse-horizontal
- collapse-left
- collapse-right
- collapse-vertical
- command
- compass
- compose
- contract-left-right
- contract-up-down
- copy
- corner-down-left
- corner-down-right
- corner-left-down
- corner-left-up
- corner-right-down
- corner-right-up
- corner-up-left
- corner-up-right
- cpu
- credit-card
- crop
- cube
- cursor
- cycling

### D-H
- data
- delete
- disc
- divide
- dollar-sign
- download-cloud
- download
- drag-move
- edit
- eject
- expand-diagonal-alt
- expand-diagonal-linked-alt
- expand-diagonal-linked
- expand-diagonal
- expand-horizontal-linked
- expand-horizontal
- expand-left
- expand-right
- expand-vertical-linked
- expand-vertical
- external-link
- eye-hidden
- eye
- file-add
- file-download
- file-text
- file-upload
- file
- film
- filter
- flag
- folder-add
- folder
- forward-10
- forward-15
- forward-5
- forward-end
- forward
- frown
- funnel
- gear
- gift
- globe
- group
- hard-drive
- hash
- headphone
- heart
- hexagon
- history
- home

### I-M
- image
- inbox
- information
- italic
- key
- laptop
- layer
- layout-alt
- layout-bottom
- layout-column
- layout-grid-alt
- layout-grid
- layout-left
- layout-right
- layout-row
- layout-sidebar-alt
- layout-sidebar
- layout-top
- layout
- life-buoy
- lightning
- link
- list-bullet
- list-dash
- list-number
- loader
- lock-unlocked
- lock
- login
- logout
- magnifying-glass
- mail
- map
- maximize
- media
- menu
- mic-muted
- mic
- minimize
- minus-square
- minus
- monitor
- moon
- more-horizontal
- more-vertical
- music-alt
- music

### N-R
- navigation
- octagon
- package
- pause-circle
- pause
- pen
- pencil
- percent
- phone-off
- phone
- pie-chart
- pin
- placeholder
- plane
- play-circle
- play
- plus-square
- plus
- printer
- question
- radio
- record-circle
- refresh
- repeat
- rewind-10
- rewind-15
- rewind-5
- rewind-start
- rewind
- rss
- run

### S
- sailboat
- save
- seal
- send
- server
- share-alt
- share
- shield-off
- shield
- ship
- shopping-bag
- shopping-cart
- shuffle
- skip-back
- skip-down
- skip-forward
- skip-left
- skip-right
- skip-up
- slash
- slider-horizontal
- slider-vertical
- smartphone
- smile
- speaker
- square
- star
- sticky-note
- stop-circle
- stop
- sun

### T-Z
- tablet
- tag
- target
- taxi
- terminal
- thumb-down
- thumb-up
- tool
- train
- trash
- trending-down
- trending-up
- triangle
- truck
- tv
- type
- umbrella
- underline
- upload-cloud
- user-check
- user-circle
- user-minus
- user-plus
- user-x
- user
- users
- verified-badge
- video-off
- video
- voicemail
- volume-high
- volume-low
- volume-muted
- volume-none
- walk
- watch
- wifi-off
- wifi
- zoom-in
- zoom-out

## よく使うアイコン

| 用途 | アイコン名 |
|------|-----------|
| ホーム | home |
| 設定 | gear |
| ユーザー | user, user-circle |
| 検索 | magnifying-glass |
| メニュー | menu |
| 閉じる | close |
| チェック | check, check-circle |
| 編集 | edit, pencil |
| 削除 | trash, delete |
| 追加 | plus, plus-square |
| お気に入り | star, heart |
| 通知 | bell |
| メール | mail |
| カレンダー | calendar |
| ダウンロード | download |
| アップロード | upload-cloud |
| 共有 | share |
| コピー | copy |
| 矢印 | arrow-up/down/left/right |
| 太陽/月 | sun, moon |

## 使用例

```tsx
import {
  SerendieSymbolHome,
  SerendieSymbolHomeFilled,
  SerendieSymbolGear,
  SerendieSymbolGearFilled,
  SerendieSymbolUser,
  SerendieSymbolStar,
  SerendieSymbolStarFilled,
  SerendieSymbolBell,
  SerendieSymbolCheck,
  SerendieSymbolCheckCircleFilled,
} from '@serendie/symbols'

// サイズ指定
<SerendieSymbolHome style={{ width: 24, height: 24 }} />

// カラー指定
<SerendieSymbolStar style={{ width: 24, height: 24, color: 'gold' }} />

// ボタン内アイコン
<Button styleType="filled" leftIcon={<SerendieSymbolHome style={{ width: 20, height: 20 }} />}>
  Home
</Button>
```
