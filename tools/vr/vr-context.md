# Optima VR — Working Context

> Living context file for building VR assignments in the **Optima On-Demand app**.
> Paste this (and `vr-assets.csv`) into any Claude chat or Claude Project as a starting point.
> Last updated: 2026-09-22.

---

## 1. What this is for

Optima teachers need to author VR assignments in the on-demand app **in mass** without producing bad assignments. Claude can help draft them, but only if it knows:

- What the app can and can't currently do
- What lesson patterns actually work inside those constraints
- What Locations (maps) exist and what's inside them
- What Assets (3D objects, characters, costumes, experiences) exist

This file holds items 1–3 plus a taxonomy for item 4. The full asset inventory lives in `vr-assets.csv` alongside this file.

---

## 2. The on-demand app — what it currently does

**Two apps exist and are not interchangeable.** The **Live app** is teacher-led multiplayer. The **On-Demand app** is what this document is about: students go in solo, on their own time.

**A capture is the deliverable.** Students enter a map, place objects, and "capture" the scene into an assignment bucket the teacher created. Captures save the placed 3D objects (like saving to a folder). Captures can be revisited, so week-long, month-long, or semester-long builds are supported. Teachers can float through student captures to review.

### Hard constraints (as of Sept 2026)

- Students can **only** enter empty pre-built maps. No prepped scenes.
- **No writing** in VR — no sticky notes, no whiteboards, no 3D pen, no drawing tools.
- **No pictures, instructions, or directions** can be placed in a scene.
- **No search bar** for models — asset menu says "filter models"; you have to click into it to search. Navigating the model menu is slow.
- **Rooms cannot be copied** from the Live app to the On-Demand app.
- **No single-user mode** in the Live app.
- **No respawn** on many maps — fall off the edge and you keep falling. Teleport out.
- **No in-app recording.** Meta screen-recording works but is clunky (permissions, file transfer via cable). Better in-app camera reportedly in progress.

### Navigation notes

- `A` button jumps. Double-jump works in every map.
- Teleport with the joystick. You can teleport onto power lines, some rails, some rooftops.
- Some scene walls can be teleported *through* by pushing your hand through the wall first — often results in falling through the map. Useful to know, not usable in student instructions.

---

## 3. Lesson patterns that work today

Only two patterns are known to work inside current on-demand app constraints. Any assignment Claude drafts must fit one of these two shapes. Everything else is out of scope until the app grows.

### Vocabulary

- **Capture** *(verb & noun)* — the in-app action of saving the current state of a scene. When a student captures, the app records the placement of every 3D object they've added to the map so it can be revisited or reviewed later. This is the single word for "save," "submit," and "snapshot" in this environment.
- **Assignment bucket** — a destination the *teacher* creates in the on-demand app for a specific assignment. Students capture *to* the bucket, which is how work is turned in. Buckets are also how teachers scope which captures belong to which assignment.
- **Personal capture** — a student can also capture to their own space (not to a bucket) to save an in-progress build across days, weeks, or a whole semester. Same mechanic, different destination. Long builds should be scoped so students routinely personal-capture, and the final version is captured to the bucket.
- **Materials constraint** — the only 3D content available in a scene is what's in `vr-assets.csv`. Teachers cannot pre-place anything, cannot supplement with custom 3D content, and cannot put images, text, sticky notes, whiteboards, or any 2D reference into VR. All prompts, rubrics, reference images, and worked examples live **in Canvas**, and any student writing happens on their computer, not in VR.

### Pattern A — Build & Capture

Student reads the prompt in Canvas, enters an empty pre-built Location, uses IFX Objects to construct or arrange something that answers the prompt, and captures the scene to the teacher's assignment bucket. Teacher grades by floating through captured scenes.

**Fits this pattern when:**
- The learning objective can be expressed as a physical arrangement of discrete objects (a model, a diagram, a labeled example, a spatial layout, a spelled word, a conjugated verb, a built structure).
- The needed objects — or close-enough substitutes — exist in `vr-assets.csv`.
- A Location exists that either fits the theme or is neutral enough to work as a stage.

**Does not fit when:**
- The output is inherently 2D or text (essays, calculations shown as work, annotated diagrams with labels).
- The activity requires objects that don't exist in the library and can't be reasonably substituted.
- The activity requires a scene the teacher would need to pre-populate (a battle scene, a completed lab setup, a partially-solved problem).

#### Exemplar A1 — Rainforest food web *(Science, 6–8)*

- **Location:** Tropical Rainforest
- **IFX Objects:** any animals from the Science subject (fish, mammals, birds, insects), plus plant/tree assets from General or Art/Clubs where useful as producers
- **Canvas setup:** Teacher posts a labeled trophic-level template (Producers → Primary Consumers → Secondary Consumers → Apex Predator), a list of at least 8 organisms the student must place, and the grading rubric
- **In VR:** Student enters the rainforest, places each required organism, groups them spatially by trophic level (e.g., producers along one edge, apex predators along the opposite), and captures to the "Food Web — Rainforest" bucket
- **Assessed for:** correct trophic-level grouping, all required organisms present, appropriate ratios (many producers, few apex predators)

#### Exemplar A2 — Represent a number in base ten *(Math, K–5)*

- **Location:** Classical Outdoor Classroom (or any neutral map)
- **IFX Objects:** Base 10 – Block (Yellow), Base 10 – Flat (Orange), Base 10 – Rod (Red), Base 10 – Unit (Grey)
- **Canvas setup:** A number is assigned (e.g., "Represent **2,437**"). Rubric explains that quantities must match exactly and blocks must be grouped by place value
- **In VR:** Student places 2 yellow blocks, 4 orange flats, 3 red rods, 7 grey units, grouped left-to-right by place value, then captures
- **Assessed for:** correct block counts per place, clear left-to-right ordering, no extra pieces

#### Exemplar A3 — Spell your vocabulary words *(ELA, K–5)*

- **Location:** any map
- **IFX Objects:** Lower Case letters (A through Z, each a separate asset)
- **Canvas setup:** List of that week's five vocabulary words; instruction to spell each one out with lowercase letter objects, one word per row
- **In VR:** Student teleports to an open area, arranges letters into words in rows, captures
- **Assessed for:** all words spelled correctly, all five words present, arrangement readable in the capture

#### Exemplar A4 — Conjugate a Latin verb *(Languages, 6–8)*

- **Location:** Roman Villa (thematic) or any map (neutral)
- **IFX Objects:** Latin ending assets (a, ae, as, arum, am, bam, bamus, bant, bat, batis, bas, bimus, bis, …)
- **Canvas setup:** A verb stem is given (e.g., "amō"). Student must produce the full present-tense active conjugation using the endings, one row per person/number pair
- **In VR:** Student arranges endings in the 6-cell conjugation table (1st/2nd/3rd person × singular/plural), captures
- **Assessed for:** correct endings in the correct cells, full paradigm present

#### Exemplar A5 — Model a molecule *(Science, 6–8)*

- **Location:** OptimaED Science Lab or Optima Chemistry Lab (thematic)
- **IFX Objects:** H2O Molecule, O2 Molecule, CO2 Molecule, Nitrogen Molecule; plus glassware and lab equipment for context if needed
- **Canvas setup:** Assign a target scene (e.g., "Show the reactants and products of photosynthesis"). Student must place the correct molecules on the "reactant" side and "product" side of a visual boundary
- **In VR:** Student groups molecules by reactant/product, uses count to represent stoichiometry (e.g., six CO2 on one side, six O2 on the other), captures
- **Assessed for:** correct molecules, correct counts, clear reactant/product separation

#### Exemplar A6 — Design a defensible castle *(Art/Clubs or History, 6–8)*

- **Location:** Medieval Forest, Old Town, or Ancient Egypt (neutral)
- **IFX Objects:** Castle family — Wall 1–9, Tower 1/2/3, Standing Torch, plus any relevant environmental pieces
- **Canvas setup:** Constraints given (must have at least one gatehouse, three towers, complete perimeter wall). Student writes a short "defense rationale" in Canvas *after* capturing
- **In VR:** Student places wall segments in a closed perimeter, positions towers at corners and gate, adds torches for lighting, captures
- **Assessed for:** perimeter closure, tower placement, gatehouse presence, defense rationale on Canvas addressing chokepoints and sightlines

### Pattern B — Observe & Reflect

Student enters a themed Location, explores it, exits VR, and writes a structured reflection on their computer (in Canvas or Teams). No building happens; the map itself is the "text." The student is expected to *cite specific details from the map* the way they'd cite a text or a painting.

**Fits this pattern when:**
- A Location itself carries the substance — a real historical setting, an authored literary environment, a scientific space, a cultural place.
- The learning objective is analysis, inference, imagination, or perspective-taking rather than construction.
- The reflection can be structured tightly enough that the student can't fake it without having actually explored.

**Does not fit when:**
- The map is generic (Classical Outdoor Classroom, empty hubs) — nothing to cite.
- The prompt is so open ("write about your feelings") that it doesn't require anything from the map.
- The learning objective needs a physical product, in which case use Pattern A.

#### Exemplar B1 — Live in La Perla *(Spanish or Social Studies, 6–12)*

- **Location:** La Perla, Puerto Rico (Day) or (Night)
- **Canvas setup:** "Imagine you live in La Perla. In 300–400 words: What is your house like? What do you do for work? What do your evenings look like? Who are your neighbors? Cite at least **five specific details** from the map — buildings, sounds, animals, signs, layout — to ground your imagination."
- **Deliverable:** Written reflection in Canvas
- **Assessed for:** at least five cited details from the map, coherence between details and inferences, tone appropriate to lived experience (not tourism)

#### Exemplar B2 — Read a city like a text *(History or Social Studies, 6–12)*

- **Location:** Roman Road (Night), A City of Rome, ELA – Boston Massachusetts Village, Colonial Williamsburg, Historical City (Day/Night), Medieval Town (Rainy/Sunny), or Snowy Historical City
- **Canvas setup:** "Look at the layout of the city. What can you infer about how this community was organized? Address at least three of: transportation (Rd. layout, waterways, bridges), commerce (market locations, shop types), civic life (religious buildings, public gathering spaces), defense (walls, gates, high ground), social hierarchy (which buildings are grand vs modest, and where they sit). Cite specific features you observed."
- **Deliverable:** Structured written reflection with three headed sub-sections
- **Assessed for:** three domains addressed, specific citations, plausible inferences supported by what's actually in the map

#### Exemplar B3 — Character study of a scientist *(Science + ELA integrated, 6–8)*

- **Location:** Dr. Victor's Laboratory
- **Canvas setup:** "You are visiting the laboratory of a scientist you've never met. Based only on what you see, write a 250-word character sketch of them: What field are they in? What are they currently working on? What kind of person are they — organized, obsessed, cautious, reckless? Cite at least **six specific objects** in the lab as evidence."
- **Deliverable:** Written character sketch in Canvas
- **Assessed for:** six object citations, inferences that actually follow from those objects, coherent portrait rather than a list

#### Exemplar B4 — Ancient life inference *(History, K–8)*

- **Location:** Pyramids of Giza, Ziggurat in Mesopotamia, Maya Pyramid, Iroquois Longhouse, Ancient Egypt, or Roman Villa
- **Canvas setup:** Age-appropriate prompt to describe three things about daily life the student can infer from the space (e.g., what people ate, where they slept, what work they did, what they worshipped). Each inference must be tied to something the student actually saw.
- **Deliverable:** Three-paragraph written reflection, one paragraph per inference
- **Assessed for:** three distinct inferences, each with a specific observation as support

#### Exemplar B5 — Setting analysis for a novel *(ELA, 6–12)*

- **Location:** map corresponding to the text being read — ELA – Boston Massachusetts Village (The Scarlet Letter), 221B Baker Street (Sherlock Holmes), Laburnum Villa (The Monkey's Paw), Lord of the Flies Runway, Maycomb (To Kill a Mockingbird), Globe Theatre (Shakespeare)
- **Canvas setup:** "How does the setting shape the story? Identify three details from this map you had not visualized while reading, and explain what each detail changes or reinforces about a scene, character, or theme."
- **Deliverable:** Written reflection in Canvas
- **Assessed for:** three specific details new to the student, cogent connection between each detail and something in the text

---

### General notes for drafting new assignments

- **Frequency:** roughly 1–2 assignments per module where the fit is genuine. Do not force a VR assignment into every lesson.
- **Location choice:** prefer a Location that thematically reinforces the content (Roman Villa for Latin, Tropical Rainforest for a rainforest food web) even when a neutral map would technically work. Immersion is doing work here.
- **Material choice:** stay within one family (Latin endings for one lesson, Base 10 blocks for another). Assignments that require students to hunt through the whole model menu fail because the menu is slow and has no real search bar.
- **Instruction clarity:** every instruction, every rubric criterion, every reference image lives in Canvas. In VR the student should already know what to do.
- **Deliverable format:** in Pattern A the deliverable is the capture itself; in Pattern B the deliverable is the writing on the computer. Never both from the same assignment unless the writing genuinely adds something the capture can't show.

## 4. Locations (Maps)

Grouped by how they were referenced in the source or transcript. Descriptions come from the 2026-09-22 brainstorm walkthrough where noted; every other entry has just the name and a placeholder for future description work.

### 4.1 Educational Hubs (Optima onboarding / gathering spaces)

- **OptimaED Intro** — Ocean setting. Six-sided central platform with three steps and the Optima owl logo in the center. Five grassy alcoves with classical pillars, connected to a smaller hexagon by a hallway. Welcome signs, benches, grape/ivy-covered trellis, banners with sparkles, some trees swaying, some not. Fall off the edge = keep falling.
- **OptimaED Explorations Hub** — Same layout as Intro but bigger. Five larger grassy alcoves with bridges between them. Stone bleachers instead of benches. Three display boards per alcove. Double the tapestries. 12 virtues on the pillars.
- **OptimaED Step Up For Students Hub** — Visually near-identical to Explorations Hub. Slightly more sparkles, slightly fewer display screens.
- **OptimaED Expeditions Hub** — [not yet described]
- **Optima Education Hub** — [not yet described]
- **Optima School Ukraine** — [not yet described]

### 4.2 Historical / Literature-adjacent

- **ELA – Boston, Massachusetts Village (The Scarlet Letter IL)** — Rolling hills at pink sunrise. Birdsong. Cobblestone path over a wooden footbridge across a creek and uphill. Downhill houses are basic; uphill houses become log cabins/cottages with chimneys. A blacksmith hut, a fruit stand with a white horse, a small market with talking sounds, a two-cell jail, tents with crops, drying clothes on lines, a boat in the river, a dock behind a mountain. Feels like harvest season. Torches uphill; not cobblestone at the top — actual pavement tiles and stairs into a city center.
- **Roman Road (Night)** — Same base layout as the Boston map, but night, empty, and Roman. No people, no farms, no animals. Colosseum and aqueduct visible in the distance. Babbling creek sound, dramatic shadows. Colosseum looks tiny when you actually get close to it.
- **Roman Road (Day)** — [same base map as Night, day variant; not walked through in the 9/22 session]
- **Roman Villa** — [not yet described]
- **Roman Village** — [not yet described]
- **221B Baker Street** — Small, one room. Sherlock Holmes' study. Fireside desk room with green wallpaper, fire crackling, map of London and the Thames, map of Great Britain, investigation papers strewn on desk and floor with string, old microscope, beakers, Petri dishes, magnifying glass, phonograph, old telephone, coffee cups, ink and quill, whiskey with big glasses, red upholstered chairs, bookcases, cobwebs in corners, newspaper about "two more victims claimed by the East End Ripper." Jumping off furniture will stick your head to the ceiling.
- **Dr. Victor's Laboratory** — Large map, easy to get lost in. Enter through a tunnel, walk toward a Tesla-coil dome with lightning arcs at the top. Classic Frankenstein feel — phonograph, big boilers and furnaces, pipes with gauges, hallways branching everywhere, stained glass windows, paintings, a bust (presumably Frankenstein), levers on the walls, a room with a brain in it, telephones, a "Histology of the Human Eyeballs" book. Blue-lit downstairs room with dead bodies. Red-lit boiler room in the basement. Raven/swallow motif on rugs. Watching the Tesla coil fire is a nice moment.
- **Laburnum Villa (The Monkey's Paw Experience)** — Very small map. A cottage plus a tool shed. Cottage has upstairs (a bed) and downstairs (table with two chairs, front porch). Tool shed has an anvil, workbench, lathe, tools, and kerosene/gasoline (slightly anachronistic). Dusk sky with a moon, leafless trees, spooky trees in the background, raining. Leaving the cottage lands you off the map. Teleporting through the tool-shed wall is possible but dumps you through the floor.
- **Colonial Williamsburg** — [not yet described]
- **The Forgotten Village** — [not yet described]
- **Globe Theatre** — [not yet described]
- **Medieval Forest** — [not yet described]
- **Medieval Castle MEGA** — [not yet described]
- **Winter Maze** — [not yet described]
- **Snowy Historical City** — [not yet described]
- **Old Town** — [not yet described]
- **Lord of the Flies Runway** — [not yet described]
- **Maycomb** — (To Kill a Mockingbird) [not yet described]
- **Farm Town (Micro)** — [not yet described]
- **A City of Rome** — [not yet described]
- **Ancient Egypt** — [not yet described]
- **Historical City (Day)** — [not yet described]
- **Historical City (Night)** — [not yet described]
- **Iroquois Longhouse** — [not yet described]
- **Maya Pyramid** — [not yet described]
- **Medieval Castle (Day)** — [not yet described]
- **Medieval Castle (Night)** — [not yet described]
- **Medieval Town (Rainy)** — [not yet described]
- **Medieval Town (Sunny)** — [not yet described]
- **Philadelphia Independence Hall** — [not yet described]
- **Western Town** — [not yet described]
- **Ziggurat in Mesopotamia** — [not yet described]

### 4.3 Cultural / World

- **La Perla, Puerto Rico (Night)** — Nighttime, realistic street-light and window light fill. String lights in places, pretty dark in spots. Music plays near one house. Power lines and utility boxes visible on house exteriors. Black cat with glowing eyes in an alleyway (there are several cats). Cliffside/hillside city layout — jump on handrails between levels. Bottom floor opens onto a beach; you can wade into the water. Mexican-food restaurant by the beach with a Puerto Rico flag, street signs, more restaurants along the beach. Bicycles, cafes, colorful buildings, palm trees. Sea turtle in the water. Graffiti walls. A church-like religious building in the middle. Anti-youth graffiti in one alley.
- **La Perla, Puerto Rico (Day)** — Same layout, daytime. Chairs at the beach restaurant are down instead of stacked. More cats visible. Chickens near the graffiti wall (cannot ride the chickens). Cloudless sky. Can teleport onto power lines but not the pavement.
- **City of Paris** — [not yet described]
- **The Alamo Fortress** — [not yet described]
- **The Alamo Fortress (Night)** — [not yet described]
- **Immigrant Steam Ship (Day)** — [not yet described]
- **Immigrant Steam Ship (Dusk)** — [not yet described]
- **Arabia (Day)** — [not yet described]
- **Arabia (Night)** — [not yet described]
- **Great Wall of China** — [not yet described]
- **Pyramids of Giza** — [not yet described]
- **Sistine Chapel** — [not yet described]

### 4.4 Nature / Environment

- **Tropical Rainforest** — [not yet described]
- **The Everglades** — [not yet described]
- **Tranquil Forest MEGA** — [not yet described]
- **Under The Ocean** — [not yet described]
- **Deserted Isles** — [not yet described]
- **Mount Olympus** — [not yet described]
- **Playground** — [not yet described]
- **Desert Sanctum** — [not yet described]
- **Ice Caverns** — [not yet described]
- **Island Town** — [not yet described]
- **Lighthouse (Night)** — [not yet described]
- **Skull Cove** — [not yet described]
- **The Countryside** — [not yet described]
- **Tranquil Forest** — [not yet described]

### 4.5 Civic / Institutional

- **United States Capitol** — [not yet described]
- **Supreme Court** — [not yet described]
- **National Bank** — [not yet described]
- **Central Bank** — [not yet described]
- **Optima News** — [not yet described]
- **Tennis Court** — [not yet described]
- **Factory Interior** — [not yet described]
- **Aircraft Carrier** — [not yet described]
- **WWI Trench** — [not yet described]
- **National Library** — [not yet described]
- **Optima Gallery** — [not yet described]
- **Optima Sydney Restaurant** — [not yet described]

### 4.6 Science / Lab

- **OptimaED Science Lab** — [not yet described]
- **Optima Chemistry Lab** — [not yet described]
- **Animal Cell** — [not yet described]
- **Explore The Brain** — [not yet described]
- **The Great Hall** — [not yet described]
- **Optima Centum Gallery** — [not yet described]
- **Optima Sphere Oasis** — [not yet described]

### 4.7 Space / Extraterrestrial

- **Optima Outer Space** — [not yet described]
- **Optima Planetarium** — [not yet described]
- **Optima Moonscape** — [not yet described]
- **Optima Moonscape (Moon Rocks Added)** — [not yet described]
- **Optima Moonbase** — [not yet described]
- **Mars Crater** — [not yet described]
- **Artemis Expedition Launchpad** — [not yet described]
- **Artemis Training Facility** — [not yet described]
- **Saturn V Launchpad** — [not yet described]
- **Optima Galaxy** — [not yet described]

### 4.8 Generic

- **Classical Outdoor Classroom** — [not yet described]
- **Creator Blank 360 Room** — [not yet described]

---

## 5. IFX Objects (3D asset library) — the full list is in `vr-assets.csv`

The source system reports **2,829 total assets**. `vr-assets.csv` now contains **2,568 IFX Objects + 94 Locations = 2,662 rows**, parsed from the 2026-09-22 paste of the full Optima VR Asset Explorer web content.

**Known gap:** the paste included pages 1–14 of the explorer (2,800 items) but not page 15 (~29 items). It also included page 6 twice, which was deduped. A few entries that share the exact same displayed name + type + subject in the source (e.g. two `Cowboy Outfit` variants) also collapse under deduping. Net: roughly **2,662 rows captured out of 2,829**, or ~94% coverage. To close the gap, paste page 15 of the explorer whenever convenient.

### Subject taxonomy used in the CSV

Every IFX Object row carries one of these `subject` values (counts from the current CSV):

| Subject | # IFX Objects |
|---|---|
| Science | 686 |
| Math | 444 |
| 360 Spheres | 362 |
| General | 315 |
| History | 266 |
| Languages | 180 |
| ELA | 158 |
| Art/Clubs | 139 |
| Special Functionality | 8 |
| Advanced IFX (AIFX) | 7 |
| All Subjects | 3 |

### Notes on how to read the CSV

- **Families of variants** are common. A single "concept" often has many rows — e.g. seven rainbow horses × two animations = fourteen `IFX Object` rows for the horse family. When drafting an assignment, refer to the family, not every SKU.
- **Pieces are meant to be assembled.** Latin word-endings, lowercase letters, castle wall segments, and dissection organs each exist as separate discrete assets so a student can build with them.
- **360 Spheres are backdrops, not walkable environments** — different from Locations in §4.
- **Subject `All Subjects`** applies to a few IFX Objects (Notre Dame 360 spheres, some animated animals) that carry an `All Grades / All Subjects` tag pair in the source instead of a single Subject.

### Getting to 100% coverage / staying current

Two paths, in order of preference:
1. **Ask Vince for the raw underlying asset list** (mentioned in the 9/22 transcript). A CSV/JSON export from the source system would give canonical names, be trivially re-runnable when new assets ship, and remove any parsing ambiguity.
2. **Paste the missing page 15** into a chat with the current CSV attached — I can splice it in.

## 6. Brainstorm session log

Append notes from each VR walkthrough / brainstorm session here so the map and object descriptions grow over time.

### 2026-09-22 — VR Fluency & Brainstorm (kickoff)
Attendees: Porter Birchum, David Waters, Bethany Birchum, John Rosenbaum, Jorge Acevedo, Jessica Drexel, Jerrod Payne, Rob Reed.

Framed the goal: one hour/week going forward is for *building* VR content, not being *in* VR — because the on-demand app doesn't have enough substance to fill an hour of student time on its own. This document is the artifact of that time. Team spent ~30 min in a shared multiplayer room walking through and describing maps out loud; that transcript became the descriptions in §4.

Maps walked and described: OptimaED Intro, OptimaED Explorations Hub, OptimaED Step Up For Students Hub, ELA – Boston Massachusetts Village, La Perla, Puerto Rico (Night), La Perla, Puerto Rico (Day), 221B Baker Street, Roman Road (Night), Dr. Victor's Laboratory, Laburnum Villa. Documented above in §4.

Open items:
- Get raw object list from Vince rather than screen-scrape (see §5).
- Continue describing remaining maps at the same time next week — target ~30 min of walkthrough per session.
- Set up a Claude Project with this file + `vr-assets.csv` + curriculum context, then try drafting assignments in mass for a single upcoming unit as the first real test.
- No standing minimum on VR assignments per module — quality first. Rough shape: 1–2 per module when the fit is real.

### [next session]
