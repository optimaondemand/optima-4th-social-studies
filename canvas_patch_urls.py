#!/usr/bin/env python3
"""
Patch all assignment iframe URLs from raw.githubusercontent.com → GitHub Pages.

Usage:
  export CANVAS_TOKEN="your-token"
  python3 canvas_patch_urls.py
"""

import os, sys, time, requests
from pathlib import Path

# ── Load .env if present ───────────────────────────────────
_env = Path(__file__).parent / ".env"
if _env.exists():
    for line in _env.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

CANVAS_URL   = "https://optimaoaoteam.instructure.com"
CANVAS_TOKEN = os.environ.get("CANVAS_TOKEN", "")
COURSE_ID    = 26

OLD_BASE = "https://raw.githubusercontent.com/optimaondemand/optima-3rd-social-studies/main"
NEW_BASE = "https://optimaondemand.github.io/optima-3rd-social-studies"

if not CANVAS_TOKEN:
    sys.exit("❌  Set CANVAS_TOKEN env var or .env file.")

headers = {"Authorization": f"Bearer {CANVAS_TOKEN}", "Content-Type": "application/json"}

def get_all_assignments():
    """Fetch all assignments in the course (handles pagination)."""
    assignments = []
    url = f"{CANVAS_URL}/api/v1/courses/{COURSE_ID}/assignments"
    params = {"per_page": 100}
    while url:
        resp = requests.get(url, headers=headers, params=params, timeout=20)
        if resp.status_code != 200:
            sys.exit(f"❌  Failed to fetch assignments: {resp.status_code} {resp.text[:200]}")
        assignments.extend(resp.json())
        # Canvas pagination via Link header
        url = None
        link = resp.headers.get("Link", "")
        for part in link.split(","):
            if 'rel="next"' in part:
                url = part.split(";")[0].strip().strip("<>")
        params = {}  # params already in the next URL
    return assignments

def main():
    print(f"\n🔧  Patching iframe URLs in course {COURSE_ID}...")
    print(f"    OLD: {OLD_BASE}")
    print(f"    NEW: {NEW_BASE}\n")

    assignments = get_all_assignments()
    print(f"   Found {len(assignments)} assignments total.")

    patched = 0
    skipped = 0

    for a in assignments:
        desc = a.get("description") or ""
        if OLD_BASE not in desc:
            skipped += 1
            continue

        new_desc = desc.replace(OLD_BASE, NEW_BASE)
        resp = requests.put(
            f"{CANVAS_URL}/api/v1/courses/{COURSE_ID}/assignments/{a['id']}",
            headers=headers,
            json={"assignment": {"description": new_desc}},
            timeout=20,
        )
        time.sleep(0.35)

        if resp.status_code in (200, 201):
            print(f"   ✅  {a['name']}")
            patched += 1
        else:
            print(f"   ❌  {a['name']} — {resp.status_code}: {resp.text[:150]}")

    print(f"\n✅  Done. {patched} patched, {skipped} skipped (no old URL found).")
    print(f"    View: {CANVAS_URL}/courses/{COURSE_ID}/modules")

if __name__ == "__main__":
    main()
