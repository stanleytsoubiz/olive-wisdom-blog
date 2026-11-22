#!/usr/bin/env python3
"""
optimize-covers.py — convert local article covers JPG -> WebP (one-time).

Why this exists: the site is a static export (next.config.js:
output 'export' + images.unoptimized), so next/image cannot optimise
anything — covers were served as 1408px JPG originals (~16 MB for
46 files). The fix is to optimise the assets themselves:
  * max width 1200px (largest display is the 1152px article hero),
  * WebP quality 82 (visually identical for these AI-generated covers),
  * references rewritten in content/posts frontmatter + public/data/images.json,
  * original JPGs deleted (orphan JPGs in the folder are deleted too).

Usage: python3 scripts/optimize-covers.py
Requires: Pillow (pip install pillow). Re-running after a conversion is
a no-op (no .jpg covers left). New covers added later as JPG: run again.
"""
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS = os.path.join(ROOT, "public", "images", "covers")
MAX_W = 1200
QUALITY = 82

try:
    from PIL import Image
except ImportError:
    print("Pillow is required: pip install pillow")
    sys.exit(1)


def referenced_covers():
    """Basenames of /images/covers/*.jpg referenced by content or images.json."""
    refs = set()
    for path in glob.glob(os.path.join(ROOT, "content", "posts", "*.md")):
        text = open(path, encoding="utf-8").read()
        refs.update(re.findall(r"/images/covers/([A-Za-z0-9_.\-]+\.jpg)", text))
    data = json.load(open(os.path.join(ROOT, "public", "data", "images.json"), encoding="utf-8"))
    for post in data.get("posts", {}).values():
        url = post.get("url", "")
        m = re.match(r"/images/covers/([A-Za-z0-9_.\-]+\.jpg)$", url)
        if m:
            refs.add(m.group(1))
    return refs


def main():
    refs = referenced_covers()
    on_disk = {os.path.basename(p) for p in glob.glob(os.path.join(COVERS, "*.jpg"))}
    orphans = on_disk - refs
    for name in sorted(orphans):
        os.remove(os.path.join(COVERS, name))
        print(f"deleted orphan {name}")

    total_before = total_after = 0
    converted = []
    for name in sorted(refs):
        src = os.path.join(COVERS, name)
        if not os.path.exists(src):
            print(f"WARNING: referenced but missing on disk: {name}")
            continue
        dst = os.path.join(COVERS, name[:-4] + ".webp")
        before = os.path.getsize(src)
        with Image.open(src) as im:
            im = im.convert("RGB")
            if im.width > MAX_W:
                im.thumbnail((MAX_W, int(im.height * MAX_W / im.width)), Image.LANCZOS)
            im.save(dst, "WebP", quality=QUALITY, method=6)
        after = os.path.getsize(dst)
        total_before += before
        total_after += after
        os.remove(src)
        converted.append(name)
        print(f"{name}: {before // 1024} KB -> {after // 1024} KB webp")

    # Rewrite references: frontmatter coverImage + images.json urls.
    for path in glob.glob(os.path.join(ROOT, "content", "posts", "*.md")):
        text = open(path, encoding="utf-8").read()
        new = re.sub(r"/images/covers/([A-Za-z0-9_.\-]+\.jpg)", lambda m: "/images/covers/" + m.group(1)[:-4] + ".webp", text)
        if new != text:
            open(path, "w", encoding="utf-8").write(new)
    data_path = os.path.join(ROOT, "public", "data", "images.json")
    text = open(data_path, encoding="utf-8").read()
    new = re.sub(r"/images/covers/([A-Za-z0-9_.\-]+\.jpg)", lambda m: "/images/covers/" + m.group(1)[:-4] + ".webp", text)
    if new != text:
        open(data_path, "w", encoding="utf-8").write(new)

    print(f"\nConverted {len(converted)} covers: "
          f"{total_before / 1024:.0f} KB -> {total_after / 1024:.0f} KB "
          f"({100 * (1 - total_after / max(total_before, 1)):.0f}% smaller)")


if __name__ == "__main__":
    main()
