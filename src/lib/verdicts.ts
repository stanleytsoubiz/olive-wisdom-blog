/**
 * 本文判讀卡資料（world-class blueprint 2.3-1；Phase A 試行 2 篇，
 * Phase B 全面化）。
 *
 * 兩種卡：
 * - grade（證據等級卡）：本文主要證據是 /evidence 已逐項分級的研究
 *   （PREDIMED=A、EUROLIVE=B、EPIC／哈佛世代=C、oleocanthal–COX=D、
 *   EFSA 核准聲稱=法規）。等級用語以 lib/evidence.ts 的 GRADES 為
 *   單一出處，getVerdict() 會以 GRADES 的 type 覆寫本檔的 gradeType。
 * - basis（判讀依據卡）：主要證據不在 /evidence 分級範圍內的文章，
 *   改標「判讀依據」四型——法規標準／產量統計／文化敘事／實作指南，
 *   依本文內容的判讀基礎誠實歸類，不冒充證據等級。
 *
 * 紀律：每張卡的判語與邊界都必須能在本文原文或 /evidence 找到出處
 * （出處註記於各條上方）；不自創等級、不增補本文沒有的數字。
 * 主要證據為未經 /evidence 分級的單一研究或多研究綜述、且四型依據
 * 皆不誠實適配的文章，不發卡（清單與理由見 Phase B 報告）。
 */
import { GRADES } from './evidence';

export type VerdictBasis = '法規標準' | '產量統計' | '文化敘事' | '實作指南';

export interface ArticleVerdict {
  kind: 'grade' | 'basis';
  /** kind='grade'：/evidence 分級 'A' | 'B' | 'C' | 'D' | '法規' */
  grade?: string;
  /** kind='grade'：分級類型（以 lib/evidence.ts GRADES 為準） */
  gradeType?: string;
  /** kind='basis'：判讀依據類型 */
  basis?: VerdictBasis;
  /** kind='basis'：依據出處一行（標準文件／資料來源／方法） */
  basisNote?: string;
  /** 本文主題 */
  topic: string;
  /** 一句判語（關聯性語言，依風格指南第 4 條） */
  verdict: string;
  /** 證據邊界一句 */
  boundary: string;
}

export const ARTICLE_VERDICTS: Record<string, ArticleVerdict> = {
  // ══ 證據等級卡（grade）═════════════════════════════════════════
  // 來源：/evidence STUDIES「PREDIMED」grade A（result／limit 原文改寫為判語／邊界）
  'predimed-study-complete-explainer-olive-oil-heart': {
    kind: 'grade',
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
    kind: 'grade',
    grade: '法規',
    gradeType: 'EFSA 核准聲稱',
    topic: '多酚分級（250／500／1000 mg/kg）與 EFSA 健康聲稱門檻',
    verdict:
      '多酚數字是參考，不是排名：250 是聲稱門檻，500 是高多酚分界，1000+ 很少見——方法相同才能比，總量夠了才有意義。',
    boundary:
      '歐盟唯一核准的多酚聲稱是「有助於保護血脂免受氧化壓力」，條件為每 20 g 油含至少 5 mg 羥基酪醇及其衍生物；門檻是法規條件，不是療效保證。',
  },
  // 來源：/evidence STUDIES「油橄欖苦素（oleocanthal）–COX 機制」grade D
  // （用詞統一：判讀卡與正文一律作「油橄欖醛」，/evidence 研究名保留原名）
  // （result／limit 原文）；本文正文即以 Beauchamp et al. 2005 為主軸
  'oleocanthal-pungency-anti-inflammation': {
    kind: 'grade',
    grade: 'D',
    gradeType: '機制／體外研究',
    topic: '喉頭嗆感的來源：oleocanthal 與 COX 抑制機制',
    verdict:
      '喉頭那道嗆來自 oleocanthal（油橄欖醛）；2005 年《自然》研究在體外觀察到它抑制 COX-1／COX-2，作用方式類似布洛芬。',
    boundary:
      '這是體外機制證據：飲食劑量約為治療劑量的 10%，人體生物利用度未證實，只能作機制說明，不可作抗發炎療效宣稱。',
  },
  // 來源：/evidence STUDIES「oleocanthal–COX」grade D＋本文 excerpt
  // （「分清哪些是細胞與動物研究的線索，哪些還沒有人體證據」）
  'oleocanthal-anti-inflammation-brain-protection': {
    kind: 'grade',
    grade: 'D',
    gradeType: '機制／體外研究',
    topic: 'Oleocanthal 與腦部研究：細胞與動物線索、人體證據現況',
    verdict:
      'oleocanthal 的腦部研究（β-類澱粉清除等）目前多停留在細胞與動物層次；還沒有人體試驗證實它對大腦的保護效果。',
    boundary:
      '機制研究只能解釋作用路徑，不能推論吃多少油、得到多少保護；喉頭的嗆感是成分存在的訊號，不是療效證明。',
  },

  // ══ 判讀依據卡：法規標準 ═════════════════════════════════════
  // 來源：本文結語原文＋本文 sources（EU 432/2012、EFSA 意見）
  '2026-evoo-quality-polyphenol-index': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 標準・Reg. (EU) No 432/2012',
    topic: '2026 產季多酚分級與鑑定報告判讀',
    verdict:
      '「特級初榨」四個字不再是答案：答案是瓶身的 mg/kg 數字、對應採收當季的 CoA，以及喉頭那道誠實的灼熱感。',
    boundary:
      '多酚數字只有在檢測方法相同時才能比較；EFSA 聲稱另有每 20 g 油 ≥5 mg 羥基酪醇及衍生物的條件。',
  },
  // 來源：本文「快速答案」與「如果只記得一件事」原文
  'coa-complete-reading-guide-olive-oil': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 貿易標準・CoA 限值',
    topic: 'CoA 判讀：先驗文件，再看數字',
    verdict:
      '先確認三件事——實驗室具名且可查、報告對應你手上那瓶的批次、分析日期夠新——再看酸值、過氧化值、K232/K270 與多酚。',
    boundary:
      'CoA 回答的是同批次在分析日期當下的品質邊界，不能取代感官、保存條件、採收年份與實際用途的判斷。',
  },
  // 來源：本文 excerpt＋/evidence FAQ（酸度 alone 不能證明特級初榨）
  'evoo-buying-guide-2026': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 貿易標準',
    topic: '用 IOC 標準選油：酸值、認證、採收年份、CoA',
    verdict:
      '選油先看標準、再看故事：酸值與等級對照 IOC 標準、產地看 PDO、年份看採收日期、品質看批次 CoA。',
    boundary:
      '酸度單獨不能證明是特級初榨——還須過氧化值、紫外線吸收與感官小組結果一起成立。',
  },
  // 來源：本文 excerpt＋/evidence CoA 表（感官列：8 人以上品評小組）
  'evoo-sensory-evaluation-ioc-standards': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 感官方法 COI/T.20/Doc. No 15',
    topic: 'IOC 感官評鑑：果香、苦味、辣感怎麼讀',
    verdict:
      '感官是法定判級的一環：訓練小組在 28°C 藍色杯中盲測，缺陷中位數須為 0、果香中位數 >0；學會這套語言，你多一套自己的判斷標準。',
    boundary:
      '正式評級須由 8 人以上訓練有素的品評小組執行；個人品嚐是近似判斷，不是官方評級。',
  },
  // 來源：本文 excerpt（五個關鍵數字）＋CoA 批次判讀原則
  'japan-coa-verification-olive-oil-guide': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 限值・CoA 五數字',
    topic: '日本選油標準：用 CoA 五個數字驗證',
    verdict:
      '游離酸度、過氧化值、多酚含量、K270、採收年份——五個數字對照 IOC 限值，就能驗證一瓶油是否名實相符。',
    boundary:
      'CoA 是特定批次在分析日期的紀錄；數字再漂亮，也要先確認報告對應的正是你手上那一批。',
  },
  // 來源：本文 excerpt（依據 IOC 官方標準解析分類體系）
  'olive-oil-grades-classification-complete-guide': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 貿易標準・EU 法規',
    topic: '橄欖油等級分類：特級初榨、初榨、精製、粕油怎麼分',
    verdict:
      '四個等級的分野由 IOC 標準與歐盟法規定義——是化學限值加感官門檻，不是品牌自訂的說法。',
    boundary:
      '掛上「特級初榨」品名只是入口；是否名實相符，要看限值與感官是否同時通過。',
  },
  // 來源：本文 excerpt（IOC 法定酸度、過氧化值、多酚含量）
  'olive-oil-evoo-vs-regular-complete-comparison': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 等級定義',
    topic: '特級初榨與一般橄欖油到底差在哪裡',
    verdict:
      '差異落在三處：法定酸度與氧化限值、製程（僅機械取得 vs 精製混合）、以及精製過程帶走的多酚。',
    boundary:
      '這是規範與成分層次的比較；等級是品質分類，不直接等於每個人的健康效果。',
  },
  // 來源：本文 excerpt＋本文「選購決策框架」（認證為第四關）
  'olive-oil-pdo-dop-igp-certification-guide': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'EU 地理標示制度',
    topic: 'PDO／DOP／IGP：認證保護的是產地',
    verdict:
      '地理認證保護的是產地真實性，不是多酚含量：一瓶 PDO 油可以多酚極低，一瓶無認證的小農油可以多酚極高。',
    boundary:
      '在本站的選購順序裡，認證排在採收日期、CoA、品種之後——是加分保障，不能替代前三關。',
  },
  // 來源：本文「快速答案」兩套制度對照表＋「一句話總結」原文
  'organic-olive-oil-label-what-it-guarantees': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'Reg. (EU) 2018/848・Reg. (EU) 2022/2104',
    topic: '有機標章與橄欖油等級：兩套制度',
    verdict:
      '有機標章是一張「生產履歷」的合格證，不是「成分含量」的成績單：它保證生產方式，不保證等級與多酚。',
    boundary:
      '兩套制度互不保證——有機認證不回答品質到哪一級，等級制度也不回答是否有機生產。',
  },
  // 來源：本文「快速答案」與「一句話總結」原文（草案狀態為本文自述）
  'tfda-olive-oil-labelling-reform-2027-guide': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'TFDA 品名及標示規定草案',
    topic: '2027 年橄欖油品名新制：6 個法定品名',
    verdict:
      '新制上路後只有 6 個合法品名，橄欖粕油不得再稱「橄欖油」——買油先看品名，再看酸值與 CoA。',
    boundary:
      '目前仍是草案：二次預告尚未發布，正式公告後內容仍可能調整；你現在買的油仍按舊制標示。',
  },
  // 來源：本文 excerpt（UC Davis 2011 抽樣 69%）＋本文五層查核框架
  'olive-oil-fraud-detection-authentic-vs-fake': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: '查核方法：CoA 與批次追溯',
    topic: '真偽鑑別：五層防禦怎麼建',
    verdict:
      '真偽不能靠單一測試：UC Davis 2011 年抽樣中，69% 的進口「特級初榨」未達官方標準——要靠 CoA、採收年份與逐層查核。',
    boundary:
      '該抽樣是特定市場與年份的調查，用來提醒查核的必要，不是對每一瓶進口油的判決。',
  },
  // 來源：本文 excerpt（EFSA 聲稱條件）＋/evidence（HPLC 為 IOC 認可方法）
  'olive-oil-polyphenol-content-how-to-verify': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'EFSA 聲稱條件・HPLC 測定',
    topic: '多酚含量怎麼驗證：標籤、CoA 與感官測試',
    verdict:
      '多數標籤不標多酚：用 EFSA 聲稱條件（每 20 g 油 ≥5 mg 羥基酪醇及衍生物）反推，再以 CoA 與三個感官測試交叉驗證。',
    boundary:
      '感官測試是近似判斷；正式數字以 HPLC 測定（IOC 認可方法）的批次 CoA 為準。',
  },
  // 來源：本文 excerpt（USDA 數據、IOC 油酸範圍）＋/evidence（油酸 55–83%）
  'olive-oil-calories-fatty-acid-composition': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'USDA 食物資料庫・IOC 組成範圍',
    topic: '熱量與脂肪酸組成：數字怎麼算',
    verdict:
      '每 15 mL 約 120 大卡、油酸約佔 73%；用量要放進每日熱量與油脂總量裡一起算，不是額外疊加。',
    boundary:
      '脂肪酸比例是組成範圍（IOC 油酸 55–83%），隨品種與批次變動，不是每一瓶的保證值。',
  },
  // 來源：本文「一句話總結」原文＋/evidence 品質基準節（競賽不是認證）
  'olive-oil-competitions-awards-how-to-read': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC Mario Solinas 規則・評鑑年鑑',
    topic: '比賽、評鑑年鑑與金牌怎麼讀',
    verdict:
      '金牌不是品牌的永久勳章，而是某一年、某一批油的成績單：先認主辦者，再對得獎年份與採收年份。',
    boundary:
      '競賽與年鑑是品質基準，不是認證——不授予法定等級，也不保證下一批同樣得獎。',
  },
  // 來源：本文「一句話總結」原文＋本文 sources（EU 2022/2104 第 10 條 27 °C）
  'olive-oil-how-its-made-harvest-to-bottle': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC／EU 初榨定義',
    topic: '製程六步驟與「冷壓」的真正意思',
    verdict:
      '製程只有六步，核心是「只用機械力、不精煉」；「冷壓／冷萃」只是 27 °C 的標籤門檻，不是品質保證。',
    boundary:
      '製程是否合規由產地法規與認證查核；消費者端仍要回到標示、採收日期與 CoA 判讀。',
  },
  // 來源：本文 excerpt（IOC 感官標準與 oleocanthal 機制）
  'olive-oil-bitterness-pungency-quality-guide': {
    kind: 'basis',
    basis: '法規標準',
    basisNote: 'IOC 感官標準・oleocanthal 機制',
    topic: '苦味與辣感為什麼是正面指標',
    verdict:
      '苦與辣不是劣質表現：IOC 感官標準把果香、苦味、辣感列為初榨油的正面屬性，辣感主要來自 oleocanthal 等多酚。',
    boundary:
      '感官強度是品質線索之一；正式評級仍須訓練小組盲測，個人感受不能取代評級。',
  },

  // ══ 判讀依據卡：產量統計 ═════════════════════════════════════
  // 來源：本文「快速答案」IOC 2024/25 產季暫定數字表
  'olive-oil-world-map-production-consumption': {
    kind: 'basis',
    basis: '產量統計',
    basisNote: 'IOC 產季統計（2024/25 暫定）',
    topic: '世界產量與消費版圖',
    verdict:
      '西班牙 1,419,000 噸、約佔全球四成，全球合計 3,572,000 噸——橄欖油至今仍是地中海盆地的產業。',
    boundary:
      '以上是 IOC 產季暫定數字，會隨結算修訂；產量隨天氣，一年可擺盪近百萬噸。',
  },
  // 來源：本文「快速答案」與「一句話總結」原文（EFSA 2019、IOC 結算）
  'olive-regions-under-threat-drought-xylella': {
    kind: 'basis',
    basis: '產量統計',
    basisNote: 'IOC 產季結算・EFSA 植物健康意見',
    topic: '產區雙警訊：乾旱減產與 Xylella 病害',
    verdict:
      '乾旱讓西班牙 2022/23 產季一年失去約 55% 產量，但雨回來、產量就回來；Xylella 無症狀期中位數約 10 個月、田間尚無根除方法，沒有回頭路。',
    boundary:
      '病害評估依 EFSA 2019 年科學意見；產量為產季結算數據，後續產季仍會變動。',
  },
  // 來源：本文「快速答案」與「一句話總結」原文
  'olive-oil-price-guide-why-so-expensive': {
    kind: 'basis',
    basis: '產量統計',
    basisNote: '產地價與市場資料',
    topic: '橄欖油價格是怎麼形成的',
    verdict:
      '價格看產量（天氣）、看等級、看產地；產地價和貨架價之間，還隔著裝瓶、運輸、關稅與通路。',
    boundary:
      '文中市場數字是引用時點的產地價與預估，會隨產季變動；貴不一定好，異常便宜的「特級初榨」值得多看一眼標籤。',
  },

  // ══ 判讀依據卡：文化敘事 ═════════════════════════════════════
  // 來源：本文 excerpt（圖坦卡門陵墓、《埃伯斯紙草卷》）
  'olive-oil-ancient-egypt-ritual-heritage': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '紙草文獻・考古出土',
    topic: '橄欖油在古埃及的角色',
    verdict:
      '從圖坦卡門陵墓出土的橄欖枝，到《埃伯斯紙草卷》記載的配方——橄欖油在三千多年前的埃及不只是食物，更是連結生死兩界的神聖媒介。',
    boundary:
      '古代用途來自文獻與考古敘事，說明的是文化地位，不是現代功效證據。',
  },
  // 來源：本文 excerpt（貿易、宗教、藝術與移民四條路）
  'olive-oil-millennium-journey-mediterranean-to-table': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '貿易・宗教・藝術・移民史',
    topic: '橄欖油三千年傳播史',
    verdict:
      '橄欖油走的是四條路——貿易、宗教、藝術與移民——花了三千年，從地中海的果樹變成全球餐桌的常備油。',
    boundary:
      '年代為學界通說的概略時間軸；歷史敘事不構成品質或功效的判準。',
  },
  // 來源：本文 excerpt（亞麻仁油／核桃油；燈油、餐桌、護膚、藥房）
  'olive-oil-renaissance-art-science-history': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '繪畫材料史・脂肪化學史',
    topic: '文藝復興時期橄欖油的真正角色',
    verdict:
      '油畫用的是會乾的亞麻仁油與核桃油——橄欖油不會乾；它在那個時代的角色是燈油、餐桌、護膚與藥房，還是現代脂肪化學的起點。',
    boundary:
      '本文是材料與文化史的考證，不涉及現代產品的品質判斷。',
  },
  // 來源：本文 excerpt（雙耳陶罐、泰斯塔喬山、東向貿易規模）
  'olive-oil-silk-road-trade-history': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '考古與貿易史研究',
    topic: '羅馬帝國的橄欖油貿易網絡',
    verdict:
      '標準化的雙耳陶罐把西班牙的橄欖油成船運進羅馬，一百多年間堆出一座陶罐山；它往東到印度的旅程真實存在，規模卻小得多。',
    boundary:
      '貿易規模由陶罐遺存與文獻重建，不同研究的估計仍有出入。',
  },
  // 來源：本文 excerpt（克里特古木；飲食、宗教、競技與貿易）
  'olive-tree-ancient-civilization-heritage': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '神話・競技・考古',
    topic: '橄欖樹與古代文明',
    verdict:
      '克里特島西部一棵估計樹齡數千年的橄欖古木至今仍在結果；人類把橄欖用進飲食、宗教、競技與貿易，那條線一直延續到今日的餐桌。',
    boundary:
      '古木樹齡為估計值；神話敘事與考古證據要分開讀。',
  },
  // 來源：本文 excerpt（風土概念）＋選油判讀原則
  'olive-oil-terroir-spain-greece-italy': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '產地與品種研究',
    topic: '風土：同品種、三國、三種風味',
    verdict:
      '同一品種在西班牙、希臘、義大利長出不同的風味——氣候、土壤與海拔組成的風土，是產地差異的說明書。',
    boundary:
      '風土解釋的是風味傾向；判斷單一瓶油，仍要看採收年份與當批次 CoA。',
  },
  // 來源：本文 excerpt（三產地風味與判讀順序）
  'olive-oil-terroir-tour-andalusia-crete-tuscany': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '產地認證・IOC 產量資料',
    topic: '三個產地怎麼讀：安達盧西亞、克里特、托斯卡尼',
    verdict:
      '安達盧西亞量大穩重、克里特小果苦辣、托斯卡尼早摘青草味——先認產地風格，再看採收年份。',
    boundary:
      '產地風格是群體傾向，不是每一瓶的保證；個別油款以當批次數據為準。',
  },
  // 來源：本文 excerpt（1908 年試種、84.6%）＋本文 sources（香川縣官方統計）
  'shodoshima-olive-oil-history-terroir': {
    kind: 'basis',
    basis: '文化敘事',
    basisNote: '香川縣官方統計・地方產業史',
    topic: '小豆島：日本的橄欖油風土實驗',
    verdict:
      '1908 年三縣同時試種，只有小豆島成功；118 年後，這座島生產全日本 84.6% 的橄欖，並在國際競賽中屢獲獎項。',
    boundary:
      '產量佔比與品質數字來自香川縣官方統計與島上紀錄，是特定年份的地方資料。',
  },

  // ══ 判讀依據卡：實作指南 ═════════════════════════════════════
  // 來源：本文「快速答案」五步驟框架原文
  'olive-oil-complete-buying-guide-2026': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '五步驟選購框架',
    topic: '選購五步驟：自己完成判斷',
    verdict:
      '先過兩關——深色瓶、採收日期 12 個月內——再依認品種、查認證、要 CoA 的順序，五個步驟自己判斷一瓶油值不值得買。',
    boundary:
      '五步驟是篩選框架，通過不等於品質保證；需要健康用途的進階判斷，仍要看批次 CoA。',
  },
  // 來源：本文 excerpt（四個品質指標＋用法小卡）
  'olive-oil-gift-guide-how-to-choose': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '選油標準的送禮應用',
    topic: '送禮選油：先看四個看得見的品質',
    verdict:
      '採收年份、深色瓶、公開 CoA、合適容量——這四件事比價位重要，再加一張用法小卡，禮物才算送到位。',
    boundary:
      '容量是否合適取決於收禮者的用量與用途；判斷基準與日常選油相同。',
  },
  // 來源：本文 excerpt（IOC 建議 3–6 個月、五感訊號）
  'olive-oil-after-opening-shelf-life': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'IOC 保存建議・儲存研究',
    topic: '開封後保存期限與氧化判斷',
    verdict:
      '開封後氧化加速，IOC 建議 3–6 個月內用完；是否已經氧化，用氣味與口感的五感訊號判斷。',
    boundary:
      '期限是一般保存條件下的通則；實際速度隨溫度、光線、瓶口密封與開瓶頻率而異。',
  },
  // 來源：本文「一句話總結」原文（三維度、台灣用量估算）
  'olive-oil-shelf-life-oxidation-storage': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '氧化指標：過氧化值・酸值・感官',
    topic: '保存期限：從三個維度判斷劣化',
    verdict:
      '從過氧化值、游離脂肪酸與感官三個維度看保質期；以台灣家庭用量估算，500 mL 裝、開封後 6 週內用完是務實做法。',
    boundary:
      '用量與時程是依台灣一般家庭使用量估算的建議，不是每一瓶油的固定期限。',
  },
  // 來源：本文 excerpt（五個保存錯誤：光、熱、瓶口）
  'olive-oil-storage-guide-2026': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '儲存研究・保存指引',
    topic: '保存的五個常見錯誤',
    verdict:
      '五個錯誤的核心是同一件事——光、熱與敞開的瓶口：把油搬進有門的櫃子，遠離爐火與西曬。',
    boundary:
      '氧化一旦發生不可逆；保存方法延緩的是衰減速度，不會讓已氧化的油回復。',
  },
  // 來源：本文 excerpt（IOC COI/CBPS Doc. No 1）＋「一句話總結」原文
  'olive-oil-storage-refrigerator-taiwan-guide': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'IOC 保存指引 COI/CBPS Doc. No 1',
    topic: '橄欖油要放冰箱嗎',
    verdict:
      '通常不需要放冰箱：日常保存的重點是陰涼、避光、密封、遠離爐火，比冷藏更重要。',
    boundary:
      '低溫變白、凝固多半是脂肪酸結晶的物理現象，不代表變質、也不能驗真偽；冷藏是長期高溫環境下的條件式選項。',
  },
  // 來源：本文「一句話總結」原文
  'olive-oil-fridge-test-myth-debunked': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '物理現象與查核方法',
    topic: '冰箱測試為什麼不能驗真假',
    verdict:
      '放冰箱會凝固是脂肪遇冷結晶，很正常、不是壞掉；但凝固不能證明是真油——真正能驗的，是聞、嚐、看標籤與 CoA。',
    boundary: '冰箱是保存的工具，不是驗油的工具。',
  },
  // 來源：本文 excerpt（氧化穩定性、極性化合物、160–180°C）
  'olive-oil-cooking-heat-stability-smoke-point': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '加熱穩定性研究',
    topic: '橄欖油可以加熱嗎：發煙點與氧化穩定性',
    verdict:
      '「橄欖油不能加熱」是常見誤解：以氧化穩定性與極性化合物生成量看，特級初榨在家庭爐溫 160–180°C 的表現穩定。',
    boundary:
      '加熱數據多來自實驗室條件；日常料理還要管理油煙、反覆加熱與油品本身的新鮮度。',
  },
  // 來源：本文 excerpt（多酚 ≥250 mg/kg、加熱自保能力）
  'olive-oil-cooking-science-can-evoo-stir-fry': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'IOC 數據・加熱研究',
    topic: '特級初榨橄欖油可以炒菜嗎',
    verdict:
      '可以炒：與其換成「高發煙點」的精製植物油，不如確認 EVOO 多酚 ≥250 mg/kg——多酚越高，加熱時的自保能力越強。',
    boundary:
      '發煙點隨精製程度、品種與批次變動，是參考值，不是好壞的唯一指標。',
  },
  // 來源：本文 excerpt（IARC 分類、情境管理）
  'olive-oil-stir-fry-cancer-myth-debunked': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'IARC 分類・加熱研究',
    topic: '橄欖油炒菜會致癌嗎',
    verdict:
      '不能簡化成「會致癌」或「完全沒風險」：一般家庭中火、短時間、使用保存良好的油，不等同致癌情境；要管理的是大量油煙、長時間高溫、反覆加熱與通風。',
    boundary:
      'IARC 的相關分類針對高溫油炸與固體燃料等情境，不直接對應日常家庭料理條件。',
  },
  // 來源：本文 excerpt（180°C 炒菜保留率研究）
  'olive-oil-cooking-polyphenol-retention-japan': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '加熱保留率研究',
    topic: '加熱後多酚還剩多少',
    verdict:
      '加熱會讓多酚下降，但不是歸零：研究觀察到 180°C 炒菜後仍有保留，關鍵變數是溫度與時間。',
    boundary:
      '保留率來自特定研究的油品與加熱條件，家庭料理的實際結果會不同。',
  },
  // 來源：本文 excerpt（20–60 mL、替換而非疊加）
  'olive-oil-daily-intake-dosage-science': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'EFSA 聲稱條件・PREDIMED 設計',
    topic: '每天吃多少：三個劑量框架',
    verdict:
      '劑量的務實區間落在研究常見的 20–60 mL／天；重點是替換原有油脂、成為飲食底色，不是疊加在奶油與醬料之上。',
    boundary:
      'EFSA 的 20 g 是聲稱條件、PREDIMED 的用量是試驗設計，兩者都不是個人處方。',
  },
  // 來源：本文 excerpt 與表格（EFSA 無「空腹」字眼；國健署 3–7 茶匙）
  'olive-oil-morning-fasting-spoon-myth': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'EFSA 聲稱條件・國健署飲食指南',
    topic: '早上空腹喝一匙，真的比較好嗎',
    verdict:
      '目前沒有證據支持空腹喝比隨餐吃更好；重點不是什麼時候喝，是每天吃多少、吃的是不是新鮮的好油。',
    boundary:
      'EFSA 聲稱條件沒有寫「空腹」；1 茶匙約 45 大卡，要算進當天 3–7 茶匙的油脂總量。',
  },
  // 來源：本文 excerpt（NRF2 機制通路；直接人體證據有限）
  'morning-ritual-evoo-metabolism': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '機制研究與人體證據分層',
    topic: '晨飲橄欖油與代謝宣稱怎麼看',
    verdict:
      '晨飲的代謝宣稱主要指向 NRF2 等機制通路；直接的人體證據有限——晨飲不是代謝開關。',
    boundary:
      '宣稱與證據要分開看：機制層次的相關訊號，不等於人體效果。',
  },
  // 來源：本文 excerpt（分工框架）＋本文「一句話總結」（發煙點是約值）
  'olive-oil-vs-camellia-rapeseed-oil-guide': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '脂肪酸組成・用途分工',
    topic: '橄欖油、苦茶油、芥花油怎麼分工',
    verdict:
      '三種油各有強項：橄欖油勝在多酚與最完整的研究證據，苦茶油勝在耐高溫與清淡，芥花油勝在通用——看用途分工，不是誰打敗誰。',
    boundary:
      '發煙點是約值，隨精製程度、品種與批次變動；分工建議以日常料理場景為準。',
  },
  // 來源：本文 excerpt（分工）＋本文結尾立場揭露原文
  'olive-oil-vs-avocado-oil-complete-comparison': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '同儕研究比較・純度調查',
    topic: '橄欖油 vs 酪梨油：廚房裡怎麼分工',
    verdict:
      '日常炒菜、淋沙拉、沾麵包是特級初榨的位置；需要 220°C 以上油炸時，精製酪梨油等備用油才合理。',
    boundary:
      '酪梨油純度數據來自美國市場抽樣研究；本站團隊的專業是橄欖油，立場已在文中揭露。',
  },
  // 來源：本文 excerpt（衰減研究）＋本文「一句話總結」原文
  'polyphenol-decay-science-2026': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '儲存衰減研究（5–50°C、18–21 個月）',
    topic: '多酚衰減：獎牌與日期，哪個算數',
    verdict:
      '多酚有半衰期、會誠實衰減——去年的金牌油，今年可能只是普通烹飪油；判斷看採收日期、CoA 日期與瓶身顏色，不看獎牌。',
    boundary:
      '衰減速率來自特定溫度與期間的儲存研究；個別油款與保存條件會讓速度不同。',
  },
  // 來源：本文 excerpt 與「一句話總結」原文（範圍非保證、看 CoA）
  'olive-oil-varieties-picual-koroneiki-frantoio-guide': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '品種特性・多酚常見範圍',
    topic: '品種決定風味：Picual、Koroneiki、Frantoio',
    verdict:
      'Picual 強勁穩定、Koroneiki 苦辣均衡、Frantoio 平衡圓潤——先認品種，再認產地與採收時間。',
    boundary:
      '表中的多酚是常見範圍，不是保證；判斷一瓶油，要看當批次的 CoA。',
  },
  // 來源：本文「一句話總結」原文＋本文（Frangipane et al. 2023 回顧）
  'olio-nuovo-unfiltered-olive-oil-guide': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '過濾研究回顧・IOC 感官方法',
    topic: '新油季：未過濾油該追鮮還是等澄清',
    verdict:
      '未過濾油把新油季的濃烈裝進瓶裡，代價是保存期以週計算：追鮮要買得對時、喝得夠快；放得久的安心，留給過濾油。',
    boundary:
      '未過濾油的水分與微生物數據來自 Frangipane 等人 2023 年的回顧彙整，個別油款仍有差異。',
  },
  // 來源：本文 excerpt（MUFA 與 GLP-1、PYY 飽足感訊號；飲食模式）
  'olive-oil-weight-loss-science': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '系統回顧・飽足感機制研究',
    topic: '橄欖油能幫助減肥嗎',
    verdict:
      '橄欖油不是減肥食品：MUFA 與 GLP-1、PYY 等飽足感訊號相關，地中海飲食組在試驗中體重管理優於低脂組——效果屬於整體飲食模式。',
    boundary:
      '體重結果來自飲食模式的試驗與回顧，不是單吃橄欖油的效果；油本身仍是高熱量食物。',
  },
  // 來源：本文結尾（端粒保護相關訊號）＋本文「實踐手冊」定位
  'mediterranean-diet-anti-aging-2026': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: '端粒研究整理・實踐手冊',
    topic: '地中海飲食實踐：多酚怎麼吃夠',
    verdict:
      '地中海飲食不是一張食譜，是把研究觀察到、與端粒保護相關的飲食模式，編進每天的廚房節奏。',
    boundary:
      '端粒等指標是相關訊號，不是逆齡保證；本文是飲食實踐整理，不構成醫療建議。',
  },
  // 來源：本文 sources（PREDIMED、EUROLIVE、世代研究）＋本文結尾判語
  'mediterranean-diet-anti-aging-women-2026': {
    kind: 'basis',
    basis: '實作指南',
    basisNote: 'PREDIMED・EUROLIVE・世代研究整理',
    topic: '地中海飲食與女性：證據到哪裡',
    verdict:
      '以橄欖油為核心的地中海飲食策略，證據來自 PREDIMED、EUROLIVE 與世代研究的整理——先看證據強度，再談應用。',
    boundary:
      '多數研究對象是一般成人或高風險族群，不是專為 35–55 歲女性設計；荷爾蒙、骨質等主題的人體證據仍有限。',
  },
};

export function getVerdict(slug: string): ArticleVerdict | undefined {
  const v = ARTICLE_VERDICTS[slug];
  if (!v) return undefined;
  if (v.kind === 'grade') {
    const g = GRADES.find((x) => x.grade === v.grade);
    // 等級用語以證據圖書館（lib/evidence.ts）為單一出處
    return g ? { ...v, gradeType: g.type } : v;
  }
  return v;
}
