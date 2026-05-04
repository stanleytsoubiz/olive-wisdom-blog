import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: '聯絡知橄生活 — Olive Wisdom',
  description: '有合作提案、讀者迴響或問題，歡迎與知橄生活團隊聯繫。',
  alternates: { canonical: 'https://olive-wisdom.com/contact' },
};

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <p className="text-[10px] font-sans font-semibold text-olive-600 tracking-[0.3em] uppercase mb-4">
            知橄生活
          </p>
          <h1 className="text-4xl font-bold text-olive-800 mb-4">聯絡我們</h1>
          <p className="text-stone-500 font-sans leading-relaxed">
            有合作提案、讀者迴響或問題，歡迎與我們聯繫
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
