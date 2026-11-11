#!/usr/bin/env python3
"""OAO clip log: one row per recorded audio clip (voice + exact script + file).

  python tools/cliplog.py build                 rebuild clip-log.json / clip-log.csv for this repo
  python tools/cliplog.py find "text" [--voice opti] [--master PATH]
                                                is this exact line already recorded?
  python tools/cliplog.py check FILE.json [--voice opti] [--master PATH]
                                                FILE.json = {"slot": "script", ...}; says which slots can reuse a clip
  python tools/cliplog.py add FILE.mp3 --voice opti --text "..."   (after a new clip is filed)
  python tools/cliplog.py master REPO [REPO ...] --out DIR         combine repos into one master log

Reuse rule (Bethany, Nov 11 2026): EXACT MATCH ONLY. A clip is reused only when the
same voice already said the same words. Never reword a script to force a match.
"""
import sys, os, re, json, csv, hashlib, argparse, glob

AUDIO_EXT = ('.mp3', '.wav', '.m4a')
NOT_SPEECH_DIRS = ('records', 'radio')          # music + real historical recordings
NOT_SPEECH_PREFIX = ('music-', 'real-', 'v-signal')
OLD_SLOT_DIRS = ('welcome', 'wgrd', 'dol', 'grammar', 'morph', 'read', 'spelling', 'vocab', 'workshop', 'turn', 'chapter', 'wordconn', 'watch')  # early layout: folder = slot, voice not recorded

DEFAULT_VOICE = {'optima-3rd-math': 'opti', 'optima-3rd-science': 'opti', 'optima-3rd-social-studies': 'opti',
                 'optima-4th-social-studies': 'g4ss teacher', 'optima-5th-social-studies': 'ms avery', 'optima-5th-science': 'keeper'}
SKIP_DIRS = ('.git', 'node_modules', 'vendor', '__pycache__', '_pv', '_ts', '_thumbcheck')

def audio_files(root):
    out = []
    for dp, dn, fn in os.walk(root):
        dn[:] = [x for x in dn if x not in SKIP_DIRS]
        for x in sorted(fn):
            if x.lower().endswith(AUDIO_EXT): out.append(os.path.join(dp, x))
    return out

def audio_stems(root):
    return set(os.path.splitext(os.path.basename(f))[0] for f in audio_files(root))

def norm(t):
    """Match key: tags out, quotes straightened, spaces collapsed, case folded, edge punctuation off."""
    t = re.sub(r'\[[^\]]*\]', ' ', t or '')
    t = re.sub(r'<[^>]+>', ' ', t)
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('—', '-').replace('–', '-').replace('…', '...')
    t = re.sub(r'\s+', ' ', t).strip().lower()
    return t.strip(' .,!?;:"\'')

def slug(w):
    return re.sub(r'[^a-z0-9]+', '-', w.lower()).strip('-')

def repo_tag(root):
    name = os.path.basename(os.path.abspath(root))
    m = re.match(r'optima-(\w+?)(?:st|nd|rd|th)?-(.+)', name)
    return name, (m.group(1), m.group(2)) if m else (name, '')

def lesson_prefix(grade, fname):
    b = os.path.basename(fname)
    m = re.search(r'(\d+)-(\d+|fluency|checkin|check-in)', b)
    if not m: return None
    return 'g%sela-%s-%s' % (grade, m.group(1), m.group(2))

# ---------- scoped lookup: find a clip's words in the files that belong to its own lesson ----------
TXT_EXT = ('.html', '.json', '.js')
STR = r'"((?:[^"\\]|\\.)*)"'
TKEY = r'"(?:script|text|prompt|say|line|transcript|t|vo|narration)"'

def code_tuples(path):
    return [tuple(int(x) for x in re.split(r'[-._]', m)) for m in re.findall(r'\d+(?:[-._]\d+)+', path)] + \
           [(int(m),) for m in re.findall(r'(?:week|wk|vr|unit)[-_ ]?(\d+)', path, re.I)]

def clip_code_slot(rel):
    """('g4ss', (4,10,4), 'guide5a') from g4ss-4-10-04-guide5a.mp3; falls back to the folder for names like opti-step1.mp3"""
    stem = os.path.splitext(os.path.basename(rel))[0]
    m = re.match(r'^(g\d[a-z]+)-((?:\d+-)+)(.+)$', stem)
    if m:
        return tuple(int(x) for x in m.group(2).strip('-').split('-')), m.group(3)
    folder = os.path.dirname(rel)
    ct = code_tuples(folder)
    slot = re.sub(r'^(audio-|\d+-\d+-)', '', stem)
    return (ct[-1] if ct else None), slot

def say_key(t):
    s_ = re.sub(r'[^a-z0-9]+', '', t.lower()); h = 0x811c9dc5
    for ch in s_:
        h ^= ord(ch); h = (h * 16777619) & 0xffffffff
    return ('%08x' % h)[:6]

def unq(x):
    try: return json.loads('"' + x + '"')
    except Exception: return x

class Scope:
    def __init__(self, root):
        self.files = []
        for dp, dn, fn in os.walk(root):
            dn[:] = [x for x in dn if x not in SKIP_DIRS and x not in ('videos', 'video', 'images', 'img', 'out', 'Teacher Slides')]
            for x in fn:
                if x.endswith(TXT_EXT) and not x.startswith(('clip-log', 'master-clip-log', 'original')) and '.bak' not in x:
                    f = os.path.join(dp, x)
                    try:
                        if os.path.getsize(f) < 3_000_000: self.files.append((f, code_tuples(os.path.relpath(f, root).replace('\\', '/'))))
                    except Exception: pass
        self.cache = {}; self.hashes = {}; self.root = root
    def raw(self, f):
        if f not in self.cache:
            try: self.cache[f] = open(f, encoding='utf-8', errors='ignore').read()
            except Exception: self.cache[f] = ''
        return self.cache[f]
    def for_code(self, code):
        out = []
        for f, cts in self.files:
            for c in cts:
                if c == code or (len(c) > 1 and len(code) > len(c) and code[-len(c):] == c) or (len(code) > 1 and len(c) > len(code) and c[-len(code):] == code):
                    out.append(f); break
        return out
    def find(self, code, slot):
        if code is None: return None
        files = self.for_code(code); cands = {}
        m = re.match(r'(?:txt|say|line)-([0-9a-f]{6})[a-z]*$', slot)
        if m:
            for f in files:
                if f not in self.hashes:
                    self.hashes[f] = {}
                    for x in re.findall(STR, self.raw(f)):
                        if 2 < len(x) < 900:
                            t = unq(x); self.hashes[f].setdefault(say_key(t), t)
                if m.group(1) in self.hashes[f]: return self.hashes[f][m.group(1)], f
            return None
        m = re.match(r'word-(\d+)$', slot)
        if m:   # flip-card word clips: the Nth vocabulary card on the lesson page (the word only; full wording is not on file)
            for f in files:
                if not f.endswith('.html'): continue
                ws = re.findall(r'class="fc-word"[^>]*>\s*([^<]+?)\s*<', self.raw(f))
                if len(ws) >= int(m.group(1)): return ws[int(m.group(1)) - 1], f + ' (card word only)'
            return None
        slots = [slot] + ([slot.split('-', 1)[1]] if '-' in slot else []) + ([re.sub(r'-?\d+$', '', slot)] if re.search(r'[a-z]-?1$', slot) else [])
        for sl in slots:
            q = re.escape(sl)
            pats = [r'"(?:slot|id|key|clip|name)"\s*:\s*"%s"(?:(?!"(?:slot|id|key|clip|name)"\s*:)[\s\S]){0,1500}?%s\s*:\s*%s' % (q, TKEY, STR),
                    r'"%s"\s*:\s*\{[^{}]{0,800}?%s\s*:\s*%s' % (q, TKEY, STR),
                    r'"%s"\s*:\s*%s' % (q, STR)]
            for f in files:
                raw = self.raw(f)
                for p in pats:
                    for mm in re.finditer(p, raw):
                        t = unq(mm.group(1)).strip()
                        if len(t) >= 12 and ' ' in t and not t.startswith(('http', 'assets/', '#', '.')) and '{' not in t[:2]:
                            cands.setdefault(norm(t), (t, f))
                    if cands: break
                if cands: break
            if cands: break
        if len(cands) == 1: return list(cands.values())[0]
        return None

def collect_scripts(root, grade):
    """stem -> (text, source). Later sources never overwrite earlier ones."""
    S = {}; V = {}
    def put(stem, text, src):
        if stem and isinstance(text, str) and text.strip() and stem not in S and (' ' in text.strip() or 'word' in stem):
            S[stem] = (text.strip(), src)
    # 1. CSV manifests (filename,...,text)
    for f in sorted(glob.glob(os.path.join(root, 'tools', '**', '*.csv'), recursive=True)):
        try:
            with open(f, encoding='utf-8-sig', newline='') as fh:
                for row in csv.DictReader(fh):
                    fn = row.get('filename') or row.get('file') or ''
                    tx = row.get('text') or row.get('script') or ''
                    put(os.path.splitext(os.path.basename(fn))[0], tx, os.path.relpath(f, root))
        except Exception: pass
    # 2. lesson DATA files
    for f in sorted(glob.glob(os.path.join(root, 'data', '*.json'))):
        try: d = json.load(open(f, encoding='utf-8'))
        except Exception: continue
        if not isinstance(d, dict): continue
        p = lesson_prefix(grade, f); src = os.path.relpath(f, root)
        tr = d.get('transcripts') or {}
        media = d.get('media') or {}
        if isinstance(media, dict):
            for k, v in media.items():
                if isinstance(v, dict) and v.get('path') and k in tr:
                    put(os.path.basename(v['path']), tr[k], src)
        if p and isinstance(tr, dict):
            for k, v in tr.items():
                put('%s-%s' % (p, k), v, src)
                m = re.match(r'guide(\d+)$', k)
                if m: put('%s-%s' % (p, m.group(1)), v, src)
        if p and isinstance(d.get('listen'), dict):
            for k, v in d['listen'].items():
                if isinstance(v, dict): put('%s-listen-%s' % (p, k), v.get('text'), src)
        teach = d.get('teach') or {}
        if p and isinstance(teach, dict):
            for m_ in teach.get('mods') or []:
                if isinstance(m_, dict): put('%s-teach-%s' % (p, slug(str(m_.get('id', '')))), m_.get('script'), src)
            for w, t in (teach.get('cards') or {}).items():
                put('%s-say-%s' % (p, slug(w)), t, src)
    # 3. VR script files
    for f in sorted(glob.glob(os.path.join(root, 'tools', 'vr', 'week*-scripts.json'))):
        try: d = json.load(open(f, encoding='utf-8'))
        except Exception: continue
        w = re.search(r'week(\d+)', os.path.basename(f)).group(1); src = os.path.relpath(f, root)
        for k, v in d.items():
            put('g%sela-vr-%s-%s' % (grade, w, k), v, src)
            put('g%sela-%s-vr-%s' % (grade, w, k), v, src)
        for k, v in (d.get('clips') or {}).items() if isinstance(d.get('clips'), dict) else []:
            if isinstance(v, dict) and v.get('file'):
                put(os.path.splitext(os.path.basename(v['file']))[0], v.get('prompt') or v.get('transcript'), src)
    # 4. any other JSON in tools/ shaped {"<clip stem>": "script"} or {"slug": "script"} (how-to lines)
    for f in sorted(glob.glob(os.path.join(root, 'tools', '**', '*.json'), recursive=True)):
        if '/vr/' in f.replace('\\', '/') or 'vendor' in f: continue
        try: d = json.load(open(f, encoding='utf-8'))
        except Exception: continue
        src = os.path.relpath(f, root)
        if isinstance(d, dict):
            for k, v in d.items():
                if isinstance(v, str):
                    put(k, v, src); put('g%sela-how-%s' % (grade, k), v, src)
                elif isinstance(v, dict):
                    t = v.get('script') or v.get('text') or v.get('say')
                    if isinstance(t, str):
                        put(k, t, src); put('g%sela-how-%s' % (grade, k), t, src)
        elif isinstance(d, list):
            for v in d:
                if isinstance(v, dict):
                    fn = v.get('filename') or v.get('file') or v.get('name') or v.get('id') or ''
                    t = v.get('script') or v.get('text')
                    if isinstance(t, str) and fn:
                        put(os.path.splitext(os.path.basename(str(fn)))[0], t, src)
    # 4b. generic sweep: any JSON (or JS data file) node that names a clip and carries its words
    stems = audio_stems(root)
    TEXT_KEYS = ('prompt', 'script', 'text', 'transcript', 'say', 'line', 'tts', 'words', 'caption', 'narration', 'vo')
    VOICE_KEYS = ('voice', 'speaker', 'who', 'character', 'voiceName', 'voice_name', 'guide')
    def node_text(n):
        for k in TEXT_KEYS:
            if isinstance(n.get(k), str) and n[k].strip(): return n[k]
        return None
    def node_voice(n):
        for k in VOICE_KEYS:
            if isinstance(n.get(k), str) and 0 < len(n[k]) < 40: return n[k]
        return None
    def stem_of(v):
        if not isinstance(v, str) or len(v) > 300: return None
        b_ = os.path.splitext(os.path.basename(v.replace('\\', '/')))[0]
        return b_ if b_ in stems else None
    def walk(n, src):
        if isinstance(n, dict):
            t = node_text(n)
            if t:
                for k, v in n.items():
                    st = stem_of(v)
                    if st and v != t:
                        put(st, t, src)
                        if node_voice(n): V.setdefault(st, node_voice(n))
            if isinstance(n.get('who'), str) and isinstance(n.get('key'), str) and isinstance(n.get('t') or node_text(n), str):
                st = '%s-%s' % (n['who'], n['key'])
                if st in stems: put(st, n.get('t') or node_text(n), src); V.setdefault(st, n['who'])
            for k, v in n.items():
                st = stem_of(k)
                if st:
                    if isinstance(v, str): put(st, v, src)
                    elif isinstance(v, dict) and node_text(v):
                        put(st, node_text(v), src)
                        if node_voice(v): V.setdefault(st, node_voice(v))
                walk(v, src)
        elif isinstance(n, list):
            for v in n: walk(v, src)
    for dp, dn, fn in os.walk(root):
        dn[:] = [x for x in dn if x not in SKIP_DIRS]
        for x in fn:
            if not x.endswith(('.json', '.js')) or x.startswith('clip-log') or x.startswith('master-clip-log'): continue
            f = os.path.join(dp, x)
            try:
                if os.path.getsize(f) > 6_000_000: continue
                raw = open(f, encoding='utf-8').read()
            except Exception: continue
            docs = []
            if x.endswith('.json'):
                try: docs = [json.loads(raw)]
                except Exception: continue
            else:
                if 'mp3' not in raw and 'audio' not in raw: continue
                dec = json.JSONDecoder()
                for m in re.finditer(r'=\s*(?=[\[{])', raw):
                    try: docs.append(dec.raw_decode(raw, m.end())[0])
                    except Exception: pass
            for d in docs: walk(d, os.path.relpath(f, root).replace('\\', '/'))
    # 5. hand-kept additions (scripts found some other way)
    f = os.path.join(root, 'tools', 'clip-log-extra.json')
    if os.path.exists(f):
        for k, v in json.load(open(f, encoding='utf-8')).items():
            if isinstance(v, dict): S[k] = (v['text'], 'tools/clip-log-extra.json')
    return S, V

def voice_for(rel, grade, extra, is_ela=True):
    stem = os.path.splitext(os.path.basename(rel))[0]
    if stem in extra and extra[stem].get('voice'): return extra[stem]['voice']
    parts = rel.replace('\\', '/').split('/')
    if 'guide' in parts:
        i = parts.index('guide')
        if len(parts) > i + 2:
            return '?' if parts[i + 1] in OLD_SLOT_DIRS else parts[i + 1]
        return {'5': 'mason'}.get(grade, '?') if is_ela else '?'
    if 'words' in parts and is_ela:
        return {'3': 'opti', '4': 'opti', '5': 'mason'}.get(grade, '?')
    return '?'

def build(root):
    name, (grade, subject) = repo_tag(root)
    grade = {'3rd': '3', '4th': '4', '5th': '5'}.get(grade, grade)
    S, V = collect_scripts(root, grade)
    is_ela = subject == 'ela'
    extra = {}
    f = os.path.join(root, 'tools', 'clip-log-extra.json')
    if os.path.exists(f): extra = json.load(open(f, encoding='utf-8'))
    rows = []
    for full in audio_files(root):
        x = os.path.basename(full); rel = os.path.relpath(full, root).replace('\\', '/')
        stem = os.path.splitext(x)[0]
        parts = rel.split('/')
        kind = 'speech'
        if any(p in NOT_SPEECH_DIRS + ('music', 'sfx', 'beds', 'sound') for p in parts[:-1]) and not stem.startswith('news-') or stem.startswith(NOT_SPEECH_PREFIX): kind = 'not-speech'
        text, src = S.get(stem, ('', ''))
        if not text:
            m = re.match(r'g\d[a-z]+-word-(.+)$', stem)
            if m: text, src = m.group(1).replace('-', ' '), 'file name'
        h = hashlib.md5(open(full, 'rb').read()).hexdigest()
        v = voice_for(rel, grade, extra, is_ela)
        if v == '?' and stem in V: v = V[stem].lower()
        if v == '?' and len(parts) > 1 and not is_ela: v = 'folder:' + parts[-2]
        rows.append(dict(repo=name, grade=grade, subject=subject, voice=v,
                         file=rel, text=text, key=norm(text), chars=len(text), kind=kind,
                         script_source=src, bytes=os.path.getsize(full), md5=h))
    sc = Scope(root)
    for r in rows:
        if r['text'] or r['kind'] != 'speech': continue
        code, slot = clip_code_slot(r['file'])
        hit = sc.find(code, slot)
        if not hit and re.match(r'(audio-)?word-', os.path.basename(r['file'])):
            w = re.sub(r'^(audio-)?word-', '', os.path.splitext(os.path.basename(r['file']))[0]); hit = (w.replace('-', ' '), 'file name')
        if hit:
            r['text'] = hit[0]; r['key'] = norm(hit[0]); r['chars'] = len(hit[0])
            r['script_source'] = hit[1] if hit[1] == 'file name' else os.path.relpath(hit[1].replace(' (card word only)', ''), root).replace('\\', '/') + (' (card word only)' if hit[1].endswith('(card word only)') else '')
    for r in rows:
        if r['voice'].startswith('folder:') or r['voice'] == '?':
            st = os.path.splitext(os.path.basename(r['file']))[0]
            m = re.match(r'(?:audio-)?([a-z]+)-(?:[0-9a-f]{6,8}|step\d+|brief|extra|\d+|w\d+-\d+|\d+-w\d+-\d+|studio|collections|alt|saved)$', st)
            if m and m.group(1) not in ('word', 'txt'): r['voice'] = m.group(1)
            elif name in DEFAULT_VOICE: r['voice'] = DEFAULT_VOICE[name]
    # working copies under tools/ or outputs/ that duplicate a published clip are not logged twice
    pub = set(r['md5'] for r in rows if not r['file'].startswith(('tools/', 'outputs/')))
    rows = [r for r in rows if not (r['file'].startswith(('tools/', 'outputs/')) and r['md5'] in pub)]
    # a file name used in more than one folder: the script on file can only belong to one of them
    stems = {}
    for r in rows: stems.setdefault(os.path.splitext(os.path.basename(r['file']))[0], []).append(r)
    for st, rs in stems.items():
        if len(rs) > 1 and len(set(r['md5'] for r in rs)) > 1:
            for r in rs: r.update(text='', key='', chars=0, script_source='')
    rows.sort(key=lambda r: r['file'])
    json.dump(rows, open(os.path.join(root, 'clip-log.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    write_csv(rows, os.path.join(root, 'clip-log.csv'))
    return rows

COLS = ['repo', 'voice', 'text', 'chars', 'file', 'kind', 'script_source', 'md5']
def write_csv(rows, path):
    with open(path, 'w', encoding='utf-8-sig', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=COLS, extrasaction='ignore'); w.writeheader(); w.writerows(rows)

def load(master=None):
    rows = []
    for p in ([master] if master else []) + ['clip-log.json']:
        if p and os.path.isdir(p): p = os.path.join(p, 'master-clip-log.json')
        if p and os.path.exists(p): rows += json.load(open(p, encoding='utf-8'))
    seen, out = set(), []
    for r in rows:
        k = (r['repo'], r['file'])
        if k not in seen: seen.add(k); out.append(r)
    return out

def lookup(rows, text, voice=None):
    k = norm(text)
    hits = [r for r in rows if r['key'] == k and r['kind'] == 'speech' and k]
    same = [r for r in hits if voice and r['voice'].lower() == voice.lower()]
    other = [r for r in hits if r not in same]
    return same, other

def main():
    ap = argparse.ArgumentParser(); sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('build')
    a = sub.add_parser('find'); a.add_argument('text'); a.add_argument('--voice'); a.add_argument('--master')
    a = sub.add_parser('check'); a.add_argument('file'); a.add_argument('--voice'); a.add_argument('--master')
    a = sub.add_parser('add'); a.add_argument('file'); a.add_argument('--voice', required=True); a.add_argument('--text', required=True)
    a = sub.add_parser('master'); a.add_argument('repos', nargs='+'); a.add_argument('--out', required=True)
    o = ap.parse_args()
    if o.cmd == 'build':
        rows = build('.'); sp = [r for r in rows if r['kind'] == 'speech']
        print('%d clips logged, %d speech, %d with no script on file' % (len(rows), len(sp), sum(1 for r in sp if not r['text'])))
    elif o.cmd == 'find':
        same, other = lookup(load(o.master), o.text, o.voice)
        for r in same: print('REUSE  %s/%s  (%s)' % (r['repo'], r['file'], r['voice']))
        for r in other: print('other voice (%s), do not reuse unless that voice is wanted: %s/%s' % (r['voice'], r['repo'], r['file']))
        if not same and not other: print('NEW  not recorded yet')
    elif o.cmd == 'check':
        rows = load(o.master); d = json.load(open(o.file, encoding='utf-8')); saved = 0
        for slot, text in d.items():
            if not isinstance(text, str): continue
            same, _ = lookup(rows, text, o.voice)
            if same: saved += len(text); print('REUSE  %-22s <- %s/%s' % (slot, same[0]['repo'], same[0]['file']))
            else: print('NEW    %-22s %d chars' % (slot, len(text)))
        print('credits saved by reuse: about %d' % saved)
    elif o.cmd == 'add':
        f = os.path.join('tools', 'clip-log-extra.json')
        ex = json.load(open(f, encoding='utf-8')) if os.path.exists(f) else {}
        ex[os.path.splitext(os.path.basename(o.file))[0]] = {'text': o.text, 'voice': o.voice}
        json.dump(ex, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        rows = build('.'); print('added; %d clips logged' % len(rows))
    elif o.cmd == 'master':
        allr = []
        for r in o.repos:
            p = os.path.join(r, 'clip-log.json')
            if os.path.exists(p): allr += json.load(open(p, encoding='utf-8'))
        os.makedirs(o.out, exist_ok=True)
        json.dump(allr, open(os.path.join(o.out, 'master-clip-log.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        write_csv(sorted(allr, key=lambda r: (r['key'], r['voice'], r['repo'])), os.path.join(o.out, 'master-clip-log.csv'))
        print('master: %d clips from %d repos' % (len(allr), len(o.repos)))

if __name__ == '__main__':
    main()
