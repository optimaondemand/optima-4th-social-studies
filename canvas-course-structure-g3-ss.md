# Canvas Course Structure — G3 Social Studies
## Optima Academy Online · Museum Immersion Arc · On-Demand

---

## DESIGN PRINCIPLES

**1. One path.** A 3rd grader should never wonder what to do next. The course flows in one direction: open the lesson → complete the activity → submit the Chronicle entry. No dead ends, no parallel tracks.

**2. The museum is real.** The Canvas course IS the museum. The home page is the museum entrance. Each module is a wing. Each lesson is a gallery room. Naming, imagery, and language should be consistent throughout — students shouldn't feel like they switched buildings when they open Canvas.

**3. Sequential by design.** Students move at their own pace, but always forward. Each lesson must be submitted before the next unlocks. The unit assessment is the final gate before the next wing opens.

---

## COURSE-LEVEL SETUP

### Home Page
The Canvas home page is the museum entrance. It should contain:

- **Museum banner image** — the Optima Museum of Human Experience header (dark navy, gold trim, museum name)
- **Welcome message** — 2–3 sentences from the "Chief Curator" introducing the museum and the year's work
- **Current wing indicator** — a small visual showing which gallery is open ("You are in: Curator Training Hall — Unit 1")

### Course Navigation (left sidebar — simplify to these items only)
- Home
- Modules
- Assignments
- Grades

Remove from student view: Pages, Files, Discussions, People, Announcements. Fewer options = less confusion.

### Course Banner / Color
Match the current unit's palette. Update at the start of each unit:
- Unit 1: Deep navy (`#0E1C42`) + gold
- Unit 2: Ocean blue (`#071E3D`) + compass gold
- Unit 3: Forest green (`#2D3A2E`) + amber

---

## MODULE STRUCTURE

Organize by **Unit** — three modules for Q1. All Q1 modules unlock simultaneously at the quarter start; teachers set specific completion dates. Within each module, students must submit each lesson before the next unlocks (sequential progression required).

```
📦 MODULE 1: Curator Training Hall (Unit 1)
   ├── [Header] Unit 1 — Curator Training Hall
   ├── ✏️  3.01.01 — What Historians Study
   ├── ✏️  3.01.02 — Primary vs. Secondary Sources
   ├── ✏️  3.01.03 — Reading a Historical Source
   ├── ✏️  3.01.04 — Technology as a Research Tool
   ├── ✏️  3.01.05 — Latin and Greek Roots
   ├── ✏️  3.01.06 — The Evidence Entry
   ├── [Header] Unit Assessment
   └── ✏️  Unit 1 Assessment

📦 MODULE 2: Explorer's Vault (Unit 2)
   ├── [Header] Unit 2 — Explorer's Vault
   ├── ✏️  3.02.01 — Why People Explore
   ├── ✏️  3.02.02 — Famous European Explorers
   ├── ✏️  3.02.03 — Navigation Tools and Technology
   ├── ✏️  3.02.04 — The Columbian Exchange
   ├── ✏️  3.02.05 — Evaluating Explorer Sources
   ├── ✏️  3.02.06 — Explorer Evidence Chart
   ├── [Header] Unit Assessment
   └── ✏️  Unit 2 Assessment

📦 MODULE 3: Cartography Gallery (Unit 3)
   ├── [Header] Unit 3 — Cartography Gallery
   ├── ✏️  3.03.01 — Map Elements
   ├── ✏️  3.03.02 — Cardinal and Intermediate Directions
   ├── ✏️  3.03.03 — Types of Maps
   ├── ✏️  3.03.04 — Map Scale and Measuring Distance
   ├── [Header] Unit Assessment
   └── ✏️  Unit 3 Assessment
```

### Module Settings
- **Sequential progress required:** Students cannot open lesson 3.01.02 until 3.01.01 is submitted.
- **Module prerequisites:** Module 2 locks until Module 1 is complete. Module 3 locks until Module 2 is complete.
- **Unlock dates:** All three Q1 modules unlock at quarter start. Teachers set the window; Canvas enforces the sequence.

---

## WHAT GOES INSIDE EACH LESSON

Every lesson is a **single Canvas Assignment** (not a separate Page + Assignment). The assignment description contains the iframe, and students submit their Chronicle entry as text.

### Canvas Assignment Structure (per lesson)

**Description field contains:**
```html
<iframe src="[URL for ss-3-XX-XX.html]"
  width="100%" height="900"
  frameborder="0" style="border:none;display:block;">
</iframe>
<hr/>
<p><strong>After completing all tabs in the lesson above:</strong>
Type your Curator's Chronicle entry in the text box below and click Submit.</p>
```

The lesson HTML itself has four tabs (already built into each file):
- Tab 1: Enter the Museum (narrative hook + vocabulary)
- Tab 2: Examine the Evidence (source analysis activity)
- Tab 3: Record Your Evidence (Curator's Chronicle prompt)
- Tab 4: Claim Your Badge (submission instructions)

**Assignment settings:**
- Type: Text entry
- Points: 10
- Assignment group: Curator's Chronicle
- Requires previous: Yes (sequential)

---

## ASSIGNMENT TYPES

### A. Curator's Chronicle Entry (every lesson — 10 pts)
Students write a structured evidence entry after working through the lesson:
- Part 1: What source did you examine? What type is it?
- Part 2: What does it tell you? (one claim + one detail from the source)
- Part 3: What can't it tell you — and why?

### B. Unit Assessment (end of each unit — 20 pts)
An HTML assessment file, embedded the same way as lessons:
```html
<iframe src="[URL for ss-3-XX-assessment.html]"
  width="100%" height="900"
  frameborder="0" style="border:none;display:block;">
</iframe>
<hr/>
<p>Complete the assessment above. When finished, type <strong>Complete</strong>
in the text box below and submit.</p>
```
Assignment group: Unit Assessments. Unlocks only after all lessons in the unit are submitted.

---

## GRADING STRUCTURE

### Points-Based
- Curator's Chronicle Entry × 6 lessons = 60 pts (Unit 1 & 2) or × 4 lessons = 40 pts (Unit 3)
- Unit Assessment = 20 pts
- **Unit 1 Total: 80 pts | Unit 2 Total: 80 pts | Unit 3 Total: 60 pts**

### Assignment Groups
| Group | Items | Points Each |
|-------|-------|------------|
| Curator's Chronicle | 16 lesson assignments | 10 pts |
| Unit Assessments | 3 unit assessments | 20 pts |

### Feedback approach
For 3rd grade: one sentence of praise + one push question. Example: "Your Part 2 is strong — you named a specific detail from the source. For Part 3: can you say more about WHY that information is missing?"

---

## FILE NAMING CONVENTIONS

```
Lesson HTML files:     ss-3-[unit]-[lesson]-[slug].html
Unit assessments:      ss-3-[unit]-assessment.html
Images (banners, etc): ss-3-[unit]-banner.png
```

Hosting: upload HTML files to your hosting provider (GitHub Pages, Canvas Files, S3, etc.) and replace `REPLACE_WITH_URL_FOR_[slug].html` placeholders in the IMSCC import file.

---

## IMPORTING THE IMSCC FILE

A Canvas course import file (`g3-ss-canvas-q1.imscc`) has been generated. It contains:
- 3 modules with all items, subheaders, and sequential settings
- 19 assignments (16 lesson + 3 assessment) with iframe placeholder descriptions
- 2 assignment groups (Curator's Chronicle, Unit Assessments)
- A museum-themed home page

**Before importing:**
1. Host all HTML lesson files at a stable URL
2. After import, go to each assignment and replace `REPLACE_WITH_URL_FOR_[slug].html` with the real hosted URL
3. Set module unlock dates for Q1

**To import:** Canvas Admin → Course Settings → Import Course Content → Canvas Course Export Package → select `g3-ss-canvas-q1.imscc`

---

## Q1 CANVAS CHECKLIST

**Before Q1 opens:**
- [ ] IMSCC imported and all 3 modules visible
- [ ] Home page published with museum banner and welcome message
- [ ] Navigation simplified to Home / Modules / Assignments / Grades
- [ ] All iframe URLs replaced with real hosted file URLs (16 lessons + 3 assessments)
- [ ] Module unlock dates set
- [ ] Sequential progression confirmed: lesson 2 locked until lesson 1 submitted

**Per unit (×3):**
- [ ] Module prerequisite set (Unit 2 locked until Unit 1 complete)
- [ ] Unit assessment locked until all lessons in the unit are submitted

**After each unit closes:**
- [ ] Return written feedback on Chronicle entries
- [ ] Update home page "current wing" indicator for the next unit
