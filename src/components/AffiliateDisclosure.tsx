
import React from 'react';

const AffiliateDisclosure: React.FC<{ content: string }> = ({ content }) => {
  const patterns = [/amazon\./i, /amzn\.to/i, /shopee\.tw/i, /shope\.ee/i, /rstyle\.me/i, /shopstyle\.com/i, /\/re\//i];
  const hasAffiliate = patterns.some(p => p.test(content));

  if (!hasAffiliate) return null;

  return (
    <div className="bg-olive-50/50 border-l-4 border-olive-400 rounded-r-xl px-6 py-4 mb-8 text-sm text-gray-500 leading-relaxed shadow-sm">
      <p>
        利益揭露：知橄生活不接受品牌付費置入或廣告委刊。若文章中的購買連結產生佣金（聯盟行銷），該佣金不影響選油標準——推薦只依 IOC 標準、採收年份與 CoA 數據決定。
      </p>
    </div>
  );
};

export default AffiliateDisclosure;
