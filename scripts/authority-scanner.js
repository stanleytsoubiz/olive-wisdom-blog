
/**
 * 🫒 Olive Wisdom Authority Scanner v1.0
 * Specialized logic for Olive Oil quality metrics (IOC/Polyphenol).
 */

function scanOliveQuality(html) {
    const issues = [], warnings = [], passes = [];
    let score = 0;

    // 1. Authority Metric: IOC Standards
    if (/IOC|International Olive Council/.test(html)) {
        score += 25;
        passes.push("權威引用：包含 IOC 國際標準。");
    } else {
        warnings.push("缺乏權威引用，建議加入 IOC 標準說明。");
    }

    // 2. Technical Depth: Polyphenols/Acidity
    if (/Polyphenol|Hydroxytyrosol|多酚|羥基酪醇/.test(html)) {
        score += 25;
        passes.push("技術深度：包含多酚數據分析。");
    } else {
        issues.push("缺乏多酚數據，建議補齊 CoA 指標。");
    }

    // 3. Sensory Accuracy
    if (/果香|苦味|辛辣|Fruity|Bitter|Pungent/.test(html)) {
        score += 20;
        passes.push("感官精確：包含官方感官評定術語。");
    }

    // 4. No AI Smell (Heuristic)
    const clichés = ["總之", "值得注意的是", "此外", "在結論中"];
    const found = clichés.filter(c => html.includes(c));
    if (found.length === 0) {
        score += 30;
    } else {
        warnings.push(`偵測到 AI 常用語彙: ${found.join(', ')}`);
    }

    return { score, issues, warnings, passes };
}

console.log("--- OLIVE WISDOM QUALITY SCANNER LOADED ---");
