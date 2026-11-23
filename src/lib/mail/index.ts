// Transactional email via Resend (order confirmation / shipping notice).
// Design rules:
// - ENV GATE: without RESEND_API_KEY every send is a no-op that only logs.
// This is the expected state until the owner finishes Resend signup and
// domain verification and the key is placed in the Worker env.
// - NEVER THROWS: email is a side effect of an order transition. A mail
// failure is logged, never propagated — the order record is the source
// of truth and the ECPay webhook must still answer "1|OK".
// - The provider sits behind this module only; swapping to SES later
// (see the migration report §4) changes this file, not the call sites.
import * as React from 'react';
import { Resend} from 'resend';
import { render} from '@react-email/render';
import type { OrderRecord} from '../commerce/orders';
import { OrderConfirmationEmail} from './templates/OrderConfirmation';
import { ShippingNotificationEmail} from './templates/ShippingNotification';

const FROM = '知橄生活 Olive Wisdom <noreply@olive-wisdom.com>';

async function send(to: string, subject: string, element: React.ReactElement): Promise<void> {
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
console.log(`[mail] RESEND_API_KEY not set — skipping "${subject}" to ${to}`);
return;
}
try {
const html = await render(element);
const resend = new Resend(apiKey);
const { error} = await resend.emails.send({ from: FROM, to, subject, html});
if (error) {
console.error('[mail] Resend send failed:', error);
} else {
console.log(`[mail] sent "${subject}" to ${to}`);
}
} catch (err) {
console.error('[mail] send threw:', err);
}
}

/** Order confirmation — call after an order transitions to `paid`. */
export async function sendOrderConfirmation(order: OrderRecord): Promise<void> {
await send(
order.email,
`訂單成立通知 ${order.orderNo}`,
React.createElement(OrderConfirmationEmail, { order}),
);
}

export interface ShippingInfo {
carrier?: string;
trackingNumber?: string;
}

/**
* Shipping notification — function + template ready. The call site is
* reserved for the fulfilment flow: Phase 1 has no shipping admin yet, so
* nothing calls this until an order can transition to `shipped`.
*/
export async function sendShippingNotification(order: OrderRecord, shipping: ShippingInfo = {}): Promise<void> {
await send(
order.email,
`訂單已出貨 ${order.orderNo}`,
React.createElement(ShippingNotificationEmail, { order,...shipping}),
);
}
