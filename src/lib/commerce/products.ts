// ⚠️ TEST / PLACEHOLDER DATA ONLY — NOT REAL PRODUCTS.
// Per the owner's 2026-11-22 directive, no product may be listed before the
// screening report is approved and same-batch CoA verification passes.
// This catalog exists solely to exercise the Phase 1 checkout chain in the
// ECPay sandbox. Never replace these entries with real product data on this
// branch, and never merge this branch before the listing gate opens.

export interface CommerceProduct {
slug: string;
name: string;
variantName: string;
/** Integer NT dollars. */
price: number;
description: string;
}

export const TEST_PRODUCTS: CommerceProduct[] = [
{
slug: 'test-evoo-500ml',
name: '特級初榨橄欖油 500ml（佔位資料・非真實商品）',
variantName: '500ml',
price: 100,
description:
'這是沙箱測試用的佔位商品，價格 NT$100 僅供跑通結帳→回呼→訂單狀態測試鏈。本站目前未販售任何橄欖油；選品標準與目前進度見「選品標準」頁。',
},
];

export function getTestProduct(slug: string): CommerceProduct | undefined {
return TEST_PRODUCTS.find((p) => p.slug === slug);
}
