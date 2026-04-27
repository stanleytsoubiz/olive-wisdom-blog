-- ============================================================
-- Week 3 ⑥: 草稿儲存
-- ============================================================
CREATE TABLE IF NOT EXISTS drafts (
  id           BIGSERIAL PRIMARY KEY,
  slug         TEXT NOT NULL,
  title        TEXT NOT NULL DEFAULT '',
  category     TEXT NOT NULL DEFAULT 'science',
  date         TEXT NOT NULL DEFAULT '',
  cover        TEXT NOT NULL DEFAULT '',
  excerpt      TEXT NOT NULL DEFAULT '',
  tags         TEXT NOT NULL DEFAULT '',
  read_time    INTEGER NOT NULL DEFAULT 8,
  content      TEXT NOT NULL DEFAULT '',
  saved_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(slug)
);
COMMENT ON TABLE drafts IS '文章草稿自動儲存（Admin 後台）';
CREATE INDEX IF NOT EXISTS idx_drafts_slug     ON drafts(slug);
CREATE INDEX IF NOT EXISTS idx_drafts_saved_at ON drafts(saved_at DESC);
