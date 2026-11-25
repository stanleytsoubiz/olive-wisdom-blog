/**
 * lib/evidence.ts — 證據圖書館資料層（world-class blueprint 2.3 / Phase B
 * 資料資產化第一步）。
 *
 * /evidence 頁的所有結構化資料（權威層級、限值表、CoA 參數、證據分級、
 * 標誌性研究、TFDA 草案、選油標準、FAQ）集中在此，頁面只負責渲染；
 * 文章判讀卡（lib/verdicts.ts）的等級用語直接引用本檔的 GRADES，
 * 保證全站只有一份分級定義。
 *
 * 紀律：本檔內容即 /evidence 已發布的判讀，搬移時逐字保留；新增或
 * 修訂判讀須先回到原始來源查證，不得在此憑空增補數字。
 */

/** 本頁資料最後查核日期（與 /evidence 更新紀錄同步維護）。 */
export const EVIDENCE_LAST_CHECKED = '2026-11-22';

/** 查核節奏聲明（blueprint 2.3-3c：把「圖書館有在維護」變成可見事實）。 */
export const EVIDENCE_CHECK_CADENCE =
  '每年至少覆核一次；IOC 貿易標準與認可實驗室名單更新、EFSA／TFDA 公告異動時同步更新。';

export interface EvidenceLink {
  label: string;
  href: string;
}

export interface RepresentativeArticle {
  slug: string;
  title: string;
}

export const EVIDENCE_FAQ = [
  {
    q: '橄欖油的等級是由誰決定的？',
    a: '等級由國際橄欖理事會（IOC）貿易標準 COI/T.15/NC No. 3/Rev. 22（2026-06）定義；歐盟將其轉化為具約束力的法律（Reg. 2568/91、29/2012）；Codex CXS 33-1981 為 FAO/WHO 國際食品標準，是 WTO 貿易爭端的參考依據；美國 USDA 等級標準為自願性。各國協會負責執行與推廣，不制定等級。',
  },
  {
    q: '特級初榨橄欖油的酸度標準是多少？',
    a: '特級初榨（Extra Virgin）的游離酸度上限為 0.8%（以油酸計），IOC、Codex、歐盟與 USDA 四方一致。但酸度 alone 不能證明是特級初榨，CoA 還須有過氧化值、K232/K270、Delta K、脂肪酸與固醇純度、FAEE 與感官小組結果。',
  },
  {
    q: '橄欖油多酚可以宣稱什麼健康功效？',
    a: '歐盟 EFSA 唯一核准的多酚健康聲稱是「橄欖油多酚有助於保護血脂免於氧化壓力」，使用條件為每 20 克油含至少 5 毫克羥基酪醇及其衍生物（即至少 250 mg/kg），且標籤須註明每日攝取 20 克。EFSA 已拒絕維持正常 HDL、維持正常血壓與抗發炎等聲稱。',
  },
  {
    q: 'PREDIMED 研究證明橄欖油可以預防心臟病嗎？',
    a: '不能這樣寫。PREDIMED 是 7,447 人的隨機對照試驗，結果是「地中海飲食＋特級初榨橄欖油」使高風險老年人重大心血管事件降低約 30%（HR 0.70），檢驗的是整套飲食模式，不是單獨的橄欖油，效果不能單獨歸因於油本身。',
  },
];

export const HIERARCHY = [
  {
    level: '第 1 層',
    name: '國際橄欖理事會 IOC',
    role: '制定全球貿易標準',
    doc: '貿易標準 COI/T.15/NC No. 3/Rev. 22（2026-06）；感官方法 COI/T.20/Doc. No. 15/Rev. 11（2024-06）；多酚 HPLC 測定 COI/T.20/Doc. No. 29/Rev. 2（2022）',
    link: 'https://www.internationaloliveoil.org/wp-content/uploads/2026/09/TRADE-STANDARD-REV-22_EN.pdf',
    linkLabel: 'IOC 貿易標準 Rev. 22（PDF）',
  },
  {
    level: '第 2 層',
    name: '歐盟 EU',
    role: '將 IOC 標準變成具約束力的法律',
    doc: 'Reg. (EEC) No 2568/91（技術法規，附件 I 限值、附件 II–XX 方法）；Reg. (EU) No 29/2012（行銷標準與標示）；Reg. (EC) No 1924/2006 ＋ Reg. (EU) No 432/2012（健康聲稱）',
    link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A31991R2568',
    linkLabel: 'Reg. 2568/91（EUR-Lex）',
  },
  {
    level: '第 3 層',
    name: 'Codex Alimentarius',
    role: 'FAO/WHO 國際食品標準，WTO 貿易爭端參考',
    doc: 'CXS 33-1981，1981 年通過，2015／2017／2024 年修訂；等級定義與 IOC 相同，另訂脂肪酸範圍與分析方法',
    link: 'https://codex.fao.org/restapi/searchstandard/CXS_033e.pdf',
    linkLabel: 'Codex CXS 33（PDF）',
  },
  {
    level: '第 4 層',
    name: '美國 USDA',
    role: '自願性美國等級標準',
    doc: '農業行銷局（AMS）標準，生產者自願加入並付費接受聯邦檢驗；化學限值與 IOC/Codex 一致，感官上對初榨較嚴',
    link: 'https://www.ams.usda.gov/grades-standards/olive-oil-and-olive-pomace-oil-grades-and-standards',
    linkLabel: 'USDA 橄欖油等級標準',
  },
  {
    level: '第 5 層',
    name: '各國協會',
    role: '執行者，不是標準制定者',
    doc: '西班牙 Organización Interprofesional del Aceite de Oliva Español、義大利 UNAPROL／ASSITOL、希臘 SEVITEL、突尼西亞 ONH 等：全產業鏈代表、推廣與研究、與歐盟／IOC 聯繫',
    link: 'https://www.internationaloliveoil.org/',
    linkLabel: 'IOC 官網',
  },
];

export const ACIDITY_ROWS = [
  { grade: '特級初榨 Extra Virgin', ioc: '≤0.8%', eu: '≤0.8%', usda: '≤0.8%' },
  { grade: '初榨 Virgin', ioc: '≤2.0%', eu: '≤2.0%', usda: '≤2.0%' },
  { grade: '普通初榨 Ordinary Virgin', ioc: '≤3.3%', eu: '—（已廢除）', usda: '—' },
  { grade: '精製 Refined', ioc: '≤0.3%', eu: '≤0.3%', usda: '≤0.3%' },
  { grade: '橄欖油（混合）', ioc: '≤1.0%', eu: '≤1.0%', usda: '≤1.0%' },
  { grade: '橄欖粕油（混合）', ioc: '≤1.0%', eu: '≤1.0%', usda: '≤1.0%' },
];

export const COA_ROWS = [
  { param: '游離酸度（以油酸計）', limit: '≤0.8%', note: '果實損傷／壓榨延遲；越低越新鮮。優質 <0.5%，極佳 <0.2%' },
  { param: '過氧化值', limit: '≤20 meq O₂/kg', note: '初級氧化；受熱、光、空氣與存放影響' },
  { param: 'K232（紫外線）', limit: '≤2.50', note: '早期氧化／共軛二烯' },
  { param: 'K270（紫外線）', limit: '≤0.22', note: '後期氧化／油耗；精製油也會升高' },
  { param: 'Delta K（ΔK）', limit: '≤0.01', note: '接近零＝未精製；>0.01 指向精製油' },
  { param: '感官', limit: '缺陷中位數 0、果香中位數 >0', note: '8 人以上訓練有素品評小組，盲測、深藍色杯、28°C' },
];

export interface EvidenceGrade {
  grade: string;
  type: string;
  example: string;
  canSay: string;
  /** 本站代表文章（blueprint 2.3-3b：讓分級可被範例理解；無專文者不列） */
  articles?: RepresentativeArticle[];
}

export const GRADES: EvidenceGrade[] = [
  {
    grade: 'A',
    type: '硬終點隨機對照試驗',
    example: 'PREDIMED',
    canSay: '「地中海飲食＋特級初榨橄欖油使高風險老年人重大心血管事件降低約 30%」——不可歸因於單獨的油',
    articles: [
      { slug: 'predimed-study-complete-explainer-olive-oil-heart', title: 'PREDIMED 研究完整解析' },
    ],
  },
  {
    grade: 'B',
    type: '生物標誌物人體隨機對照試驗',
    example: 'EUROLIVE',
    canSay: '「高多酚特級初榨劑量依賴性降低氧化 LDL、提升 HDL」——替代終點、短期',
  },
  {
    grade: 'C',
    type: '大型前瞻世代研究',
    example: 'EPIC-Spain、哈佛世代',
    canSay: '「攝取量較高者死亡率較低（關聯）」——絕不寫成「證明預防疾病」',
  },
  {
    grade: 'D',
    type: '機制／體外研究',
    example: '油橄欖苦素（oleocanthal）–COX',
    canSay: '僅解釋作用機制，不可作人體療效宣稱',
    articles: [
      { slug: 'oleocanthal-pungency-anti-inflammation', title: '橄欖油的辣喉感是什麼？Oleocanthal 與喉頭那道嗆' },
      { slug: 'oleocanthal-anti-inflammation-brain-protection', title: 'Oleocanthal 與大腦研究怎麼看？' },
    ],
  },
  {
    grade: '法規',
    type: 'EFSA 核准聲稱',
    example: 'Reg. (EU) No 432/2012',
    canSay: '唯一可在歐盟標籤上使用的多酚聲稱，條件嚴格（見下方）',
    articles: [
      { slug: 'olive-oil-polyphenol-tiers-250-500-1000', title: '多酚 250、500、1000 mg/kg 差在哪？' },
    ],
  },
];

export interface EvidenceStudy {
  name: string;
  grade: string;
  design: string;
  result: string;
  limit: string;
  links: EvidenceLink[];
  /** 本站代表文章（以該研究為主要證據的專文；無專文者不列） */
  articles?: RepresentativeArticle[];
}

export const STUDIES: EvidenceStudy[] = [
  {
    name: 'PREDIMED',
    grade: 'A',
    design: '西班牙多中心平行分組隨機對照試驗，7,447 名 55–80 歲心血管高風險成人，中位追蹤 4.8 年',
    result: '地中海飲食＋特級初榨橄欖油組（約 50 g/天）重大心血管事件 HR 0.70（95% CI 0.54–0.92），約降低 30%；中風約降低 50%。2018 年重分析 HR 0.69，結果基本不變。',
    limit:
      '檢驗的是「整套地中海飲食＋特級初榨橄欖油」，不是單獨的橄欖油；受試者為西班牙高風險老年人，效果不能單獨歸因於油。2013 年論文因 11 個中心中有 2 個隨機分派程序瑕疵而撤回，2018 年重發——引用時應提及此事以示嚴謹。',
    links: [
      { label: 'NEJM 2013 · doi:10.1056/NEJMoa1200303', href: 'https://doi.org/10.1056/NEJMoa1200303' },
      { label: '2018 重分析 · doi:10.1056/nejmoa1800389', href: 'https://doi.org/10.1056/nejmoa1800389' },
    ],
    articles: [
      { slug: 'predimed-study-complete-explainer-olive-oil-heart', title: 'PREDIMED 研究完整解析：7,447 人試驗如何理解橄欖油與心血管證據' },
    ],
  },
  {
    name: 'EPIC-Spain',
    grade: 'C',
    design: '前瞻世代研究，40,622 人，13.4 年追蹤',
    result: '橄欖油攝取最高四分位 vs 不食用者：全因死亡率低 26%、心血管死亡率低 44%；每多 10 g/天，全因死亡率低 7%、心血管死亡率低 13%。',
    limit: '觀察性研究、自報飲食、地中海族群；顯示關聯，不是因果。',
    links: [
      { label: 'Am J Clin Nutr 2012（全文）', href: 'https://ajcn.nutrition.org/article/S0002-9165(23)02848-4/fulltext' },
    ],
  },
  {
    name: '哈佛美國世代',
    grade: 'C',
    design: '前瞻世代研究，92,383 人，28 年追蹤',
    result: '攝取 >7 g/天 vs 幾乎不吃：全因與心血管死亡率低 19%、癌症死亡率低 17%、神經退化死亡率低 29%。',
    limit: '觀察性研究、殘餘混雜（吃橄欖油者通常較健康／富裕）、無法區分油的等級；顯示關聯，不是因果。',
    links: [
      { label: 'J Am Coll Cardiol 2022 · PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov/35027106/' },
    ],
  },
  {
    name: 'EUROLIVE',
    grade: 'B',
    design: '隨機交叉人體試驗，200 名健康歐洲男性，每日 25 mL 多酚含量不同（低 2.7、中 164、高 366 mg/kg）的橄欖油，各 3 週',
    result: '氧化低密度脂蛋白隨多酚劑量下降、高密度脂蛋白上升。結論：「橄欖油不只是單元不飽和脂肪。」',
    limit: '短期（3 週）、替代性終點（氧化 LDL、HDL）、僅健康男性、無硬終點。',
    links: [
      { label: 'Ann Intern Med 2006 · PubMed', href: 'https://pubmed.ncbi.nlm.nih.gov/16954359/' },
    ],
  },
  {
    name: '油橄欖苦素（oleocanthal）–COX 機制',
    grade: 'D',
    design: '體外實驗：新鮮特級初榨中喉嚨刺辣的成分抑制 COX-1/COX-2，作用類似布洛芬',
    result: '在體外觀察到抑制環氧合酶的作用。',
    limit: '飲食劑量約為治療劑量的 10%，人體生物利用度未證實。只能作機制故事，不可作抗發炎療效宣稱。',
    links: [
      { label: 'Nature 2005 · doi:10.1038/437045a', href: 'https://doi.org/10.1038/437045a' },
    ],
    articles: [
      { slug: 'oleocanthal-pungency-anti-inflammation', title: '橄欖油的辣喉感是什麼？Oleocanthal 與喉頭那道嗆的關係' },
      { slug: 'oleocanthal-anti-inflammation-brain-protection', title: 'Oleocanthal 與大腦研究怎麼看？喉頭的嗆感與神經保護線索' },
    ],
  },
];

export const TFDA_ROWS = [
  { name: '特級初榨橄欖油 Extra virgin', acid: '≤0.8%', deltaK: '≤0.01', process: '僅洗滌、物理壓榨、過濾、離心' },
  { name: '初榨橄欖油 Virgin', acid: '≤2.0%', deltaK: '≤0.01', process: '同上物理製程' },
  { name: '精製橄欖油 Refined', acid: '≤0.3%', deltaK: '≤0.16', process: '脫膠、脫酸、脫色、脫臭' },
  { name: '橄欖油 Olive oil', acid: '≤1.0%', deltaK: '≤0.15', process: '初榨＋精製混合' },
  { name: '精製橄欖粕油 Refined pomace', acid: '≤0.3%', deltaK: '≤0.20', process: '溶劑／物理萃取粕油後精製' },
  { name: '橄欖粕油 Pomace oil', acid: '≤1.0%', deltaK: '≤0.18', process: '初榨＋精製粕油混合' },
];

export const SELECTION_CRITERIA = [
  { criterion: '法定品名', source: '台灣 TFDA 新制草案（預計 2027-07-01）＋ IOC／Codex', threshold: '品名須為 6 類法定品名之一；粕油不得稱「橄欖油」' },
  { criterion: '游離酸度', source: 'IOC Rev. 22、Codex CXS 33、EU 2568/91', threshold: '特級初榨 ≤0.8%（優質 <0.5%）' },
  { criterion: '過氧化值／K232／K270／ΔK', source: 'IOC 貿易標準／EU 法規', threshold: '≤20 meq/kg、≤2.50、≤0.22、≤0.01' },
  { criterion: '多酚（HPLC）', source: 'EFSA 2011 意見＋ IOC COI/T.20/Doc. 29', threshold: '健康聲稱門檻 ≥250 mg/kg（每 20 g ≥5 mg 羥基酪醇＋衍生物）' },
  { criterion: '感官', source: 'IOC COI/T.20/Doc. 15', threshold: '缺陷中位數 0、果香 >0' },
  { criterion: '收穫日期／批次', source: '最佳實務（非法律）', threshold: '標示收穫年份與批次，附該批次 CoA' },
  { criterion: '獎項', source: 'NYIOOC／Flos Olei', threshold: '註明名稱＋年份＋確切產品，不稱「認證」' },
];
