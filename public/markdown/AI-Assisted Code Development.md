# AI-Assisted Code Development

This section highlights open-source and commercial tools that leverage AI to improve developer productivity, code quality, and collaboration. You'll find both model-based code generators and smart assistants that integrate into your IDE or CI/CD pipelines.

---

## 2026 Highlights: Agentic Coding

The biggest shift in AI-assisted development is the move from **autocomplete** to **agentic coding**—AI that can autonomously write, test, and iterate on code across multiple files while understanding your entire codebase context.

| Tool | Type | Best For | Notes |
|------|------|----------|-------|
| **Claude Code** | CLI Agent | Complex multi-file tasks | Best reasoning, MCP support |
| **Cursor** | IDE | Daily development | Fast, great UX |
| **Windsurf** | IDE | Flow state coding | Free tier, good agentic features |
| **Aider** | CLI Agent | Open source, local models | Works with any LLM |
| **Cline** | VS Code Extension | VS Code users | Agent mode in familiar environment |
| **Devin** | Autonomous Agent | Delegating full tasks | Background execution |
| **Amazon Q Developer** | IDE/CLI | AWS integration | Free tier, security focus |

---

## How to Use This Directory

1. Identify your workflow: choose a tool that best fits your environment (editor, IDE, terminal).
2. Review licensing and deployment options: decide between local self-hosted models, cloud APIs, or hybrid approaches.
3. Integrate with your tooling: install plugins or configure CLI tools as needed.
4. Customize models and prompts: fine-tune open-source models or tailor prompts for your codebase.

---

## Agentic Coding Tools

| Tool | Description | Key Features | Platform Support |
|------|-------------|--------------|------------------|
| **Claude Code (Anthropic)**<br>🔗 [anthropic.com](https://www.anthropic.com/claude-code)<br>🪪 Commercial | Agentic coding assistant that runs in your terminal. Understands full codebase, executes commands, edits files, and supports MCP tools. | Multi-file editing, terminal commands, MCP integration, git-aware, extended thinking | Cross-platform CLI (Max plan) |
| **Cursor**<br>🔗 [cursor.so](https://www.cursor.so/)<br>🪪 Commercial (Free tier) | AI-first code editor with Composer for multi-file agentic editing, codebase chat, and agent mode for autonomous task completion. | Agent mode, Composer, codebase indexing, apply mode, custom models | Desktop (VS Code fork) |
| **Windsurf (Codeium)**<br>🔗 [codeium.com/windsurf](https://codeium.com/windsurf)<br>🪪 Free/Commercial | AI IDE with Cascade—an agentic flow system that maintains context across editing sessions. Supercomplete predicts your next edit. | Cascade agentic flow, Supercomplete, command mode, flows | Desktop (Cross-platform) |
| **Aider**<br>🔗 [paul-gauthier/aider](https://github.com/paul-gauthier/aider)<br>🪪 Apache-2.0 | Terminal-based AI pair programmer. Works with any LLM (local or cloud). Multi-file editing with git integration. | Architect mode, multi-file refactor, Git integration, supports 40+ LLMs, voice mode | Cross-platform CLI |
| **Cline (VS Code)**<br>🔗 [cline.bot](https://cline.bot/)<br>🪪 Apache-2.0 | VS Code extension with autonomous agent capabilities. Can browse web, execute commands, and edit files with human-in-the-loop. | Agent mode, browser use, terminal access, MCP support, multi-model | VS Code Extension |
| **Devin (Cognition)**<br>🔗 [devin.ai](https://devin.ai/)<br>🪪 Commercial | Autonomous AI software engineer that works in background. Handles full tasks from issue to PR. Slack integration. | Autonomous execution, full context, PR creation, Slack integration | Cloud service |
| **OpenHands (ex-OpenDevin)**<br>🔗 [all-hands-ai/OpenHands](https://github.com/all-hands-ai/OpenHands)<br>🪪 MIT | Open-source autonomous AI agent for software development. Runs in sandboxed environment, supports multiple LLMs. | Sandboxed execution, browser automation, multi-model, self-hosted | Docker/Self-hosted |
| **SWE-agent (Princeton)**<br>🔗 [princeton-nlp/SWE-agent](https://github.com/princeton-nlp/SWE-agent)<br>🪪 MIT | Research agent for automatically resolving GitHub issues. Benchmarked on SWE-bench. | Issue resolution, GitHub integration, research-grade | CLI/Research |

## AI Coding Assistants & IDEs

| Tool | Description | Key Features | Platform Support |
|------|-------------|--------------|------------------|
| **GitHub Copilot**<br>🔗 [github.com/features/copilot](https://github.com/features/copilot)<br>🪪 Commercial | Industry-standard AI pair programmer with inline suggestions, chat, and now agent capabilities (Copilot Workspace). | Inline completion, chat, workspace, CLI, PR summaries | VS Code, JetBrains, Neovim, CLI |
| **Amazon Q Developer**<br>🔗 [aws.amazon.com/q/developer](https://aws.amazon.com/q/developer/)<br>🪪 Free/Commercial | AWS's coding assistant with security scanning, inline suggestions, and agent capabilities for AWS tasks. | Security scanning, AWS integration, /dev agent, free tier | VS Code, JetBrains, CLI |
| **Continue**<br>🔗 [continuedev/continue](https://github.com/continuedev/continue)<br>🪪 Apache-2.0 | Open-source AI code assistant for VS Code and JetBrains. Use any model (local or cloud), with full customization. | Any model support, context providers, MCP support, custom commands | VS Code, JetBrains |
| **Codeium**<br>🔗 [codeium.com](https://www.codeium.com/)<br>🪪 Free/Commercial | Fast, privacy-focused code completion. Free for individuals, enterprise deployment options. | Real-time suggestions, chat, context-aware, 70+ languages | 40+ IDEs |
| **Sourcegraph Cody**<br>🔗 [sourcegraph/cody](https://github.com/sourcegraph/cody)<br>🪪 Apache-2.0 | Context-aware AI assistant with deep codebase understanding via Sourcegraph's code graph. | Codebase search, multi-repo context, enterprise search | VS Code, JetBrains, Web |
| **Tabnine**<br>🔗 [tabnine.com](https://www.tabnine.com/)<br>🪪 Commercial | AI code completion with on-premise deployment options. Team training on your codebase. | Private deployment, team learning, whole-line completion | 15+ IDEs |
| **CodeGeeX**<br>🔗 [THUDM/CodeGeeX](https://github.com/THUDM/CodeGeeX)<br>🪪 Apache-2.0 | Open-source multilingual code model (CodeGeeX4 based on GLM-4). IDE plugins and API. | 100+ languages, open weights, free | VS Code, JetBrains |

## Code Models for Local Development

| Model | Size | Description | Best For |
|-------|------|-------------|----------|
| **DeepSeek-Coder-V3**<br>🔗 [deepseek-ai/DeepSeek-Coder-V3](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V3)<br>🪪 MIT | 236B (MoE) | State-of-the-art open code model. Matches GPT-4 on many benchmarks. | Best open model for complex coding |
| **Qwen2.5-Coder-32B**<br>🔗 [Qwen/Qwen2.5-Coder-32B](https://huggingface.co/Qwen/Qwen2.5-Coder-32B)<br>🪪 Apache-2.0 | 32B | Excellent reasoning and code generation. 128K context. | Balance of quality and speed |
| **Codestral (Mistral)**<br>🔗 [mistral.ai/codestral](https://mistral.ai/news/codestral/)<br>🪪 MNPL | 22B | Mistral's code-specialized model. Fast, supports 80+ languages. | Production use, speed |
| **CodeLlama 70B**<br>🔗 [meta-llama/CodeLlama-70b](https://huggingface.co/meta-llama/CodeLlama-70b-hf)<br>🪪 Llama 2 | 70B | Meta's large code model. Infill support, Python specialization available. | Local dev, fine-tuning |
| **StarCoder2-15B**<br>🔗 [bigcode/starcoder2-15b](https://huggingface.co/bigcode/starcoder2-15b)<br>🪪 BigCode-OpenRAIL-M | 15B | Trained on The Stack v2. Good balance of size and capability. | Mid-size local deployment |
| **DeepSeek-Coder-V2-Lite**<br>🔗 [deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct](https://huggingface.co/deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct)<br>🪪 MIT | 16B | Smaller DeepSeek model, runs on consumer hardware. | 16GB+ VRAM local development |
| **Granite-Code (IBM)**<br>🔗 [ibm-granite/granite-3b-code-base](https://huggingface.co/ibm-granite)<br>🪪 Apache-2.0 | 3B-34B | IBM's code models, commercial-friendly license, multiple sizes. | Enterprise, compliance needs |

## Code Analysis & Quality Tools

| Tool | Description | Key Features | Use Cases |
|------|-------------|--------------|-----------|
| **SonarQube**<br>🔗 [sonarqube.org](https://www.sonarqube.org/)<br>🪪 LGPL v3 | Code quality and security analysis with AI-powered suggestions | Static analysis, security hotspots, quality gates | CI/CD integration |
| **Snyk Code**<br>🔗 [snyk.io/product/snyk-code](https://snyk.io/product/snyk-code/)<br>🪪 Commercial | AI-powered security scanning that learns from real vulnerabilities | ML vulnerability detection, IDE integration | Security scanning |
| **CodeRabbit**<br>🔗 [coderabbit.ai](https://coderabbit.ai/)<br>🪪 Commercial | AI code review bot for GitHub/GitLab PRs. Summarizes changes, finds issues. | PR review, summaries, suggestions | Automated code review |
| **Codacy**<br>🔗 [codacy.com](https://www.codacy.com/)<br>🪪 Commercial | Automated code review with AI insights and quality metrics | Automated reviews, duplication detection | Code quality monitoring |

## Terminal & CLI Tools

| Tool | Description | Key Features | Platform Support |
|------|-------------|--------------|------------------|
| **Open Interpreter**<br>🔗 [open-interpreter/open-interpreter](https://github.com/open-interpreter/open-interpreter)<br>🪪 AGPL-3.0 | Run code via natural language in terminal. Computer use, file editing, automation. | Code execution, file ops, computer use, multi-modal | Cross-platform CLI |
| **Shell GPT**<br>🔗 [TheR1D/shell_gpt](https://github.com/TheR1D/shell_gpt)<br>🪪 MIT | Natural language to shell commands. Execute, explain, or generate scripts. | Shell commands, code execution, roles | Cross-platform CLI |
| **AI Shell**<br>🔗 [BuilderIO/ai-shell](https://github.com/BuilderIO/ai-shell)<br>🪪 MIT | Simple CLI for converting natural language to shell commands | Command suggestions, safety confirmations | Cross-platform CLI |
| **LLM CLI**<br>🔗 [simonw/llm](https://github.com/simonw/llm)<br>🪪 Apache-2.0 | CLI for interacting with LLMs. Supports many providers and local models. | Multi-provider, plugins, templates | Cross-platform CLI |

## MCP (Model Context Protocol) Integration

MCP allows AI assistants to securely access tools, data sources, and APIs. Many coding tools now support MCP for extended capabilities.

| MCP Server | Description | Use With |
|------------|-------------|----------|
| **filesystem** | Read/write local files | Claude Code, Cline, Continue |
| **github** | GitHub API access (issues, PRs, repos) | Claude Code, Cline |
| **postgres/sqlite** | Database queries | Claude Code, Cline |
| **playwright** | Browser automation for testing | Claude Code, Cline |
| **memory** | Persistent knowledge storage | Claude Code |
| **fetch** | HTTP requests | Claude Code, Cline |

---

## Example Workflows

### Agentic Coding with Claude Code

```bash
# Install Claude Code (requires Anthropic Max subscription)
npm install -g @anthropic-ai/claude-code

# Start Claude Code in your project
claude

# Example commands in Claude Code:
# "Refactor the authentication module to use JWT instead of sessions"
# "Write tests for the payment processing functions"
# "Fix all TypeScript errors in the src directory"
```

### Aider with Local Models

```bash
# Install aider
pip install aider-chat

# Use with local Ollama model
aider --model ollama/deepseek-coder-v2:16b

# Use with Claude for complex tasks
export ANTHROPIC_API_KEY=your_key
aider --model claude-3-5-sonnet-20241022

# Architect mode for planning
aider --architect --model claude-3-5-sonnet-20241022
```

### Continue with MCP

```json
{
  "models": [
    {
      "title": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022"
    },
    {
      "title": "Local DeepSeek",
      "provider": "ollama",
      "model": "deepseek-coder-v2:16b"
    }
  ],
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Cursor Setup for Agentic Coding

1. Open Cursor Settings → Models
2. Enable "Agent" mode in Composer
3. Configure codebase indexing for full context
4. Use `Cmd/Ctrl+K` for inline edits, `Cmd/Ctrl+L` for chat
5. In Composer, describe multi-file changes and let Agent execute
