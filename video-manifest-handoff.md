# Video Manifest Handoff — Grade 4 Social Studies

## What we just did

You asked whether a video manifest existed for the course. It does: `video-manifest.json` in this project folder. From it, I generated `g4-video-bulk-add.txt` — a pipe-delimited list of all 312 video slots formatted for your app's "Bulk add video entries" import (`Course | Week | Title | Owner`). Mapping used:

- **Course**: `Grade 4 Social Studies` for every row
- **Week**: the module number pulled from the slot key (e.g. `4-07-01-...` → module `07` → Week 7)
- **Title**: lesson title + video type, e.g. `Fort Mose And Freedom In Spanish Florida - Teacher Welcome`
- **Owner**: `Bethany Birchum` for every row

That file is a one-time export — if the manifest changes (new lessons, renamed slots), regenerate it rather than hand-editing it.

## How the manifest works

**File**: `video-manifest.json`, project root.
**Synced from**: `https://raw.githubusercontent.com/bbirchum1/optima-4th-social-studies/main/video-manifest.json` — lesson pages pull from this URL to auto-load videos, so edits should go back to that GitHub repo, not just the local copy.

**Structure**: one `videos` object, keyed by slot ID. Each slot is one video placeholder:

```json
"4-07-01-welcome": {
  "lesson": "Optima Academy Online — 01 Fort Mose And Freedom In Spanish Florida",
  "file": "ss-4-07-01-fort-mose-and-freedom-in-spanish-florida.html",
  "type": "Teacher Welcome",
  "section": "Welcome",
  "embed": "<iframe ...></iframe>",
  "status": "ready"
}
```

- **slot key**: `4-{module}-{lesson}-{video-type-slug}` — e.g. `4-07-01-welcome` is Module 7, Lesson 1, Welcome video.
- **lesson**: display title of the lesson the video belongs to.
- **file**: the actual HTML lesson file this video is embedded in.
- **type / section**: what kind of video this is (see below).
- **embed**: the raw SharePoint/Stream `<iframe>` embed code. Empty string until filled in.
- **status**: `"pending"` until an embed is added, then set to `"ready"`. The lesson pages key off this — empty `embed` won't render.

**Video types per lesson** (not every lesson has all 6):
| Type | Section | Count | Notes |
|---|---|---|---|
| Teacher Welcome | Welcome | 62 | one per lesson |
| Core Lesson | Explore | 62 | one per lesson |
| Perfect Score | Quiz | 32 | only lessons with a quiz reward video |
| Review & Encouragement | Quiz | 32 | pairs with Perfect Score |
| Assignment Explainer | Assignment | 58 | most lessons |
| Closing | Closing | 62 | one per lesson |
| Video *(untyped)* | Unknown | 4 | data quirk — see below |

Total: 62 lessons across 13 modules, 312 video slots, 4 currently `"ready"`, 308 `"pending"`.

**Known data quirk**: 4 slots (`4-07-01-assignment-explainer-explainer`, `4-07-02-...`, `4-07-03-...`, `4-07-04-...`) have a duplicated `-explainer` suffix in the key, `type: "Video"`, and `section: "Unknown"` instead of the normal `"Assignment Explainer"` / `"Assignment"` pattern. These look like a copy-paste error from when Module 7 was added — worth fixing at the source (rename keys, correct type/section) rather than working around them.

## Picking this back up

1. To add embed codes: edit `video-manifest.json` directly (or wherever the bulk-add app writes them back to), paste the SharePoint iframe into `embed`, flip `status` to `"ready"`.
2. To regenerate the bulk-add list after manifest changes: re-run the same key-parsing logic (`4-{module}-{lesson}-` prefix regex) against the `videos` object.
3. Push changes to the GitHub repo (`bbirchum1/optima-4th-social-studies`) since lesson pages fetch the raw URL, not the local file.
