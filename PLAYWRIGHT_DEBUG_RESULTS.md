# Card Height Issue - Playwright Debugging Results

Status: Fixed and re-validated as of 2026-02-06.

## Issues Identified

### 1. **Hardcoded Height Override (FIXED)**
- **Location:** `src/index.css` line 171
- **Problem:** `.group.full-expanded` had `height: 85vh !important;` which overrode the dynamic `--card-content-height` CSS variable
- **Fix Applied:** Changed to `height: var(--card-content-height, 85vh) !important;`
- **Impact:** HIGH - This was the primary cause of content being cut off

### 2. **Overflow Conflict (FIXED)**
- **Location:** `src/index.css` line 1076
- **Problem:** `.group.full-expanded` had `overflow-y: auto !important;` making the card container scrollable instead of just the card-back
- **Fix Applied:** Changed to `overflow: hidden !important;` - only `.card-back` should scroll
- **Impact:** MEDIUM - Caused confusion about which element should handle scrolling

### 3. **Content Height Measurement (IMPROVED)**
- **Location:** `src/hooks/useCardAnimation.js` line 18
- **Problem:** `measureContentHeight()` was:
  - Selecting the wrong element (`.card-inner > div[style*="rotateY(180deg)"]` instead of `.card-back`)
  - Not accounting for all content properly
  - Missing overflow and display styles in temp element
- **Fix Applied:** 
  - Now selects `.card-back` directly
  - Added proper styles to temp div (height: auto, overflow: visible, display: block)
  - Measures inner content directly
  - Added console logging for debugging
- **Impact:** MEDIUM - Better height calculation accuracy

## Structure Analysis

```
.group (card container)
├── Close button
└── .card-inner (preserves 3D)
    ├── .card-front (hidden when flipped)
    └── .card-back (visible when flipped, SCROLLABLE)
        ├── Background overlay div (absolute inset-0)
        └── Content div (relative z-10, with id=containerId)
            └── .markdown-body (actual content)
```

## CSS Rules Applied (in order of specificity)

1. `.group.expanding-height` → Sets initial height to `--card-content-height`
2. `.group.flipped.full-expanded` → Sets height to `--card-content-height` with max-height 95vh
3. `#cards-container .group.full-expanded` → Same, ultra-high specificity
4. `.group.full-expanded` → Now properly uses `--card-content-height` (FIXED)

## How Height Calculation Works

1. User clicks card
2. `expandCard()` calls `measureContentHeight()`
3. Measurement:
   - Clones `.card-back` element
   - Appends to body with 90vw width, auto height, no constraints
   - Measures scrollHeight of inner content
   - Adds 100px padding
   - Caps at 95vh (window.innerHeight * 0.95)
   - Returns finalHeight
4. Sets `--card-content-height` CSS variable on card element
5. CSS rules use this variable for height animation

## Reproduction Steps
1. Start the dev server and open `http://localhost:5503`.
2. Click a card with long markdown content.
3. Observe the card height expansion and verify bottom content is reachable.

## Follow-ups

1. **Padding accounting:** card-back has `px-6 py-4` (24px horizontal, 16px vertical padding)
   - Total vertical padding: 32px (16px top + 16px bottom)
   - This should be included in scrollHeight but verify

2. **Background overlay:** The `absolute inset-0` div might not affect height but could affect interaction

3. **Markdown content rendering:** If images or async content loads after measurement, height will be wrong

## Why Playwright
Playwright was used to automate repeatable card expansion and height checks with consistent timing and screenshot capture.

## Recommended Tests

Run the debug page at `debug-card-height.html` to:
1. Measure actual vs. expected heights
2. Check if content is still cut off
3. Verify scrolling behavior
4. Inspect CSS variable values

## Test Command

```bash
# Open in browser
open http://localhost:5503/debug-card-height.html

# Or use the Playwright test
npm test -- tests/card-height.spec.js
```

## Success Criteria

✅ Card expands to show all content OR provides scrolling
✅ `--card-content-height` is set correctly based on actual content
✅ No hardcoded height values override the dynamic calculation
✅ `.card-back` is the only scrollable element
✅ Content at bottom is accessible via scrolling
