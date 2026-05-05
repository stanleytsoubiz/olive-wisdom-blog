# 知橄生活 Olive Wisdom｜設計規格書 v1.0

**版本：** 1.0  
**制定：** D1 視覺總監（CEO 審定）  
**日期：** 2026-05-04  
**狀態：** 生效中  
**對象：** T1 前端品質工程師（實作執行依據）

---

## 設計總綱：Kinfolk 地中海美學

**核心方向：** 讓 35+ 知性白領消費者感受到「有品味的知識感」——不是健康食品廣告，不是學術論文，是像 Kinfolk 雜誌一樣讓人想慢慢讀的溫暖美學。

**三個詞定義視覺：**
1. **溫暖**（Warm）— 米白底、大地色系，非冷白或純黑
2. **克制**（Restrained）— 留白大方，不堆積元素
3. **可信**（Trustworthy）— 排版嚴謹，標題serif有力，內文sans清晰

---

## 色彩系統

### 基礎色票

| Token | Hex | 用途 |
|-------|-----|------|
| `warm-white` | `#FAF8F4` | 頁面背景（主色） |
| `warm-cream` | `#F0EBE1` | 卡片底色、hover 狀態 |
| `warm-ink` | `#2C2416` | 主要文字色 |
| `warm-muted` | `#6B5E4E` | 次要文字、日期、作者 |
| `olive-500` | `#5C6B2E` | 品牌主色（標誌、CTA）|
| `olive-600` | `#3D4A1E` | 深色橄欖（hover 狀態）|
| `olive-100` | `#EFF2E4` | 輕底色（quote 背景、badge）|
| `terracotta-500` | `#A0522D` | 強調色（聯盟按鈕、重要標記）|
| `gold-400` | `#C4A96A` | 裝飾線、分隔線（維持現有）|

### Tailwind 配置更新（P2 執行，T1 確認時間）

```typescript
// tailwind.config.ts — P2 更新目標
colors: {
  warm: {
    white: '#FAF8F4',
    cream: '#F0EBE1',
    ink: '#2C2416',
    muted: '#6B5E4E',
  },
  olive: {
    100: '#EFF2E4',
    200: '#D7DDB4',  // 維持現有
    500: '#5C6B2E',  // 更新（現有 #7a8f3a）
    600: '#3D4A1E',  // 更新（現有 #5f712c）
    700: '#4a5824',  // 維持現有
    // 其他層級維持現有
  },
  terracotta: {
    500: '#A0522D',
  },
}
```

**注意：** P2 色彩更新需檢查全站已使用 `olive-500/600` 的元件是否需要同步調整視覺。

---

## 字體系統

### 字體分工

| 用途 | 字體 | 重量 | 備注 |
|------|------|------|------|
| 主標題（H1）| Noto Serif TC | 700 | 有力、信任感 |
| 次標題（H2/H3）| Noto Serif TC | 700 | 一致性 |
| 內文段落 | Noto Sans TC | 400 | 手機閱讀友善 |
| UI 元素（按鈕、標籤、導覽）| Noto Sans TC | 500/600 | 功能性清晰 |
| 英文點綴 | Playfair Display（標題）/ Lato（內文）| 依需求 | 中英混排用 |

### 字體大小（響應式）

```css
/* 內文 */
mobile: 17px / line-height 1.85   （已實作於 P0）
desktop (≥768px): 18px / line-height 1.875  （已實作於 P0）

/* 標題 */
H1 mobile: 28px / desktop: 40px
H2 mobile: 22px / desktop: 28px
H3 mobile: 18px / desktop: 22px

/* UI 小字 */
標籤/分類: 10px, tracking 0.2em uppercase
日期/作者: 12px
```

### 字重方針
- **標題**：700（粗體） — 解決「字型太細不清楚」問題
- **內文**：400（Regular）
- **按鈕/CTA**：600（Semi-bold）
- **次要文字**：400，顏色用 `warm-muted` 降低視覺重量

---

## 響應式斷點

| 名稱 | 寬度 | 說明 |
|------|------|------|
| mobile | 375px（基準）| iPhone 14 Pro 標準 |
| mobile-lg | 430px | iPhone 14 Pro Max |
| tablet | 768px（md 斷點）| iPad mini |
| desktop | 1024px（lg 斷點）| 筆電最小 |
| wide | 1280px（xl 斷點）| 全尺寸桌機 |

**Mobile-first 原則：** 所有樣式從 375px 開始設計，向上覆蓋。

---

## P0 — 已完成（2026-05-04 T1 實作並推送）

| 項目 | 修改內容 | 狀態 |
|------|---------|------|
| 背景色 | `#fafaf7` → `#FAF8F4` | ✅ 完成 |
| body 字體 | Noto Serif TC → Noto Sans TC | ✅ 完成 |
| 內文字體大小 | 18px → 17px mobile / 18px desktop | ✅ 完成 |
| 手機側邊距 | `px-6`(24px) → `px-5`(20px) mobile | ✅ 完成（header/article header/section）|
| inline `<p>` 字體 | 移除硬碼 `text-[1.125rem]`，繼承 prose-custom | ✅ 完成 |

**已修改檔案：**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/page.tsx`

---

## P1 — 下週執行（2026-05-05-08 T1 實作目標）

### P1-1：固定導覽列陰影（Sticky Header Enhancement）

**問題：** 目前 header 已是 sticky，但 scroll 後視覺層次不明顯。  
**規格：**
```tsx
// layout.tsx — header className 更新
// 現有：
"sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-olive-100 shadow-sm"
// 目標：加入 scroll-based shadow
```

建議實作方式：useScrollY hook，scroll > 10px 時加入 `shadow-md`，scroll = 0 時維持 `shadow-none`。

```typescript
// 加入 ScrollHeader client component
'use client'
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
// className: scrolled ? 'shadow-md bg-white/98' : 'shadow-none bg-white/95'
```

**K4 完成標準：** iPhone 14 Pro 模擬器，scroll 50px，header 明顯有陰影分層。

---

### P1-2：手機全螢幕選單（Fullscreen Mobile Menu）

**問題：** 目前手機沒有 hamburger menu，用戶無法從手機存取完整導覽（BottomNav 只有 5 個 Tab）。  
**規格：**
```
UI 結構：
  - Header 右側加入 hamburger icon（僅 mobile 顯示，md: hidden）
  - 點擊後：fullscreen overlay，z-index 60
  - 背景：#FAF8F4（不透明）
  - 選單項目：NAV_LINKS（6 個，含分類頁）
  - 每個選單項 min-height: 56px，font-size: 20px，font-weight: 700
  - 右上角 ✕ 按鈕關閉
  - 開啟時 body overflow: hidden（防捲動穿透）
```

**動畫：** slide-in from right，duration 200ms，ease-out。

**K4 完成標準：**
- iPhone 14 Pro 截圖驗證選單可開啟/關閉
- 選單項目 touch target ≥44px
- body 不隨選單捲動

---

### P1-3：TOC 浮動按鈕（文章目錄 Drawer，Mobile Only）

**問題：** 手機版 TableOfContents 目前不可用（desktop sidebar 在手機不顯示）。  
**規格：**
```
UI 結構：
  - 文章頁右下角固定按鈕（位置：right: 20px，bottom: 80px，避開 BottomNav）
  - 按鈕：圓形 44×44px，bg: olive-700，icon: 三條線（hamburger），text: 「目錄」
  - 點擊後：左側 drawer，寬度 280px，max-height: 70vh，可滾動
  - Drawer 背景：#FAF8F4，border-right: 1px solid #E8E3DC
  - 標題顯示 h2/h3，縮排層次區分
  - 觸點：點擊錨點後 drawer 自動關閉
```

**K4 完成標準：**
- 只在文章頁（`/blog/[slug]`）顯示
- 只在 mobile（md 以下）顯示
- 點擊章節標題，頁面正確滾動至對應錨點

---

### P1-4：iOS Safe Area

**問題：** 部分 iPhone 機型（有 Home Bar）底部內容被截斷。  
**現狀：** BottomNav 已有 `paddingBottom: env(safe-area-inset-bottom)`，但其他固定元素（未來的 TOC 按鈕）可能遺漏。  
**規格：** 所有 fixed/sticky 底部元素加入：
```css
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

**注意：** P1-3 TOC 按鈕定位須考量 safe area：
```typescript
bottom: `calc(80px + env(safe-area-inset-bottom))`
```

**K4 完成標準：** iPhone 14 Pro 模擬器（有 home bar）截圖驗證，無內容被截斷。

---

## P2 — 兩週後執行（2026-05-11 以後）

| 項目 | 說明 | 優先序 |
|------|------|--------|
| Tailwind 色彩系統完整更新 | 依上方色彩系統表更新 tailwind.config.ts | P2-1 |
| 元件庫色彩同步 | 全站 olive-500/600 元件視覺一致性審查 | P2-2 |
| 文章頁寬度確認 | article-body max-width: 680px（已設定，確認手機體驗）| P2-3 |
| 封面圖 Kinfolk 化 | 依 D1 Imagen 4 prompt 重新生成 8 張封面 | P2-4（D1 執行）|
| 字體載入優化 | font-display: swap 已設定，加入 preload subset | P2-5 |
| 卡片 hover 動畫 | 統一 scale(1.02) + shadow 動畫規格 | P2-6 |

---

## Imagen 4 封面圖生成 Prompt 模板（D1 執行）

以下 8 個模板適用於不同文章類別，確保 Kinfolk 美學一致性：

### 科學類（science）
```
Overhead shot of extra virgin olive oil being poured from a hand-thrown ceramic carafe onto rustic wooden surface, golden morning light from window casting warm shadows, a few fresh olive branches with small dark olives scattered naturally, shallow depth of field, film grain, Kinfolk magazine editorial style, warm amber tones, no text, no people
```

### 料理類（lifestyle）
```
Mediterranean kitchen scene, cast iron pan with golden olive oil on worn linen tablecloth, fresh herbs, garlic, soft natural window light, slightly overexposed highlights, lifestyle photography, intimate and warm, Kinfolk aesthetic, 35mm film look
```

### 健康類（health）
```
Glass bottle of premium olive oil with light passing through, bokeh background of ancient olive grove, warm terracotta and sage tones, still life photography, minimal composition, late afternoon golden hour, no labels visible, fine art food photography
```

### 文化類（culture）
```
Ancient stone olive press in Mediterranean village, warm sunset light, worn textures and patina, no people, historical atmosphere, National Geographic meets Kinfolk, travel editorial photography
```

---

## 品質驗收清單（T1 每次上線前）

- [ ] iPhone 14 Pro（375px）截圖視覺確認
- [ ] iPad mini（768px）截圖確認無破版
- [ ] `npm run build` Exit 0
- [ ] Lighthouse Mobile ≥ 90
- [ ] CWV：LCP ≤2.5s，CLS ≤0.1
- [ ] 所有觸點 min 44×44px
- [ ] safe area 底部元素不被截斷

---

*T1 如有規格疑問，向 D1 確認；執行前向 GM 報告 K4 完成標準；完成後回報「技術實作完成報告」格式。*
