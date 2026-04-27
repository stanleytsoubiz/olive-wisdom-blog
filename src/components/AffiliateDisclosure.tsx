
import React from 'react';

const AffiliateDisclosure: React.FC<{ content: string }> = ({ content }) => {
  const patterns = [/amazon\./i, /amzn\.to/i, /shopee\.tw/i, /shope\.ee/i, /rstyle\.me/i, /shopstyle\.com/i, /\/re\//i];
  const hasAffiliate = patterns.some(p => p.test(content));

  if (!hasAffiliate) return null;

  return (
    <div className="bg-olive-50/50 border-l-4 border-olive-400 rounded-r-xl px-6 py-4 mb-8 text-sm text-gray-500 leading-relaxed shadow-sm">
      <p>
        <strong className="text-olive-800">☕ 利益揭露：</strong>
        本篇文章包含聯盟行銷連結。若您透過連結購買，我們可能會獲得小額佣金，這有助於維持 <strong>知橄生活 (Olive Wisdom)</strong> 的優質內容營運，且不會增加您的購買成本。感謝您的支持！
      </p>
    </div>
  );
};

export default AffiliateDisclosure;
