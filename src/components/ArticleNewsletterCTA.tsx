import Link from 'next/link';
import SubscribeForm from '@/components/SubscribeForm';

/**
 * ArticleNewsletterCTA — 文末訂閱框（訂閱優先）。
 *
 * 放在每篇文章「參考文獻」之後、導覽之前。訂閱只承諾每週一封週報：
 * PDF 贈品已依站長決定暫停，不再於站內提及；歡迎信的實際寄送
 * 亦不在本階段處理（已知缺口，見研究報告）。
 */
export default function ArticleNewsletterCTA() {
  return (
    <section className="mt-12 rounded-2xl border border-olive-200 bg-olive-50 px-6 py-8 sm:px-8">
      <p className="text-[11px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase mb-3">
        知橄週報
      </p>
      <h2 className="text-xl font-bold text-olive-900 leading-snug mb-3 tracking-tight">
        喜歡這篇文章？訂閱知橄週報
      </h2>
      <p className="text-sm text-stone-600 leading-relaxed font-sans mb-6 max-w-[560px]">
        每週一封，精選最新橄欖油研究、品質判讀與地中海生活美學。
        隨時可取消訂閱。
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
