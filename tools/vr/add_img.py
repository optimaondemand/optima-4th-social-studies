#!/usr/bin/env python3
"""Copy ONE image that is already in the repo (images/) into a week, resized, with its credit line copied from the lesson.
  python3 tools/vr/add_img.py 17 map1763 images/source-4-07-02-east-west-florida-1763-original.jpg "A Map of ... Library of Congress. Free to use."
No downloads. Use only images whose lesson gives a credit line; never the unlicensed source-* placeholders (Units 1-3).
"""
import json, os, sys
from PIL import Image
wk, key, src, line = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
d = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'weeks', wk)
os.makedirs(os.path.join(d, 'img'), exist_ok=True)
im = Image.open(src).convert('RGB'); im.thumbnail((1280, 1280))
im.save(os.path.join(d, 'img', key + '.jpg'), quality=62, optimize=True, progressive=True)
cp = os.path.join(d, 'credits.json')
c = json.load(open(cp, encoding='utf-8')) if os.path.exists(cp) else {}
c[key] = {'line': line, 'from': os.path.basename(src)}
json.dump(c, open(cp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(key, im.size, os.path.getsize(os.path.join(d, 'img', key + '.jpg')))
