import Link from 'next/link';
import SubscribeForm from '@/components/SubscribeForm';

/**
 * ArticleNewsletterCTA — 文末追蹤框。
 *
 * 放在每篇文章「參考文獻」之後、導覽之前。站長已定調：電郵訂閱
 * 沒有效益，本站不寄送電子報。此框只做兩件事——引導讀者回本站與
 * 官方社群追蹤新文章；願意留信箱者加入讀者名單（寫入 Supabase），
 * 前端不承諾任何寄信。
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
      <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6 max-w-[560px]">
        新文章與研究更新會公布在網站與官方社群。你也可以留下信箱加入讀者名單——
        本站目前不寄送電子報，加入名單是讓我們知道，這些整理值得繼續做下去。
      </p>
      <SubscribeForm />
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
