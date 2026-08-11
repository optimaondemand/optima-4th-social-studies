# Video Manifest Handoff — Grade 3 & Grade 4 Social Studies

*Last updated: August 11, 2026*

---

## Current state

### Grade 4
- **File**: `video-manifest.json` in `optima-4th-social-studies`
- **GitHub**: `https://raw.githubusercontent.com/bbirchum1/optima-4th-social-studies/main/video-manifest.json`
- **Total slots**: 248 (8 ready, 240 pending)
- **Video types**: Teacher Welcome (62), Core Lesson (62), Assignment Explainer (58), Closing (62), Video/untyped (4)
- **Removed**: 64 quiz-feedback slots (Perfect Score / Review & Encouragement) — replaced with generic text messages in the lesson HTML, no longer in manifest
- **Known quirk**: 4 slots in Module 7 (`4-07-0X-assignment-explainer-explainer`) have duplicated suffix, `type: "Video"`, `section: "Unknown"` — should be renamed to match the normal pattern

### Grade 3
- **File**: `video-manifest.json` in `optima-3rd-social-studies`
- **GitHub**: `https://raw.githubusercontent.com/bbirchum1/optima-3rd-social-studies/main/video-manifest.json`
- **Total slots**: 366 (80 ready, 286 pending)
- **Video types**: Teacher Welcome (61), Core Lesson (61), Perfect Score (61), Review & Encouragement (61), Assignment Explainer (61), Closing (61)
- **Note**: G3 still has quiz-feedback slots (Perfect Score / Review & Encouragement) — remove these if applying the same generic-text approach as G4

---

## How the manifest works

Each repo has a `video-manifest.json` at root. Lesson HTML pages fetch it from the raw GitHub URL at page load via the Video Manifest Loader script (appended before `</body>` in every lesson file). The loader finds `.video-placeholder-id` elements with `<!-- slot: SLOT-KEY -->` comments and injects the matching iframe when `status` is `"ready"`.

**Slot structure**:
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

- **slot key**: `{grade}-{module}-{lesson}-{video-type-slug}`
- **embed**: raw `<iframe>` embed code — works with any source (SharePoint, YouTube, Loom, etc.)
- **status**: `"pending"` (empty embed, won't render) or `"ready"` (has embed, will render)

---

## Embed source: SharePoint vs YouTube

SharePoint/Stream embeds require authentication. When lesson pages are viewed inside Canvas (cross-origin iframe), browsers block SharePoint's auth cookies → video won't load even if the user has access. This is a browser security boundary, not a permissions issue.

**Current decision**: Use **YouTube (unlisted)** embed codes instead. YouTube-nocookie embeds work inside Canvas iframes without authentication. Test embeds using `youtube-nocookie.com` are currently on `4-01-01-welcome` (G4) and `3-01-01-welcome` (G3).

If IT enables "Anyone" sharing links at the SharePoint tenant level in the future, SharePoint embeds would also work.

---

## How to add embed codes

### What Bethany provides
- A CSV or Excel file with columns: `Course`, `Week`, `Title`, `Embed Code`
- The `<iframe>` title attribute contains the slot key (e.g. `title="4-01-02-welcome.mp4"`)

### What Claude does
1. Parse the CSV/Excel — extract slot keys from iframe title attributes (strip `.mp4`)
2. Match each slot key to `video-manifest.json`
3. Set `embed` to the iframe code, set `status` to `"ready"`
4. Save the manifest
5. Bethany commits and pushes from Git Bash:
```
cd ~/OneDrive\ -\ OptimaEd/Documents/Claude/optima-4th-social-studies
git add video-manifest.json
git commit -m "Add embed codes for [lessons]"
git push origin main
```

### Naming convention for slot keys
`{grade}-{module}-{lesson}-{type-slug}`

| Type slug | Video type |
|---|---|
| `welcome` | Teacher Welcome |
| `explore-explainer` | Core Lesson |
| `assignment-explainer` | Assignment Explainer |
| `closing` | Closing |
| `quiz-perfect` | Perfect Score (G3 only, removed from G4) |
| `quiz-review` | Review & Encouragement (G3 only, removed from G4) |

---

## Git push notes

- The sandbox environment can't push to GitHub (no credentials). Bethany pushes manually from Git Bash.
- If `index.lock` errors appear: `rm .git/index.lock` then retry.
- Don't `git add .` — it picks up unrelated cache files. Use `git add video-manifest.json` (and `*.html` if lesson files changed).
