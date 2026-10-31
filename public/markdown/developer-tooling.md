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
| [Devin](https://devin.ai/) | Autonomous AI software engineer that plans, codes, tests, and opens PRs end-to-end. | Web | Hosted cloud agent; reduced to $20/mo Core plan as of 2025. |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Google's open-source terminal agent powered by Gemini with 1M-token context and MCP support. | Cross-platform | Free tier: 1,000 req/day; Apache 2.0; launched June 2025. |
| [Goose](https://github.com/aaif-goose/goose) | Extensible coding agent that can install, execute, edit, and test; fully local. | Cross-platform | Strong for tool-heavy workflows. |
| [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) | AI developer focused on building applications from requirements. | Cross-platform | Useful for app scaffolding and iteration. |
| [MetaGPT](https://github.com/FoundationAgents/MetaGPT) | Multi-agent software company simulation for structured delivery. | Self-hosted, Web | Good for role-based generation pipelines. |
| [OpenCode](https://github.com/anomalyco/opencode) | Provider-agnostic terminal AI coding agent with polished TUI; 200k+ GitHub stars. | Cross-platform | Top open alternative to Claude Code; supports 75+ providers. |
| [OpenHands](https://github.com/OpenHands/OpenHands) | Open autonomous developer that runs tasks in a sandboxed environment. | Cross-platform, Self-hosted | One of the strongest open choices for end-to-end dev tasks. |
| [Plandex](https://github.com/plandex-ai/plandex) | Open-source coding agent designed for larger, longer-running projects. | Cross-platform | Good when long-running plans matter. |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code) | VS Code coding agent with multi-step task execution and model flexibility. | VS Code | Archived by its owner (read-only). Good for editor-native agent workflows. |
| [Tabby](https://github.com/TabbyML/tabby) | Self-hosted AI coding assistant for local or team deployment. | Self-hosted, VS Code, JetBrains | Good privacy-focused alternative. |
| [windsurf.vim](https://github.com/Exafunction/windsurf.vim) | Vim and Neovim integration for Windsurf-style AI assistance. | Neovim, Vim | Useful when you want agent help without leaving modal editing. |
| [screenshot-to-code](https://github.com/abi/screenshot-to-code) | Converts a screenshot or mockup into HTML, Tailwind, React or Vue code. | Cross-platform | MIT; ~81k stars; relies on multimodal models. |
| [argent](https://github.com/software-mansion/argent) | Agent toolkit that controls, debugs and profiles iOS and Android apps. | iOS, Android | Apache-2.0; ~3k stars; from Software Mansion. |

## AI Code Review

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [CodeRabbit](https://www.coderabbit.ai/) | AI-assisted PR reviewer for GitHub/GitLab with inline comments and summaries. | Web | 2M+ repos connected; most-downloaded GitHub Marketplace app. |
| [Greptile](https://www.greptile.com/) | Context-aware code review tool that indexes the full codebase to catch deep bugs. | Web | 82% bug catch rate in benchmarks; raised $25M Series A in 2025. |
| [Qodo](https://github.com/The-PR-Agent/pr-agent) | AI code quality platform combining PR review with test generation. | Web, VS Code | Rebranded from CodiumAI 2024; multi-agent review architecture. |
| [open-code-review](https://github.com/alibaba/open-code-review) | Hybrid AI code review tool built for large codebases. | Cross-platform | Apache-2.0; ~49k stars; from Alibaba. |

## Proprietary Tools Worth Knowing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Cursor](https://cursor.com/) | AI-first code editor forked from VS Code with deep inline agent capabilities. | Cross-platform | Cursor 2.0 added parallel background agents on isolated VMs (Feb 2026). |
| [GitHub Copilot](https://github.com/features/copilot) | Microsoft/OpenAI IDE assistant with inline completions, chat, and agent mode. | VS Code, JetBrains, CLI | Ubiquitous; agent mode added in 2025; integrated into GitHub PRs. |
| [Windsurf (now Devin Desktop)](https://devin.ai/desktop) | AI-native IDE from Cognition; the Windsurf domains now lead to its Devin Desktop page. | Cross-platform | Cognition, the maker of Devin, now runs it; Devin Desktop is its home for coding agents. |

## Editors & IDEs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [code-server](https://github.com/coder/code-server) | VS Code running in the browser for remote or ephemeral dev environments. | Self-hosted | Good for remote and ephemeral dev environments. |
| [CodeEdit](https://github.com/CodeEditApp/CodeEdit) | Native macOS editor focused on a polished coding experience. | macOS | Worth tracking for Apple-native development. |
| [Helix](https://github.com/helix-editor/helix) | Modern modal editor with tree-sitter and LSP support built-in. | Cross-platform | Strong for fast keyboard workflows. |
| [Lapce](https://github.com/lapce/lapce) | Fast Rust-based editor with built-in remote development and LSP. | Cross-platform | Good alternative to Electron-heavy editors. |
| [LazyVim](https://github.com/LazyVim/LazyVim) | Opinionated Neovim distribution for productive defaults. | Cross-platform | Great baseline for a serious Neovim setup. |
| [Onlook](https://github.com/onlook-dev/onlook) | Visual AI-first design and React editing tool. | Cross-platform | Helpful for design-to-code workflows. |
| [Void](https://github.com/voideditor/void) | Open-source Cursor alternative built on VS Code. | Windows, macOS | Archived by its owner (read-only). Good option if you want an AI-first editor without lock-in. |
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
| [ReDoc](https://github.com/Redocly/redoc) | Renders OpenAPI specifications as static, responsive API reference docs. | Web | MIT; ~26k stars; now maintained under Redocly. |
| [JSON Editor](https://github.com/josdejong/jsoneditor) | Web-based tool to view, edit, format and validate JSON. | Web | Apache-2.0; ~12k stars. |

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
| [Git](https://git-scm.com/) | Distributed version control system; the reference site for downloads and documentation. | Cross-platform | The reference site for the Git project itself. |
| [Repowise](https://github.com/repowise-dev/repowise) | Codebase intelligence for AI and humans: health scores, generated docs and git analytics. | Cross-platform | AGPL-3.0; ~8k stars. |

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
| [Chocolatey](https://chocolatey.org/) | Package manager for Windows that installs software from a community repository. | Windows | Open-source CLI; GitHub did not detect a license. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Claude Sonnet 4.6 / Opus 4.8](https://claude.com/product/overview) | Anthropic's coding flagship pair: Sonnet 4.6 for cost-effective work, Opus 4.8 for hard tasks. | Hosted API | Opus 4.8 leads the Claude line on SWE-bench Verified; Sonnet 4.6 is the everyday default. |
| [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) | Anthropic's top-tier Mythos-class agentic model, GA June 2026. | Hosted API | Current top published results on agentic coding benchmarks at release. |
| [DeepSeek V4](https://huggingface.co/deepseek-ai) | DeepSeek's open-weight frontier family (V4-Pro / V4-Flash), released April 2026. | Open weights, Hosted API | 80.6% SWE-bench Verified leads the open-weight category; MIT; very competitive cost. |
| [Gemini 3.1 Pro](https://deepmind.google/models/gemini/) | Google DeepMind's flagship coding model with 1M context. | Hosted API | 80.6% SWE-bench Verified; Gemini 3.5 generation rolling out mid-2026. |
| [GPT-5.4 / GPT-5.5](https://openai.com/index/introducing-gpt-5-5/) | OpenAI's current flagship coding models; both power Codex workflows. | Hosted API | GPT-5.5 released April 2026; strong agentic tool use and long-task efficiency. |
| [Kimi K2.6](https://huggingface.co/moonshotai) | Moonshot AI's ~1T-param MoE open model, 32B active, tuned for coding. | Open weights, Hosted API | Modified MIT license; released April 2026; strong agentic stability. |
| [MiniMax M3](https://github.com/MiniMax-AI) | MiniMax's open-weight model combining frontier coding, 1M context, and multimodality. | Open weights, Hosted API | Released June 2026; exceptionally cost-effective for its benchmark tier. |
| [Qwen3.8](https://github.com/QwenLM/Qwen3.8) | Alibaba's open-weight line; Qwen3.8 is aimed at coding, research and long-horizon agent tasks. | Open weights, Hosted API | 27B dense and 2.4T-A95B MoE; the repo is Apache 2.0, and each model card carries its own terms. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Anthropic Claude Code Docs](https://code.claude.com/docs) | Official Claude Code documentation covering best practices, hooks, subagents, and MCP. | Web | Primary reference; covers agentic patterns and configuration in depth. |
| [awesome-claude-code (hesreallyhim)](https://github.com/hesreallyhim/awesome-claude-code) | Curated list of skills, hooks, slash-commands, and orchestrators for Claude Code. | Web | High signal-to-noise; community-maintained. |
| [Claude Code: A Highly Agentic Coding Assistant](https://www.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant) | DeepLearning.AI short course on agentic coding patterns with Claude Code. | Web | Taught by Elie Schoppik, Anthropic Head of Technical Education. |
| [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | Community guide covering Claude Code from beginner to power user with templates. | Web | Production-ready templates, workflow guides, and a cheatsheet. |
| [OpenAI Codex Docs](https://learn.chatgpt.com/docs/codex/cli) | Official Codex CLI documentation, quickstarts, and API integration guides. | Web | Useful companion when routing tasks between Claude Code and Codex CLI. |
| [Devhints](https://devhints.io/) | Concise cheat sheets for developer tools, languages and frameworks. | Web | Community-maintained; source is on GitHub under rstacruz/cheatsheets. |
