# 知橄生活 · Olive Wisdom Blog

> 橄欖油文化、地中海生活美學與健康飲食的全棧部落格

🌐 **網站**：[olive-wisdom.com](https://olive-wisdom.com)  
🛠 **技術棧**：Next.js 16 + TypeScript + Supabase + Cloudflare Workers（OpenNext）  
📦 **資料庫**：Supabase PostgreSQL

## 功能特色

- 📝 精選橄欖油文化文章
- 📧 電子報訂閱系統（subscribers）
- 👁️ 文章瀏覽統計（article_views）
- 📬 讀者聯繫表單（contacts）
- 🌍 自訂域名 olive-wisdom.com

## 快速開始

```bash
npm install
cp .env.example .env.local
# 填入 Supabase 專案 URL 與 API Key
npm run dev
```

## 資料庫 Migration

```bash
# 於 Supabase SQL Editor 執行
supabase/migrations/001_initial_schema.sql
```

## 部署

Push 到 `main` 後由 GitHub Actions（`.github/workflows/nextjs-deploy.yml`）自動執行
`npm run build:cf`（OpenNext server build）並部署至 Cloudflare Worker `olive-wisdom`。
舊 Cloudflare Pages 專案保留為回滾備援，平時不部署。
