/**
 * 封面三式系統（world-class blueprint 3.4）：61 張封面收進三個受控
 * 模板系列，讓圖庫一眼成「一家人」。
 *
 * - 產地實景：文化／產地／歷史——產地實景與歷史場景。
 * - 靜物特寫：選購／判讀／生活——瓶身、標籤、倒油、廚房靜物。
 * - 圖解示意：科學／數據——分子、機制、數據意象。
 *
 * 系列依文章分類欄位（lib/categories.ts 的 column）自動歸屬；
 * 文章頁封面以 CSS 疊加系列字標（分類英文名）並在圖說標明圖片來源
 * 與所屬系列。圖片本體的統一色調與重製屬二進位資產工作，另案處理
 * （見 Phase B 報告的逐篇清單）；本檔只負責歸屬與標示。
 */
import { CATEGORY_MAP } from './categories';

export type CoverStyleId = 'landscape' | 'still-life' | 'diagram';

export interface CoverStyle {
  id: CoverStyleId;
  name: string;
  description: string;
}

export const COVER_STYLES: Record<CoverStyleId, CoverStyle> = {
  landscape: {
    id: 'landscape',
    name: '產地實景',
    description: '產地實景與歷史場景：橄欖園、產區地景、古文明遺跡',
  },
  'still-life': {
    id: 'still-life',
    name: '靜物特寫',
    description: '靜物判讀：瓶身、標籤、倒油與廚房場景',
  },
  diagram: {
    id: 'diagram',
    name: '圖解示意',
    description: '圖解式：分子、機制與數據意象',
  },
};

/** 分類欄位 → 封面系列（blueprint 3.4 的歸屬規則） */
const STYLE_BY_COLUMN: Record<string, CoverStyleId> = {
  culture: 'landscape', // 知性史詩（culture／heritage）
  health: 'still-life', // 品味鑑賞（health／selection／guide）
  lifestyle: 'still-life', // 餐桌美學
  science: 'diagram', // 科學萃取
};

export function getCoverStyle(category?: string): CoverStyle {
  const column = category ? CATEGORY_MAP[category]?.column : undefined;
  const id = (column && STYLE_BY_COLUMN[column]) || 'still-life';
  return COVER_STYLES[id];
}

/** 封面右下角的系列字標（分類英文名，大寫呈現） */
export function getCoverSeriesLabel(category?: string): string | undefined {
  return category ? CATEGORY_MAP[category]?.en : undefined;
}

/** images.json 的 source 代碼 → 圖說用語（blueprint 2.2-5 來源標示） */
export function getCoverSourceLabel(source?: string): string | undefined {
  switch (source) {
    case 'google_imagen4':
    case 'pollinations_ai_local':
      return 'AI 生成';
    case 'unsplash':
      return 'Unsplash 圖庫';
    case 'custom':
      return '本站自製';
    default:
      return undefined;
  }
}
