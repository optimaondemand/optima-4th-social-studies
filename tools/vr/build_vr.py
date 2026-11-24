#!/usr/bin/env python3
"""G4 Social Studies VR kit (Field Files / Desk Day), ported from the G3 Build the Diorama kit: weeks/<WW>/week.json -> one page.

  python3 build_vr.py weeks/17/week.json out/G4-SS-Week-17-VR-mockup.html          (mockup: everything inline)
  python3 build_vr.py weeks/17/week.json ../../vr-17.html --repo                   (repo: assets referenced)
G4 pages are text only (oao-audio-budget): no voice clips, no play buttons.

week.json "pattern": "A" (Build & Capture: model groups, photo) or "B" (Scout: a place map, ONE video under
30 seconds with 2 spoken sentences). Students submit ONE thing on the VR path.
Repo mode expects, relative to the repo root:
  images/opti-owl.png, assets/sparkle/vr/{ff-base.css,vr.css,vr.js,optima-logo.png}
  assets/sparkle/vr-<W>/img/<key>.jpg
  images/vr-canvas-help-*.jpg                              (help drawer, same files as G3 SS and G4 science)
The engine holds no week words. All words live in week.json.
"""
import base64, html, json, os, re, sys

KIT = os.path.dirname(os.path.abspath(__file__))


def kitfile(*cands):
    # first existing path: lets the kit run inside the repo (tools/vr next to tools/sparkle, images/ at the root)
    for c in cands:
        p = os.path.join(KIT, c)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(cands[0])
E = html.escape


def b64(path, mime):
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (mime, base64.b64encode(f.read()).decode())


def build(week_path, out_path, repo=False):
    wdir = os.path.dirname(os.path.abspath(week_path))
    W = json.load(open(week_path, encoding='utf-8'))
    wk = W['week']
    credits = json.load(open(os.path.join(wdir, 'credits.json'), encoding='utf-8'))
    used = []

    def img(key):
        if key not in used:
            used.append(key)
        if repo:
            return 'assets/sparkle/vr-%s/img/%s.jpg' % (wk, key)
        return b64(os.path.join(wdir, 'img', key + '.jpg'), 'image/jpeg')

    def shared(name):
        if name == 'opti.png':
            return 'images/opti-owl.png' if repo else b64(kitfile('opti-owl.png', '../../images/opti-owl.png'), 'image/png')
        if repo:
            return 'assets/sparkle/vr/' + name
        return b64(kitfile('engine/' + name, name), 'image/png')

    def help_img(name):
        if repo:
            return 'images/' + name
        return b64(kitfile('images/' + name, '../../images/' + name), 'image/jpeg')

    clips = {}
    for c in W.get('voice', {}):
        p = os.path.join(wdir, 'audio', 'opti-%s.mp3' % c)
        if os.path.exists(p):
            clips[c] = ('assets/sparkle/vr-%s/audio/opti-%s.mp3' % (wk, c)) if repo else b64(p, 'audio/mpeg')

    def play(c):
        if c in clips:
            return '<button class="vr-play" type="button" data-clip="%s" aria-label="Listen to Opti">🔊 Opti</button>' % c
        return ''

    canvas = E(W['canvasName'])

    # ---------- models block ----------
    mb = []
    for g in W['vr']['groups']:
        mb.append('<div class="vr-group"><h4>%s</h4><div class="vr-models">' % E(g['title']))
        for m in g['models']:
            pic = ('<img src="%s" alt="%s" loading="lazy">' % (img(m['img']), E(m['alt']))) if m.get('img') else ('<span class="vr-ic vr-mic" role="img" aria-label="%s">%s</span>' % (E(m.get('alt', m['name'])), m['icon']))
            cnt = (' <span class="vr-x">× %d</span>' % m['count']) if m.get('count', 1) > 1 else ''
            mb.append('<div class="vr-model">%s<div><b>%s</b>%s<span class="vr-word">%s</span>%s</div></div>'
                      % (pic, E(m['name']), cnt, E(m['word']), ('<small class="vr-why">%s</small>' % E(m['why'])) if m.get('why') else ''))
        mb.append('</div></div>')
    models_html = ''.join(mb)
    B_ = W.get('pattern', 'A') == 'B'
    place_html = ''.join('<div class="vr-place-card"><img src="%s" alt="%s" loading="lazy"><div>%s<small>%s</small></div></div>'
                         % (img(p['img']), E(p['alt']), p['html'], E(p['cap'])) for p in W['vr'].get('place', []))
    say_html = '<ol class="vr-sayl">' + ''.join('<li><b>%d</b>%s</li>' % (i + 1, E(x)) for i, x in enumerate(W['vr'].get('say', []))) + '</ol>'
    secs = W['vr'].get('seconds', 30)
    timer_html = ('<div class="vr-timer" data-secs="%d"><button type="button">▶ Practice: %d seconds</button><span class="clock">0:%02d</span>'
                  '<span class="bar"><i></i></span></div>' % (secs, secs, secs))

    # ---------- steps ----------
    steps = []
    n = len(W['vr']['steps'])
    for i, s in enumerate(W['vr']['steps']):
        if s.get('where'):
            steps.append('<div class="vr-where">%s</div>' % E(s['where']))
        body = s['html'].replace('@MODELS@', models_html).replace('@PLACE@', place_html).replace('@SAY@', say_html).replace('@TIMER@', timer_html).replace('@CANVAS@', canvas)
        steps.append('<div class="vr-step" data-step="%d"><button class="vr-chk" type="button" aria-label="Mark step %d done" aria-pressed="false"></button>'
                     '<div><div class="sn">Step %d of %d · %s %s</div><div class="st">%s</div></div></div>'
                     % (i, i + 1, i + 1, n, E(s['title']), play(s.get('clip', '')), body))
        ex = W['vr'].get('extra')
        if ex and ex['after'] == i + 1:
            steps.append('<div class="vr-extra"><span class="vr-tag">VR only</span><b>Extra, if you have time</b> %s<div class="st">%s</div></div>'
                         % (play(ex.get('clip', '')), ex['html']))

    # ---------- hook ----------
    h = W['hook']
    rows = ''.join('<tr><td>%s</td><td>%s</td></tr>' % (E(a), E(b)) for a, b in h['rows'])
    hook = ('<div class="wl-card"><div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
            '<div class="vr-sheet"><div class="hd"><b>%s</b><span>%s</span></div><table>%s</table>'
            '<div class="ph"><figure><img src="%s" alt="%s"><figcaption>%s</figcaption></figure>'
            '<div class="vr-note"><small>%s</small>%s</div></div></div></div>'
            % (h['look'], E(h['head']), E(h['sub']), rows, img(h['img']), E(h['alt']), E(h['cap']), E(h.get('noteFrom', 'Message from inside Canvas')), E(h['note'])))

    opti_img = shared('opti.png')

    def opti(text, clip):
        return ('<div class="wl-opti"><img src="%s" alt="Opti the owl"><div class="bub"><b class="who">Opti, the team’s owl, says…</b>%s %s</div></div>'
                % (opti_img, E(text), play(clip)))

    # ---------- VR pane ----------
    B = W['badge']
    job = W['vr'].get('job') or (['Scout the place in VR', 'Record your video', 'Send it to Canvas'] if B_ else ['Build it in VR', 'Take one photo', 'Send it to Canvas'])
    vr = ('<section class="vr-pane on" id="vr-loc" aria-label="Field Files">'
          '<div class="wl-card"><div class="vr-kick">%s · about 10 minutes</div><h3 class="vr-h3">%s</h3>'
          '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div>'
          '<div class="vr-job"><span><span class="n">1</span>%s</span><i>→</i><span><span class="n">2</span>%s</span><i>→</i><span><span class="n">3</span>%s</span></div>'
          '<div class="vr-prog" aria-live="polite"><span id="vr-prog-t">0 of %d steps done</span> · tap the box when you finish a step<div class="bar"><i id="vr-prog-b"></i></div></div>'
          '%s'
          '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
          '<label class="vr-done"><input type="checkbox" id="vr-sent"> %s</label>'
          '<div class="vr-badge" id="vr-badge" role="status"><span class="em">%s</span><div><b>%s: done!</b>%s</div></div>'
          '%s</div></section>'
          % ('Field File %s · scout it' % wk if B_ else 'Field File %s · build it' % wk, E(W['vr']['h3']), W['vr']['look'], E(job[0]), E(job[1]), E(job[2]), n, ''.join(steps), E(W['vr']['full']),
             'Video sent!' if B_ else 'Photo sent!', B['emoji'], E(B['name']), E(B['line']), help_drawer(W, help_img, B_)))

    # ---------- Desk Day pane (no headset) ----------
    S = W['studio']
    wr = S['write']
    wframes = ''.join('<div class="vr-lead">%s</div><textarea data-w="%d" aria-label="%s" placeholder="%s"></textarea>'
                      % (E(f['lead']), i, E(f['lead']), E(f['starter'])) for i, f in enumerate(wr['frames']))
    chips = ''.join('<button type="button">%s</button>' % E(c) for c in wr['chips'])
    studio = ('<section class="vr-pane" id="vr-studio" aria-label="Desk Day">'
              '<div class="wl-card"><div class="vr-kick">%s</div><h3 class="vr-h3">%s</h3>%s'
              '<div class="wl-look"><b>👀 What am I looking at?</b> %s</div><div class="wl-do"><b>What to do:</b> %s</div>'
              '<div id="vr-game"></div>'
              '<div id="vr-write" hidden><div class="vr-gstep">Tell your teacher what you found</div>'
              '<div class="wl-look"><b>👀 What am I looking at?</b> Two sentence starters. Finish both in your own words. Tap a word to add it.</div>'
              '<div class="vr-chips">%s</div><div class="vr-frames-w">%s</div>'
              '<div class="vr-count" id="vr-count">0 of %d words</div></div>'
              '<div class="vr-stamp" id="vr-stamp">✔ %s</div>'
              '<div class="vr-full">⭐ <b>Full points:</b> %s</div>'
              '<div class="vr-gather"><b>📄 My answers</b><div style="margin:6px 0">First name: <input type="text" id="vr-name" maxlength="20" autocomplete="given-name"></div>'
              '<div class="ok-name" id="vr-name-msg"></div>'
              '<button class="vr-pdf" type="button" id="vr-pdf">📄 Download my answers (PDF)</button>'
              '<div style="font-size:15.5px">Choose <b>Save as PDF</b>. Then upload that file to the Canvas assignment.</div></div>'
              '</div></section>'
              % (E(S['kicker']), E(S['title']), opti(W['opti']['desk'], 'desk'), S['look'], E(S['do']), chips, wframes, wr['min'], E(W['stamp']), E(S['full'])))

    G = S['game']
    def res(o):
        if isinstance(o, dict):
            return {k: (img(v) if k == 'img' and isinstance(v, str) else res(v)) for k, v in o.items()}
        if isinstance(o, list):
            return [res(v) for v in o]
        return o
    game = dict(res(G), title=S['title'], min=wr['min'], frames=[f['lead'] for f in wr['frames']])
    cfg = {'pre': W['id'], 'clips': clips, 'game': game, 'canvas': W['canvasName'], 'title': W['title'], 'week': wk,
           'lesson': W['lesson'], 'stamp': W['stamp'], 'video': 'assets/video/teacher/g4ss-vr-%s.mp4' % wk if repo else '',
           'doneKey': 'oao.g4ss.vr.', 'alt': 'Desk Day', 'gradeLine': 'Optima Academy Online · 4th Grade Social Studies'}

    paths = ('<div class="vr-paths" role="group" aria-label="Pick your path">'
             '<button class="vr-path" type="button" data-path="vr-loc" aria-pressed="true"><span class="ic">🥽</span><span><b>Field Files (VR)</b><small>Earn the %s</small></span></button>'
             '<button class="vr-path" type="button" data-path="vr-studio" aria-pressed="false"><span class="ic">🗄️</span><span><b>No headset today? Desk Day</b><small>Do it on your computer</small></span></button></div>'
             % E(B['name']))

    video = '<div class="vr-video" id="vr-video" hidden><div class="wl-card"><div class="vr-kick">From your teacher</div><video controls preload="none"></video></div></div>'

    cred = []
    for k in used:
        c = credits[k]
        if c.get('line'):
            cred.append(E(c['line'].rstrip('.')))
        else:
            cred.append('%s: <a href="%s" target="_blank" rel="noopener">%s</a>, %s (%s, Wikimedia Commons)'
                        % (E(k), E(c['url']), E(c['title'].replace('File:', '')), E(c['artist'] or 'unknown'), E(c['license'])))
    credits_html = '<footer class="vr-credits"><b>Photo credits</b>: ' + '; '.join(cred) + '. Opti the owl © Optima Academy Online.</footer>'

    header = ('<div class="header"><div class="header-brand"><div class="header-logo"><img src="%s" alt="Optima Academy"></div>'
              '<div><div class="header-org">Optima Academy Online</div><div class="header-sub">An Education Experience Company</div></div></div>'
              '<div class="header-title">%s VR: <em>%s</em></div><div class="header-badge"><span>%s</span><span>Week %s · VR</span></div></div><div class="ms-strip"></div>'
              % (shared('optima-logo.png'), E(W['lesson']), E(W['title']), W['emoji'], wk))
    details = ''.join('<span>%s</span>' % E(d) for d in W['details'])
    top = ('<div class="wl-top"><div class="wl-hdr"><button class="wl-pill" id="wl-details-btn" aria-expanded="false">Activity details ▾</button></div>'
           '<div class="wl-details" id="wl-details">%s</div></div>' % details)

    if repo:
        css = ('<link rel="stylesheet" href="assets/sparkle/vr/ff-base.css"><link rel="stylesheet" href="assets/sparkle/vr/vr.css">')
        js = '<script src="assets/sparkle/vr/vr.js"></script>'
    else:
        wf = open(os.path.join(KIT, 'engine', 'ff-base.css'), encoding='utf-8').read()
        css = '<style>%s</style><style>%s</style>' % (wf, open(os.path.join(KIT, 'engine', 'vr.css'), encoding='utf-8').read())
        js = '<script>%s</script>' % open(os.path.join(KIT, 'engine', 'vr.js'), encoding='utf-8').read()

    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            '<!-- G4 Social Studies VR (Field Files / Desk Day) · Week %s · built by tools/vr/build_vr.py from weeks/%s/week.json. Edit the JSON, not this file. -->'
            '<title>%s VR · %s</title>%s</head><body><div class="page-wrap">%s%s<main class="vr">%s%s%s%s%s</main>%s</div>'
            '<script>window.VR=%s;</script>%s</body></html>'
            % (wk, wk, E(W['lesson']), E(W['title']), css, header, top, hook, opti(W['opti']['brief'], 'brief'), video, paths,
               vr + studio, credits_html, json.dumps(cfg, ensure_ascii=False).replace('</', '<\\/'), js))
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(page)
    missing = [k for k in used if k not in credits]
    print('built', out_path, '%.1f MB' % (len(page) / 1e6), 'missing credits:', missing)


def help_drawer(W, help_img, video=False):
    what = 'video' if video else 'photo'
    m = E(W['map'])
    def s(n, img, title, text):
        return '<div class="vr-hs"><img src="%s" alt="%s" loading="lazy"><div class="t"><b class="k">%s</b><b>%s</b><br>%s</div></div>' % (help_img(img), E(title), n, E(title), text)
    return ('<details class="vr-help" id="vr-help"><summary><span>🛟 Having trouble in VR?<small>Steps with pictures, and a how-to video</small></span></summary><div class="in">'
            '<div class="vid"><iframe data-src="https://www.youtube-nocookie.com/embed/slDH-WN4scY?rel=0" title="How-to video: Optima On-Demand and Canvas" allowfullscreen></iframe></div>'
            '<p style="font-size:15px">These pictures come from other maps. Your map will be <b>%s</b>, but the buttons are the same.</p>'
            '<h5>🖥️ First time only: connect Canvas (on your computer)</h5>'
            + s(1, 'vr-canvas-help-01-login.jpg', 'Log in', 'Go to <b>xr.optimaed.com</b>. Log in with your VR login.')
            + s(2, 'vr-canvas-help-02-authorize.jpg', 'Connect to Canvas', 'Click <b>Connect to Canvas</b>. Log in to Canvas, then click <b>Authorize</b>. You will see <b>Canvas connection completed</b>.')
            + s(3, 'vr-canvas-help-03-connected.jpg', 'Find our class', 'Click <b>Canvas</b> on the left and pick our class. You only do this one time.')
            + '<h5>📄 Only if the assignment has a file</h5>'
            + s(4, 'vr-canvas-help-04-upload.jpg', 'Get the file ready', 'Open the assignment. Click <b>Open in Canvas</b> to download the file. Then click <b>My Files</b> and <b>Upload File</b>.')
            + '<h5>🥽 In the headset</h5>'
            + s(5, 'vr-canvas-help-05-explore.jpg', 'Explore tab', 'Click <b>Explore</b>. Type the map name in <b>Filter environments</b>.')
            + s(6, 'vr-canvas-help-06-begin-solo.jpg', 'Begin Solo', 'Click the map, then click <b>Begin Solo</b>.')
            + s(7, 'vr-canvas-help-07-canvas.jpg', 'Read the assignment', 'Press the <b>top button on your right controller</b>. Click the <b>Canvas</b> tab and pick our assignment. Tip: point at a mint side grip and squeeze to pull the tablet to your hand.')
            + s(8, 'vr-canvas-help-08-models.jpg', 'Bring out the models', 'Click <b>Models</b>. Type the gray word in the search box. Click a model to bring it out.')
            + s(9, 'vr-canvas-help-08b-move.jpg', 'Move and resize', 'Grab a model with the <b>palm trigger</b>. Use <b>both</b> palm triggers to make it bigger or smaller.')
            + s(10, 'vr-canvas-help-09-placed.jpg', 'Need a file?', 'Click <b>Library</b>, then <b>Files</b>. Pick your file to place it.')
            + (s(11, 'vr-canvas-help-10-camera.jpg', 'Record a video', 'Click <b>Library</b>, then <b>Camera</b>. Move the tablet until the place fits. Click <b>Record video</b> and talk. Click it again to stop.') if video else s(11, 'vr-canvas-help-10-camera.jpg', 'Take a photo', 'Click <b>Library</b>, then <b>Camera</b>. Move the tablet until your scene fits. Click <b>Take photo</b>.'))
            + s(12, 'vr-canvas-help-11-choose.jpg', 'Pick your ' + what, 'Click the <b>Canvas</b> tab and pick our assignment. Click <b>Choose from My Files</b>, pick your newest ' + what + ', then <b>Use this file</b>.')
            + s(13, 'vr-canvas-help-12-submitted.jpg', 'Submit to Canvas', 'Click <b>Submit to Canvas</b>. Look for the green <b>Submitted</b> tag. To leave, press the <b>Meta button</b>, then click <b>Quit</b>.')
            + '<h5>🔁 Didn’t work in VR? Two other ways</h5>'
            + s(14, 'vr-canvas-help-13-portal-submit.jpg', 'Use the website', 'Go to <b>xr.optimaed.com</b> and click <b>Canvas</b>. Pick our assignment, click <b>Choose from My Files</b>, pick your ' + what + ' and submit it.')
            + '<p style="font-size:15px">Your photos and videos save to <b>My Files</b> at xr.optimaed.com. You can also download your ' + what + ' there and upload it to the Canvas assignment yourself.</p>'
            '</div></details>') % m


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0], a[1], repo='--repo' in sys.argv)
