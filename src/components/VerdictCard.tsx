import Link from 'next/link';
import type { ArticleVerdict } from '@/lib/verdicts';

/**
 * 本文判讀卡（blueprint 2.3-1）— 把 /evidence 的證據分級帶進每一篇
 * 文章：標題列下方固定版位，等級大字＋一句判語＋證據邊界。
 * 等級色只用橄欖綠深淺與字重區分，不彩虹化（blueprint 3.3-2）。
 * 手機直式堆疊：等級與判語先行（blueprint 2.6-4）。
 * Phase B：主要證據不在 /evidence 分級範圍內的文章，改顯示「判讀依據」
 * 四型（法規標準／產量統計／文化敘事／實作指南）——標的是判讀基礎，
 * 不冒充證據等級。
 */
export default function VerdictCard({ verdict }: { verdict: ArticleVerdict }) {
  const isGrade = verdict.kind === 'grade';
  const bigText = isGrade ? verdict.grade! : verdict.basis!;
  const isLongLabel = bigText.length > 1;
  return (
    <section
      aria-label={isGrade ? '本文判讀' : '本文判讀依據'}
      className="mt-6 border border-olive-200 bg-olive-50/60 px-5 py-5 sm:px-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Grade / basis block */}
        <div className="flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-1 shrink-0 sm:w-24">
          <span className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.25em] uppercase">
            {isGrade ? '證據等級' : '判讀依據'}
          </span>
          <span
            className={`font-serif font-bold text-olive-800 leading-none ${
              isLongLabel ? 'text-4xl' : 'text-6xl'
            }`}
          >
            {bigText}
          </span>
          <span className="text-[11px] font-sans text-stone-500 leading-snug">
            {isGrade ? verdict.gradeType : verdict.basisNote}
          </span>
        </div>

        {/* Verdict body */}
        <div className="flex-1 min-w-0 border-t sm:border-t-0 sm:border-l border-olive-200 pt-4 sm:pt-0 sm:pl-6">
          <p className="text-[11px] font-sans font-semibold text-stone-500 tracking-[0.2em] uppercase mb-1.5">
            本文主題
          </p>
          <p className="text-sm font-sans font-medium text-stone-700 leading-relaxed mb-3">
            {verdict.topic}
          </p>
          <p className="font-serif text-[1.05rem] md:text-lg text-olive-950 leading-[1.7] mb-3">
            {verdict.verdict}
          </p>
          <p className="text-xs font-sans text-stone-500 leading-relaxed">
            <span className="font-semibold text-stone-600">證據邊界：</span>
            {verdict.boundary}
          </p>
        </div>
      </div>

      <p className="mt-4 pt-3 border-t border-olive-200/70 text-[11px] font-sans text-stone-500">
        分級定義與完整判讀標準，見
        <Link href="/evidence#grades" className="text-olive-700 hover:text-olive-900 underline underline-offset-4 ml-1">
          證據圖書館 →
        </Link>
      </p>
    </section>
  );
}
