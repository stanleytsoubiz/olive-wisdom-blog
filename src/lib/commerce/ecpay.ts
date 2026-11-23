// ECPay (綠界) AIO checkout integration — Phase 1, sandbox only.
// Test parameters below are ECPay's OFFICIAL PUBLIC stage credentials,
// published in ECPay's developer documentation for integration testing.
// Production credentials must come from environment variables once the
// merchant account exists; never commit real HashKey/HashIV.
import { createHash } from 'node:crypto';

export const ECPAY_SANDBOX = {
  merchantId: '2000132',
  hashKey: '5294y06JbISpM5x9',
  hashIV: 'v77hoKGq4kWxNNIS',
  checkoutUrl: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
} as const;

export interface EcpayConfig {
  merchantId: string;
  hashKey: string;
  hashIV: string;
  checkoutUrl: string;
}

export function getEcpayConfig(): EcpayConfig {
  if (process.env.ECPAY_ENV === 'production') {
    return {
      merchantId: process.env.ECPAY_MERCHANT_ID ?? '',
      hashKey: process.env.ECPAY_HASH_KEY ?? '',
      hashIV: process.env.ECPAY_HASH_IV ?? '',
      checkoutUrl: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
    };
  }
  return { ...ECPAY_SANDBOX };
}

// ECPay CheckMacValue encoding: like encodeURIComponent, then the documented
// replacements, then lowercase (per ECPay's .NET urlEncode reference).
function ecpayUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2a')
    .toLowerCase();
}

/** Generate a SHA256 CheckMacValue for a parameter set (excludes CheckMacValue itself). */
export function generateCheckMacValue(
  params: Record<string, string | number>,
  hashKey: string,
  hashIV: string,
): string {
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== 'CheckMacValue' && params[k] !== '' && params[k] !== undefined)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const raw = `HashKey=${hashKey}&` + sortedKeys.map((k) => `${k}=${params[k]}`).join('&') + `&HashIV=${hashIV}`;
  return createHash('sha256').update(ecpayUrlEncode(raw)).digest('hex').toUpperCase();
}

/** Verify a callback payload from ECPay. Returns true only on an exact match. */
export function verifyCheckMacValue(
  payload: Record<string, string>,
  hashKey: string,
  hashIV: string,
): boolean {
  const received = payload.CheckMacValue;
  if (!received) return false;
  const expected = generateCheckMacValue(payload, hashKey, hashIV);
  return expected === received.toUpperCase();
}

export interface CheckoutParamsInput {
  merchantTradeNo: string;
  /** yyyy/MM/dd HH:mm:ss */
  merchantTradeDate: string;
  totalAmount: number;
  itemName: string;
  returnUrl: string;
  orderResultUrl: string;
  clientBackUrl: string;
}

/** Build the signed parameter set to auto-post to ECPay's hosted checkout page. */
export function buildCheckoutParams(input: CheckoutParamsInput, config: EcpayConfig): Record<string, string> {
  const params: Record<string, string> = {
    MerchantID: config.merchantId,
    MerchantTradeNo: input.merchantTradeNo,
    MerchantTradeDate: input.merchantTradeDate,
    PaymentType: 'aio',
    TotalAmount: String(input.totalAmount),
    TradeDesc: 'OliveWisdomOrder',
    ItemName: input.itemName,
    ReturnURL: input.returnUrl,
    OrderResultURL: input.orderResultUrl,
    ClientBackURL: input.clientBackUrl,
    ChoosePayment: 'ALL',
    EncryptType: '1',
  };
  params.CheckMacValue = generateCheckMacValue(params, config.hashKey, config.hashIV);
  return params;
}

/** MerchantTradeNo: ≤20 chars, alphanumeric. OW + timestamp base36 + random suffix. */
export function newMerchantTradeNo(now = new Date()): string {
  const stamp = now.getTime().toString(36).toUpperCase();
  const rand = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, '0');
  return `OW${stamp}${rand}`.slice(0, 20);
}

export function formatTradeDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
