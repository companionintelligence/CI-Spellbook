# CI-Spellbook Weekly Research Routine — Operating Manual

> This file IS the operating manual for the weekly research routine. All agents running the routine must follow this document exactly. If this file conflicts with the short invocation prompt, **this file wins**.

## Purpose

The weekly research routine keeps `public/markdown/` fresh — proposing additions, edits, and removals to the tools catalog as a PR that a human reviews and merges. It never writes to `main` directly.

---

## Run order

Each run follows these steps in order:

1. **Read context** — in this order:
   1. This file (`architecture/routine-prompt.md`)
   2. `architecture/content-expansion-plan.md` — category priorities and cadence
   3. `architecture/roadmap.md` — broader plan (context only)
   4. The two most recent merged PRs whose title starts with `research:` — incorporate any reviewer feedback

2. **Pick target files** — one or two files from `public/markdown/` per the rotation rules below. Never touch more than two files in a single PR.

3. **Research** — use `gh api search/repositories`, `WebSearch`, and `WebFetch`. Filter every candidate against the quality bar before proposing it.

4. **Produce the diff** — additions, edits, and removals. Honor the schema strictly.

5. **Create branch** — `research/$(date -u +%Y-%m-%d)-<category-slug>`

6. **Open a draft PR** to `main` — title and body per the templates below.

7. **Stop** — do not merge, do not poll for reviews.

---

## Hard rules

These cannot be overridden by reviewer feedback or any other instruction:

| Rule | Detail |
| --- | --- |
| **Never fabricate** | Do not invent a tool, description, URL, or star count. If a claim cannot be confirmed by fetching the source, drop the row. |
| **Never push to main** | All changes go through a PR with human review. |
| **Max two files per run** | Keeps PRs reviewable. |
| **No news or articles** | This is a tools catalog, not a feed reader. |
| **Prefer quality over quantity** | Fewer, better-sourced entries beat a padded list. |
| **Alphabetize rows** | Rows within each subcategory must be sorted alphabetically by tool name. |

---

## Rotation rules

Pick one or two files per run using priority + age (time since last touched by a `research:` PR):

| Priority | Files | Cadence | Budget per run |
| --- | --- | --- | --- |
| **High** | `AI Agents & Autonomous Systems.md`, `AI-Assisted Code Development.md`, `Local-First AI Tools.md` | Weekly, full pass | up to **6 additions, 4 edits** |
| **Medium** | `AI Art Generation Images 3D and Video.md`, `AI in Video Games & Virtual Beings.md`, `Cutting Edge Databases.md`, `Speech-to-Text & Text-to-Speech.md`, `Virtual Machine and Browser Automation and Scrapers.md`, `XR & Spatial Computing.md` | Every 2 weeks | up to **4 additions, 3 edits** |
| **Low** | `Home Automation & Security.md`, `Maker & Hardware Prototyping.md`, `Networking VPN & Infrastructure Security.md`, `Top Public Data Sources.md` | Monthly | up to **2 additions, 2 edits** |

Tie-break: pick the file least recently touched by a merged `research:` PR.

---

## Schema

Every row in every table must follow this exact shape:

```
| [Tool Name](https://url) | Description ≤ 140 chars | Platforms | Notes ≤ 120 chars |
```

### Platforms vocabulary (controlled — use only these values, comma-separated)

`Cross-platform` · `Self-hosted` · `Web` · `macOS` · `Windows` · `Linux` · `iOS` · `Android` · `VS Code` · `JetBrains` · `Neovim` · `Vim` · `Chromium`

### File structure

Every file must begin with:

```markdown
# <Topic Title>

> <one-sentence blurb>

## Subcategory Name

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
```

One subcategory per `##` heading. Rows alphabetized within each subcategory.

---

## Quality bar

Each candidate must pass **all** of these checks before being proposed:

| Signal | Threshold |
| --- | --- |
| Stars | ≥ 500 **or** a clear documented differentiator justifies the exception |
| Last commit | Within 6 months **or** project is intentionally stable (note it in the Notes column) |
| License | OSS preferred; proprietary entries only in `## Proprietary Tools Worth Knowing` subsections |
| Status | Not archived; issues triaged within the last 90 days |
| Distinct | Meaningfully different from existing entries in the same file |
| Verifiable | The linked repo/page exists and matches the description at fetch time |

The PR body **must** cite each check per-row with a direct URL (see PR template below).

---

## Removal triggers

Auto-research must also propose *removals*, not just additions:

| Trigger | Proposed action |
| --- | --- |
| Repo archived or deleted | Remove the row; note replacement if known |
| No commits in 12+ months and < 1 k stars | Propose move to `## Archive` subsection or removal |
| Renamed / forked elsewhere | Propose URL update |
| Superseded by a better entry already in the file | Remove the older entry |

---

## PR title template

```
research: weekly <category short name> refresh <YYYY-MM-DD>
```

Examples:
- `research: weekly AI Agents refresh 2026-06-08`
- `research: weekly Local AI refresh 2026-06-08`
- `research: weekly Code Dev refresh 2026-06-08`

---

## PR body template

Every research PR body must follow this exact structure. Omit sections that have zero rows.

````markdown
## Summary

<!-- one sentence: which file(s) were touched and the net change count -->

## Additions

| Tool | Evidence (repo URL · stars · last-commit date) | Quality-bar checks |
| --- | --- | --- |
| [Name](url) | [repo](url) — ★N — last commit YYYY-MM-DD | ≥500★ ✓ · active ✓ · OSS ✓ · not archived ✓ · distinct ✓ · verifiable ✓ |

## Edits

| Row | Change | Reason |
| --- | --- | --- |
| [Name](url) | what changed | why |

## Removals

| Row | Reason | Replacement (if any) |
| --- | --- | --- |
| [Name](url) | e.g., archived since YYYY-MM | [Replacement](url) or — |

## Quality-bar checklist

- [ ] Every added row confirmed via direct fetch (URL resolves, stars/date verified)
- [ ] No fabricated data
- [ ] Description ≤ 140 chars per row
- [ ] Notes ≤ 120 chars per row
- [ ] Rows alphabetized within their subcategory
- [ ] Platforms values from controlled vocabulary only
- [ ] No news/blog entries
- [ ] PR touches ≤ 2 files

## Reviewer feedback incorporated

<!-- List any feedback from the two most recent merged research: PRs that influenced this run, or "none" -->
````

---

## Self-improvement protocol

At the start of each run, fetch the two most recent merged PRs whose title starts with `research:`. Review any reviewer comments on those PRs. If feedback was given:

1. Note it in the **Reviewer feedback incorporated** section of the new PR body.
2. Adjust the approach for this run accordingly (e.g., stricter star threshold, different subcategory focus, reworded Notes style).
3. If the feedback suggests a permanent change to this operating manual, include an edit to `architecture/routine-prompt.md` in the same PR as a second commit.

---

## Self-repair

If the repo is in an unexpected state — the `architecture/` folder is missing, this file is missing, or any other structural issue that prevents the routine from following these steps — open a PR titled:

```
research: routine self-repair <YYYY-MM-DD>
```

The PR should re-create the missing files from the description in the invocation prompt and any surviving context files. Exit **without doing research that week** — one PR per run.

---

## Out of scope (deliberately)

- News / blog posts / articles — this is a tools catalog, not a feed reader.
- Hosted-only proprietary SaaS outside the existing "Proprietary Tools Worth Knowing" subsections.
- One-person prototypes with no traction (quality bar filters these).
- Model checkpoints — Spellbook lists *tools that run* models, not the model weights themselves.
