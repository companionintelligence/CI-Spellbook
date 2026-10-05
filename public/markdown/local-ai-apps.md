# Local AI Apps, Model Managers & AI Clients

> If you want an AI stack that runs close to your data, this is the field guide: inference runtimes, desktop clients, model managers, on-device tools, and privacy-first assistants.

## Inference Runtimes & Servers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Lemonade](https://github.com/lemonade-sdk/lemonade) | AMD-sponsored local LLM server routing to CPU, GPU, or NPU via llama.cpp. | Cross-platform | Good choice for AMD hardware; OpenAI-compatible API. |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | C++ inference engine for GGUF models; runs on CPU, CUDA, Metal, and more. | Cross-platform | The engine under many tools; use directly for edge or custom deployments. |
| [llamafile](https://github.com/mozilla-ai/llamafile) | Single-executable LLM distribution format from Mozilla; double-click to run. | Cross-platform | Simplest path to a fully offline model with zero setup. |
| [LocalAI](https://github.com/mudler/LocalAI) | OpenAI-compatible REST API gateway routing to multiple local backends. | Self-hosted | Good when you want one API endpoint across many model backends. |
| [mlx-lm](https://github.com/ml-explore/mlx-lm) | Apple MLX Python package for running and fine-tuning LLMs on Apple Silicon. | macOS | Fastest path for LLMs on M-series hardware. |
| [Ollama](https://github.com/ollama/ollama) | Popular model runner for local LLMs and embeddings; OpenAI-compatible API. | Cross-platform, Self-hosted | The default starting point for most local stacks; v0.24 as of May 2026. |
| [vLLM](https://github.com/vllm-project/vllm) | High-throughput LLM serving with PagedAttention and continuous batching. | Self-hosted, Linux | Best choice for multi-user or production GPU serving; ~20x Ollama throughput. |

## LLM Clients & Desktop GUIs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [5ire](https://github.com/nanbingxyz/5ire) | Cross-platform AI client with MCP support and local knowledge features. | Cross-platform | Good option for teams using mixed providers. |
| [Chatbox](https://github.com/chatboxai/chatbox) | Polished desktop AI client for multiple providers. | Cross-platform | Clean general-purpose chat client. |
| [Cherry Studio](https://github.com/CherryHQ/cherry-studio) | AI productivity studio with assistants, smart chat, and local model support. | Cross-platform | Strong fit for multi-assistant setups. |
| [DeepChat](https://github.com/ThinkInAIXYZ/deepchat) | Personal-world assistant with desktop integrations. | Cross-platform | Useful when local context matters. |
| [GPT4ALL](https://github.com/nomic-ai/gpt4all) | Desktop app for running local models on consumer hardware. | Cross-platform | One of the simplest local-model entry points. |
| [Jan](https://github.com/janhq/jan) | Open-source ChatGPT alternative focused on local-first usage. | Cross-platform | Good UX for experimenting with offline models. |
| [LibreChat](https://github.com/LibreChat-AI/LibreChat) | Flexible self-hosted chat platform with agents, tools, and model switching. | Self-hosted | Good when a team wants one shared AI hub. |
| [NextChat](https://github.com/ChatGPTNextWeb/NextChat) | Lightweight AI assistant spanning desktop and web-style use. | Cross-platform, Web | Good fit for simpler chat-centric workflows. |
| [Onyx](https://github.com/onyx-dot-app/onyx) | Open-source AI platform for chat, search, and advanced workflows. | Self-hosted | Strong fit for internal AI platforms. |
| [Open WebUI](https://github.com/open-webui/open-webui) | Friendly interface for local or hosted model backends. | Self-hosted | One of the most widely used local AI frontends. |
| [Pinokio](https://github.com/pinokiocomputer/pinokio) | One-click browser for installing and running local AI apps without coding. | Cross-platform | Great for discovering and running community AI tools locally. |
| [SillyTavern](https://github.com/SillyTavern/SillyTavern) | Power-user frontend for model interaction and prompt customization. | Self-hosted | Best for highly customized conversational setups. |
| [SurfSense](https://github.com/MODSetter/SurfSense) | Team-oriented alternative to NotebookLM. | Self-hosted | Good for research and shared context. |
| [TextGen (formerly text-generation-webui)](https://github.com/oobabooga/textgen) | Desktop app for local LLMs: chat, vision, tool-calling and an OpenAI-compatible API. | Windows, macOS, Linux | Open source with no telemetry; one of the classic local inference frontends. |
| [tgpt](https://github.com/aandrew-me/tgpt) | Simple terminal chatbot client. | CLI | Great when you want chat without GUI overhead. |

## Local Model Managers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [KoboldCpp](https://github.com/LostRuins/koboldcpp) | Single-binary GGUF runner with UI support. | Cross-platform, Self-hosted | Good for lightweight local inference. |
| [StabilityMatrix](https://github.com/LykosAI/StabilityMatrix) | Manager for Stable Diffusion and other generative AI tools and models. | Cross-platform | Useful when image tools sprawl across multiple apps. |

## Assistants, Memory & Context

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Leon](https://github.com/leon-ai/leon) | Open-source personal assistant platform. | Self-hosted | Good if you want a self-hosted assistant shell. |
| [Meetily](https://github.com/Zackriya-Solutions/meetily) | Local meeting assistant with transcription and summarization. | Windows, macOS | Strong for offline meeting notes. |
| [mem0](https://github.com/mem0ai/mem0) | Reusable memory layer for agents and apps. | Self-hosted | Good backend building block for personalization. |
| [screenpipe](https://github.com/screenpipe/screenpipe) | Records and indexes on-device activity for search and automation. | macOS, Windows | Powerful if you want searchable personal context. |

## Local-First Knowledge & Document Workflows

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | Workspace-driven chat with document ingestion and local model support. | Cross-platform | Great bridge between local models and document QA. |
| [DocsGPT](https://github.com/arc53/DocsGPT) | Chat with private documents and datasets. | Cross-platform, Self-hosted | Good for internal documentation portals. |
| [kotaemon](https://github.com/Cinnamon/kotaemon) | RAG workbench for document collections. | Self-hosted | Strong fit for teams with PDFs and reports. |
| [PaperQA2](https://github.com/Future-House/paper-qa) | Scientific retrieval and citation workflows. | Cross-platform | Good for research-heavy local pipelines. |
| [Reor](https://github.com/reorproject/reor) | Private, local AI personal knowledge manager. | Cross-platform | Archived by its owner (read-only). Nice fit for knowledge workers who prefer offline tools. |

## Proprietary Tools Worth Knowing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [JetBrains](https://www.jetbrains.com/) | Commercial IDE suite with growing AI integrations. | Cross-platform | Still a top choice for language-specific IDE workflows. |
| [LM Studio](https://lmstudio.ai/) | Desktop app for discovering, downloading, and serving local models. | Cross-platform | Strong UX for local model experimentation. |
| [Obsidian](https://obsidian.md/) | Flexible knowledge app with a large plugin ecosystem. | Cross-platform | Pairs well with local AI plugins and vault-based workflows. |
| [Raycast](https://www.raycast.com/) | Launcher and productivity layer with AI extensions. | macOS | Useful as a local command surface for many AI tasks. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [DeepSeek R1](https://github.com/deepseek-ai/DeepSeek-R1) | Reasoning model; 671B MoE full or distilled 1.5B–70B variants. | Open weights | Distilled variants run well on consumer hardware. |
| [DeepSeek V4](https://huggingface.co/deepseek-ai) | DeepSeek's MoE flagship family; V4-Flash (284B, 13B active) suits strong local rigs. | Open weights | Released April 2026; MIT; strong coding and reasoning. |
| [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) | Google multimodal open family: E2B, E4B, 12B, 26B-A4B, and 31B variants. | Open weights | Released April 2026 under Apache 2.0; E-variants run well on-device. |
| [Granite 4](https://huggingface.co/ibm-granite) | IBM's hybrid Mamba/Transformer family designed for efficient enterprise and edge use. | Open weights | Apache 2.0; small variants are strong on modest hardware. |
| [Kimi K2.6](https://huggingface.co/moonshotai) | Moonshot AI MoE; ~1T params / 32B active, 256K context, vision. | Open weights | Tops open-weight agentic coding benchmarks; needs serious hardware. |
| [Llama 4 Scout](https://github.com/meta-llama/llama-models) | Meta MoE; 109B total / 17B active, 10M-token context, multimodal. | Open weights | Unique for extremely long-context local use cases. |
| [MiniMax M3](https://github.com/MiniMax-AI) | Open-weight model combining frontier coding, 1M context, and native multimodality. | Open weights | Released June 2026; exceptional context-length-to-cost ratio. |
| [Mistral Small 4](https://huggingface.co/mistralai) | ~120B MoE (6B active) merging reasoning, vision, and coding in one model. | Open weights | Released March 2026; Apache 2.0; replaces Magistral/Pixtral/Devstral trio. |
| [Phi-4](https://huggingface.co/microsoft/phi-4) | Microsoft 14B dense model; strong STEM and reasoning per parameter. | Open weights | Phi-4-mini (3.8B) is a strong on-device reasoning option. |
| [Qwen3](https://github.com/QwenLM/Qwen3) | Alibaba MoE; 235B total / 22B active; spans 0.6B edge to 235B flagship. | Open weights | Generally rated best overall open-weight family as of mid-2026. |
| [SmolLM3](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) | HuggingFace 3B fully open instruct/reasoning model; outperforms Llama 3.2-3B. | Open weights | Good for edge and mobile; SmolLM2 family goes down to 135M. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Build a Local AI Stack from Scratch](https://www.mindstudio.ai/blog/build-local-ai-stack-ollama-to-vllm-step-by-step) | Step-by-step guide from Ollama through vLLM for production serving. | Web | Covers the full developer journey from prototype to scale. |
| [llama.cpp — Zero to Production](https://atalupadhyay.wordpress.com/2026/04/01/running-local-ai-mastering-llama-cpp-from-zero-to-production/) | Practical walkthrough of llama.cpp from install to serving. | Web | Good reference for low-level control of inference. |
| [Local LLMs 2026 — Complete Developer Guide](https://www.sitepoint.com/run-local-llms-2026-complete-developer-guide/) | SitePoint overview of hardware, tools, and model selection for 2026. | Web | Good orientation article if you're new to local LLM stacks. |
| [MLX for Apple Silicon — WWDC25](https://developer.apple.com/videos/play/wwdc2025/298/) | Apple's official session on running LLMs on-device with MLX. | Web | Essential if you build for Apple platforms. |
| [Ollama 11-Step Tutorial](https://tech-insider.org/ollama-tutorial-run-llm-locally-2026/) | Hands-on walkthrough covering REST API, Python, Docker, and optimization. | Web | Recommended first read for Ollama newcomers. |
