// Product page skeleton — Phase 1 feature branch only.
// Renders ONLY the placeholder test product. Real products may appear here
// after: screening approval → same-batch CoA verification → importer
// agreement → company + merchant account. See /selection for the standards.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TEST_PRODUCTS, getTestProduct } from '@/lib/commerce/products';
import BuyNowButton from '@/components/BuyNowButton';

export function generateStaticParams() {
  return TEST_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getTestProduct(slug);
  if (!product) return { title: '商品不存在' };
  return {
    title: product.name,
    description: product.description,
    robots: { index: false, follow: false }, // test page — never index
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getTestProduct(slug);
  if (!product) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="border border-amber-300 bg-amber-50 p-4 mb-8">
        <p className="text-sm font-sans text-amber-900">
          測試頁面：本站目前未販售任何橄欖油。此頁僅供金流沙箱測試，商品為佔位資料。
          正式選品標準與目前進度，請見「選品標準」頁。
        </p>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-semibold text-stone-900 mb-4">{product.name}</h1>
      <p className="text-base text-stone-600 leading-relaxed font-sans mb-6">{product.description}</p>
      <p className="text-2xl font-serif text-olive-900 mb-8">NT$ {product.price.toLocaleString()}</p>

      {/* Real product pages will render, directly under the price:
          the same-batch CoA six values (acidity, peroxide, K232, K270, ΔK,
          polyphenols + method), harvest date, batch no., and the importer /
          fulfilment disclosure. No CoA, no listing — that block is the page. */}

      <BuyNowButton slug={product.slug} price={product.price} />
    </main>
  );
}
