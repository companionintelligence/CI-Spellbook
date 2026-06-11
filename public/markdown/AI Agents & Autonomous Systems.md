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

## Agent Frameworks & Orchestration

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AutoGen](https://github.com/microsoft/autogen) | Microsoft's multi-agent conversation framework; includes the Magentic-One multi-agent system. | Cross-platform | Mature ecosystem; Magentic-One adds a capable out-of-box multi-agent setup. |
| [CrewAI](https://github.com/crewAIInc/crewAI) | Role-based multi-agent framework for collaborative task workflows. | Cross-platform | 44k+ stars; fast to prototype; teams often graduate to LangGraph for prod. |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Graph-based stateful agent runtime; default engine for all LangChain agents. | Cross-platform | 10k+ stars; strong audit/rollback story; preferred for production deployments. |
| [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) | Production-ready multi-agent SDK with handoffs, guardrails, and built-in tracing. | Cross-platform | Supersedes OpenAI Swarm; v0.17+ adds sandbox execution and subagent primitives. |
| [PydanticAI](https://github.com/pydantic/pydantic-ai) | Type-safe Python agent framework built on Pydantic with concise, validated tool calls. | Cross-platform | Hit v1 in late 2025; ~16k stars; less boilerplate than LangGraph for simple flows. |
| [smolagents](https://github.com/huggingface/smolagents) | Minimal code-first agent library from Hugging Face; agents express actions as Python code. | Cross-platform | 26k+ stars; ~1k-line core; model-agnostic; excellent for teaching and rapid prototyping. |

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
| [Agntcy Directory](https://github.com/agntcy/dir) | Distributed directory for publishing, storing, and discovering AI agent records across a peer-to-peer network. | Self-hosted | Strong fit for capability-based agent discovery and knowledge exchange. |
| [Agent Directory Protocol](https://github.com/agntcy/dir-spec) | Technical specification for the Agntcy directory service and interoperable agent record exchange. | Cross-platform | Helpful when implementing compatible directory tooling and integrations. |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | Privacy-focused assistant for documents, retrieval, and workspace-based chat. | Cross-platform | Easy entry point for local RAG. |
| [DeepSearcher](https://github.com/zilliztech/deep-searcher) | Open-source deep research assistant for private data using agentic search loops. | Cross-platform | Best for search-heavy investigation flows over internal corpora. |
| [DocsGPT](https://github.com/arc53/DocsGPT) | Private AI platform for search, documents, and built-in agent tools. | Cross-platform, Self-hosted | Useful for internal documentation assistants. |
| [GPT Researcher](https://github.com/assafelovic/gpt-researcher) | Autonomous research agent that gathers, analyzes, and structures sources. | Cross-platform, Self-hosted | Strong report-generation workflow; widely used for deep-research pipelines. |
| [kotaemon](https://github.com/Cinnamon/kotaemon) | Document-centric RAG workspace for chatting with files and reports. | Self-hosted | Good for knowledge-heavy teams. |
| [PaperQA2](https://github.com/Future-House/paper-qa) | Retrieval stack for high-accuracy answers over research papers. | Cross-platform | Strong fit for scientific work. |
| [R2R](https://github.com/SciPhi-AI/R2R) | Production retrieval system with agentic RAG APIs. | Web, Self-hosted | Suitable for app backends needing a complete retrieval layer. |
| [RAGFlow](https://github.com/infiniflow/ragflow) | Full RAG engine that pairs retrieval with agent workflows. | Self-hosted | Strong when you need a complete context layer. |
| [STORM](https://github.com/stanford-oval/storm) | Research system for topic exploration and report synthesis with citations. | Cross-platform | Good for long-form knowledge curation. |
| [Verba](https://github.com/weaviate/Verba) | Weaviate-powered retrieval chatbot framework. | Self-hosted | Good for teams already using Weaviate. |

## Agent Memory & Context

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Airweave](https://github.com/airweave-ai/airweave) | Context retrieval layer that syncs fragmented data sources for AI agents. | Cross-platform | Good for connecting fragmented sources into a unified agent context. |
| [mem0](https://github.com/mem0ai/mem0) | Persistent memory layer for agents and assistants with user-level recall. | Self-hosted | Strong fit for user-specific memory across sessions. |
| [omi](https://github.com/BasedHardware/omi) | Wearable capture device for continuous speech transcription and passive context. | Mobile | Best for passive lifelog-style context capture. |
| [screenpipe](https://github.com/mediar-ai/screenpipe) | Local activity capture layer for search, recall, and automation triggers. | macOS, Windows | A strong base for personal context systems. |

## Model, Eval & Prompt Infrastructure

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Agno](https://github.com/agno-agi/agno) | CLI framework for building and operating agentic software at scale. | Cross-platform | Good for app and agent backends. |
| [Kiln](https://github.com/Kiln-AI/Kiln) | Toolkit for evals, fine-tuning, synthetic data, and MCP-aware systems. | Cross-platform | Useful when teams need a full iteration loop. |
| [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) | Fine-tuning workstation supporting many LLMs and VLMs with a unified interface. | Self-hosted | One of the most complete open tuning stacks. |
| [Ludwig](https://github.com/ludwig-ai/ludwig) | Low-code framework for custom model building and experimentation. | Cross-platform | Good when teams want lower-friction experimentation. |
| [Opik](https://github.com/comet-ml/opik) | Tracing, evaluation, and monitoring for LLM and agent workflows. | Self-hosted, Web | Strong observability layer for production AI. |
| [PyTorch Lightning](https://github.com/Lightning-AI/pytorch-lightning) | Training framework for large-scale model development. | Cross-platform | A solid foundation for serious model work. |
| [Second Me](https://github.com/mindverse/Second-Me) | Platform for training a personalized AI identity and interaction layer. | Self-hosted, Web | Useful for persistent persona experiments. |

## AI Utilities & Desktop Context

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Everywhere](https://github.com/DearVa/Everywhere) | Context-aware desktop assistant with MCP-style tool integrations. | Windows | Good for desktop-level context workflows. |
| [Netron](https://github.com/lutzroeder/netron) | Visualizer for neural network models and artifacts. | Cross-platform | Useful for inspecting model internals. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Claude Fable 5 / Opus 4.8](https://www.anthropic.com/news/claude-fable-5-mythos-5) | Anthropic's flagship tier: Fable 5 is the widest-release Mythos-class model; Opus 4.8 leads the Opus tier for agentic coding. | Hosted API | Fable 5 GA June 2026; current top published results on agentic coding benchmarks. |
| [DeepSeek V4](https://huggingface.co/deepseek-ai) | DeepSeek's open-weight family (V4-Pro 1.6T MoE, V4-Flash 284B); released April 2026. | Open weights, Hosted API | 80.6% SWE-bench Verified; MIT-licensed; strong coding and tool-call accuracy. |
| [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models) | Google's current GA frontier model; optimized for agentic and coding tasks at scale. | Hosted API | Default Gemini model since May 2026; Gemini 3.5 Pro announced at I/O, GA pending. |
| [GLM-5.1](https://huggingface.co/zai-org/GLM-5) | Z.ai's open-weight MoE flagship (745B) specialised for agentic engineering. | Open weights, Hosted API | Tops SWE-Bench Pro among open models; MIT license is a differentiator for fine-tuning. |
| [GPT-5.5](https://openai.com/index/introducing-gpt-5-5/) | OpenAI's current flagship; iterative release atop the GPT-5 base with enhanced reasoning. | Hosted API | Released April 2026; strong at agentic coding, computer use, and knowledge work. |
| [Grok 4.3](https://x.ai/news) | xAI's production flagship model balancing reasoning density with API throughput. | Hosted API | Strong tool-calling; API access live from May 2026. |
| [Kimi K2.6](https://huggingface.co/moonshotai) | Moonshot AI's open-weight MoE family; ~1T params / 32B active; coding-focused. | Open weights, Hosted API | Leads SWE-Bench Pro among open models with GLM-5.1; 256K context; modified MIT. |
| [Llama 4 Scout / Maverick](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) | Meta's multimodal MoE family: Scout (17B active, 10M context) and Maverick (full quality). | Open weights | Llama Community License; Scout fits on a single H100; broad fine-tuning adoption. |
| [Mistral Small 4](https://mistral.ai/news/mistral-small-4/) | Mistral's small model unifying reasoning, multimodal, and agentic coding capabilities. | Open weights, Hosted API | ~120B total / 6B active MoE; Apache 2.0; merges the Magistral/Pixtral/Devstral trio. |
| [Qwen3.6](https://github.com/QwenLM/Qwen3.6) | Alibaba's current open-weight family: 27B dense and 35B-A3B MoE; Max-Preview is hosted-only. | Open weights, Hosted API | Apache 2.0; the 27B dense model is frontier-competitive on agentic coding. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Anthropic: Building Effective AI Agents](https://www.anthropic.com/research/building-effective-agents) | Anthropic's canonical guide to agent design patterns, workflows, and production considerations. | Web | The primary reference for Claude-based agent architecture; updated regularly. |
| [DeepLearning.AI: Agent Skills with Anthropic](https://www.deeplearning.ai/courses/agent-skills-with-anthropic/) | Short course on building Claude agents, covering MCP, Claude Code, and the Agent SDK. | Web | Up to date with the 2026 Claude platform; good on-ramp for new developers. |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction) | Free multi-unit course on building agents with smolagents, LangGraph, and tool use. | Web | Covers code agents, multi-agent systems, and tool integration; actively maintained. |
| [OpenAI: Practical Guide to Building Agents](https://openai.com/index/new-tools-for-building-agents/) | OpenAI's practical reference for the Agents SDK, handoffs, guardrails, and tracing. | Web | Essential reading for teams using the OpenAI Agents SDK in production. |
| [Awesome AI Agents (e2b)](https://github.com/e2b-dev/awesome-ai-agents) | Curated list of AI agents, frameworks, and tools with categorised links. | Web | Broadly maintained community list; good for discovery across the ecosystem. |
