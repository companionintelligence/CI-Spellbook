# Developer Tooling, Editors & Automation

> This section combines modern code assistants with the broader developer stack: editors, API clients, version control tools, dev utilities, and terminal-native workflows.

## Code Assistants

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Aider](https://github.com/Aider-AI/aider) | Terminal-based AI pair programmer for multi-file changes. | Cross-platform | Strong fit for repo-aware editing with any model. |
| [Cline](https://github.com/cline/cline) | Autonomous coding agent inside VS Code with browser and terminal access. | VS Code | Good when you want approvals in the loop. |
| [Codex](https://github.com/openai/codex) | Lightweight coding agent for terminal workflows. | Cross-platform | Useful for focused command-line tasks. |
| [Continue](https://github.com/continuedev/continue) | Open-source code assistant with customizable models and checks. | VS Code, JetBrains | Good fit for teams standardizing prompt and model behavior. |
| [Goose](https://github.com/block/goose) | Extensible coding agent that can install, execute, edit, and test. | Cross-platform | Strong for tool-heavy workflows. |
| [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) | AI developer focused on building applications from requirements. | Cross-platform | Useful for app scaffolding and iteration. |
| [MetaGPT](https://github.com/geekan/MetaGPT) | Multi-agent software company simulation for structured delivery. | Self-hosted, Web | Good for role-based generation pipelines. |
| [OpenHands](https://github.com/All-Hands-AI/OpenHands) | Open autonomous developer that runs tasks in a controlled environment. | Cross-platform, Self-hosted | One of the strongest open choices for end-to-end dev tasks. |
| [Plandex](https://github.com/plandex-ai/plandex) | Open-source coding agent designed for larger projects. | Cross-platform | Good when long-running plans matter. |
| [Roo Code](https://github.com/RooVetGit/Roo-Code) | VS Code coding agent with multi-step task execution. | VS Code | Good for editor-native agent workflows. |
| [Tabby](https://github.com/TabbyML/tabby) | Self-hosted AI coding assistant for local or team deployment. | Self-hosted, VS Code, JetBrains | Good privacy-focused alternative. |
| [windsurf.vim](https://github.com/Exafunction/windsurf.vim) | Vim and Neovim integration for Windsurf-style assistance. | Neovim, Vim | Useful when you want agent help without leaving modal editing. |

## Editors & IDEs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [code-server](https://github.com/coder/code-server) | VS Code running in the browser. | Self-hosted | Good for remote and ephemeral dev environments. |
| [CodeEdit](https://github.com/CodeEditApp/CodeEdit) | Native macOS editor focused on a polished coding experience. | macOS | Worth tracking for Apple-native development. |
| [Helix](https://github.com/helix-editor/helix) | Modern modal editor with tree-sitter and LSP support. | Cross-platform | Strong for fast keyboard workflows. |
| [Lapce](https://github.com/lapce/lapce) | Fast editor written in Rust with built-in tooling. | Cross-platform | Good alternative to Electron-heavy editors. |
| [LazyVim](https://github.com/LazyVim/LazyVim) | Opinionated Neovim distribution for productive defaults. | Cross-platform | Great baseline for a serious Neovim setup. |
| [Onlook](https://github.com/onlook-dev/onlook) | Visual AI-first design and React editing tool. | Cross-platform | Helpful for design-to-code workflows. |
| [Void](https://github.com/voideditor/void) | Open-source Cursor alternative. | Windows, macOS | Good option if you want an AI-first editor without lock-in. |
| [VS Code](https://github.com/microsoft/vscode) | General-purpose developer IDE with extension ecosystem. | Cross-platform | Still the broadest extension platform. |
| [VSCodium](https://github.com/VSCodium/vscodium) | Community build of VS Code without Microsoft branding or telemetry. | Cross-platform | Useful when you want VS Code compatibility with fewer defaults. |
| [Zed](https://github.com/zed-industries/zed) | High-performance collaborative editor. | macOS, Linux | Great for speed-sensitive workflows. |

## API Clients & IDE Adjacent Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Hoppscotch](https://github.com/hoppscotch/hoppscotch) | Open-source API ecosystem for REST, GraphQL, and more. | Cross-platform, Web | Good for web-first API exploration. |
| [HTTPie CLI](https://github.com/httpie/cli) | Human-friendly HTTP client for terminal workflows. | Cross-platform | Excellent for scripts and quick requests. |
| [HTTPie Desktop](https://github.com/httpie/desktop) | GUI companion to HTTPie for API exploration. | Cross-platform | Good balance of simplicity and polish. |
| [Insomnia](https://github.com/Kong/insomnia) | Mature open-source client for REST, GraphQL, SSE, and gRPC. | Cross-platform | Strong for broad protocol coverage. |
| [Requestly](https://github.com/requestly/requestly) | API client and request interceptor. | Cross-platform | Useful when debugging frontend and browser traffic. |
| [Restfox](https://github.com/flawiddsouza/Restfox) | Offline-first minimal API client for web and desktop. | Cross-platform | Good for lightweight teams. |
| [Yaak](https://github.com/mountain-loop/yaak) | Desktop API client with a simpler execution model. | Cross-platform | Nice fit when Postman-class tools feel heavy. |
| [Bruno](https://github.com/usebruno/bruno) | Local-first API IDE with file-based collections. | Cross-platform | Good for repo-native API definitions. |

## Dev Tools, Git & Version Control

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [act](https://github.com/nektos/act) | Run CI workflows locally. | Self-hosted | Essential when debugging pipeline behavior. |
| [Backlog.md](https://github.com/MrLesk/Backlog.md) | Collaboration layer for humans and AI agents in git repos. | Cross-platform | Good for hybrid human-agent workflows. |
| [bat](https://github.com/sharkdp/bat) | Syntax-aware file viewer. | Cross-platform | Practical upgrade over plain cat. |
| [Jujutsu](https://github.com/jj-vcs/jj) | Git-compatible VCS with a simpler model. | Cross-platform | Worth evaluating for cleaner history management. |
| [Onefetch](https://github.com/o2sh/onefetch) | Repository summary utility for the terminal. | Cross-platform | Handy for quick repo diagnostics. |
| [typos](https://github.com/crate-ci/typos) | Fast source-code spell checker. | Cross-platform | Easy win for documentation and UI copy. |
| [Watchexec](https://github.com/watchexec/watchexec) | File-watching task runner. | Cross-platform | Useful for small local automations. |
| [GitButler](https://github.com/gitbutlerapp/gitbutler) | Branch-oriented desktop git client. | Cross-platform | Good for parallel change stacks. |
| [GitHub Desktop](https://github.com/desktop/desktop) | Friendly graphical client for git repositories. | Cross-platform | Good for lower-friction git tasks. |
| [Lazygit](https://github.com/jesseduffield/lazygit) | Fast TUI for day-to-day git operations. | Cross-platform | Excellent for keyboard-first git work. |
| [Gitea](https://github.com/go-gitea/gitea) | Lightweight self-hosted git platform. | Self-hosted | Strong fit for private team hosting. |
| [GitLab](https://github.com/gitlabhq/gitlabhq) | Full DevOps platform with source hosting and CI. | Self-hosted, Web | Best for all-in-one enterprise workflows. |
| [Soft Serve](https://github.com/charmbracelet/soft-serve) | Terminal-native self-hosted git server. | Cross-platform | Good for simpler private hosting. |

## Package Managers & Terminal Workflow

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Bun](https://github.com/oven-sh/bun) | JavaScript runtime, bundler, and package manager. | Cross-platform | Fast choice for modern JS tooling. |
| [PNPM](https://github.com/pnpm/pnpm) | Disk-efficient Node package manager. | Cross-platform | Great for large workspaces. |
| [uv](https://github.com/astral-sh/uv) | Fast Python package and project manager. | Cross-platform | One of the best upgrades for Python environments. |
| [Yarn](https://github.com/yarnpkg/berry) | Mature Node package manager with workspace features. | Cross-platform | Strong when monorepo constraints matter. |
| [delta](https://github.com/dandavison/delta) | Syntax-highlighted pager for git and diff workflows. | Cross-platform | Makes review output much easier to scan. |
| [fd](https://github.com/sharkdp/fd) | User-friendly file finder. | Cross-platform | Fast replacement for many find usages. |
| [fzf](https://github.com/junegunn/fzf) | Fuzzy finder for shell and scripts. | Cross-platform | Foundation piece for power-user terminals. |
| [ripgrep](https://github.com/BurntSushi/ripgrep) | Fast recursive search utility. | Cross-platform | Still the default tool for codebase search. |
| [zoxide](https://github.com/ajeetdsouza/zoxide) | Smarter directory jumper. | Cross-platform | Small utility, large workflow gain. |
| [ShellGPT](https://github.com/TheR1D/shell_gpt) | AI help for shell tasks and scripts. | Cross-platform | Useful when terminal work needs quick translation or explanation. |
