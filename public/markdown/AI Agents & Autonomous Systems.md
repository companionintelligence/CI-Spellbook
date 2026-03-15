# AI Agents, Research & Model Systems

> A practical map of the current AI toolchain: agents, orchestration frameworks, RAG stacks, research tools, and model-building platforms.

## Agent Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AgentGPT](https://github.com/reworkd/AgentGPT) | Browser-based interface for assembling and running autonomous agents. | Self-hosted | Good for quick experiments and demos. |
| [AgenticSeek](https://github.com/Fosowl/agenticSeek) | Local-first autonomous agent focused on browsing, reasoning, and task execution without recurring API costs. | Cross-platform | Strong fit for private local workflows. |
| [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) | General-purpose autonomous agent framework with long-running task execution. | Self-hosted | Best when you want a flexible agent sandbox. |
| [Browser Use](https://github.com/browser-use/browser-use) | Browser automation stack that makes websites easier for agents to navigate. | Cross-platform | Useful for agentic web tasks and testing. |
| [c/ua](https://github.com/trycua/cua) | Infrastructure for computer-use agents across desktop environments. | Cross-platform | Focused on sandboxes, SDKs, and evaluation. |
| [Claudia](https://github.com/getAsterisk/claudia) | GUI and toolkit for Claude Code workflows and background agents. | Cross-platform | Helpful when you want a more visual agent workflow. |
| [Crush](https://github.com/charmbracelet/crush) | Terminal-first agentic coding experience with a polished TUI. | Cross-platform | Strong fit for keyboard-driven workflows. |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Open-source terminal agent built around Gemini models. | Cross-platform | Good for shell-heavy development loops. |
| [gptme](https://github.com/gptme/gptme) | Terminal-native personal agent with tools, web access, and coding support. | Cross-platform | Lightweight option for persistent local agents. |
| [Huginn](https://github.com/huginn/huginn) | Event-driven agent platform for monitoring, scraping, and automation. | Self-hosted | More automation-oriented than chat-oriented. |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Browser extension for AI-powered automation inside Chrome. | Chromium | Useful for quick multi-agent web flows. |
| [Open Interpreter](https://github.com/OpenInterpreter/open-interpreter) | Natural language interface for running code and controlling a computer. | Cross-platform | Strong for terminal and desktop task execution. |
| [opencode](https://github.com/sst/opencode) | Open-source coding agent with a focused developer workflow. | Cross-platform | Built for software tasks rather than general chat. |
| [Refact](https://github.com/smallcloudai/refact) | Engineering agent that plans, executes, and iterates across developer tools. | VS Code | Good fit for end-to-end software tasks. |
| [TEN Agent](https://github.com/TEN-framework/TEN-Agent) | Framework for conversational voice agents. | Self-hosted | Useful when voice is the main interface. |
| [UI-TARS](https://github.com/bytedance/UI-TARS-desktop) | Multimodal agent stack for UI understanding and agent infrastructure. | Cross-platform | Good for computer-use and UI-driven automation. |
| [WrenAI](https://github.com/Canner/WrenAI) | Natural-language analytics and BI assistant for databases. | Web, Self-hosted | Strong when analytics is the user-facing agent. |

## All-in-One AI Workspaces

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AIChat](https://github.com/sigoden/aichat) | Unified CLI for chat, shell assistance, RAG, and tool use. | Cross-platform | Great one-binary option for power users. |
| [ClaraVerse](https://github.com/badboysm890/ClaraVerse) | Privacy-focused ecosystem combining chat, workflow automation, and media generation. | Cross-platform, Self-hosted | Ambitious all-in-one open stack. |
| [Khoj AI](https://github.com/khoj-ai/khoj) | Personal AI workspace with agents, automation, web search, and local or hosted models. | Web, Self-hosted | Strong fit for knowledge-heavy workflows. |
| [LobeHub](https://github.com/lobehub/lobehub) | Agent-centric workspace for building and collaborating with AI teammates. | Web, Self-hosted | Good for team-oriented agent experiences. |

## RAG, Knowledge & Research

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | Privacy-focused assistant for documents, retrieval, and workspace-based chat. | Cross-platform | Easy entry point for local RAG. |
| [DocsGPT](https://github.com/arc53/DocsGPT) | Private AI platform for search, documents, and built-in agent tools. | Cross-platform, Self-hosted | Useful for internal documentation assistants. |
| [kotaemon](https://github.com/Cinnamon/kotaemon) | Document-centric RAG workspace for chatting with files and reports. | Self-hosted | Good for knowledge-heavy teams. |
| [PaperQA2](https://github.com/Future-House/paper-qa) | Retrieval stack for high-accuracy answers over research papers. | Cross-platform | Strong fit for scientific work. |
| [R2R](https://github.com/SciPhi-AI/R2R) | Production retrieval system with agentic RAG APIs. | Web, Self-hosted | Suitable for app backends. |
| [RAGFlow](https://github.com/infiniflow/ragflow) | Full RAG engine that pairs retrieval with agent workflows. | Self-hosted | Strong when you need a complete context layer. |
| [Verba](https://github.com/weaviate/Verba) | Weaviate-powered retrieval chatbot framework. | Self-hosted | Good for teams already using Weaviate. |
| [DeepSearcher](https://github.com/zilliztech/deep-searcher) | Open-source deep research assistant for private data. | Cross-platform | Best for search-heavy investigation flows. |
| [GPT Researcher](https://github.com/assafelovic/gpt-researcher) | Autonomous research agent that gathers, analyzes, and structures sources. | Cross-platform, Self-hosted | Strong report-generation workflow. |
| [STORM](https://github.com/stanford-oval/storm) | Research system for topic exploration and report synthesis with citations. | Cross-platform | Good for long-form knowledge curation. |

## Model, Eval & Prompt Infrastructure

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Agno](https://github.com/agno-agi/agno) | CLI framework for building and operating agentic software at scale. | Cross-platform | Good for app and agent backends. |
| [Kiln](https://github.com/Kiln-AI/Kiln) | Toolkit for evals, fine-tuning, synthetic data, and MCP-aware systems. | Cross-platform | Useful when teams need a full iteration loop. |
| [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) | Fine-tuning workstation for many LLMs and VLMs. | Self-hosted | One of the most complete open tuning stacks. |
| [Ludwig](https://github.com/ludwig-ai/ludwig) | Low-code framework for custom model building. | Cross-platform | Good when teams want lower-friction experimentation. |
| [Opik](https://github.com/comet-ml/opik) | Tracing, evaluation, and monitoring for LLM and agent workflows. | Self-hosted, Web | Strong observability layer for production AI. |
| [PyTorch Lightning](https://github.com/Lightning-AI/pytorch-lightning) | Training framework for large-scale model development. | Cross-platform | A solid foundation for serious model work. |
| [Second Me](https://github.com/mindverse/Second-Me) | Platform for training a personalized AI identity and interaction layer. | Self-hosted, Web | Useful for persistent persona experiments. |

## AI Utilities & Context Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Airweave](https://github.com/airweave-ai/airweave) | Context retrieval layer for AI agents. | Cross-platform | Good for connecting fragmented sources. |
| [mem0](https://github.com/mem0ai/mem0) | Memory layer for agents and assistants. | Self-hosted | Strong fit for user-specific recall. |
| [Netron](https://github.com/lutzroeder/netron) | Visualizer for neural network models and artifacts. | Cross-platform | Useful for inspecting model internals. |
| [Everywhere](https://github.com/DearVa/Everywhere) | Context-aware desktop assistant with MCP-style tool integrations. | Windows | Good for desktop-level context workflows. |
| [omi](https://github.com/BasedHardware/omi) | Wearable capture device for continuous speech and transcription. | Mobile | Best for passive context capture. |
| [screenpipe](https://github.com/mediar-ai/screenpipe) | Local activity capture layer for search, recall, and automation. | macOS, Windows | A strong base for personal context systems. |
