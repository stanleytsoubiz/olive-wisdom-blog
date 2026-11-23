// 訂單確認信（交易信）— React Email template.
// Sent after the ECPay webhook moves an order to `paid`.
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { OrderRecord } from '../../commerce/orders';

function fmt(amount: number): string {
  return `NT$${amount.toLocaleString('en-US')}`;
}

export function OrderConfirmationEmail({ order }: { order: OrderRecord }) {
  return (
    <Html lang="zh-Hant">
      <Head />
      <Preview>{`知橄生活訂單成立通知 ${order.orderNo}`}</Preview>
      <Body style={{ backgroundColor: '#f7f5ef', fontFamily: 'sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', margin: '0 auto', maxWidth: '560px', padding: '32px' }}>
          <Heading as="h1" style={{ color: '#3f4a1e', fontSize: '22px', margin: '0 0 8px' }}>
            知橄生活 Olive Wisdom
          </Heading>
          <Text style={{ color: '#555', fontSize: '14px', margin: '0 0 24px' }}>
            謝謝你的訂購，我們已收到付款。
          </Text>

          <Section>
            <Text style={{ fontSize: '15px', margin: '4px 0' }}>
              訂單編號：<strong>{order.orderNo}</strong>
            </Text>
            <Text style={{ fontSize: '15px', margin: '4px 0' }}>
              訂單狀態：已付款
            </Text>
            {order.paidAt ? (
              <Text style={{ fontSize: '15px', margin: '4px 0' }}>
                付款時間：{order.paidAt.slice(0, 10)}
              </Text>
            ) : null}
          </Section>

          {order.items.length > 0 ? (
            <>
              <Hr style={{ borderColor: '#e3ddcb', margin: '20px 0' }} />
              <Section>
                {order.items.map((item) => (
                  <Text key={item.productSlug} style={{ fontSize: '15px', margin: '4px 0' }}>
                    {item.productName} × {item.qty} — {fmt(item.unitPrice * item.qty)}
                  </Text>
                ))}
              </Section>
            </>
          ) : null}

          <Hr style={{ borderColor: '#e3ddcb', margin: '20px 0' }} />
          <Text style={{ fontSize: '16px', margin: '4px 0' }}>
            總計：<strong>{fmt(order.total)}</strong>
          </Text>

          <Text style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginTop: '24px' }}>
            商品出貨時，我們會再寄一封出貨通知給你。若對訂單有任何問題，請透過網站的聯絡頁面與我們聯繫：
            https://olive-wisdom.com/contact
          </Text>
          <Text style={{ color: '#999', fontSize: '12px', marginTop: '16px' }}>
            本信由系統自動發送，請勿直接回覆。
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
