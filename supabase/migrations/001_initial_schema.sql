-- ============================================================
-- 知橄生活 · Olive Wisdom Blog
-- Supabase DB Migration — 001_initial_schema.sql
-- ============================================================

-- 1. 電子報訂閱者
CREATE TABLE IF NOT EXISTS subscribers (
  id             BIGSERIAL PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active      BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE subscribers IS '電子報訂閱者清單';
COMMENT ON COLUMN subscribers.email IS '訂閱者電子信箱（唯一）';
COMMENT ON COLUMN subscribers.is_active IS '是否仍在訂閱狀態';

-- 2. 文章瀏覽統計
CREATE TABLE IF NOT EXISTS article_views (
  id         BIGSERIAL PRIMARY KEY,
  slug       TEXT NOT NULL UNIQUE,
  views      BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE article_views IS '各文章累計瀏覽次數';
COMMENT ON COLUMN article_views.slug IS '文章 URL slug（唯一識別）';
COMMENT ON COLUMN article_views.views IS '累計瀏覽次數';

-- 3. 讀者聯繫表單
CREATE TABLE IF NOT EXISTS contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_read    BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE contacts IS '讀者聯繫訊息';
COMMENT ON COLUMN contacts.is_read IS '是否已讀取';

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_subscribers_email      ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active     ON subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_article_views_slug     ON article_views(slug);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at    ON contacts(created_at DESC);

-- ── Function: increment article view (atomic) ─────────────
CREATE OR REPLACE FUNCTION increment_article_view(article_slug TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO article_views (slug, views, updated_at)
    VALUES (article_slug, 1, NOW())
  ON CONFLICT (slug)
    DO UPDATE SET
      views      = article_views.views + 1,
      updated_at = NOW();
END;
$$;

-- ── Row Level Security ────────────────────────────────────
ALTER TABLE subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;

-- Service role 可完全存取（API routes 使用 service role key）
CREATE POLICY "service_role_all_subscribers"
  ON subscribers FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_article_views"
  ON article_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_contacts"
  ON contacts FOR ALL
  USING (auth.role() = 'service_role');

-- 公開可讀文章瀏覽數（anon 可 SELECT）
CREATE POLICY "anon_read_article_views"
  ON article_views FOR SELECT
  USING (true);
