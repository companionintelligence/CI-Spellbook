# CI-Spellbook Copilot Instructions

## Project Overview
This is a React 18 single-page application built with Vite and Tailwind CSS v4. The application, "CI-Spellbook", serves as an interactive knowledge base, rendering Markdown content into expandable "Card" components.

## Architecture & Core Components

- **Entry Point**: `index.html` loads `src/main.jsx` which mounts `src/App.jsx`.
- **Data Source**: Content is static Markdown files located in `public/markdown/`.
  - `src/App.jsx` serves as the registry for all cards, defining their metadata (title, colors, markdown path).
  - `src/hooks/useMarkdown.js` handles fetching, parsing (via `marked`), and syntax highlighting (via `highlight.js`) of these files at runtime.
- **Components**:
  - `src/components/Card.jsx`: Handles the display, expansion logic, and interaction of individual spellbook cards.
  - `src/components/DebugPanel.jsx`: A developer tool for inspecting internal application state.
- **Styling**: 
  - Primarily Tailwind CSS (v4) via Vite plugin.
  - Custom animations and overrides in `src/styles.css`.
  - Color palette is strictly defined in `src/App.jsx` and `README.md`.

## Development Workflows

### Run & Build
- **Dev Server**: `npm run dev` (Runs Vite on port 5500).
- **Build**: `npm run build` (Outputs to `dist/`).
- **Preview**: `npm run preview`.

### Testing
- **Framework**: Playwright (End-to-End testing).
- **Run Tests**: `npm test` or `npx playwright test`.
- **UI Mode**: `npm run test:ui` (Useful for debugging tests).
- **Test Files**: Located in `tests/` (e.g., `tests/card-height.spec.js`).

## Coding Conventions & Patterns

- **Markdown Content**: To add new content, create a `.md` file in `public/markdown/` and add a corresponding entry to the `cardConfigs` array in `src/App.jsx`.
- **Card Styling**: Each card relies on a specific color theme defined in `App.jsx` (baseColor, borderColor, hoverColor). Ensure these are consistent when adding new cards.
- **State Management**: Uses React standard hooks (`useState`, `useEffect`). `useDebugPanel` is a custom hook for global debug state.
- **Assets**: Static assets (images, markdown) live in `public/`. Reference them with absolute paths (e.g., `/markdown/file.md`).
- **Mixed Environment**: You may see `index-vanilla.html` and `script.js` in the root. These are likely legacy or reference files. Focus on the `src/` directory for React development.

## Dependency Management
- **Main**: `react`, `react-dom`, `marked`, `highlight.js`, `classnames`.
- **Dev**: `vite`, `@playwright/test`, `tailwindcss`.
