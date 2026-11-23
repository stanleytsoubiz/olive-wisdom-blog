// Order persistence for commerce Phase 1.
// Production path writes to Supabase with the SERVICE-ROLE key (server-only;
// the commerce tables have RLS enabled with no public policies).
// The store interface lets the sandbox test harness exercise the full chain
// (create → ECPay callback → status update) against an in-memory store when
// no database is provisioned yet.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled' | 'refunded';

export interface OrderRecord {
  orderNo: string;
  email: string;
  status: OrderStatus;
  total: number;
  merchantTradeNo: string;
  items: { productSlug: string; productName: string; unitPrice: number; qty: number }[];
  paidAt?: string;
  lastCallback?: Record<string, string>;
}

export interface OrderStore {
  create(order: OrderRecord): Promise<void>;
  getByTradeNo(merchantTradeNo: string): Promise<OrderRecord | undefined>;
  markPaid(merchantTradeNo: string, callback: Record<string, string>): Promise<OrderRecord | undefined>;
}

/** In-memory store — test harness and local development only. */
export class InMemoryOrderStore implements OrderStore {
  private orders = new Map<string, OrderRecord>();

  async create(order: OrderRecord): Promise<void> {
    this.orders.set(order.merchantTradeNo, { ...order });
  }

  async getByTradeNo(merchantTradeNo: string): Promise<OrderRecord | undefined> {
    return this.orders.get(merchantTradeNo);
  }

  async markPaid(merchantTradeNo: string, callback: Record<string, string>): Promise<OrderRecord | undefined> {
    const order = this.orders.get(merchantTradeNo);
    if (!order) return undefined;
    // Idempotent: a duplicate success callback must not re-apply side effects.
    if (order.status === 'paid') return order;
    order.status = 'paid';
    order.paidAt = new Date().toISOString();
    order.lastCallback = callback;
    return order;
  }
}

/** Supabase store — requires SUPABASE_SERVICE_ROLE_KEY (never expose client-side). */
export class SupabaseOrderStore implements OrderStore {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) throw new Error('Supabase service-role configuration missing');
    this.client = createClient(url, serviceKey);
  }

  async create(order: OrderRecord): Promise<void> {
    const { data, error } = await this.client
      .from('orders')
      .insert({
        order_no: order.orderNo,
        email: order.email,
        status: order.status,
        payment_provider: 'ecpay',
        subtotal: order.total,
        total: order.total,
      })
      .select('id')
      .single();
    if (error) throw error;
    const items = order.items.map((i) => ({
      order_id: data.id,
      product_name: i.productName,
      unit_price: i.unitPrice,
      qty: i.qty,
    }));
    const { error: itemError } = await this.client.from('order_items').insert(items);
    if (itemError) throw itemError;
    const { error: payError } = await this.client.from('payments').insert({
      order_id: data.id,
      provider: 'ecpay',
      provider_trade_no: order.merchantTradeNo,
      amount: order.total,
      status: 'pending',
    });
    if (payError) throw payError;
  }

  async getByTradeNo(merchantTradeNo: string): Promise<OrderRecord | undefined> {
    const { data: payment } = await this.client
      .from('payments')
      .select('order_id, status')
      .eq('provider_trade_no', merchantTradeNo)
      .single();
    if (!payment) return undefined;
    const { data: order } = await this.client
      .from('orders')
      .select('order_no, email, status, total, paid_at')
      .eq('id', payment.order_id)
      .single();
    if (!order) return undefined;
    return {
      orderNo: order.order_no,
      email: order.email,
      status: order.status as OrderStatus,
      total: order.total,
      merchantTradeNo,
      items: [],
      paidAt: order.paid_at ?? undefined,
    };
  }

  async markPaid(merchantTradeNo: string, callback: Record<string, string>): Promise<OrderRecord | undefined> {
    const existing = await this.getByTradeNo(merchantTradeNo);
    if (!existing) return undefined;
    if (existing.status === 'paid') return existing; // idempotent
    const { data: payment } = await this.client
      .from('payments')
      .select('order_id')
      .eq('provider_trade_no', merchantTradeNo)
      .single();
    if (!payment) return undefined;
    await this.client
      .from('payments')
      .update({ status: 'success', provider_txn_id: callback.TradeNo ?? null, raw_payload: callback })
      .eq('provider_trade_no', merchantTradeNo);
    await this.client
      .from('orders')
      .update({ status: 'paid', paid_at: new Date().toISOString(), payment_method: callback.PaymentType ?? null })
      .eq('id', payment.order_id);
    return this.getByTradeNo(merchantTradeNo);
  }
}

export function defaultOrderStore(): OrderStore {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ? new SupabaseOrderStore() : new InMemoryOrderStore();
}
