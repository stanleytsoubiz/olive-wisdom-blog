-- ============================================================
-- 知橄生活 · Olive Wisdom Blog
-- Supabase DB Migration — 002_fix_schema.sql
-- 補齊 subscribers/contact_messages 欄位
-- ============================================================

-- 補充 subscribers 欄位
ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- 若原有 is_active 欄位，source / active 為新增
-- 相容處理：建立 contact_messages（API 使用 contact_messages 資料表）
CREATE TABLE IF NOT EXISTS contact_messages (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  message      TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read         BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE contact_messages IS '讀者聯繫訊息（contact_messages 版本）';
CREATE INDEX IF NOT EXISTS idx_contact_messages_submitted ON contact_messages(submitted_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_contact_messages"
  ON contact_messages FOR ALL
  USING (auth.role() = 'service_role');

-- 匿名可 INSERT（訪客聯絡表單）
CREATE POLICY "anon_insert_contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- 訂閱者 — 匿名可 INSERT
CREATE POLICY IF NOT EXISTS "anon_insert_subscribers"
  ON subscribers FOR INSERT
  WITH CHECK (true);
