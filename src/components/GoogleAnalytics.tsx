'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JWJE0S46SE';

// ── GoogleAnalytics Component ─────────────────────────────────────────────────
// Inject GA4 only when NEXT_PUBLIC_GA_ID is set.
// Strategy: afterInteractive — safe for static export (Cloudflare Pages).
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
          });

          // ── Olive Wisdom Custom Events ──────────────────────────────────
          // 1. Scroll Depth (25 / 50 / 75 / 100%)
          (function() {
            const marks = [25, 50, 75, 100];
            const fired = new Set();
            function onScroll() {
              const el = document.documentElement;
              const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
              marks.forEach(m => {
                if (pct >= m && !fired.has(m)) {
                  fired.add(m);
                  gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: window.location.pathname,
                    value: m,
                    non_interaction: m < 50,
                  });
                  if (m === 100) window.removeEventListener('scroll', onScroll);
                }
              });
            }
            window.addEventListener('scroll', onScroll, { passive: true });
          })();

          // 2. Affiliate / External Link Click
          document.addEventListener('click', function(e) {
            const a = e.target.closest('a[href]');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            const isExternal = href.startsWith('http') && !href.includes('olive-wisdom.com');
            const isAffiliate = href.includes('amzn') || href.includes('momo') ||
                                href.includes('pchome') || href.includes('affiliate') ||
                                href.includes('ref=') || href.includes('tag=');
            if (isAffiliate) {
              gtag('event', 'affiliate_click', {
                event_category: 'monetisation',
                event_label: href,
                link_text: a.innerText?.substring(0, 50) || '',
                page_path: window.location.pathname,
              });
            } else if (isExternal) {
              gtag('event', 'outbound_click', {
                event_category: 'engagement',
                event_label: href,
              });
            }
          });

          // 3. Subscribe Form Submit
          document.addEventListener('olive:subscribe', function(e) {
            gtag('event', 'generate_lead', {
              event_category: 'conversion',
              event_label: e.detail?.source || 'unknown',
              value: 1,
            });
          });

          // 4. Search Query
          document.addEventListener('olive:search', function(e) {
            if (e.detail?.query) {
              gtag('event', 'search', {
                search_term: e.detail.query,
              });
            }
          });
        `}
      </Script>
    </>
  );
}

// ── Helper: fire subscribe event from anywhere ────────────────────────────────
export function trackSubscribe(source: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('olive:subscribe', { detail: { source } }));
}

// ── Helper: fire search event ─────────────────────────────────────────────────
export function trackSearch(query: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('olive:search', { detail: { query } }));
}
