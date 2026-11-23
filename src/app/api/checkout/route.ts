// POST /api/checkout — create a pending order and return signed ECPay
// checkout parameters for the client to auto-post to ECPay's hosted page.
// SERVER BUILD ONLY (OpenNext): this handler cannot run in the static export.
// Sandbox phase: catalog is placeholder test data (see lib/commerce/products).
import { NextRequest, NextResponse } from 'next/server';
import { getTestProduct } from '@/lib/commerce/products';
import { buildCheckoutParams, formatTradeDate, getEcpayConfig, newMerchantTradeNo } from '@/lib/commerce/ecpay';
import { defaultOrderStore } from '@/lib/commerce/orders';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { slug?: string; qty?: number; email?: string } | null;
  const product = body?.slug ? getTestProduct(body.slug) : undefined;
  const qty = Math.max(1, Math.min(99, Number(body?.qty ?? 1) || 1));
  const email = (body?.email ?? '').trim();

  if (!product) return NextResponse.json({ error: 'unknown product' }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'valid email required' }, { status: 400 });
  }

  const config = getEcpayConfig();
  const merchantTradeNo = newMerchantTradeNo();
  const total = product.price * qty;
  const orderNo = `OW-${merchantTradeNo}`;

  await defaultOrderStore().create({
    orderNo,
    email,
    status: 'pending',
    total,
    merchantTradeNo,
    items: [{ productSlug: product.slug, productName: product.name, unitPrice: product.price, qty }],
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olive-wisdom.com';
  const params = buildCheckoutParams(
    {
      merchantTradeNo,
      merchantTradeDate: formatTradeDate(),
      totalAmount: total,
      itemName: `${product.name} x${qty}`,
      returnUrl: `${base}/api/webhooks/ecpay`,
      orderResultUrl: `${base}/checkout/result`,
      clientBackUrl: `${base}/shop/${product.slug}`,
    },
    config,
  );

  return NextResponse.json({ checkoutUrl: config.checkoutUrl, params, orderNo });
}
