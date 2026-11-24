#!/usr/bin/env python3
"""File G4 SS VR weeks into the repo (run from the repo root). Ported from the G3 kit's file_week.py, minus audio:
G4 VR pages are text only (oao-audio-budget), so there are no clips to reuse, pick up or log.
  python3 tools/vr/file_week.py 17          # build vr-17.html (repo mode) + copy its images + the engine
  python3 tools/vr/file_week.py all         # every week in tools/vr/weeks
Then: check_vr (0 FAIL), playtest over http, and commit with explicit paths (git commit -- <paths>).
"""
import glob, json, os, shutil, subprocess, sys
K = 'tools/vr/weeks'
weeks = sorted(int(os.path.basename(p)) for p in glob.glob(K + '/*') if os.path.isdir(p) and os.path.basename(p).isdigit())
todo = weeks if sys.argv[1] == 'all' else [int(sys.argv[1])]
os.makedirs('assets/sparkle/vr', exist_ok=True)
for f in ('ff-base.css', 'vr.css', 'vr.js', 'optima-logo.png'):
    shutil.copy('tools/vr/engine/' + f, 'assets/sparkle/vr/')
for w in todo:
    a = 'assets/sparkle/vr-%d/img' % w
    os.makedirs(a, exist_ok=True)
    for f in glob.glob('%s/%d/img/*.jpg' % (K, w)): shutil.copy(f, a + '/')
    subprocess.run(['python3', 'tools/vr/build_vr.py', '%s/%d/week.json' % (K, w), 'vr-%d.html' % w, '--repo'], check=True)
    print('filed week', w, '->', 'vr-%d.html' % w, '+', a)
