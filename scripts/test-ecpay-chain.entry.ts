// Test-chain entry (bundled by scripts/test-ecpay-chain.mjs via esbuild).
// Exercises the full Phase 1 sandbox chain without a live database or a
// browser round-trip to ECPay:
//   create order → build+sign checkout params → verify own signature →
//   simulate ECPay success callback → verify signature → markPaid →
//   duplicate callback (idempotency) → tampered callback (must reject).
import {
  ECPAY_SANDBOX,
  buildCheckoutParams,
  formatTradeDate,
  generateCheckMacValue,
  newMerchantTradeNo,
  verifyCheckMacValue,
} from '../src/lib/commerce/ecpay';
import { InMemoryOrderStore } from '../src/lib/commerce/orders';
import { getTestProduct } from '../src/lib/commerce/products';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function main() {
  const config = { ...ECPAY_SANDBOX };
  const product = getTestProduct('test-evoo-500ml');
  check('placeholder product exists', !!product);
  if (!product) process.exit(1);

  const qty = 2;
  const total = product.price * qty;
  const merchantTradeNo = newMerchantTradeNo();
  const store = new InMemoryOrderStore();

  await store.create({
    orderNo: `OW-${merchantTradeNo}`,
    email: 'test@example.com',
    status: 'pending',
    total,
    merchantTradeNo,
    items: [{ productSlug: product.slug, productName: product.name, unitPrice: product.price, qty }],
  });
  const created = await store.getByTradeNo(merchantTradeNo);
  check('order created as pending', created?.status === 'pending' && created?.total === total);

  const params = buildCheckoutParams(
    {
      merchantTradeNo,
      merchantTradeDate: formatTradeDate(),
      totalAmount: total,
      itemName: `${product.name} x${qty}`,
      returnUrl: 'https://olive-wisdom.com/api/webhooks/ecpay',
      orderResultUrl: 'https://olive-wisdom.com/checkout/result',
      clientBackUrl: `https://olive-wisdom.com/shop/${product.slug}`,
    },
    config,
  );
  check(
    'checkout params signed and self-verify',
    verifyCheckMacValue(params, config.hashKey, config.hashIV),
    `MerchantTradeNo=${merchantTradeNo}`,
  );

  // Simulate ECPay's server-to-server success notification.
  const callback: Record<string, string> = {
    MerchantID: config.merchantId,
    MerchantTradeNo: merchantTradeNo,
    StoreID: '',
    RtnCode: '1',
    RtnMsg: 'Success',
    TradeNo: '20261122000123456',
    TradeAmt: String(total),
    PaymentDate: formatTradeDate(),
    PaymentType: 'Credit_CreditCard',
    PaymentTypeChargeFee: '5',
    TradeDate: formatTradeDate(),
    SimulatePaid: '1',
  };
  callback.CheckMacValue = generateCheckMacValue(callback, config.hashKey, config.hashIV);
  check('callback signature verifies', verifyCheckMacValue(callback, config.hashKey, config.hashIV));

  const tampered = { ...callback, TradeAmt: '1' };
  check('tampered callback rejected', !verifyCheckMacValue(tampered, config.hashKey, config.hashIV));

  if (callback.RtnCode === '1') {
    await store.markPaid(merchantTradeNo, callback);
  }
  const paid = await store.getByTradeNo(merchantTradeNo);
  check('order marked paid after callback', paid?.status === 'paid' && !!paid?.paidAt);

  const again = await store.markPaid(merchantTradeNo, callback);
  check('duplicate callback idempotent', again?.status === 'paid' && again?.paidAt === paid?.paidAt);

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

void main();
