# Dot Journal Planner

A lightweight static web app that generates dotted journal layout ideas based on a user's stated purpose and grid dimensions (number of dots horizontally and vertically). Everything runs locally in the browser—no backend.

## Features
- Input purpose/theme plus width & height in dots.
- Heuristic idea generation across a broad catalog (weekly, notes, fitness, habit, meal, mood, kanban, finance, goal, time-block, sleep, gratitude, reading, travel, wellness, creative, event, health log, hobby, social, home, pet, seasonal, minimalism, memory, dream, productivity, sustainability, growth, collection, gaming, language, spiritual, career, garden, volunteer, fashion, writing, and more).
- Orientation (portrait / landscape) and Page Mode (single page, double page, spread) controls.
- Markdown preview + full markdown download per selected layout.
- Visual dot grid preview sized to your dimensions with adaptive scaling.
- Select a layout idea to overlay section rectangles (highlight active selection).
- Optional guide lines (rule of thirds) toggle.
- Dark / Light mode toggle (persists).
- Automatically remembers last inputs, selection, orientation & page mode (localStorage).
- Export current selection as PNG or multi-page PDF (landscape/portrait aware, spread handling).
- Configurable synonyms / weights via `prompt-config.json` (tag expansion + weighting).
- Editable `PROMPT.md` (now the canonical implemented template registry).

## Quick Start
Open `index.html` directly in a modern browser (Chrome, Edge, Firefox). No build step required.

If you run into CORS issues loading `prompt-config.json` via `file://`, serve locally:

```powershell
# From project root
python -m http.server 5500
# or
npx serve .
```
Then browse to http://localhost:5500/

## Editing Prompts & Behavior
- Add or adjust synonym groups & weights in `prompt-config.json` to map new keywords to templates.
- Document new template ideas (optional) in `PROMPT.md` under the Adding New Templates section.
- Implement new template functions in `src/suggestions.js` (follow existing pattern, return { name/title, sections }).
- Each section object uses: { label, x, y, w, h } in dot units.
- The generator automatically considers orientation & page mode; design your sections within the provided width/height.

## File Overview
- `index.html` – UI structure.
- `styles.css` – Styling.
- `src/main.js` – App bootstrap & event handlers.
- `src/suggestions.js` – Layout idea generation heuristics.
- `src/render.js` – Canvas drawing & export logic.
- `src/tags.js` – Purpose → tags expansion.
- `src/promptConfig.js` – Loads JSON config.
- `prompt-config.json` – Synonym & weighting config.
- `PROMPT.md` – Editable prompt/instructions file.

## Adding a New Template
1. Add synonyms & (optional) weight multipliers in `prompt-config.json`.
2. (Optional) Document its intent & sections in `PROMPT.md` (will become canonical after implementation).
3. Implement a function in `src/suggestions.js` (pattern: `function makeXTemplate(w,h){ return { name: "X Template", sections:[...] }; }`).
4. Register inclusion logic in the main idea generation switch/tag checks (follow existing examples for tag arrays).
5. Test by entering purpose keywords that should trigger the template; confirm it appears, overlay works, and markdown/PDF exports list sections correctly.
6. For multi-page behaviors, rely on page mode options—section coordinates should stay within a single logical page size; spreads are handled by rendering adjustments.

## Accessibility / Notes
- Semantic landmarks (header, main, sections) used.
- Form labeled inputs and sensible defaults.
- High contrast dark/light themes; selection highlighting.

## Markdown & PDF Export
Select a layout card, then:
- Download Markdown: saves `.md` with title, dimensions, sections, and brief legend.
- Download PDF: generates a PDF using current orientation & page mode; for spreads/double pages, sections are split or centered appropriately.
PNG export captures the visual grid + overlays for quick sharing.

## Future Enhancements
Potential next steps:
- Interactive drag & resize editor (author custom layouts).
- Constraint solver (min sizes, priority weighting, auto-pack).
- SVG / vector export & themeable stroke weights.
- Data binding (populate sections with dynamic trackers/logs).
- Layer system (guides, annotation overlays).
- Share/import template JSON bundles.

## License
MIT (adjust as preferred).
