
/* ══════════════════════════════════════════════════════════
   知橄生活 Olive Wisdom — 國際頂級部落格功能增強模組
   版本: 2026.04.12 v4.2
   修復: F2 component 讀 e.content 但資料用 text 屬性
         → 直接從 Fiber 取 content blocks，填回 DOM H2/P
         → DOM text walker 修復 **bold** → <strong>
         → list items 的 **粗體** 全修復
══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── 1. 閱讀進度條 ────────────────────────────────────────
  function initProgressBar() {
    if (document.getElementById('ow-progress-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'ow-progress-bar';
    bar.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;height:3px;width:0%;background:linear-gradient(to right,#3d6b3f,#7ab87d);transition:width 120ms linear;box-shadow:0 0 6px rgba(61,107,63,0.5);pointer-events:none;';
    document.body.appendChild(bar);
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = document.documentElement;
          const scrollTop = el.scrollTop || document.body.scrollTop;
          const scrollH = el.scrollHeight - el.clientHeight;
          bar.style.width = scrollH > 0 ? (scrollTop / scrollH * 100) + '%' : '0%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── 2. 核心修復：從 React Fiber 讀取文章資料，填入空 DOM ─
  function getArticleFromFiber() {
    const root = document.getElementById('root');
    if (!root) return null;
    const fiberKey = Object.keys(root).find(k => k.startsWith('__reactContainer'));
    if (!fiberKey) return null;
    const allArticles = [];
    const seen = new Set();
    function walk(node, d) {
      if (!node || d > 200) return;
      const p = node.memoizedProps;
      if (p && p.article && Array.isArray(p.article.content) && p.article.content.length > 3) {
        if (!seen.has(p.article.slug)) { seen.add(p.article.slug); allArticles.push(p.article); }
      }
      if (p && p.section && p.section.type) {
        // 找到單個 block
      }
      walk(node.child, d+1); walk(node.sibling, d+1);
    }
    walk(root[fiberKey], 0);
    const slug = window.location.hash.replace('#/article/', '').split('?')[0];
    return allArticles.find(a => a.slug === slug) || allArticles[0] || null;
  }

  // inline Markdown 渲染
  function renderInline(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong style="font-weight:700;">$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/`([^`\n]+)`/g, '<code style="background:#f0ede5;padding:1px 5px;border-radius:3px;font-size:0.9em;">$1</code>');
  }

  // Markdown 表格渲染
  function renderTable(text) {
    const lines = text.trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 3) return null;
    const headers = lines[0].split('|').filter(c => c.trim()).map(c => renderInline(c.trim()));
    const rows = lines.slice(2).map(l => l.split('|').filter(c => c.trim()).map(c => renderInline(c.trim())));
    return `<div style="overflow-x:auto;margin:16px 0;"><table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead><tr style="background:#2d5a3d;color:#fff;">${headers.map(h => `<th style="padding:8px 12px;text-align:left;border:1px solid #3d6b3f;">${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r, i) => `<tr style="background:${i%2===0?'#fff':'#f8f6f1'};">${r.map(c => `<td style="padding:7px 12px;border:1px solid #e8e0d0;">${c}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  }

  // ── 行內 Markdown 渲染（text → HTML）───────────────────────
  function inlineMarkdown(s) {
    return String(s || '')
      .replace(/\*\*\*([^*\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong style="font-weight:700;color:#1a1a18;">$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/`([^`\n]+)`/g, '<code style="background:#f0ede5;padding:1px 5px;border-radius:3px;font-size:.9em;">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#3d6b3f;text-decoration:underline;">$1</a>');
  }

  function fillArticleContent() {
    if (!window.location.hash.includes('/article/')) return;

    // ── 策略 A：直接從每個空 DOM 元素的 Fiber section.text 填入 ──────
    // 根因：F2 component 讀 e.content，但資料用 e.text
    // 解法：找每個 h2/p 的 React Fiber → parent(F2).memoizedProps.section.text

    function fillFromFiberSections() {
      const container = document.querySelector('.space-y-8');
      if (!container) return 0;
      let filled = 0;

      function getFiberKey(el) {
        return Object.keys(el).find(k =>
          k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance')
        );
      }

      // 填 H2 標題
      container.querySelectorAll('h2').forEach(h2 => {
        if (h2.textContent.trim()) return; // 已有內容則跳過
        const fk = getFiberKey(h2);
        if (!fk) return;
        const parent = h2[fk].return;
        const section = parent && parent.memoizedProps && parent.memoizedProps.section;
        if (section && section.text) {
          h2.innerHTML = inlineMarkdown(section.text);
          filled++;
        }
      });

      // 填 P 段落
      container.querySelectorAll('p').forEach(p => {
        if (p.textContent.trim()) return; // 已有內容則跳過
        const fk = getFiberKey(p);
        if (!fk) return;
        const parent = p[fk].return;
        const section = parent && parent.memoizedProps && parent.memoizedProps.section;
        if (section && section.text) {
          p.innerHTML = inlineMarkdown(section.text);
          filled++;
        }
      });

      // 填 blockquote 引用
      container.querySelectorAll('blockquote p').forEach(bqp => {
        if (bqp.textContent.trim()) return;
        const fk = getFiberKey(bqp);
        if (!fk) return;
        const grandParent = bqp[fk].return && bqp[fk].return.return;
        const section = grandParent && grandParent.memoizedProps && grandParent.memoizedProps.section;
        if (section && section.text) {
          bqp.innerHTML = inlineMarkdown(section.text);
          filled++;
        }
      });

      return filled;
    }

    // ── 策略 B：DOM text-node walker — 修復所有殘留 **bold** ──────────────
    function fixBoldInDom() {
      const inlineEl = new Set(['SPAN','P','LI','H1','H2','H3','H4','BLOCKQUOTE','DIV','TD','TH']);
      let fixed = 0;
      // 修復含有 **...** 的元素的 innerHTML
      document.querySelectorAll(
        '.space-y-8 p, .space-y-8 li, .space-y-8 span, .space-y-8 h2, .space-y-8 h3, .space-y-8 blockquote'
      ).forEach(el => {
        if (/\*\*/.test(el.innerHTML)) {
          el.innerHTML = el.innerHTML
            .replace(/\*\*\*([^*<\n]+)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*([^*<\n]+)\*\*/g,     '<strong style="font-weight:700;color:#1a1a18;">$1</strong>')
            .replace(/\*([^*<\n]+)\*/g,          '<em>$1</em>');
          fixed++;
        }
      });
      return fixed;
    }

    // ── 執行兩層修復 ────────────────────────────────────────────────────
    fillFromFiberSections();
    // 無論 Fiber 是否成功，都執行 DOM bold 修復（處理 list items 等剩餘情況）
    fixBoldInDom();
  }

  // ── 3. 閱讀時間重新計算 ──────────────────────────────────
  function recalcReadTime() {
    if (!window.location.hash.includes('/article/')) return;
    const article = getArticleFromFiber();
    if (!article) return;
    const allText = article.content.map(b => b.text || b.content || (b.items||[]).join(' ')).join(' ');
    const zhCount = (allText.match(/[\u4e00-\u9fff]/g) || []).length;
    const minutes = Math.max(8, Math.ceil(zhCount / 350));
    const allSpans = document.querySelectorAll('span');
    allSpans.forEach(span => {
      if (span.textContent.trim() === '3') {
        const next = span.nextSibling || span.nextElementSibling;
        if (next && next.textContent && next.textContent.includes('分鐘')) span.textContent = String(minutes);
      }
    });
  }

  // ── 4. 強化 TOC（填入標題文字後再建立）────────────────────
  function buildTOC() {
    if (!window.location.hash.includes('/article/')) return;
    if (document.getElementById('ow-toc-v2')) return;
    const container = document.querySelector('.space-y-8');
    if (!container) return;
    const headings = Array.from(container.querySelectorAll('h2')).filter(h => {
      const t = h.textContent.trim();
      return t && !/(延伸閱讀|口袋手冊|訂閱|週報)/.test(t);
    });
    if (headings.length < 2) return;
    headings.forEach((h, i) => { h.id = 'ow-h-' + i; });

    // 隱藏舊 TOC（只顯示數字）
    const oldTocs = Array.from(document.querySelectorAll('div')).filter(d => {
      const links = d.querySelectorAll('a');
      return links.length >= 3 && Array.from(links).slice(0,3).every(l => /^\d{1,2}$/.test(l.textContent.trim()));
    });
    oldTocs.forEach(t => { t.style.display = 'none'; });

    const toc = document.createElement('div');
    toc.id = 'ow-toc-v2';
    toc.style.cssText = 'background:#f8f6f1;border:1px solid #e8e0d0;border-radius:12px;padding:18px 20px;margin:24px 0;';
    toc.innerHTML = `<div style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#8a7d6a;margin-bottom:12px;">📋 文章目錄</div>
      <ol style="margin:0;padding:0;list-style:none;">${headings.map((h,i)=>`
        <li style="margin:5px 0;"><a href="#ow-h-${i}" onclick="document.getElementById('ow-h-${i}').scrollIntoView({behavior:'smooth'});return false;"
          style="color:#4a7c5c;text-decoration:none;font-size:13.5px;display:flex;gap:8px;align-items:start;line-height:1.4;"
          onmouseover="this.style.color='#2d5a3d'" onmouseout="this.style.color='#4a7c5c'">
          <span style="color:#9db89e;font-family:monospace;font-size:11px;min-width:22px;">${String(i+1).padStart(2,'0')}</span>
          <span>${h.textContent.trim()}</span></a></li>`).join('')}
      </ol>`;
    headings[0].parentNode.insertBefore(toc, headings[0]);
  }

  // ── 5. 參考文獻區塊 ─────────────────────────────────────
  function addReferences() {
    if (!window.location.hash.includes('/article/')) return;
    if (document.getElementById('ow-refs')) return;
    const article = getArticleFromFiber();
    const slug = window.location.hash.replace('#/article/','').split('?')[0];
    const REFS = {
      'oleocanthal-anti-inflammation-brain-protection': ['Beauchamp, G.K. et al. (2005). Phytochemistry: ibuprofen-like activity in extra-virgin olive oil. <em>Nature</em>, 437, 45–46.','Lucas, L. et al. (2011). Anti-inflammatory benefits of virgin olive oil and Oleocanthal. <em>Current Pharmaceutical Design</em>, 17(8), 754–768.','Abuznait, A.H. et al. (2013). Oleocanthal enhances β-amyloid clearance. <em>ACS Chemical Neuroscience</em>, 4(6), 973–982.','PREDIMED (2013). Mediterranean Diet & Cardiovascular Disease. <em>NEJM</em>, 368, 1279–1290.'],
      'hydroxytyrosol-brain-cognition-memory': ['EFSA (2011). Health claims on polyphenols in olive oil. <em>EFSA Journal</em>, 9(4), 2033.','Martínez-Lapiscina et al. (2013). Mediterranean diet improves cognition: PREDIMED-NAVARRA. <em>J Neurology</em>, 84(12).'],
      'evoo-sensory-evaluation-ioc-standards': ['International Olive Council (2015). Trade standard applying to olive oils. COI/T.15/NC No 3/Rev. 13.'],
      'evoo-buying-guide-2026': ['International Olive Council (2019). World Olive Oil Figures. Madrid.','Frankel, E.N. (2010). Chemistry of extra virgin olive oil. <em>JAFC</em>, 58(10).'],
    };
    const refs = REFS[slug];
    if (!refs) return;
    const extH2 = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('延伸閱讀'));
    if (!extH2) return;
    const block = document.createElement('div');
    block.id = 'ow-refs';
    block.style.cssText = 'margin:36px 0 28px;padding:18px 22px;background:#f8f6f1;border-left:3px solid #3d6b3f;border-radius:0 8px 8px 0;';
    block.innerHTML = `<div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a7d6a;margin-bottom:12px;">📚 參考文獻</div>
      <ol style="margin:0;padding-left:18px;">${refs.map(r=>`<li style="font-size:12.5px;color:#5a5040;line-height:1.75;margin-bottom:6px;">${r}</li>`).join('')}</ol>
      <p style="font-size:11px;color:#8a7d6a;margin:10px 0 0;font-style:italic;">本文資訊僅供教育參考，不構成醫療建議。</p>`;
    extH2.parentNode.insertBefore(block, extH2);
  }

  // ── 6. 作者 Bio 強化 ─────────────────────────────────────
  function enhanceAuthorBio() {
    const owSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'OW');
    if (!owSpan) return;
    const bioWrap = owSpan.closest('[class*="rounded-full"]');
    if (!bioWrap || bioWrap.dataset.enhanced) return;
    bioWrap.dataset.enhanced = '1';
    bioWrap.innerHTML = '';
    bioWrap.style.cssText += 'overflow:hidden;width:52px;height:52px;border:2px solid rgba(61,107,63,0.2);';
    const img = document.createElement('img');
    img.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80';
    img.alt = '編輯團隊'; img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    bioWrap.appendChild(img);
    const bioContainer = bioWrap.parentElement;
    if (!bioContainer) return;
    const bioTextDiv = bioContainer.querySelector('div:last-child');
    if (!bioTextDiv || bioTextDiv.dataset.badgesAdded) return;
    bioTextDiv.dataset.badgesAdded = '1';
    const badges = document.createElement('div');
    badges.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;';
    badges.innerHTML = '<span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#e8f0ea;color:#3d6b3f;font-weight:600;">✓ 醫學審查</span><span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#e8f0f4;color:#2e6b8a;font-weight:600;">🎓 科學實證</span><span style="font-size:10px;padding:2px 8px;border-radius:99px;background:#f4f0e8;color:#7a5c2e;font-weight:600;">🏆 IOC 認證</span>';
    bioTextDiv.appendChild(badges);
  }

  // ── 7. Footer 社群連結 & 連結修復 ──────────────────────────

  // ── 行動端 Header Nav 隱藏（P1 RWD）─────────────────────
  function hideHeaderNavOnMobile() {
    if (window.innerWidth > 768) return;  // 桌機不執行
    const header = document.querySelector('header');
    if (!header) return;
    // 找 header 內的 nav 元素
    const nav = header.querySelector('nav');
    if (nav) {
      nav.style.cssText = 'display:none!important;visibility:hidden!important;';
      nav.setAttribute('aria-hidden', 'true');
    }
    // 找包含 3 個以上導航連結的容器 div（排除 Logo）
    const allDivs = header.querySelectorAll('div');
    allDivs.forEach(function(div) {
      const links = div.querySelectorAll('a[href]');
      // 如果有 3+ 個連結且包含典型導航文字，就隱藏
      const texts = Array.from(links).map(a => a.textContent.trim());
      const navWords = ['知性史詩','科學萃取','品味鑑賞','餐桌美學','關於知橄'];
      const isNavContainer = navWords.filter(w => texts.some(t => t.includes(w))).length >= 2;
      if (isNavContainer) {
        div.style.cssText = 'display:none!important;visibility:hidden!important;';
      }
    });
  }

  function addSocialLinks() {
    const copyrightDivs = Array.from(document.querySelectorAll('div')).filter(d =>
      d.textContent.includes('ALL RIGHTS RESERVED') && d.textContent.includes('知橄生活'));
    if (!copyrightDivs.length) return;
    const copyrightBar = copyrightDivs[0].closest('[class*="border-t"]') || copyrightDivs[0].parentElement;
    if (!copyrightBar || copyrightBar.dataset.socialAdded) return;
    copyrightBar.dataset.socialAdded = '1';
    const socialDiv = document.createElement('div');
    socialDiv.style.cssText = 'display:flex;align-items:center;gap:14px;margin-top:12px;justify-content:center;';
    socialDiv.innerHTML = `<a href="https://instagram.com/olivewisdom" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.45);transition:color 0.2s;" onmouseover="this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.color='rgba(255,255,255,0.45)'"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
    <a href="https://facebook.com/olivewisdom" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.45);font-size:11px;font-weight:600;transition:color 0.2s;" onmouseover="this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.color='rgba(255,255,255,0.45)'">Facebook</a>
    <span style="color:rgba(255,255,255,0.2);">|</span>
    <a href="https://line.me" target="_blank" rel="noopener" style="color:rgba(255,255,255,0.45);font-size:11px;font-weight:600;transition:color 0.2s;" onmouseover="this.style.color='rgba(255,255,255,0.85)'" onmouseout="this.style.color='rgba(255,255,255,0.45)'">LINE</a>`;
    copyrightBar.appendChild(socialDiv);
  }

  function fixFooterLinks() {
    document.querySelectorAll('footer a, [class*="footer"] a').forEach(link => {
      const text = link.textContent.trim();
      if ((text === '隱私政策' || text === '使用條款') && link.href.includes('/article/')) {
        link.removeAttribute('href');
        link.style.cursor = 'pointer';
        link.onclick = (e) => { e.preventDefault(); alert(text + '頁面即將上線，感謝您的耐心等待。'); };
      }
    });
  }

  // ── 8. 搜尋快捷鍵 ────────────────────────────────────────
  function enhanceSearch() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.querySelector('[href*="/search"]');
        if (searchBtn) searchBtn.click();
      }
    });
  }

  // ── 9. 圖片 lazy loading ──────────────────────────────────
  function addArticleEnhancements() {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading = 'lazy'; img.decoding = 'async';
    });
  }

  // ── 執行器 ────────────────────────────────────────────────
  let lastUrl = '', runTimer = null;

  function runAll() {
    initProgressBar();
    enhanceSearch();

    const apply = () => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        clearTimeout(runTimer);
        runTimer = setTimeout(() => {
          const isArticle = url.includes('/article/');
          if (isArticle) {
            // v4.3 修復：等待 .space-y-8 container 且至少一個 h2 有 Fiber parent section
            let retryCount = 0;
            function tryFill() {
              const container = document.querySelector('.space-y-8');
              if (container) {
                // 額外確認：第一個 h2 的 Fiber parent 是否有 section.text
                const firstH2 = container.querySelector('h2');
                let fiberReady = false;
                if (firstH2) {
                  const fk = Object.keys(firstH2).find(k => k.startsWith('__reactFiber'));
                  const parent = fk && firstH2[fk].return;
                  fiberReady = parent && parent.memoizedProps && parent.memoizedProps.section;
                }
                if (fiberReady || retryCount >= 15) {
                  fillArticleContent();
                  recalcReadTime();
                  buildTOC();
                  enhanceAuthorBio();
                  addReferences();
                  // 額外延遲重跑一次，確保非同步渲染的元素也被修復
                  setTimeout(fillArticleContent, 1200);
                } else {
                  retryCount++;
                  setTimeout(tryFill, 400);
                }
              } else if (retryCount < 25) {
                retryCount++;
                setTimeout(tryFill, 400);
              }
            }
            tryFill();
          }
          hideHeaderNavOnMobile();
          addSocialLinks();
          addArticleEnhancements();
          fixFooterLinks();
        }, 800);
      }
    };

    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runAll);
  else runAll();
})();
