#!/usr/bin/env python3
"""Rules check for one G4 SOCIAL STUDIES VR week (Field Files / Desk Day). Must print 0 FAIL before Bethany sees the page.
  python3 check_vr.py weeks/17/week.json [built.html]
"""
import csv, html, json, os, re, sys

KIT = os.path.dirname(os.path.abspath(__file__))
fails, warns = [], []
def F(m): fails.append(m)
def Wn(m): warns.append(m)

wp = sys.argv[1]
wdir = os.path.dirname(os.path.abspath(wp))
W = json.load(open(wp, encoding='utf-8'))
cred = json.load(open(os.path.join(wdir, 'credits.json'), encoding='utf-8'))
rows = list(csv.DictReader(open(os.path.join(KIT, 'vr-assets.csv'), encoding='utf-8')))
maps = {r['name'] for r in rows if r['type'] == 'Location'}
models = {r['name'] for r in rows if r['type'] != 'Location'}
BANNED_MODELS = re.compile(r'Tribal Mask|Barbarian|Celtic (Running|Standing|Walking)|Cowboy|Cowgirl|Costume|Outfit|Mask|Businessman|Legionnaire|Statue - (Head|Torso)|Monument', re.I)

# lesson: Lesson B of the week (planning table: weeks have A + B; B codes are even within a unit's pairs)
if not re.match(r'^4\.\d\d\.\d\d$', W['lesson']): F('lesson code must look like 4.UU.LL')
if not W['canvasName'].startswith(W['lesson'] + ' VR · '): F('canvasName must be "<Lesson B code> VR · <Title>"')
if W.get('lessonA') and W['lessonA'] >= W['lesson']: F('lessonA must come before the VR lesson (VR goes with Lesson B)')

# map + models exactly in vr-assets.csv
if W['map'] == 'The Everglades': F('map: The Everglades is not in the app')
if W['map'] not in maps: F('map not in vr-assets.csv: ' + W['map'])
if W['mapWord'].lower() not in W['map'].lower(): F('mapWord must be part of the map name')
pat = W.get('pattern', 'A')
ms = [m for g in W['vr'].get('groups', []) for m in g['models']]
if pat == 'A':
    if not 4 <= len(ms) <= 6: F('Pattern A: 4 to 6 model kinds (has %d)' % len(ms))
    if sum(m.get('count', 1) for m in ms) > 10: F('Pattern A: 10 pieces or fewer')
    for m in ms:
        if m['name'] not in models: F('model not in vr-assets.csv: ' + m['name'])
        if not m.get('word'): F('model without a search word: ' + m['name'])
        if BANNED_MODELS.search(m['name']): F('costume/caricature model may not stand for a people: ' + m['name'])
elif pat == 'B':
    if ms: F('Pattern B places no models')
    if len(W['vr'].get('say', [])) != 2: F('Pattern B: exactly 2 sentences to say in the video')
    if W['vr'].get('seconds', 30) > 30: F('Pattern B: the video is 30 seconds or less')
    t = json.dumps(W['vr']['steps'])
    if 'Record video' not in t: F('Pattern B: a step must say Record video')
    if re.search(r'Take photo', t): F('Pattern B: one video only, no photo')
    if '@SAY@' not in t or '@TIMER@' not in t: F('Pattern B: Step 1 needs @SAY@ and the @TIMER@ practice')
    if re.search(r'\bfind (the|a|an) ', t, re.I): F('never "find" one object on a map')
else:
    F('pattern must be A or B')
if re.search(r'(and|then) (upload|download) .*PDF', json.dumps(W['vr']), re.I): F('VR path turns in ONE thing (no PDF on the VR path)')

steps = W['vr']['steps']
if len(steps) != 5: F('VR path needs exactly 5 steps (has %d)' % len(steps))
if '@CANVAS@' not in json.dumps(steps): F('a step must name the Canvas assignment (@CANVAS@)')

# G4 VR pages are TEXT ONLY (oao-audio-budget): no voice lines, no clips
if W.get('voice'): F('G4 VR pages have no audio: remove "voice"')
if os.path.isdir(os.path.join(wdir, 'audio')) and os.listdir(os.path.join(wdir, 'audio')): F('G4 VR pages have no audio files')
for k in ('brief', 'desk'):
    if not W.get('opti', {}).get(k): F('missing Opti line: opti.' + k)
    else:
        n = len(W['opti'][k].split())
        if not 8 <= n <= 30: Wn('Opti %s is %d words (aim 8-30)' % (k, n))
# nothing written in VR (vr-context hard limits): words only live in Canvas
vt = json.dumps(W['vr']['steps'] + [W['vr'].get('extra', {})])
for bad in [r'\bwrite\b', r'\bdraw', r'sticky', r'whiteboard', r'\blabel\b', r'\bsign\b']:
    if re.search(bad, vt, re.I): F('VR step asks for writing/labels in VR: ' + bad)

# one game type per week across the course (no repeats)
here = os.path.basename(wdir)
for d in sorted(os.listdir(os.path.dirname(wdir))):
    p2 = os.path.join(os.path.dirname(wdir), d, 'week.json')
    if d != here and os.path.exists(p2):
        try:
            if json.load(open(p2, encoding='utf-8'))['studio']['game']['type'] == W['studio']['game']['type']: F('Desk Day game type %s already used in week %s' % (W['studio']['game']['type'], d))
        except Exception: pass

# Desk Day
S = W['studio']; G = S['game']
if S['write']['min'] < 20: F('Desk Day writing minimum is 20 words')
if len(S['write']['frames']) != 2: F('Desk Day needs exactly 2 sentence frames')
def need(*ks):
    for k in ks:
        if k not in G: F('%s game needs "%s"' % (G['type'], k))
def pic(o, what):
    if not (o.get('img') or o.get('icon')): F('%s needs img or icon: %s' % (what, o.get('name', '?')))
t = G['type']
if t == 'timeline':
    need('slots', 'cards', 'miss', 'done'); keys = {s['key'] for s in G['slots']}
    for c in G['cards']:
        if c['slot'] not in keys: F('card slot missing: ' + c['name'])
elif t == 'match':
    need('pairs', 'miss', 'done')
    for p in G['pairs']: pic(p['left'], 'match left')
    if 'order' in G and sorted(G['order']) != list(range(len(G['pairs']))): F('match order must list every pair once')
elif t == 'sort':
    need('bins', 'cards', 'miss', 'done'); bk = {b['key'] for b in G['bins']}
    for c in G['cards']:
        pic(c, 'sort card')
        if c['bin'] not in bk: F('sort card bin missing: ' + c['name'])
    for b in G['bins']:
        if not any(c['bin'] == b['key'] for c in G['cards']): F('empty bin: ' + b['name'])
elif t == 'order':
    need('steps', 'miss', 'done')
    if 'show' in G and sorted(G['show']) != list(range(len(G['steps']))): F('order show must list every step once')
    if G.get('show') == list(range(len(G['steps']))): F('order: the steps start already in order')
elif t == 'odd':
    need('rounds', 'miss', 'done')
    for r in G['rounds']:
        if not 0 <= r['odd'] < len(r['items']): F('odd index out of range: ' + r['q'])
elif t == 'clue':
    need('people', 'rounds', 'miss', 'done')
    if sorted(r['answer'] for r in G['rounds']) != sorted(set(r['answer'] for r in G['rounds'])): F('clue: each person is the answer once')
    for r in G['rounds']:
        if len(r['clues']) < 2: F('clue: give 2 or 3 clues per round')
elif t == 'regionmap':
    need('regions', 'cards', 'miss', 'done')
    if [r['key'] for r in G['regions']] != ['w', 'sw', 'mw', 'se', 'ne']: F('regionmap regions must be w, sw, mw, se, ne in that order')
    for c in G['cards']:
        if c['region'] not in {'w', 'sw', 'mw', 'se', 'ne'}: F('bad region: ' + c['name'])
elif t == 'trade':
    need('rounds', 'done')
    for r in G['rounds']:
        for sd in ('a', 'b'):
            if not 0 <= r[sd]['give'] < len(r[sd]['goods']): F('trade give out of range')
            if not r[sd].get('miss'): F('trade side needs a miss line')
elif t == 'checks':
    need('tests', 'things', 'miss', 'done'); tk = {x['key'] for x in G['tests']}
    for k in G['things']:
        if not set(k['pass']) <= tk: F('checks: unknown test in ' + k['name'])
elif t == 'route':
    need('places', 'cargo', 'miss', 'done'); pk = {p['key'] for p in G['places']}
    for c in G['cargo']:
        if c['from'] not in pk or c['to'] not in pk or c['from'] == c['to']: F('route cargo places wrong: ' + c['name'])
    for p in G['places']:
        if not (8 <= p['x'] <= 92 and 6 <= p['y'] <= 64): F('route place too close to the edge: ' + p['name'])
elif t == 'dilemma':
    need('rounds', 'miss', 'done')
    for r in G['rounds']:
        if not 0 <= r['right'] < len(r['options']): F('dilemma right out of range')
elif t == 'fill':
    need('sentences', 'words', 'miss', 'done')
    for x in G['sentences']:
        if x['text'].count('___') != 1: F('fill sentence needs exactly one ___')
        if x['answer'] not in G['words']: F('fill answer not in words: ' + x['answer'])
elif t == 'memory':
    need('pairs', 'layout', 'miss', 'done')
    L = G['layout']
    if sorted((c['p'], c['s']) for c in L) != sorted([(i, s) for i in range(len(G['pairs'])) for s in 'ab']): F('memory layout must hold each pair once as a and b')
elif t == 'calendar':
    need('cards', 'kinds', 'months', 'miss', 'done'); kk = {k['key'] for k in G['kinds']}
    if len(G['months']) != 12: F('calendar needs 12 months')
    for c in G['cards']:
        if c['kind'] not in kk or not 1 <= c['month'] <= 12: F('calendar card wrong: ' + c['name'])
elif t == 'reveal':
    need('rounds', 'miss', 'done')
    for r in G['rounds']:
        if not r.get('img'): F('reveal rounds need a photo')
elif t == 'panel':
    need('parts', 'done')
    for p in G['parts']:
        if sum(1 for c in p['choices'] if c.get('good')) != 1: F('panel: exactly one good choice per part: ' + p['name'])
elif t == 'wheel':
    need('slices', 'miss', 'done')
    if len(G['slices']) != 6: F('wheel needs 6 slices')
else:
    F('unknown Desk Day game type: ' + t)

# images + credits + alt text
imgs = set()
def walk(o):
    if isinstance(o, dict):
        if isinstance(o.get('img'), str):
            imgs.add(o['img'])
            if not o.get('alt'): F('image without alt text: ' + o['img'])
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(W)
for k in imgs:
    if not os.path.exists(os.path.join(wdir, 'img', k + '.jpg')): F('image file missing: ' + k)
    if k not in cred: F('no credit for image: ' + k)
    elif not cred[k].get('line') or not cred[k].get('from'): F('credit must be a "line" copied from the lesson + "from" (repo file): ' + k)
    elif not re.search(r'Library of Congress|Archives|NASA|FEMA|Public Library|National Park|public domain|Florida House|Newberry', cred[k]['line'], re.I): F('credit line names no real source: ' + k)
    if k in cred and re.match(r'source-4-0[1-6]-', cred[k].get('from', '')) and not cred[k]['from'].endswith('-original.jpg'): Wn('check this early-unit image is a real credited source: ' + cred[k]['from'])

# banned words, dashes, flag emojis in student text
txt = json.dumps({k: v for k, v in W.items() if k not in ('id',)}, ensure_ascii=False)
for bad in ['bonus', 'notebook', 'go back']:
    if re.search(bad, txt, re.I): F('banned word: ' + bad)
if re.search(r' [—–] |—', txt): F('dash in student text')
if re.search('[\U0001F1E6-\U0001F1FF]', txt): F('flag emoji (Windows shows letters)')

# built page: reading load per path (top + ONE path), measured the G3 way (Opti's bubbles left out) so the two grades compare; bubble words are printed too.
if len(sys.argv) > 2:
    s = open(sys.argv[2], encoding='utf-8').read()
    s = re.sub(r'(?s)<details class="vr-help".*?</details>', '', s)
    bubw = len(re.findall(r"[A-Za-z0-9’']+", html.unescape(re.sub(r'<[^>]+>', ' ', ' '.join(re.findall(r'(?s)<div class="bub">(.*?)</div>', s))))))
    s = re.sub(r'(?s)<div class="bub">.*?</div>', '', s)
    s = re.sub(r'(?s)<style.*?</style>|<script.*?</script>|<footer.*?</footer>|<textarea.*?</textarea>|<span class="vr-word">.*?</span>|<div class="vr-video".*?</video></div></div>|<div class="vr-badge".*?</div></div>|<div class="wl-details".*?</div>', '', s)
    def wc(x): return len(re.findall(r"[A-Za-z0-9’']+", html.unescape(re.sub(r'<[^>]+>', ' ', x))))
    a = s.find('<section class="vr-pane on"'); b = s.find('<section class="vr-pane" id="vr-studio"')
    top, vr, st = wc(s[:a]), wc(s[a:b]), wc(s[b:])
    def strs(o):
        if isinstance(o, str): return [] if o.endswith('.jpg') or o.startswith('data:') else [o]
        if isinstance(o, dict): return [x for k, v in o.items() if k not in ('img', 'alt', 'key', 'icon', 'type', 'miss', 'hint', 'why', 'cols', 'order', 'show', 'layout') for x in strs(v)]
        if isinstance(o, list): return [x for v in o for x in strs(v)]
        return []
    gw = sum(len(re.findall(r"[A-Za-z0-9’']+", x)) for x in strs(G))
    print('reading words (G3 measure): top %d + Field File %d = %d; top + Desk Day %d (+ game cards %d) = %d; Opti bubbles +%d' % (top, vr, top + vr, st, gw, top + st + gw, bubw))
    for name, n in (('Field File', top + vr), ('Desk Day', top + st + gw)):
        if n > 520: F('%s reading load %d words (limit ~450)' % (name, n))
        elif n > 450: Wn('%s reading load %d words (aim <= 450)' % (name, n))

for m in warns: print('warn:', m)
for m in fails: print('FAIL:', m)
print('%d FAIL, %d warn' % (len(fails), len(warns)))
sys.exit(1 if fails else 0)
