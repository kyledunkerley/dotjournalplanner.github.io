# Dot Journal Planner Prompt File

Edit this file to influence heuristic layout idea generation. This is **not** sent to any server—it's purely a local reference that you (or future AI assisted tools) can use to refine generated layouts.

## Purpose
The generator maps a user's described purpose (e.g. "Exercise journal" or "Meal tracking + habits") and the grid dimensions (width & height in dots) into candidate layout sections. Templates are selected based on extracted tags, synonyms, and heuristics.

## How It Works (Current Heuristics)
1. Tokenize the purpose string (lowercase alphanumeric).
2. Expand tags using `prompt-config.json` synonyms (weighted relevance).
3. Match tags to the registered layout templates (see list below).
4. Generate section rectangles with proportional math & spread/orientation rules (single, double, landscape, portrait).
5. Render a canvas layout preview and build markdown + optional PDF export (multi‑page aware). fallback ensures at least one idea always appears.

## Customization Strategy
Add more domain-specific ideas here. When you add a new conceptual template, also implement it in `src/suggestions.js` and map synonyms in `prompt-config.json`.

## Existing Template Concepts
- Weekly Overview: Two column, 7 days + notes.
- Notes Centric: Header + large notes area.
- Fitness Tracker: Metrics sidebar + log space.
- Habit Tracker: Grid of small habit squares + reflection.
- Meal Planner: Header + 3x3 meal/nutrition grid.
- Mood Tracker: Legend + horizontal timeline.
- Project Kanban: 3–4 task flow columns under a header.
- Finance Budget: Income / costs / savings with graph area.
- Goal Planner: Long vs short term goals, milestones, action steps.
- Time Management: Time blocks, tasks, pomodoro log.
- Sleep Tracker: Sleep log, factors, notes.
- Gratitude Log: Daily gratitude with themed lists & reflection.
- Reading & Learning: Books list, study topics, quotes.
- Travel Planner: Itinerary, packing, budget, memories.
- Self-Care & Wellness: Activities, hydration, reflection.
- Creative Project Board: Brainstorm, inspiration, progress, mood board.
- Event Planner: Checklist, guests, vendors, notes.
- Health Log: Symptoms, meds, appointments, lifestyle.
- Hobby Practice: Practice log, goals, progress notes.
- Social Connections: Outreach, dates, meetup ideas.
- Home Management: Chores, maintenance, projects, utilities.
- Pet Care: Schedule, health log, behavior.
- Seasonal Planner: Calendar, traditions, gifts/budget.
- Minimalism Tracker: Declutter log, capsule, challenges.
- Memory Keeper: Memories, quotes, reflections.
- Dream Journal: Log, themes, analysis.
- Productivity System: Eisenhower, backlog, next actions, review.
- Sustainability Tracker: Eco log, goals, metrics.
- Personal Growth & Reflection: Prompts, reflections, insights.
- Collection Tracker: Inventory, wishlist, trades.
- Gaming Log: Games progress, achievements, backlog.
- Language Learning: Vocabulary, grammar, practice log.
- Spiritual Tracker: Practices schedule, readings, reflections.
- Career & Networking: Applications, networking, development.
- Garden Planner: Layout, planting schedule, care.
- Volunteer Log: Hours, organizations, impact.
- Fashion & Style: Lookbook, shopping, repairs.
- Writing Planner: Brainstorm, characters, outline, writing log.

## Adding New Templates
To add another template:
1. Describe its purpose & sections here (optional—this list is now canonical).
2. Implement a generator in `src/suggestions.js` (follow existing patterns, return { name, sections }).
3. Add synonyms & weights in `prompt-config.json` so tag expansion can discover it.
4. (Optional) Adjust rendering heuristics if it needs special geometry.

If a new template is experimental, list it under a temporary heading until implemented, then move it into the main list above.

---
All previously suggested tracker types have been implemented; the deprecated suggestion backlog section was removed for clarity.