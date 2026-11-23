// 出貨通知信（交易信）— React Email template.
// Call site is reserved for the fulfilment flow (Phase 1 has no shipping
// admin yet); the function + template are ready in src/lib/mail/index.ts.
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { OrderRecord } from '../../commerce/orders';

export interface ShippingNotificationProps {
  order: OrderRecord;
  carrier?: string;
  trackingNumber?: string;
}

export function ShippingNotificationEmail({ order, carrier, trackingNumber }: ShippingNotificationProps) {
  return (
    <Html lang="zh-Hant">
      <Head />
      <Preview>{`知橄生活訂單已出貨 ${order.orderNo}`}</Preview>
      <Body style={{ backgroundColor: '#f7f5ef', fontFamily: 'sans-serif', margin: 0, padding: '24px 0' }}>
        <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', margin: '0 auto', maxWidth: '560px', padding: '32px' }}>
          <Heading as="h1" style={{ color: '#3f4a1e', fontSize: '22px', margin: '0 0 8px' }}>
            知橄生活 Olive Wisdom
          </Heading>
          <Text style={{ color: '#555', fontSize: '14px', margin: '0 0 24px' }}>
            你的訂單已經出貨，正在送往你指定的地址。
          </Text>

          <Section>
            <Text style={{ fontSize: '15px', margin: '4px 0' }}>
              訂單編號：<strong>{order.orderNo}</strong>
            </Text>
            {carrier ? (
              <Text style={{ fontSize: '15px', margin: '4px 0' }}>
                物流公司：{carrier}
              </Text>
            ) : null}
            {trackingNumber ? (
              <Text style={{ fontSize: '15px', margin: '4px 0' }}>
                追蹤編號：{trackingNumber}
              </Text>
            ) : null}
          </Section>

          <Text style={{ color: '#555', fontSize: '14px', lineHeight: '1.7', marginTop: '24px' }}>
            收到商品後，若有任何問題，請在七天內透過網站的聯絡頁面與我們聯繫：
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
