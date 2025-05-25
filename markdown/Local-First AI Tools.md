# Local-First AI Tools

> **Build a private AI workstation with zero cloud dependencies**  
> This comprehensive guide catalogs leading open-source, local-first AI tools organized by category.  
> Pick your stack: choose an LLM runner (e.g., Ollama or llama.cpp), add a chat UI (OpenWebUI or Text-Gen WebUI), connect data with RAG suites, and layer on agents or automations.  
> Every entry links to project pages or repos for quick access to docs, downloads, and community support.
>
> **Key benefits of local-first AI:**
> - **Privacy**: Your data never leaves your device
> - **No usage fees**: Run unlimited queries without per-token costs
> - **Offline capability**: Work without internet connectivity
> - **Customization**: Fine-tune models for your specific domain
> - **Ownership**: Full control over models, data, and infrastructure

## Local-First AI Tools Directory

Below is a quick-reference directory of leading local-first AI tools grouped by function. Use it as a jump-off for building or expanding a home workstation stack—every entry links to the project’s home page or GitHub repo so you can dive straight into docs, downloads, and community.

### How to use this table

- **Pick a backbone** – choose an LLM runner that matches your hardware.  
- **Add a chat UI** – wire it to a browser-based front-end.  
- **Attach data** – hook up RAG (Retrieval-Augmented Generation) pipelines.  
- **Automate tasks** – layer on no-code or agent frameworks for workflows.  
- **Expand creatively** – spin up image and diffusion UIs.  
- **Scale & train** – integrate local vector DBs and fine-tuning tooling.

### LLM Runners / Hosting

| Tool      | Description |
|-----------|-------------|
| **Ollama**  
🔗 [ollama.com](https://ollama.com)  
🪪 MIT | Simple local LLM runner with one-line model downloads and REST API. Great for desktop and dev use. |
| **LM Studio**  
🔗 [lmstudio.ai](https://lmstudio.ai)  
🪪 AGPL-3.0 | Cross-platform GUI for running, managing, and chatting with local LLMs. Supports many model formats. |
| **llama.cpp**  
🔗 [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)  
🪪 MIT | Fast, portable C/C++ inference engine for Llama-family and compatible models. CLI and server modes. |
| **KoboldCpp**  
🔗 [LostRuins/koboldcpp](https://github.com/LostRuins/koboldcpp)  
🪪 AGPL-3.0 | Easy-to-use LLM runner with web UI, story mode, and GPU/CPU support. Focused on creative writing. |
| **GPT4All**  
🔗 [nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)  
🪪 Apache-2.0 | Multi-platform LLM runner and chat UI. Supports many models, with easy install and local vector DB. |

### Chat UI / Front-Ends

| Tool      | Description |
|-----------|-------------|
| **OpenWebUI**  
🔗 [open-webui/open-webui](https://github.com/open-webui/open-webui)  
🪪 AGPL-3.0 | Modern, extensible web chat UI for local LLMs (Ollama, llama.cpp, etc). Multi-user, plugin support. |
| **Text-Generation WebUI**  
🔗 [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)  
🪪 AGPL-3.0 | Feature-rich web UI for running, chatting, and experimenting with local LLMs. Huge extension ecosystem. |
| **SillyTavern**  
🔗 [SillyTavern/SillyTavern](https://github.com/SillyTavern/SillyTavern)  
🪪 GPL-3.0 | Roleplay and character-focused chat UI for local and remote LLMs. Integrates with KoboldCpp, OAI, and more. |

### Knowledge-Base / RAG Suites

| Tool      | Description |
|-----------|-------------|
| **AnythingLLM**  
🔗 [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm)  
🪪 AGPL-3.0 | Plug-and-play RAG suite for connecting docs, files, and data to local or remote LLMs. Easy setup, web UI. |
| **Haystack**  
🔗 [deepset-ai/haystack](https://github.com/deepset-ai/haystack)  
🪪 Apache-2.0 | Flexible Python framework for building RAG, search, and question-answering pipelines. Many integrations. |
| **Dify**  
🔗 [langgenius/dify](https://github.com/langgenius/dify)  
🪪 Apache-2.0 | All-in-one platform for building RAG, chatbots, and agent workflows. Web UI, API, and multi-model support. |

## Example Workstation Setup

> Build a minimal local AI workstation with this example stack:
>
>- Install **llama.cpp** for lightweight model inference and **Ollama** for REST API serving.
>- Deploy **OpenWebUI** at [http://localhost:3000](http://localhost:3000) for browser-based chat.
>- Connect **Qdrant** for embedding storage and fast vector search.
>- Orchestrate workflows with **n8n** to automate data ingestion, Slack notifications, or email alerts.
>- Launch **ComfyUI** for image diffusion pipelines and creative prototyping.

## Recommended Usage Patterns

1. Start with a core LLM runner and chat UI to validate basic text workflows.
2. Layer on a vector database and RAG suite for context-aware agents.
3. Integrate no-code builders or agent frameworks for multi-step automations.
4. Add creative UIs (image, video) as needed for multimodal pipelines.
5. Monitor resource usage and scale components (e.g., GPU runners, DB nodes) based on workload.

#### How to use these tables

- Pick a backbone – choose an LLM runner (Ollama or llama.cpp) that fits your hardware.
- Add a chat UI – wire it to OpenWebUI or Text-Gen WebUI for a browser-based experience.
- Attach data or workflows – AnythingLLM or Haystack for RAG; Flowise or n8n for orchestration.
- Layer on agents and automations – CrewAI / AutoGen for multi-step tasks; n8n triggers to integrate email, Slack, or IoT.
- Spin up creative tools – ComfyUI or Stable-Diffusion WebUI for image pipelines.
- Persist vectors & fine-tune – drop Qdrant/Chroma alongside Axolotl or H2O LLM Studio when you’re ready to train or store embeddings.

Mix-and-match to suit your goals—everything here is open-source and self-hostable, letting you craft a private, powerful AI workstation without relying on cloud APIs.
