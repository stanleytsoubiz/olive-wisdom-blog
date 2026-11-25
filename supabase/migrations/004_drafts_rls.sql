-- ============================================================
-- 004: drafts 補上 Row Level Security（003 建表時遺漏）
-- 2026-11-25 部署與設定稽核發現：subscribers / article_views /
-- contacts / contact_messages 四表皆已啟用 RLS，僅 drafts 未啟用。
-- drafts 存未發佈草稿全文，而 anon key 為公開金鑰（隨前端發佈），
-- 未啟用 RLS 時任何人可經 PostgREST 直接讀寫此表。
-- 套用方式：同 001–003，於 Supabase SQL Editor 執行本檔。
-- ============================================================
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- Service role 可完全存取（與其他表一致的模式）
CREATE POLICY "service_role_all_drafts"
  ON drafts FOR ALL
  USING (auth.role() = 'service_role');
