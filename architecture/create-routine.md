# Creating the Weekly Research Routine

> The routine itself is a Claude Code scheduled task. This file is the one-time setup checklist. The recurring prompt lives in [routine-prompt.md](routine-prompt.md) — edit that file to change behavior, not the schedule.

## Why a separate file

`mcp__scheduled-tasks__create_scheduled_task` requires explicit user approval (it can't be auto-created in unsupervised / autonomous modes). Keeping the exact inputs here means setup is "click approve once" instead of "re-derive the prompt from chat history".

## One-time setup

Open Claude Code (interactive mode), then ask:

> Create the CI-Spellbook weekly research routine using the inputs in `architecture/create-routine.md`.

Claude will call `mcp__scheduled-tasks__create_scheduled_task` with the inputs below; you approve once.

## Inputs

| Field | Value |
| --- | --- |
| `taskId` | `ci-spellbook-weekly-research` |
| `description` | `Weekly research run for CI-Spellbook — opens a PR with proposed catalog updates.` |
| `cronExpression` | `0 7 * * 1` (Mondays at 07:00 local) |
| `notifyOnCompletion` | `true` |

### `prompt`

```text
You are the **CI-Spellbook Weekly Research** routine. You run cold each week and propose curated updates to the Spellbook tools catalog via a pull request.

# Bootstrap

Repo: `companionintelligence/CI-Spellbook`
Local clone: `/Users/liam/devel/ci/CI-Spellbook`

1. `cd /Users/liam/devel/ci/CI-Spellbook`
2. `git fetch origin && git checkout main && git pull --ff-only origin main`
3. Create a research branch: `git checkout -b research/$(date +%Y-%m-%d)-auto`

# Read the canonical prompt + plan

Before doing anything else, read these files in this order:

1. `architecture/routine-prompt.md` — your full operating contract (quality bar, target selection, PR conventions, removal criteria).
2. `architecture/content-expansion-plan.md` — current category priorities, cadence, and source-quality bar.
3. The 2 most recent merged PRs whose title starts with `research:` — `gh pr list --repo companionintelligence/CI-Spellbook --search "research: in:title is:merged" --limit 2 --json number,title,body`. Learn from any reviewer feedback.

If `architecture/routine-prompt.md` exists, follow it exactly; the rules below are only a fallback if that file is missing.

# Fallback rules (if routine-prompt.md is missing)

1. Pick one or two files in `public/markdown/`. Prefer High-priority files (`ai-agents.md`, `developer-tooling.md`, `local-ai-apps.md`) not touched by a `research:` PR in ≥ 14 days. Never touch more than 2 files per PR.
2. Research each chosen file:
   - Read existing entries.
   - `gh api -X GET search/repositories -f q="<category keywords> stars:>500 pushed:>2025-11-01" -f sort=stars -f order=desc`
   - Cross-check via WebSearch for "<category> open source 2026".
   - Verify each candidate: ≥ 500 stars (or strong differentiator), last commit within 6 months, OSS license (or `## Proprietary Tools Worth Knowing`), not archived, distinct from existing entries.
3. Edit files. Keep the schema: `| Tool | Description | Platforms | Notes |`. Description ≤ 140 chars. Notes ≤ 120 chars. Tool cell is `[Name](url)`.
4. Also propose removals for archived/abandoned repos or entries superseded by clearly better existing rows.
5. Budget: up to ~6 additions, 4 edits, 2 removals across the PR. Quality > quantity.

# PR conventions

- Branch: `research/YYYY-MM-DD-auto`
- Title: `research: weekly catalog update YYYY-MM-DD`
- Body must contain:
  - Files touched (bulleted list)
  - Citations table — for each new row: `| Tool | Stars | Last commit | License | Source |`
  - Removals section (if any) with reason
  - Quality bar checks — a checkbox list confirming each candidate passed the quality bar
- Open the PR: `gh pr create --base main --head research/$(date +%Y-%m-%d)-auto --title "..." --body "..."`
- Never push to main directly. Never merge your own PR.

# When done

Print a short summary: PR URL, files touched, count of additions/edits/removals. If you found nothing worth proposing (high-quality bar applied honestly), say so and exit without opening a PR — that is the correct outcome some weeks.

# Operating notes

- You have `gh`, `git`, `WebSearch`, `WebFetch`, `Read`, `Edit`, `Write`, `Bash`.
- All edits should be small and reviewable.
- If `git status` shows uncommitted changes on `main` at the start, abort and report — don't risk losing user work.
- If a `research/<today>-auto` branch already exists, abort and report.
```

## After creation

- The task fires every Monday 07:00 local time.
- Claude Code must be open for the task to fire on time; if closed, it runs on next launch.
- To stop the routine: `mcp__scheduled-tasks__delete_scheduled_task` with `taskId: ci-spellbook-weekly-research`.
- To change the schedule or prompt: edit `architecture/routine-prompt.md` (no schedule edit needed) or use `mcp__scheduled-tasks__update_scheduled_task`.

## Sanity test before scheduling

You can dry-run the routine by simply pasting the prompt into a fresh Claude Code session in `/Users/liam/devel/ci/CI-Spellbook`. If it opens a clean `research:` PR end-to-end, schedule it. If not, fix `routine-prompt.md` first.
