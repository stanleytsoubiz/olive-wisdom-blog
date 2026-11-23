// POST /api/webhooks/ecpay — ECPay server-to-server payment notification.
// Verifies CheckMacValue before trusting anything; idempotent on repeat
// notifications. ECPay expects the literal response "1|OK" on success.
// SERVER BUILD ONLY (OpenNext).
import { NextRequest } from 'next/server';
import { getEcpayConfig, verifyCheckMacValue } from '@/lib/commerce/ecpay';
import { defaultOrderStore } from '@/lib/commerce/orders';
import { sendOrderConfirmation } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return new Response('0|BadRequest', { status: 400 });

  const payload: Record<string, string> = {};
  form.forEach((value, key) => {
    payload[key] = String(value);
  });

  const config = getEcpayConfig();
  if (!verifyCheckMacValue(payload, config.hashKey, config.hashIV)) {
    return new Response('0|CheckMacValueError', { status: 400 });
  }

  // RtnCode "1" = payment succeeded. Other codes (ATM/CVS awaiting payment,
  // failures) are acknowledged but do not mark the order paid in Phase 1.
  if (payload.RtnCode === '1') {
    const store = defaultOrderStore();
    const before = await store.getByTradeNo(payload.MerchantTradeNo);
    const order = await store.markPaid(payload.MerchantTradeNo, payload);
    if (!order) return new Response('0|OrderNotFound', { status: 404 });
    // Transactional email only on the fresh pending → paid transition:
    // markPaid is idempotent, so a duplicate callback must not re-send.
    // sendOrderConfirmation never throws and is a no-op without a key.
    if (before?.status !== 'paid') {
      await sendOrderConfirmation(order);
    }
  }

  return new Response('1|OK');
}
