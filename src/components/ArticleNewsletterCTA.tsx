import Link from 'next/link';

/**
 * ArticleNewsletterCTA — 文末追蹤框（每篇唯一的 CTA）。
 *
 * 版位（blueprint 2.2）：正文固定收尾之後、分享列之後，FAQ 與參考
 * 文獻之前。站長已定調：本站不收集讀者信箱、不寄送電子報
 * （2026-11-22 起移除留信箱表單）。此框只做兩件事——引導讀者回本站
 * 追蹤新文章（官方社群與 LINE 尚在籌備，文案不得宣稱已開通），並
 * 指向證據圖書館。
 */
export default function ArticleNewsletterCTA() {
  return (
    <section className="mt-12 rounded-2xl border border-olive-200 bg-olive-50 px-6 py-8 sm:px-8">
      <p className="text-[11px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-3">
        追蹤知橄生活
      </p>
      <h2 className="text-xl font-bold text-olive-900 leading-snug mb-3 tracking-tight">
        喜歡這篇文章？把知橄生活加入你的追蹤清單
      </h2>
      <p className="text-sm text-stone-600 leading-relaxed font-sans max-w-[560px]">
        新文章與研究更新會公布在網站上；官方社群與 LINE 正在籌備中，開通後會在此公布，歡迎常回來看看。
      </p>
      <p className="text-xs text-stone-500 leading-relaxed font-sans mt-6 pt-5 border-t border-olive-200">
        證據來源與評級標準：
        <Link href="/evidence/" className="text-olive-700 hover:text-olive-900 font-medium underline underline-offset-4 ml-1">
          查看證據圖書館 →
        </Link>
        <span className="block mt-1">
          本站每一項主張的依據——國際標準、研究文獻與證據分級——都整理在那裡。
        </span>
      </p>
    </section>
  );
}
