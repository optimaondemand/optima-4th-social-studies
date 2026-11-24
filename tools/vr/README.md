# G4 Social Studies VR kit (`tools/vr/`): one weekly VR page, with Lesson B of the week

Ported 24 Nov 2026 from the G3 SS kit (optima-3rd-social-studies/tools/vr, "Build the Diorama"). Same engine and 17 game types, restyled for the Florida Files.

Theme: **Field Files** (VR). The teacher is stuck inside Canvas, so Opti (the Florida History Team's owl, on the student's side of the screen) sends the student out to the real place. The student sends back ONE thing, and it lands in her file. Badge = Field Seal W.
No headset: **Desk Day** (Opti's desk): one game + 2 sentence frames (20+ words) → **Download my answers (PDF)** with the red **Desk Day · FILED** stamp → upload to the same Canvas assignment.
Pattern A = build with 4-6 model kinds (10 pieces or fewer), ONE photo. Pattern B = scout a map, ONE video (30 s or less, 2 spoken sentences). Weeks alternate strictly (17 B, 18 A, ...).

**Text only.** oao-audio-budget: G4 VR pages have no audio. week.json has no `voice`; check_vr fails if a voice line or audio file appears.

```
python3 check_vr.py weeks/WW/week.json                        # rules (0 FAIL)
python3 build_vr.py weeks/WW/week.json out/G4-SS-Week-WW-VR-mockup.html
python3 check_vr.py weeks/WW/week.json out/G4-SS-Week-WW-VR-mockup.html   # + reading load per path
node playtest_vr.js out/G4-SS-Week-WW-VR-mockup.html 1150 out/pt
node playtest_vr.js out/G4-SS-Week-WW-VR-mockup.html 420 out/pt
python3 tools/vr/file_week.py WW        # from the repo root: vr-WW.html (repo mode) + assets/sparkle/vr-WW/img + engine copy
```
- `engine/` (ff-base.css, vr.css, vr.js, optima-logo.png): no week words. Repo copies go to `assets/sparkle/vr/`.
  Changes from G3: Florida Files colors (navy, gold, manila), grade/label/storage key come from `window.VR` (`gradeLine`, `alt`, `doneKey` = `oao.g4ss.vr.<W>`), timeline cards may use an emoji `icon`.
- `weeks/WW/`: week.json, credits.json, img/<key>.jpg. Repo copies go to `assets/sparkle/vr-WW/img/`.
- `add_img.py WW key images/<file> "<credit line>"`: the ONLY way to add a picture. It takes an image already in the repo, resizes it (≤1280 px, q62) and stores the credit line copied from that image's lesson (`{"line", "from"}`). No downloads. Never the unlicensed AI placeholders from Units 1-3; the credited `source-4-07..13-*-original.jpg` sources are fine. No credited photo? Use an emoji `icon`.
- Opti = `images/opti-owl.png`; help drawer = `images/vr-canvas-help-*.jpg` (both copied from optima-3rd-social-studies/images).
- `vr-assets.csv` + `vr-context.md`: copied from the G3 kit. Map and model names are checked against the CSV exactly. No costume/caricature/person models (check_vr bans them); objects stand for people instead.
- Hard limits (vr-context.md): no writing, labels or pictures in VR; every word lives in Canvas. check_vr fails a VR step that asks for writing.
- Desk Day games (engine/vr.js `GAMES`, all DATA in `studio.game`; check_vr validates each type and fails if a type repeats across weeks):
  17 timeline, 18 sort, 19 odd, 20 fill, 21 checks, 22 match, 23 clue, 24 order, 25 calendar, 26 memory, 27 dilemma, 28 panel, 29 wheel, 30 route, 31 reveal (branch only). Not used yet: trade, regionmap (regionmap is built for U.S. regions).
- Reading load: measured the G3 way (Opti's bubbles left out, printed separately) so it compares with G3 (G3 weeks 464-507). Warn above 450, FAIL above 520.
- Commit with explicit paths (`git commit -- <paths>`): another session may have files staged in this repo. Never `git add tools/vr` wholesale.
- Built 24 Nov 2026 in one sweep: project doc claude/g4-ss-vr-sweep.md. Week 31 (light page) is on branch `vr-31-light`, not main.
