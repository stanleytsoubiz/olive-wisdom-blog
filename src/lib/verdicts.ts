/**
 * 本文判讀卡資料（world-class blueprint 2.3-1，Phase A 試行）。
 *
 * 紀律：等級只能來自 /evidence 已記錄的分級與研究判讀——GRADES 表
 * （A 硬終點 RCT／B 生物標誌物 RCT／C 大型前瞻世代／D 機制・體外／
 * 法規 EFSA 核准聲稱）與 STUDIES 逐項判讀。文章的主要證據不在
 * /evidence 的記錄範圍內（國際標準、法規標示、市場統計、文化史等），
 * 就不發卡、不自創等級；那類文章的判讀卡規格留待 Phase B 定版。
 *
 * 每張卡的判語與邊界都必須能在 /evidence 或本文原文中找到出處，
 * 新增條目時在下方註明來源。
 */
export interface ArticleVerdict {
  /** /evidence 分級：'A' | 'B' | 'C' | 'D' | '法規' */
  grade: string;
  /** 分級類型（/evidence GRADES 表原文） */
  gradeType: string;
  /** 本文主題 */
  topic: string;
  /** 一句判語（關聯性語言，依風格指南第 4 條） */
  verdict: string;
  /** 證據邊界一句 */
  boundary: string;
}

export const ARTICLE_VERDICTS: Record<string, ArticleVerdict> = {
  // 來源：/evidence STUDIES「PREDIMED」grade A（result／limit 原文改寫為判語／邊界）
  'predimed-study-complete-explainer-olive-oil-heart': {
    grade: 'A',
    gradeType: '硬終點隨機對照試驗',
    topic: 'PREDIMED 試驗判讀：地中海飲食＋特級初榨橄欖油與重大心血管事件',
    verdict:
      '地中海飲食＋特級初榨橄欖油，使高風險老年人重大心血管事件相對風險約低 30%（HR 0.70；2018 年重分析 HR 0.69）。',
    boundary:
      '檢驗的是整套飲食模式，不是單獨的橄欖油；受試者為西班牙 55–80 歲高風險成人，效果不能單獨歸因於油。',
  },
  // 來源：/evidence GRADES「法規」級（EFSA 核准聲稱）＋本文結尾判語原文
  'olive-oil-polyphenol-tiers-250-500-1000': {
    grade: '法規',
    gradeType: 'EFSA 核准聲稱',
    topic: '多酚分級（250／500／1000 mg/kg）與 EFSA 健康聲稱門檻',
    verdict:
      '多酚數字是參考，不是排名：250 是聲稱門檻，500 是高多酚分界，1000+ 很少見——方法相同才能比，總量夠了才有意義。',
    boundary:
      '歐盟唯一核准的多酚聲稱是「有助於保護血脂免受氧化壓力」，條件為每 20 g 油含至少 5 mg 羥基酪醇及其衍生物；門檻是法規條件，不是療效保證。',
  },
};

export function getVerdict(slug: string): ArticleVerdict | undefined {
  return ARTICLE_VERDICTS[slug];
}
