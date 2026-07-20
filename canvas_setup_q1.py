#!/usr/bin/env python3
"""
G3 Social Studies Q1 — Canvas Course Builder
Course: https://optimaoaoteam.instructure.com/courses/26

HOW TO SET YOUR API TOKEN (never put it in this file):

  Option A — environment variable (recommended for Claude Code):
    export CANVAS_TOKEN="your-token-here"
    python3 canvas_setup_q1.py

  Option B — .env file next to this script (keep out of git):
    echo 'CANVAS_TOKEN=your-token-here' > .env
    python3 canvas_setup_q1.py

  In Claude Code: add CANVAS_TOKEN to your project's environment
  variables in .claude/settings.local.json (that file is git-ignored).
"""

import os, re, sys, time, json, requests
from pathlib import Path

# ── Load .env if present ───────────────────────────────────
_env = Path(__file__).parent / ".env"
if _env.exists():
    for line in _env.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

# ── Config — edit only these if anything changes ───────────
CANVAS_URL   = "https://optimaoaoteam.instructure.com"
CANVAS_TOKEN = os.environ.get("CANVAS_TOKEN", "")
COURSE_ID    = 26
GITHUB_REPO  = "optimaondemand/optima-3rd-social-studies"
GITHUB_BRANCH = "main"   # script will fall back to "master" if main 404s

if not CANVAS_TOKEN:
    sys.exit(
        "\n❌  CANVAS_TOKEN not set.\n"
        "    Run:  export CANVAS_TOKEN='your-token'\n"
        "    Or create a .env file next to this script.\n"
    )

CANVAS_HEADERS = {
    "Authorization": f"Bearer {CANVAS_TOKEN}",
    "Content-Type": "application/json",
}

RAW_BASE = f"https://optimaondemand.github.io/optima-3rd-social-studies"

# ── Q1 lesson manifest ─────────────────────────────────────
UNITS = [
    {"num": 1, "title": "Curator Training Hall"},
    {"num": 2, "title": "Explorer's Vault"},
    {"num": 3, "title": "Cartography Gallery"},
]

LESSONS = [
    # (unit, lesson_num, display_title)
    (1, 1, "What Historians Study"),
    (1, 2, "Primary vs. Secondary Sources"),
    (1, 3, "Reading a Historical Source"),
    (1, 4, "Technology as a Research Tool"),
    (1, 5, "Latin and Greek Roots"),
    (1, 6, "The Evidence Entry"),
    (2, 1, "Why People Explore"),
    (2, 2, "Famous European Explorers"),
    (2, 3, "Navigation Tools and Technology"),
    (2, 4, "The Columbian Exchange"),
    (2, 5, "Evaluating Explorer Sources"),
    (2, 6, "Explorer Evidence Chart"),
    (3, 1, "Map Elements"),
    (3, 2, "Cardinal and Intermediate Directions"),
    (3, 3, "Types of Maps"),
    (3, 4, "Map Scale and Measuring Distance"),
]


# ── GitHub helpers ─────────────────────────────────────────
def get_repo_files():
    """Return list of filenames in the repo root via GitHub contents API."""
    global GITHUB_BRANCH, RAW_BASE
    url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/"
    for branch in ("main", "master"):
        resp = requests.get(url, params={"ref": branch}, timeout=15)
        if resp.status_code == 200:
            GITHUB_BRANCH = branch
            RAW_BASE = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{branch}"
            files = [item["name"] for item in resp.json() if item["type"] == "file"]
            print(f"   GitHub branch: {branch} ({len(files)} files found)")
            return files
    sys.exit(f"❌  GitHub API returned {resp.status_code}: {resp.text[:200]}")


def find_lesson_file(files, unit, lesson):
    """
    Find the HTML file for a given unit/lesson number.
    Handles both dot separator (01.01) and underscore (07_03).
    Returns filename or None.
    """
    pattern = re.compile(
        rf"ss-3-{unit:02d}[._]{lesson:02d}-.+\.html$"
    )
    matches = [f for f in files if pattern.match(f)]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        print(f"     ⚠️  Multiple matches for {unit:02d}.{lesson:02d}: {matches} — using first")
        return matches[0]
    return None


def find_assessment_file(files, unit):
    """Match g3-u{unit:02d}-assessment.html"""
    target = f"g3-u{unit:02d}-assessment.html"
    return target if target in files else None


# ── Canvas API helpers ─────────────────────────────────────
def _canvas(method, path, payload=None, label=""):
    url  = f"{CANVAS_URL}/api/v1{path}"
    resp = getattr(requests, method)(
        url, headers=CANVAS_HEADERS, json=payload, timeout=20
    )
    time.sleep(0.35)  # gentle rate-limiting
    if resp.status_code not in (200, 201):
        print(f"     ❌  {label} — HTTP {resp.status_code}: {resp.text[:300]}")
        return None
    return resp.json()


def cpost(path, payload, label=""):
    return _canvas("post", path, payload, label)


def cput(path, payload, label=""):
    return _canvas("put", path, payload, label)


# ── HTML builders ──────────────────────────────────────────
def lesson_html(file_url, code, title):
    return (
        f'<p style="font-style:italic;color:#555;margin-bottom:6px;">'
        f'Lesson {code} — {title}</p>'
        f'<iframe src="{file_url}" width="100%" height="900" '
        f'frameborder="0" style="border:none;display:block;"></iframe>'
        f'<hr/>'
        f'<p><strong>After completing all tabs in the lesson above:</strong> '
        f'Type your Curator\'s Chronicle entry in the text box below and click Submit.</p>'
    )


def assessment_html(file_url, unit_num, unit_title):
    return (
        f'<p style="font-style:italic;color:#555;margin-bottom:6px;">'
        f'Unit {unit_num} Assessment — {unit_title}</p>'
        f'<iframe src="{file_url}" width="100%" height="900" '
        f'frameborder="0" style="border:none;display:block;"></iframe>'
        f'<hr/>'
        f'<p>Complete the assessment above. When finished, type '
        f'<strong>Complete</strong> in the text box below and submit.</p>'
    )


# ── Main ───────────────────────────────────────────────────
def main():
    print(f"\n🏛️   G3 Social Studies Q1 — Canvas Course Builder")
    print(f"    Course: {CANVAS_URL}/courses/{COURSE_ID}/modules\n")

    # 1. GitHub file inventory
    print("🔍  Fetching GitHub file list...")
    files = get_repo_files()

    # 2. Assignment groups
    print("\n📂  Creating assignment groups...")
    ag_chronicle = cpost(
        f"/courses/{COURSE_ID}/assignment_groups",
        {"assignment_group": {"name": "Curator's Chronicle", "position": 1, "group_weight": 0}},
        "ag:chronicle",
    )
    ag_assess = cpost(
        f"/courses/{COURSE_ID}/assignment_groups",
        {"assignment_group": {"name": "Unit Assessments", "position": 2, "group_weight": 0}},
        "ag:assessments",
    )
    if not ag_chronicle or not ag_assess:
        sys.exit("❌  Could not create assignment groups. Check your token and course ID.")

    ag_chronicle_id = ag_chronicle["id"]
    ag_assess_id    = ag_assess["id"]
    print(f"   ✅  Curator's Chronicle  (id {ag_chronicle_id})")
    print(f"   ✅  Unit Assessments     (id {ag_assess_id})")

    # 3. Modules + items
    module_ids    = []
    assign_pos    = 1

    for unit in UNITS:
        u     = unit["num"]
        title = unit["title"]
        print(f"\n📦  Module {u}: {title}")

        # Create module
        mod = cpost(
            f"/courses/{COURSE_ID}/modules",
            {"module": {
                "name": title,
                "position": u,
                "require_sequential_progress": True,
            }},
            f"module:{u}",
        )
        if not mod:
            sys.exit(f"❌  Failed to create module {u}. Stopping.")
        mod_id = mod["id"]
        module_ids.append(mod_id)
        print(f"   ✅  Module created (id {mod_id})")

        item_pos = 1

        # Section subheader
        cpost(
            f"/courses/{COURSE_ID}/modules/{mod_id}/items",
            {"module_item": {"title": title, "type": "SubHeader", "position": item_pos}},
            f"subheader:{u}",
        )
        item_pos += 1

        # Lesson assignments
        unit_lessons = [(n, t) for (u2, n, t) in LESSONS if u2 == u]
        for lesson_num, lesson_title in unit_lessons:
            code  = f"3.{u:02d}.{lesson_num:02d}"
            fname = find_lesson_file(files, u, lesson_num)

            if fname:
                file_url = f"{RAW_BASE}/{fname}"
                status   = f"→ {fname}"
            else:
                file_url = f"MISSING_FILE_ss-3-{u:02d}_{lesson_num:02d}-*.html"
                status   = "⚠️  file not found in repo"

            print(f"   {code}  {status}")

            assignment = cpost(
                f"/courses/{COURSE_ID}/assignments",
                {"assignment": {
                    "name": f"{code} — {lesson_title}",
                    "description": lesson_html(file_url, code, lesson_title),
                    "points_possible": 10,
                    "grading_type": "points",
                    "submission_types": ["online_text_entry"],
                    "assignment_group_id": ag_chronicle_id,
                    "published": True,
                    "position": assign_pos,
                }},
                f"assignment:{code}",
            )
            assign_pos += 1

            if assignment:
                cpost(
                    f"/courses/{COURSE_ID}/modules/{mod_id}/items",
                    {"module_item": {
                        "title": f"{code} — {lesson_title}",
                        "type": "Assignment",
                        "content_id": assignment["id"],
                        "position": item_pos,
                        "completion_requirement": {"type": "must_submit"},
                    }},
                    f"moditem:{code}",
                )
                item_pos += 1

        # Assessment subheader
        cpost(
            f"/courses/{COURSE_ID}/modules/{mod_id}/items",
            {"module_item": {
                "title": "Unit Assessment",
                "type": "SubHeader",
                "position": item_pos,
            }},
            f"subheader:assessment:{u}",
        )
        item_pos += 1

        # Assessment assignment
        afname = find_assessment_file(files, u)
        if afname:
            assess_url = f"{RAW_BASE}/{afname}"
            print(f"   Assessment → {afname}")
        else:
            assess_url = f"MISSING_FILE_g3-u{u:02d}-assessment.html"
            print(f"   ⚠️  Assessment file not found (g3-u{u:02d}-assessment.html)")

        assess_assign = cpost(
            f"/courses/{COURSE_ID}/assignments",
            {"assignment": {
                "name": f"Unit {u} Assessment — {title}",
                "description": assessment_html(assess_url, u, title),
                "points_possible": 20,
                "grading_type": "points",
                "submission_types": ["online_text_entry"],
                "assignment_group_id": ag_assess_id,
                "published": True,
                "position": assign_pos,
            }},
            f"assessment:u{u}",
        )
        assign_pos += 1

        if assess_assign:
            cpost(
                f"/courses/{COURSE_ID}/modules/{mod_id}/items",
                {"module_item": {
                    "title": f"Unit {u} Assessment — {title}",
                    "type": "Assignment",
                    "content_id": assess_assign["id"],
                    "position": item_pos,
                    "completion_requirement": {"type": "must_submit"},
                }},
                f"moditem:assess:{u}",
            )

    # 4. Module prerequisites
    print("\n🔗  Setting module prerequisites...")
    if len(module_ids) >= 2:
        cput(
            f"/courses/{COURSE_ID}/modules/{module_ids[1]}",
            {"module": {"prerequisite_module_ids": [module_ids[0]]}},
            "prereq:m2",
        )
        print(f"   ✅  Module 2 requires Module 1")
    if len(module_ids) >= 3:
        cput(
            f"/courses/{COURSE_ID}/modules/{module_ids[2]}",
            {"module": {"prerequisite_module_ids": [module_ids[1]]}},
            "prereq:m3",
        )
        print(f"   ✅  Module 3 requires Module 2")

    print(f"\n✅  Done!")
    print(f"    View: {CANVAS_URL}/courses/{COURSE_ID}/modules\n")
    print("    ⚠️  Regenerate your Canvas API token — it was shared in chat.")


if __name__ == "__main__":
    main()
