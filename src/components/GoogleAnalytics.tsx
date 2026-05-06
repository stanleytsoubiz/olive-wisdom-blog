'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JWJE0S46SE';

// ── GoogleAnalytics Component ─────────────────────────────────────────────────
// Inject GA4 only when NEXT_PUBLIC_GA_ID is set.
// Strategy: afterInteractive — safe for static export (Cloudflare Pages).
// v2.0: △3 三角驗證 GA4 強化 — scroll_depth[25/50/70/90/100] + read_time + internal_link_click + article_slug
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

          // ── Article slug：from /blog/[slug] path (for per-article GA4 drill-down)
          var _slug = (function() {
            var parts = window.location.pathname.split('/').filter(Boolean);
            return parts.length >= 2 && parts[0] === 'blog' ? parts[1] : '';
          })();

          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            article_slug: _slug,
          });

          // ── 1. Scroll Depth (25 / 50 / 70 / 90 / 100%) ──────────────
          // △3 目標：70% 閾值達成率 ≥60%
          (function() {
            var marks = [25, 50, 70, 90, 100];
            var fired = {};
            function onScroll() {
              var el = document.documentElement;
              var pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
              marks.forEach(function(m) {
                if (pct >= m && !fired[m]) {
                  fired[m] = true;
                  gtag('event', 'scroll_depth', {
                    event_category: 'engagement',
                    event_label: window.location.pathname,
                    value: m,
                    article_slug: _slug,
                    non_interaction: m < 50,
                  });
                  if (m === 100) window.removeEventListener('scroll', onScroll);
                }
              });
            }
            window.addEventListener('scroll', onScroll, { passive: true });
          })();

          // ── 2. Read Time ──────────────────────────────────────────────
          // △3 目標：平均閱讀時間 ≥5 分鐘（300 秒）
          // Tracks active time: pauses on visibilitychange hidden, resumes on visible.
          (function() {
            var _activeMs = 0;
            var _lastActive = Date.now();
            var _sent = false;

            function _sendReadTime() {
              if (_sent) return;
              _sent = true;
              var secs = Math.round(_activeMs / 1000);
              if (secs < 5) return; // ignore accidental page loads / bounces
              gtag('event', 'read_time', {
                event_category: 'engagement',
                event_label: window.location.pathname,
                value: secs,
                article_slug: _slug,
                non_interaction: true,
              });
            }

            document.addEventListener('visibilitychange', function() {
              if (document.visibilityState === 'hidden') {
                _activeMs += Date.now() - _lastActive;
                _sendReadTime();
              } else {
                _lastActive = Date.now();
                _sent = false; // allow re-send if user returns to tab
              }
            });

            window.addEventListener('pagehide', function() {
              if (!_sent) {
                _activeMs += Date.now() - _lastActive;
                _sendReadTime();
              }
            });
          })();

          // ── 3. Link Click Tracking ────────────────────────────────────
          document.addEventListener('click', function(e) {
            var a = e.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href') || '';
            var isAnchor = href === '#' || href.startsWith('#');
            var isExternal = href.startsWith('http') && !href.includes('olive-wisdom.com');
            var isAffiliate = href.includes('amzn') || href.includes('momo') ||
                              href.includes('pchome') || href.includes('affiliate') ||
                              href.includes('ref=') || href.includes('tag=');
            var isInternal = !isAnchor && !isExternal;

            if (isAffiliate) {
              gtag('event', 'affiliate_click', {
                event_category: 'monetisation',
                event_label: href,
                link_text: a.innerText ? a.innerText.substring(0, 50) : '',
                page_path: window.location.pathname,
                article_slug: _slug,
              });
            } else if (isExternal) {
              gtag('event', 'outbound_click', {
                event_category: 'engagement',
                event_label: href,
                article_slug: _slug,
              });
            } else if (isInternal) {
              // △3 目標：內部連結點擊率 ≥8%
              gtag('event', 'internal_link_click', {
                event_category: 'engagement',
                event_label: href,
                link_text: a.innerText ? a.innerText.substring(0, 50) : '',
                page_path: window.location.pathname,
                article_slug: _slug,
              });
            }
          });

          // ── 4. Subscribe Form Submit ──────────────────────────────────
          document.addEventListener('olive:subscribe', function(e) {
            gtag('event', 'generate_lead', {
              event_category: 'conversion',
              event_label: e.detail && e.detail.source ? e.detail.source : 'unknown',
              value: 1,
            });
          });

          // ── 5. Search Query ───────────────────────────────────────────
          document.addEventListener('olive:search', function(e) {
            if (e.detail && e.detail.query) {
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
