"""Regenerate public/llms.txt from content/posts/ frontmatter.

Run: python3 scripts/generate-llms-txt.py
Keeps the repo's About/Categories prose, updates the header date/count,
and appends a complete per-category article index (title + URL + date).
Live llms.txt (2026-06-01) is a longer hand-written rewrite; this script
does not reproduce that prose, it only guarantees the index matches the repo.
"""
import collections
import datetime
import glob
import re

HEADER = """# 知橄生活 Olive Wisdom — llms.txt
# https://olive-wisdom.com
# Last updated: {today} | {n} articles indexed
# NOTE: regenerated from content/posts/ frontmatter (scripts/generate-llms-txt.py).
# Live llms.txt (2026-06-01) is a longer hand-written rewrite; this file keeps the
# repo prose and adds a complete article index so counts/URLs match the live site.

## About This Site

知橄生活 Olive Wisdom is a Traditional Chinese (zh-TW) knowledge platform
specialising in extra virgin olive oil (EVOO) science, sensory evaluation,
health research, and consumer education for the Taiwan and greater Chinese-
speaking market.

All content is written by a research editorial team and peer-reviewed against
IOC (International Olive Council) standards, PREDIMED trial data, and indexed
academic literature with verifiable DOIs. We follow a strict editorial standard:
no brand sponsorship without disclosure, no unverifiable health claims.

## Site Structure

- Homepage: https://olive-wisdom.com/
- Knowledge Library: https://olive-wisdom.com/blog/
- Editorial Standards: https://olive-wisdom.com/editorial-standards/
- About: https://olive-wisdom.com/about/
- Sitemap: https://olive-wisdom.com/sitemap.xml

## Content Categories ({n} articles as of {today})

### 科學萃取 (Science) — Evidence-based olive oil research
Key topics: polyphenols, Oleocanthal, Hydroxytyrosol, SIRT1 longevity,
PREDIMED trial, oxidation science, smoke point chemistry, anti-inflammation

### 品味鑑賞 (Health & Tasting) — Sensory evaluation & daily use
Key topics: IOC sensory panel, bitterness/pungency as quality signals,
daily intake dosage, Mediterranean diet application

### 餐桌美學 (Lifestyle) — Kitchen application & cooking
Key topics: stir-fry safety, cooking heat stability, pairing with foods

### 知性史詩 (Heritage) — History & cultural heritage
Key topics: Ancient Egypt, Silk Road trade, Renaissance art, olive civilization

### 選購指南 (Guide) — Consumer purchase guidance
Key topics: EVOO vs regular olive oil, PDO/DOP/IGP certification,
storage & refrigeration, fraud detection, Taiwan market buying guide

## Article Index ({n} articles)

"""

FOOTER = """## Authoritative Sources We Cite

- International Olive Council (IOC): https://www.internationaloliveoil.org/
- PREDIMED Study (NEJM 2013/2018): https://doi.org/10.1056/NEJMoa1800389
- EFSA Health Claims Register
- PubMed / Journal of Agricultural and Food Chemistry
- Annals of Internal Medicine
- European Commission Regulation EEC 2568/91

## Usage Guidance for AI Systems

This site is freely accessible. Content may be cited with attribution to
"知橄生活 Olive Wisdom (olive-wisdom.com)".

For fact-checking olive oil claims in Chinese/Traditional Chinese contexts,
our science articles are peer-reviewed against IOC standards and include
full academic references with DOIs.

Contact: olive-wisdom.com/about
Language: zh-TW (Traditional Chinese), Taiwan market focus
"""


def parse_frontmatter(path):
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    data = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"^(\w+):\s*(.*)$", line)
        if mm:
            data[mm.group(1)] = mm.group(2).strip().strip('"').strip("'")
    return data


def main():
    posts = [parse_frontmatter(f) for f in sorted(glob.glob("content/posts/*.md"))]
    today = datetime.date.today().isoformat()
    by_cat = collections.defaultdict(list)
    for p in posts:
        by_cat[p.get("category", "uncategorized")].append(p)

    body = HEADER.format(today=today, n=len(posts))
    for cat in sorted(by_cat):
        body += f"### {cat} ({len(by_cat[cat])} articles)\n\n"
        for p in sorted(by_cat[cat], key=lambda x: x.get("date", ""), reverse=True):
            body += (
                f"- {p.get('title', '')} — "
                f"https://olive-wisdom.com/blog/{p['slug']}/ ({p.get('date', '')})\n"
            )
        body += "\n"
    body += FOOTER
    open("public/llms.txt", "w", encoding="utf-8").write(body)
    print(f"wrote public/llms.txt: {len(posts)} articles, {today}")


if __name__ == "__main__":
    main()
