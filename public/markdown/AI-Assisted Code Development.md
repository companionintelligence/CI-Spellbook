# Developer Tooling, Editors & Automation

> This section combines modern code assistants with the broader developer stack: editors, API clients, version control tools, dev utilities, and terminal-native workflows.

## Code Assistants

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Aider](https://github.com/Aider-AI/aider) | Terminal-based AI pair programmer for multi-file changes with any model. | Cross-platform | Strong fit for repo-aware editing; git-native diff workflow. |
| [Claude Code](https://github.com/anthropics/claude-code) | Anthropic's official terminal-native coding agent with hooks, skills, plugins, and MCP support. | Cross-platform | Strong fit for repo-scale work and scripted automation. |
| [Cline](https://github.com/cline/cline) | Autonomous coding agent inside VS Code with Plan/Act modes, browser, and terminal access. | VS Code | Good when you want approvals in the loop. |
| [Codex](https://github.com/openai/codex) | OpenAI's lightweight terminal coding agent for focused CLI workflows. | Cross-platform | Useful for focused command-line tasks; pairs well with GPT-5 family. |
| [Continue](https://github.com/continuedev/continue) | Open-source code assistant with customizable models and checks. | VS Code, JetBrains | Good fit for teams standardizing prompt and model behavior. |
| [Devin](https://github.com/cognition-ai/devin) | Autonomous AI software engineer that plans, codes, tests, and opens PRs end-to-end. | Web | Hosted cloud agent; reduced to $20/mo Core plan as of 2025. |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Google's open-source terminal agent powered by Gemini with 1M-token context and MCP support. | Cross-platform | Free tier: 1,000 req/day; Apache 2.0; launched June 2025. |
| [Goose](https://github.com/block/goose) | Extensible coding agent that can install, execute, edit, and test; fully local. | Cross-platform | Strong for tool-heavy workflows. |
| [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) | AI developer focused on building applications from requirements. | Cross-platform | Useful for app scaffolding and iteration. |
| [MetaGPT](https://github.com/geekan/MetaGPT) | Multi-agent software company simulation for structured delivery. | Self-hosted, Web | Good for role-based generation pipelines. |
| [OpenCode](https://github.com/opencode-ai/opencode) | Provider-agnostic terminal AI coding agent with polished TUI; 160k+ GitHub stars. | Cross-platform | Top open alternative to Claude Code; supports 75+ providers. |
| [OpenHands](https://github.com/All-Hands-AI/OpenHands) | Open autonomous developer that runs tasks in a sandboxed environment. | Cross-platform, Self-hosted | One of the strongest open choices for end-to-end dev tasks. |
| [Plandex](https://github.com/plandex-ai/plandex) | Open-source coding agent designed for larger, longer-running projects. | Cross-platform | Good when long-running plans matter. |
| [Roo Code](https://github.com/RooVetGit/Roo-Code) | VS Code coding agent with multi-step task execution and model flexibility. | VS Code | Good for editor-native agent workflows. |
| [Tabby](https://github.com/TabbyML/tabby) | Self-hosted AI coding assistant for local or team deployment. | Self-hosted, VS Code, JetBrains | Good privacy-focused alternative. |
| [windsurf.vim](https://github.com/Exafunction/windsurf.vim) | Vim and Neovim integration for Windsurf-style AI assistance. | Neovim, Vim | Useful when you want agent help without leaving modal editing. |

## AI Code Review

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [CodeRabbit](https://github.com/coderabbitai/coderabbit) | AI-assisted PR reviewer for GitHub/GitLab with inline comments and summaries. | Web | 2M+ repos connected; most-downloaded GitHub Marketplace app. |
| [Greptile](https://github.com/greptileai/greptile) | Context-aware code review tool that indexes the full codebase to catch deep bugs. | Web | 82% bug catch rate in benchmarks; raised $25M Series A in 2025. |
| [Qodo](https://github.com/Codium-ai/pr-agent) | AI code quality platform combining PR review with test generation. | Web, VS Code | Rebranded from CodiumAI 2024; multi-agent review architecture. |

## Proprietary Tools Worth Knowing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Cursor](https://www.cursor.com/) | AI-first code editor forked from VS Code with deep inline agent capabilities. | Cross-platform | Cursor 2.0 added parallel background agents on isolated VMs (Feb 2026). |
| [GitHub Copilot](https://github.com/features/copilot) | Microsoft/OpenAI IDE assistant with inline completions, chat, and agent mode. | VS Code, JetBrains, CLI | Ubiquitous; agent mode added in 2025; integrated into GitHub PRs. |
| [Windsurf](https://www.windsurf.ai/) | AI-native IDE with context-aware "Cascade" agent and multi-file awareness. | Cross-platform | Acquired by OpenAI in 2025; tight Codex integration expected. |

## Editors & IDEs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [code-server](https://github.com/coder/code-server) | VS Code running in the browser for remote or ephemeral dev environments. | Self-hosted | Good for remote and ephemeral dev environments. |
| [CodeEdit](https://github.com/CodeEditApp/CodeEdit) | Native macOS editor focused on a polished coding experience. | macOS | Worth tracking for Apple-native development. |
| [Helix](https://github.com/helix-editor/helix) | Modern modal editor with tree-sitter and LSP support built-in. | Cross-platform | Strong for fast keyboard workflows. |
| [Lapce](https://github.com/lapce/lapce) | Fast Rust-based editor with built-in remote development and LSP. | Cross-platform | Good alternative to Electron-heavy editors. |
| [LazyVim](https://github.com/LazyVim/LazyVim) | Opinionated Neovim distribution for productive defaults. | Cross-platform | Great baseline for a serious Neovim setup. |
| [Onlook](https://github.com/onlook-dev/onlook) | Visual AI-first design and React editing tool. | Cross-platform | Helpful for design-to-code workflows. |
| [Void](https://github.com/voideditor/void) | Open-source Cursor alternative built on VS Code. | Windows, macOS | Good option if you want an AI-first editor without lock-in. |
| [VS Code](https://github.com/microsoft/vscode) | General-purpose developer IDE with extension ecosystem. | Cross-platform | Still the broadest extension platform. |
| [VSCodium](https://github.com/VSCodium/vscodium) | Community build of VS Code without Microsoft branding or telemetry. | Cross-platform | Useful when you want VS Code compatibility with fewer defaults. |
| [Zed](https://github.com/zed-industries/zed) | High-performance collaborative editor with built-in AI model access. | macOS, Linux | Great for speed-sensitive workflows. |

## API Clients & IDE Adjacent Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Bruno](https://github.com/usebruno/bruno) | Local-first API IDE with file-based collections stored in git. | Cross-platform | Good for repo-native API definitions. |
| [Hoppscotch](https://github.com/hoppscotch/hoppscotch) | Open-source API ecosystem for REST, GraphQL, and more. | Cross-platform, Web | Good for web-first API exploration. |
| [HTTPie CLI](https://github.com/httpie/cli) | Human-friendly HTTP client for terminal workflows. | Cross-platform | Excellent for scripts and quick requests. |
| [HTTPie Desktop](https://github.com/httpie/desktop) | GUI companion to HTTPie for API exploration. | Cross-platform | Good balance of simplicity and polish. |
| [Insomnia](https://github.com/Kong/insomnia) | Mature open-source client for REST, GraphQL, SSE, and gRPC. | Cross-platform | Strong for broad protocol coverage. |
| [Requestly](https://github.com/requestly/requestly) | API client and request interceptor for frontend debugging. | Cross-platform | Useful when debugging frontend and browser traffic. |
| [Restfox](https://github.com/flawiddsouza/Restfox) | Offline-first minimal API client for web and desktop. | Cross-platform | Good for lightweight teams. |
| [Yaak](https://github.com/mountain-loop/yaak) | Desktop API client with a simpler execution model than Postman. | Cross-platform | Nice fit when Postman-class tools feel heavy. |

## Dev Tools, Git & Version Control

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [act](https://github.com/nektos/act) | Run GitHub Actions CI workflows locally. | Self-hosted | Essential when debugging pipeline behavior. |
| [Backlog.md](https://github.com/MrLesk/Backlog.md) | Collaboration layer for humans and AI agents in git repos. | Cross-platform | Good for hybrid human-agent workflows. |
| [bat](https://github.com/sharkdp/bat) | Syntax-aware file viewer with git integration. | Cross-platform | Practical upgrade over plain cat. |
| [GitButler](https://github.com/gitbutlerapp/gitbutler) | Branch-oriented desktop git client for parallel change stacks. | Cross-platform | Good for parallel change stacks. |
| [Gitea](https://github.com/go-gitea/gitea) | Lightweight self-hosted git platform. | Self-hosted | Strong fit for private team hosting. |
| [GitHub Desktop](https://github.com/desktop/desktop) | Friendly graphical client for git repositories. | Cross-platform | Good for lower-friction git tasks. |
| [GitLab](https://github.com/gitlabhq/gitlabhq) | Full DevOps platform with source hosting and CI. | Self-hosted, Web | Best for all-in-one enterprise workflows. |
| [Jujutsu](https://github.com/jj-vcs/jj) | Git-compatible VCS with a simpler conflict-resolution model. | Cross-platform | Worth evaluating for cleaner history management. |
| [Lazygit](https://github.com/jesseduffield/lazygit) | Fast TUI for day-to-day git operations. | Cross-platform | Excellent for keyboard-first git work. |
| [Onefetch](https://github.com/o2sh/onefetch) | Repository summary and diagnostics utility for the terminal. | Cross-platform | Handy for quick repo diagnostics. |
| [Soft Serve](https://github.com/charmbracelet/soft-serve) | Terminal-native self-hosted git server. | Cross-platform | Good for simpler private hosting. |
| [typos](https://github.com/crate-ci/typos) | Fast source-code spell checker. | Cross-platform | Easy win for documentation and UI copy. |
| [Watchexec](https://github.com/watchexec/watchexec) | File-watching task runner for local automations. | Cross-platform | Useful for small local automations. |

## Package Managers & Terminal Workflow

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Bun](https://github.com/oven-sh/bun) | JavaScript runtime, bundler, and package manager in one. | Cross-platform | Fast choice for modern JS tooling. |
| [delta](https://github.com/dandavison/delta) | Syntax-highlighted pager for git and diff workflows. | Cross-platform | Makes review output much easier to scan. |
| [fd](https://github.com/sharkdp/fd) | User-friendly file finder as a fast replacement for find. | Cross-platform | Fast replacement for many find usages. |
| [fzf](https://github.com/junegunn/fzf) | Fuzzy finder for shell and scripts. | Cross-platform | Foundation piece for power-user terminals. |
| [PNPM](https://github.com/pnpm/pnpm) | Disk-efficient Node package manager with workspace support. | Cross-platform | Great for large workspaces. |
| [ripgrep](https://github.com/BurntSushi/ripgrep) | Fast recursive search utility for codebases. | Cross-platform | Still the default tool for codebase search. |
| [ShellGPT](https://github.com/TheR1D/shell_gpt) | AI assistance for shell tasks, scripts, and command translation. | Cross-platform | Useful when terminal work needs quick translation or explanation. |
| [uv](https://github.com/astral-sh/uv) | Fast Python package and project manager written in Rust. | Cross-platform | One of the best upgrades for Python environments. |
| [Yarn](https://github.com/yarnpkg/berry) | Mature Node package manager with workspace features. | Cross-platform | Strong when monorepo constraints matter. |
| [zoxide](https://github.com/ajeetdsouza/zoxide) | Smarter directory jumper with frecency ranking. | Cross-platform | Small utility, large workflow gain. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Claude Sonnet 4.6 / Opus 4.8](https://www.anthropic.com/claude) | Anthropic's current coding flagship pair: Sonnet 4.6 for cost-effective work, Opus 4.8 for hard tasks. | Hosted API | Opus 4.8: 88.6% SWE-bench Verified (May 2026); Sonnet 4.6 at $3/$15 per M tokens. |
| [Claude Fable 5](https://www.anthropic.com/claude) | Anthropic's top-tier agentic model, GA June 9 2026. | Hosted API | 95.0% SWE-bench Verified; $10/$50 per M tokens; leads all public benchmarks at time of writing. |
| [DeepSeek-V4-Pro-Max](https://github.com/deepseek-ai/DeepSeek-V3) | DeepSeek's open-weight frontier model, 80.6% SWE-bench Verified. | Open weights, Hosted API | Leads open-weight category; Apache 2.0; very competitive cost. |
| [Gemini 3.1 Pro](https://deepmind.google/technologies/gemini/) | Google DeepMind's flagship coding model with 1M context. | Hosted API | 80.6% SWE-bench Verified; strong multimodal and long-context capabilities. |
| [GPT-5.4 / GPT-5.5](https://openai.com/) | OpenAI's current flagship coding models; 5.4 incorporates Codex capabilities. | Hosted API | GPT-5: 74.9% SWE-bench Verified at launch; 5.5 released April 2026; strong agentic tool-use. |
| [Kimi K2.6](https://huggingface.co/moonshotai) | Moonshot AI's 1T-param MoE open model, 32B active; 80.2% SWE-bench Verified. | Open weights, Hosted API | Modified MIT license; released April 2026; strong agentic stability. |
| [MiniMax M3](https://github.com/MiniMaxAI) | MiniMax's open-weight model with 1M context at $0.30/$1.20 per M tokens. | Open weights, Hosted API | 80.5% SWE-bench Verified; exceptionally cost-effective for its benchmark tier. |
| [Qwen3-Coder-Next](https://github.com/QwenLM/Qwen3) | Alibaba's 80B MoE coding specialist (3B active), strong agentic task performance. | Open weights, Hosted API | 70.6% SWE-bench Verified; Apache 2.0; runs locally on modest hardware due to MoE design. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Anthropic Claude Code Docs](https://code.claude.com/docs) | Official Claude Code documentation covering best practices, hooks, subagents, and MCP. | Web | Primary reference; covers agentic patterns and configuration in depth. |
| [awesome-claude-code (hesreallyhim)](https://github.com/hesreallyhim/awesome-claude-code) | Curated list of skills, hooks, slash-commands, and orchestrators for Claude Code. | Web | High signal-to-noise; community-maintained. |
| [Claude Code: A Highly Agentic Coding Assistant](https://www.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant) | DeepLearning.AI short course on agentic coding patterns with Claude Code. | Web | Taught by Elie Schoppik, Anthropic Head of Technical Education. |
| [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | Community guide covering Claude Code from beginner to power user with templates. | Web | Production-ready templates, workflow guides, and a cheatsheet. |
| [OpenAI Codex Docs](https://platform.openai.com/docs/guides/codex) | Official Codex CLI documentation, quickstarts, and API integration guides. | Web | Useful companion when routing tasks between Claude Code and Codex CLI. |
