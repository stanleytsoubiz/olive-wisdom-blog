#!/usr/bin/env python3
"""
知橄生活 Olive Wisdom — 文章同步腳本
用法: python3 scripts/sync-articles.py
功能: 讀取 content/posts/*.md → 更新 JS bundle 的 Ua 陣列 → 自動部署
"""
import re, os, glob, json, subprocess, sys
from datetime import datetime

BUNDLE = 'public/assets/index-6EDA4CED.js'
BUNDLE2 = 'public/assets/index-BxRycmCb.js'
POSTS_DIR = 'content/posts'

CATEGORY_MAP = {
    'science': {'label': '科學萃取', 'labelEn': 'Science', 'readTime': 8},
    'heritage': {'label': '知性史詩', 'labelEn': 'Heritage', 'readTime': 9},
    'selection': {'label': '品味鑑賞', 'labelEn': 'Selection', 'readTime': 7},
    'lifestyle': {'label': '餐桌美學', 'labelEn': 'Lifestyle', 'readTime': 7},
}

DEFAULT_IMAGES = {
    'science': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80',
    'heritage': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80',
    'selection': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&auto=format&fit=crop&q=80',
    'lifestyle': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop&q=80',
}

def parse_frontmatter(content):
    """解析 Markdown frontmatter"""
    meta = {}
    body = content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            fm = parts[1].strip()
            body = parts[2].strip()
            for line in fm.split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    k = k.strip()
                    v = v.strip().strip('"\'')
                    if k == 'tags':
                        v = [t.strip().strip('"\'') for t in v.strip('[]').split(',') if t.strip()]
                    meta[k] = v
    return meta, body

def markdown_to_content_blocks(body):
    """將 Markdown body 轉換為 content blocks"""
    blocks = []
    lines = body.split('\n')
    current_para = []
    
    for line in lines:
        line = line.rstrip()
        if not line:
            if current_para:
                text = ' '.join(current_para).strip()
                if text:
                    blocks.append({'type': 'paragraph', 'text': text})
                current_para = []
        elif line.startswith('## '):
            if current_para:
                blocks.append({'type': 'paragraph', 'text': ' '.join(current_para)})
                current_para = []
            blocks.append({'type': 'heading', 'text': line[3:].strip()})
        elif line.startswith('### '):
            if current_para:
                blocks.append({'type': 'paragraph', 'text': ' '.join(current_para)})
                current_para = []
            blocks.append({'type': 'heading', 'text': line[4:].strip()})
        elif line.startswith('> '):
            if current_para:
                blocks.append({'type': 'paragraph', 'text': ' '.join(current_para)})
                current_para = []
            blocks.append({'type': 'quote', 'text': line[2:].strip()})
        elif re.match(r'^[\d]+\. |^- |^\* ', line):
            item = re.sub(r'^[\d]+\. |^- |^\* ', '', line).strip()
            if item:
                blocks.append({'type': 'list', 'items': [item]})
        else:
            current_para.append(line)
    
    if current_para:
        text = ' '.join(current_para).strip()
        if text:
            blocks.append({'type': 'paragraph', 'text': text})
    
    # 合併相鄰的 list blocks
    merged = []
    for b in blocks:
        if b['type'] == 'list' and merged and merged[-1]['type'] == 'list':
            merged[-1]['items'].extend(b['items'])
        else:
            merged.append(b)
    
    return merged

def article_to_js_object(meta, body, slug):
    """將文章轉換為 JS bundle 格式"""
    cat = meta.get('category', 'science').lower()
    cat_info = CATEGORY_MAP.get(cat, CATEGORY_MAP['science'])
    
    # 計算閱讀時間（每分鐘 200 字）
    word_count = len(body.replace('\n', ' ').split())
    read_time = max(3, round(word_count / 200))
    
    title = meta.get('title', slug)
    subtitle = meta.get('subtitle', '')
    excerpt = meta.get('excerpt', body[:150].replace('\n', ' ').strip() + '...')
    date = meta.get('date', datetime.now().strftime('%Y-%m-%d'))
    image = meta.get('coverImage') or meta.get('image', DEFAULT_IMAGES.get(cat, DEFAULT_IMAGES['science']))
    tags = meta.get('tags', [])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(',')]
    
    content_blocks = markdown_to_content_blocks(body)
    
    # 構建 JS object string（手動序列化避免 JSON 轉義問題）
    def esc(s):
        return str(s).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '')
    
    tags_js = ','.join([f'"{esc(t)}"' for t in tags])
    
    def block_to_js(b):
        t = b['type']
        if t == 'heading':
            return f'{{type:"heading",text:"{esc(b["text"])}"}}'
        elif t == 'paragraph':
            return f'{{type:"paragraph",text:"{esc(b["text"])}"}}'
        elif t == 'quote':
            return f'{{type:"quote",text:"{esc(b["text"])}"}}'
        elif t == 'list':
            items_js = ','.join([f'"{esc(i)}"' for i in b['items']])
            return f'{{type:"list",items:[{items_js}]}}'
        return f'{{type:"paragraph",text:""}}'
    
    content_js = ','.join([block_to_js(b) for b in content_blocks])
    
    obj = (
        f'{{slug:"{slug}",'
        f'title:"{esc(title)}",'
        f'subtitle:"{esc(subtitle)}",'
        f'category:"{cat}",'
        f'categoryLabel:"{cat_info["label"]}",'
        f'date:"{date}",'
        f'readTime:{read_time},'
        f'image:"{esc(image)}",'
        f'excerpt:"{esc(excerpt)}",'
        f'tags:[{tags_js}],'
        f'content:[{content_js}]}}'
    )
    return obj

def sync_articles():
    print("=" * 60)
    print("知橄生活 文章同步工具")
    print("=" * 60)
    
    # 讀取所有 Markdown 文章
    md_files = sorted(glob.glob(f'{POSTS_DIR}/*.md'))
    print(f"\n發現 {len(md_files)} 篇文章：")
    
    articles_js = []
    for md_path in md_files:
        slug = os.path.basename(md_path).replace('.md', '')
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        meta, body = parse_frontmatter(content)
        js_obj = article_to_js_object(meta, body, slug)
        articles_js.append(js_obj)
        print(f"  ✅ {slug[:50]}")
    
    # 讀取 bundle
    with open(BUNDLE, 'r') as f:
        code = f.read()
    
    # 找 Ua 陣列的位置
    # 格式：Ua=[{slug:...,title:...},{...}]
    ua_match = re.search(r'(Ua\s*=\s*)\[(\{slug:"[^"]+?".*?)\](?=,\s*[A-Za-z])', code, re.DOTALL)
    if not ua_match:
        # 嘗試另一種匹配
        ua_match = re.search(r'(const\s+Ua\s*=\s*)\[', code)
        if not ua_match:
            print("\n❌ 找不到 Ua 陣列！請手動更新 bundle。")
            return False
    
    new_ua = 'Ua=[' + ','.join(articles_js) + ']'
    
    # 找到並替換整個 Ua 陣列
    # 使用精確邊界匹配
    ua_start = code.find('Ua=[{slug:')
    if ua_start < 0:
        print("❌ Ua 陣列起點未找到")
        return False
    
    # 找結束位置（平衡括號）
    depth = 0
    i = ua_start + 3  # 跳過 'Ua='
    ua_array_start = i
    for i in range(ua_array_start, len(code)):
        if code[i] == '[': depth += 1
        elif code[i] == ']':
            depth -= 1
            if depth == 0:
                ua_array_end = i + 1
                break
    
    old_ua = code[ua_start:ua_array_end]
    print(f"\n舊 Ua 陣列：{len(old_ua)} chars，{old_ua.count('slug:')} 篇文章")
    
    new_code = code[:ua_start] + new_ua + code[ua_array_end:]
    print(f"新 Ua 陣列：{len(new_ua)} chars，{len(articles_js)} 篇文章")
    
    # 語法驗證
    try:
        import subprocess
        result = subprocess.run(
            ['node', '-e', f'try{{new Function({json.dumps(new_code)});console.log("OK")}}catch(e){{console.log("ERR:"+e.message)}}'],
            capture_output=True, text=True, timeout=15
        )
        if 'OK' in result.stdout:
            print("✅ JS 語法驗證通過")
        else:
            print(f"❌ JS 語法錯誤：{result.stdout[:100]}")
            return False
    except:
        print("⚠ 跳過語法驗證")
    
    # 寫入
    with open(BUNDLE, 'w') as f:
        f.write(new_code)
    with open(BUNDLE2, 'w') as f:
        f.write(new_code)
    
    print(f"\n✅ 已更新：{BUNDLE}")
    return True

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    success = sync_articles()
    if success:
        print("\n下一步：git add -A && git commit -m '同步文章' && git push")
    sys.exit(0 if success else 1)
