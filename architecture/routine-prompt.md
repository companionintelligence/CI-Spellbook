# Research Routine — Operating Manual

> **This file is the single source of truth for the weekly auto-research routine.**
> If it conflicts with the short system prompt that invokes the routine, **this file wins**.

Private & Confidential — Property of Lifescope Inc. Do not distribute.

---

## Purpose

The weekly research routine keeps `public/markdown/` fresh and trustworthy. It proposes curated
additions, edits, and removals to the catalog by searching GitHub and the web, then opens a
single PR for human review. It never pushes to `main` and never merges its own PRs.

---

## Step-by-step workflow

### STEP 1 — Read context (in this order)

1. `architecture/routine-prompt.md` — this file, the full operating manual.
2. `architecture/content-expansion-plan.md` — category priorities, cadence, quality bar.
3. `architecture/roadmap.md` — broader plan (context only; do not act on it this run).
4. The two most recent merged PRs whose title starts with `research:` — extract reviewer feedback
   and honor it in this run.

### STEP 2 — Pick target file(s)

Choose **one or two** files from `public/markdown/` following the rotation rules below.
Never touch more than two files in a single PR.

### STEP 3 — Research

Use `gh api search/repositories`, `WebSearch`, and `WebFetch` to find candidates. Apply the
quality bar (see below) to every candidate before including it.

### STEP 4 — Produce the diff

For each target file:
- **Additions**: new rows that pass the quality bar and are not already present.
- **Edits**: update stale descriptions, Notes, URLs, or Platforms values for existing rows.
- **Removals**: rows that should be removed per the deprecation triggers below.

Honor the schema (columns, character limits, platforms vocabulary, alphabetical order within
subcategory) on every change.

### STEP 5 — Create branch and commit

Branch name: `research/YYYY-MM-DD-<category-slug>`

Example: `research/2026-06-08-ai-agents`

Commit the changed files only. Do not commit documentation, config, or source code.

### STEP 6 — Open PR

- **Title**: `research: weekly <category short name> refresh YYYY-MM-DD`
- **Body**: follow the PR body template below exactly.
- Target branch: `main`.
- Open as a **draft**.

### STEP 7 — Stop

Do not merge. Do not poll for reviews. Do not push follow-up commits unless a reviewer asks.

---

## Hard rules

| Rule | Detail |
| --- | --- |
| Never fabricate | Do not invent a tool, description, URL, or star count. If you cannot confirm via fetch, drop the row. |
| Never push to main | All changes land via PR only. |
| Two-file limit | Touch at most 2 markdown files per run. |
| No articles / blog posts | This is a tools catalog, not a feed reader. |
| Fewer is better | Prefer 3 well-evidenced additions over 8 marginal ones. |
| Alphabetical order | Rows within each `##` subcategory must be sorted A–Z by tool name after edits. |
| No marketing language | Description = what it does. Notes = opinion / context. |

---

## Schema

Every entry table must have exactly these four columns:

```
| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Name](url) | ≤ 140 chars | Controlled vocabulary | ≤ 120 chars |
```

### Platforms vocabulary

Use only these values (comma-separated where a tool genuinely spans multiple):

`Cross-platform`, `Self-hosted`, `Web`, `macOS`, `Windows`, `Linux`, `iOS`, `Android`,
`VS Code`, `JetBrains`, `Neovim`, `Vim`, `Chromium`

### File-level structure

```markdown
# <Topic Title>

> One-line description of the category.

## <Subcategory>

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Name](url) | ... | ... | ... |
```

- First line = `# <Topic Title>` — used as the card title in the UI.
- Second non-blank line = `> blurb` — used as the card description.
- One subcategory per `##` heading.
- Tool cell is `[Name](url)` — the URL is the canonical identifier.

---

## Quality bar

Every proposed addition must pass **all** of the following checks. Document each check per row
in the PR body.

| Signal | Threshold |
| --- | --- |
| GitHub stars | ≥ 500 (lower OK if Notes column gives a clear differentiator) |
| Last commit | Within 6 months **or** project is intentionally stable (mark in Notes) |
| License | OSS preferred; proprietary only in `## Proprietary Tools Worth Knowing` subsections |
| Maintained | Not archived; issues triaged in last 90 days |
| Distinct | Different enough from existing entries to earn a row |
| Verifiable | Linked repo/page exists and description matches what it actually does |

---

## Per-run budgets and rotation

| Priority | Files | Cadence | Additions budget | Edits budget |
| --- | --- | --- | --- | --- |
| High | `AI Agents & Autonomous Systems.md`, `AI-Assisted Code Development.md`, `Local-First AI Tools.md` | Weekly, full pass | up to 6 | up to 4 |
| Medium | `AI Art Generation Images 3D and Video.md`, `AI in Video Games & Virtual Beings.md`, `Cutting Edge Databases.md`, `Speech-to-Text & Text-to-Speech.md`, `Virtual Machine and Browser Automation and Scrapers.md`, `XR & Spatial Computing.md` | Every 2 weeks (rotation) | up to 4 | up to 3 |
| Low | `Home Automation & Security.md`, `Maker & Hardware Prototyping.md`, `Networking VPN & Infrastructure Security.md`, `Top Public Data Sources.md` | Monthly (rotation) | up to 2 | up to 2 |

**Rotation rule**: within a priority tier, pick the file that was touched *least recently*
(check git log). When two files tie, pick alphabetically first. Always honor the two-file
maximum per run.

**New-category rule**: if `content-expansion-plan.md` lists proposed new files, one new file
may be created per run in addition to the rotation file, but only if at least 4 seed entries
pass the quality bar.

---

## Removal and deprecation triggers

| Trigger | Action |
| --- | --- |
| Repo archived or deleted | Propose row removal; note replacement if any |
| No commits in 12+ months and < 1 k stars | Propose move to a `## Archive` subsection or removal |
| Renamed / forked elsewhere | Propose URL update |
| Superseded by a better entry already in the file | Propose removal of the older row |

---

## PR body template

Every research PR body **must** follow this template exactly.

```markdown
## Summary

<!-- One sentence: what category, how many changes, why now. -->

## Additions

| Tool | URL | Stars | Last commit | License | Why it's distinct |
| --- | --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... | ... |

## Edits

| Tool | Field changed | Before | After | Reason |
| --- | --- | --- | --- | --- |
| ... | ... | ... | ... | ... |

## Removals

| Tool | Reason | Replacement (if any) |
| --- | --- | --- |
| ... | ... | ... |

## Quality-bar checklist

For each proposed addition, confirm:

- [ ] ≥ 500 stars (or differentiator noted in Notes)
- [ ] Last commit within 6 months (or stable + noted)
- [ ] OSS license (or in Proprietary subsection)
- [ ] Not archived
- [ ] Distinct from existing entries
- [ ] URL fetched and description verified

## Reviewer feedback incorporated

<!-- Summarise any feedback from the two most recent merged research: PRs that influenced this run. If none, write "None — first run." -->

## Files changed

<!-- List each .md file touched and the net Δ row count. -->
```

---

## Self-improvement protocol

After each research PR is reviewed and merged (or closed with comments):

1. On the **next run**, read the two most recent merged `research:` PRs (STEP 1 above).
2. Extract any reviewer feedback: removed rows, requested changes, style corrections.
3. Apply that feedback as standing rules for this run — do not repeat rejected patterns.
4. Log what you incorporated in the "Reviewer feedback incorporated" section of the new PR body.

If a reviewer consistently rejects a class of entry (e.g. single-maintainer projects, tools
under 200 stars, tools with no docs site), treat that as a permanent rule for this repo.

---

## Self-repair procedure

If the repo is in an unexpected state (this file missing, `architecture/` folder absent, etc.):

1. Open a PR titled `research: routine self-repair YYYY-MM-DD`.
2. Re-create only the missing infrastructure files (do not do research content that week).
3. PR body must describe what was missing and what was re-created.
4. Stop — do not attempt a content run in the same session.

---

## Out of scope (deliberately)

- **News / blog posts.** This is a tools catalog, not a feed reader.
- **Hosted-only proprietary SaaS** outside existing "Proprietary Tools Worth Knowing" subsections.
- **One-person prototypes** with no traction (quality bar filters these).
- **Model checkpoints.** Spellbook lists *tools that run* models, not the models themselves.
