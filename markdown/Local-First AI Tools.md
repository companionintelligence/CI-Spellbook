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
| **AnythingLLM**<br>🔗 [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm)<br>🪪 AGPL-3.0 | Plug-and-play RAG suite for connecting docs, files, and data to local or remote LLMs. Easy setup, web UI. |
| **Haystack**<br>🔗 [deepset-ai/haystack](https://github.com/deepset-ai/haystack)<br>🪪 Apache-2.0 | Flexible Python framework for building RAG, search, and question-answering pipelines. Many integrations. |
| **Dify**<br>🔗 [langgenius/dify](https://github.com/langgenius/dify)<br>🪪 Apache-2.0 | All-in-one platform for building RAG, chatbots, and agent workflows. Web UI, API, and multi-model support. |
| **PrivateGPT**<br>🔗 [imartinez/privateGPT](https://github.com/imartinez/privateGPT)<br>🪪 Apache-2.0 | Complete local RAG solution for chatting with documents. Uses Ollama/LlamaCpp with vector databases. |
| **LocalGPT**<br>🔗 [PromtEngineer/localGPT](https://github.com/PromtEngineer/localGPT)<br>🪪 Apache-2.0 | Local document Q&A using GPT models. Ingest PDFs, web pages, and more into a searchable knowledge base. |
| **Quivr**<br>🔗 [QuivrHQ/quivr](https://github.com/QuivrHQ/quivr)<br>🪪 Apache-2.0 | Personal productivity assistant that can ingest and chat with various document types using local LLMs. |
| **Danswer**<br>🔗 [danswer-ai/danswer](https://github.com/danswer-ai/danswer)<br>🪪 MIT | Enterprise-grade RAG system for connecting internal knowledge bases with local LLMs. Slack integration. |

### Vector Databases & Embedding Stores

| Tool      | Description |
|-----------|-------------|
| **Qdrant**<br>🔗 [qdrant/qdrant](https://github.com/qdrant/qdrant)<br>🪪 Apache-2.0 | High-performance vector database with REST API, clustering support, and advanced filtering capabilities. |
| **Chroma**<br>🔗 [chroma-core/chroma](https://github.com/chroma-core/chroma)<br>🪪 Apache-2.0 | AI-native open-source embedding database with Python/JS clients and simple setup. |
| **Weaviate**<br>🔗 [weaviate/weaviate](https://github.com/weaviate/weaviate)<br>🪪 BSD-3-Clause | Vector database with hybrid search, GraphQL API, and built-in NLP modules for local deployment. |
| **Milvus**<br>🔗 [milvus-io/milvus](https://github.com/milvus-io/milvus)<br>🪪 Apache-2.0 | Scalable vector database with high-performance similarity search and cloud-native architecture. |
| **FAISS**<br>🔗 [facebookresearch/faiss](https://github.com/facebookresearch/faiss)<br>🪪 MIT | Facebook's library for efficient similarity search and clustering of dense vectors. CPU/GPU optimized. |
| **Vespa**<br>🔗 [vespa-engine/vespa](https://github.com/vespa-engine/vespa)<br>🪪 Apache-2.0 | Big data serving engine with real-time vector search, ML inference, and structured data querying. |
| **txtai**<br>🔗 [neuml/txtai](https://github.com/neuml/txtai)<br>🪪 Apache-2.0 | All-in-one embeddings database for semantic search, LLM orchestration, and language model workflows. |

### Agent Frameworks & Automation

| Tool      | Description |
|-----------|-------------|
| **CrewAI**<br>🔗 [joaomdmoura/crewAI](https://github.com/joaomdmoura/crewAI)<br>🪪 MIT | Framework for orchestrating role-playing, autonomous AI agents for collaborative task execution. |
| **AutoGen**<br>🔗 [microsoft/autogen](https://github.com/microsoft/autogen)<br>🪪 MIT | Microsoft's framework for building multi-agent conversational AI systems with local LLM support. |
| **LangGraph**<br>🔗 [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)<br>🪪 MIT | Build stateful, multi-actor applications with LLMs using graph-based workflows and local models. |
| **AgentGPT**<br>🔗 [reworkd/AgentGPT](https://github.com/reworkd/AgentGPT)<br>🪪 GPL-3.0 | Autonomous AI agents in your browser. Deploy and configure agents to accomplish goals with local LLMs. |
| **AutoGPT**<br>🔗 [Significant-Gravitas/AutoGPT](https://github.com/Significant-Gravitas/AutoGPT)<br>🪪 MIT | Autonomous GPT-4 agent that can execute tasks, browse the web, and interact with applications. |
| **BabyAGI**<br>🔗 [yoheinakajima/babyagi](https://github.com/yoheinakajima/babyagi)<br>🪪 MIT | Task-driven autonomous agent using LLMs to generate, prioritize, and execute tasks towards a goal. |
| **MetaGPT**<br>🔗 [geekan/MetaGPT](https://github.com/geekan/MetaGPT)<br>🪪 MIT | Multi-agent framework that assigns different roles to GPTs to form a collaborative software entity. |

### Workflow Orchestration & No-Code

| Tool      | Description |
|-----------|-------------|
| **Flowise**<br>🔗 [FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)<br>🪪 Apache-2.0 | Drag-and-drop UI for building LLM flows and chatbots with local models. Visual workflow builder. |
| **LangFlow**<br>🔗 [logspace-ai/langflow](https://github.com/logspace-ai/langflow)<br>🪪 MIT | Visual framework for building multi-agent and RAG applications. No-code LLM app development. |
| **n8n**<br>🔗 [n8n-io/n8n](https://github.com/n8n-io/n8n)<br>🪪 Fair-code | Workflow automation tool with AI integrations, local LLM support, and 350+ pre-built connectors. |
| **Windmill**<br>🔗 [windmill-labs/windmill](https://github.com/windmill-labs/windmill)<br>🪪 AGPL-3.0 | Fast workflow engine and app builder with TypeScript/Python/Go scripts and AI code generation. |
| **Activepieces**<br>🔗 [activepieces/activepieces](https://github.com/activepieces/activepieces)<br>🪪 MIT | Open-source business automation tool with visual flow builder and AI integration capabilities. |
| **Automatisch**<br>🔗 [automatisch/automatisch](https://github.com/automatisch/automatisch)<br>🪪 AGPL-3.0 | Open-source Zapier alternative with multi-step automations and local hosting capabilities. |

### Image Generation & Computer Vision

| Tool      | Description |
|-----------|-------------|
| **ComfyUI**<br>🔗 [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI)<br>🪪 GPL-3.0 | Powerful node-based UI for Stable Diffusion with advanced workflows, custom nodes, and model management. |
| **AUTOMATIC1111**<br>🔗 [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)<br>🪪 AGPL-3.0 | Popular web UI for Stable Diffusion with extensive features, extensions, and model support. |
| **InvokeAI**<br>🔗 [invoke-ai/InvokeAI](https://github.com/invoke-ai/InvokeAI)<br>🪪 Apache-2.0 | Professional-grade Stable Diffusion toolkit with web UI, unified canvas, and workflow management. |
| **Fooocus**<br>🔗 [lllyasviel/Fooocus](https://github.com/lllyasviel/Fooocus)<br>🪪 GPL-3.0 | Simplified Stable Diffusion interface inspired by Midjourney, focusing on ease of use and quality. |
| **Forge**<br>🔗 [lllyasviel/stable-diffusion-webui-forge](https://github.com/lllyasviel/stable-diffusion-webui-forge)<br>🪪 AGPL-3.0 | Optimized fork of AUTOMATIC1111 with better performance, VRAM usage, and advanced features. |
| **Draw Things**<br>🔗 [drawthingsai/draw-things-community](https://github.com/drawthingsai/draw-things-community)<br>🪪 MIT | Native iOS/macOS app for running Stable Diffusion locally with Apple Silicon optimization. |
| **DiffusionBee**<br>🔗 [divamgupta/diffusionbee-stable-diffusion-ui](https://github.com/divamgupta/diffusionbee-stable-diffusion-ui)<br>🪪 Custom | Native macOS app for Stable Diffusion with simple interface and Apple Silicon support. |

### Audio & Speech Processing

| Tool      | Description |
|-----------|-------------|
| **Whisper**<br>🔗 [openai/whisper](https://github.com/openai/whisper)<br>🪪 MIT | OpenAI's robust speech recognition model for transcription and translation in multiple languages. |
| **whisper.cpp**<br>🔗 [ggerganov/whisper.cpp](https://github.com/ggerganov/whisper.cpp)<br>🪪 MIT | High-performance inference of OpenAI's Whisper ASR model in C/C++ with minimal dependencies. |
| **Whisper-WebUI**<br>🔗 [jhj0517/Whisper-WebUI](https://github.com/jhj0517/Whisper-WebUI)<br>🪪 MIT | Web interface for Whisper speech recognition with batch processing and multiple output formats. |
| **Coqui TTS**<br>🔗 [coqui-ai/TTS](https://github.com/coqui-ai/TTS)<br>🪪 MPL-2.0 | Deep learning toolkit for text-to-speech synthesis with voice cloning and multi-language support. |
| **Real-Time Voice Cloning**<br>🔗 [CorentinJ/Real-Time-Voice-Cloning](https://github.com/CorentinJ/Real-Time-Voice-Cloning)<br>🪪 MIT | Clone voices in real-time with just a few seconds of audio using deep learning models. |
| **Bark**<br>🔗 [suno-ai/bark](https://github.com/suno-ai/bark)<br>🪪 MIT | Transformer-based text-to-audio model that can generate highly realistic speech and audio. |
| **Tortoise TTS**<br>🔗 [neonbjb/tortoise-tts](https://github.com/neonbjb/tortoise-tts)<br>🪪 Apache-2.0 | Multi-voice text-to-speech synthesis with focus on quality and expressiveness. |

### Video & Multimedia AI

| Tool      | Description |
|-----------|-------------|
| **Stable Video Diffusion**<br>🔗 [Stability-AI/generative-models](https://github.com/Stability-AI/generative-models)<br>🪪 MIT | Generate short video clips from images using Stability AI's video diffusion models. |
| **AnimateDiff**<br>🔗 [guoyww/AnimateDiff](https://github.com/guoyww/AnimateDiff)<br>🪪 Apache-2.0 | Animate personalized text-to-image diffusion models without model-specific tuning. |
| **Real-ESRGAN**<br>🔗 [xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)<br>🪪 BSD-3-Clause | Practical image and video super-resolution using deep learning for upscaling and enhancement. |
| **GFPGAN**<br>🔗 [TencentARC/GFPGAN](https://github.com/TencentARC/GFPGAN)<br>🪪 Custom | AI-powered face restoration and enhancement for old photos and low-quality images. |
| **CodeFormer**<br>🔗 [sczhou/CodeFormer](https://github.com/sczhou/CodeFormer)<br>🪪 Custom | Robust face restoration with fidelity preservation for old, blurry, or damaged face images. |
| **wav2lip**<br>🔗 [Rudrabha/Wav2Lip](https://github.com/Rudrabha/Wav2Lip)<br>🪪 MIT | Generate lip-sync videos from any audio and face video using deep learning models. |
| **DeOldify**<br>🔗 [jantic/DeOldify](https://github.com/jantic/DeOldify)<br>🪪 MIT | AI-powered colorization of black and white images and videos with impressive results. |

### Model Training & Fine-Tuning

| Tool      | Description |
|-----------|-------------|
| **Axolotl**<br>🔗 [OpenAccess-AI-Collective/axolotl](https://github.com/OpenAccess-AI-Collective/axolotl)<br>🪪 Apache-2.0 | Tool for fine-tuning various AI models with YAML configs. Supports LoRA, QLoRA, and full fine-tuning. |
| **H2O LLM Studio**<br>🔗 [h2oai/h2o-llmstudio](https://github.com/h2oai/h2o-llmstudio)<br>🪪 Apache-2.0 | Framework and no-code GUI for fine-tuning state-of-the-art large language models. |
| **Ludwig**<br>🔗 [ludwig-ai/ludwig](https://github.com/ludwig-ai/ludwig)<br>🪪 Apache-2.0 | Low-code machine learning framework that allows users to train models by providing a simple config. |
| **Unsloth**<br>🔗 [unslothai/unsloth](https://github.com/unslothai/unsloth)<br>🪪 Apache-2.0 | Finetune Llama, Mistral, CodeLlama models 2-5x faster with 80% less memory usage. |
| **LoRAX**<br>🔗 [predibase/lorax](https://github.com/predibase/lorax)<br>🪪 Apache-2.0 | Multi-LoRA inference server that scales to 1000+ fine-tuned models on a single GPU. |
| **PEFT**<br>🔗 [huggingface/peft](https://github.com/huggingface/peft)<br>🪪 Apache-2.0 | Parameter-Efficient Fine-Tuning methods for efficiently adapting pre-trained models. |
| **AutoTrain Advanced**<br>🔗 [huggingface/autotrain-advanced](https://github.com/huggingface/autotrain-advanced)<br>🪪 Apache-2.0 | No-code tool for training state-of-the-art ML models for various tasks with minimal setup. |

### Development Tools & APIs

| Tool      | Description |
|-----------|-------------|
| **LiteLLM**<br>🔗 [BerriAI/litellm](https://github.com/BerriAI/litellm)<br>🪪 MIT | Unified API for 100+ LLMs. Call Ollama, OpenAI, Anthropic, etc. using the OpenAI format. |
| **LocalAI**<br>🔗 [mudler/LocalAI](https://github.com/mudler/LocalAI)<br>🪪 MIT | Self-hosted, community-driven local OpenAI-compatible API for running LLMs, embeddings, and more. |
| **FastChat**<br>🔗 [lm-sys/FastChat](https://github.com/lm-sys/FastChat)<br>🪪 Apache-2.0 | Open platform for training, serving, and evaluating LLM-based chatbots with OpenAI-compatible API. |
| **vLLM**<br>🔗 [vllm-project/vllm](https://github.com/vllm-project/vllm)<br>🪪 Apache-2.0 | High-throughput and memory-efficient inference and serving engine for LLMs with optimized performance. |
| **text-generation-inference**<br>🔗 [huggingface/text-generation-inference](https://github.com/huggingface/text-generation-inference)<br>🪪 Apache-2.0 | Rust-powered production-ready inference container for deploying and serving LLMs at scale. |
| **Semantic Kernel**<br>🔗 [microsoft/semantic-kernel](https://github.com/microsoft/semantic-kernel)<br>🪪 MIT | Microsoft's SDK for integrating AI models with programming languages and local LLM support. |
| **LangChain**<br>🔗 [langchain-ai/langchain](https://github.com/langchain-ai/langchain)<br>🪪 MIT | Framework for developing applications powered by language models with extensive local model support. |

### Privacy & Security Tools

| Tool      | Description |
|-----------|-------------|
| **GPT-Engineer**<br>🔗 [AntonOsika/gpt-engineer](https://github.com/AntonOsika/gpt-engineer)<br>🪪 MIT | Code generation agent that can work entirely offline with local models for private development. |
| **Aider**<br>🔗 [paul-gauthier/aider](https://github.com/paul-gauthier/aider)<br>🪪 Apache-2.0 | AI pair programming tool that works with local LLMs for secure, private code assistance. |
| **Continue**<br>🔗 [continuedev/continue](https://github.com/continuedev/continue)<br>🪪 Apache-2.0 | VS Code extension for AI code assistance with support for local models and full privacy control. |
| **SecretLlama**<br>🔗 [abi/secret-llama](https://github.com/abi/secret-llama)<br>🪪 MIT | Private LLM inference with end-to-end encryption and secure multi-party computation. |
| **Tor Browser**<br>🔗 [torproject/tor](https://github.com/torproject/tor)<br>🪪 BSD-3-Clause | Anonymous browsing for accessing AI tools and datasets while protecting privacy. |

### Hardware Optimization & Acceleration

| Tool      | Description |
|-----------|-------------|
| **ExLlamaV2**<br>🔗 [turboderp/exllamav2](https://github.com/turboderp/exllamav2)<br>🪪 MIT | Fast inference library for Llama and Llama-derivative models with GPTQ and EXL2 support. |
| **llama-cpp-python**<br>🔗 [abetlen/llama-cpp-python](https://github.com/abetlen/llama-cpp-python)<br>🪪 MIT | Python bindings for llama.cpp with OpenAI-compatible API and hardware acceleration. |
| **CTranslate2**<br>🔗 [OpenNMT/CTranslate2](https://github.com/OpenNMT/CTranslate2)<br>🪪 MIT | Fast inference engine for Transformer models with CPU and GPU acceleration. |
| **ONNX Runtime**<br>🔗 [microsoft/onnxruntime](https://github.com/microsoft/onnxruntime)<br>🪪 MIT | Cross-platform inference and training accelerator compatible with PyTorch, TensorFlow, and more. |
| **TensorRT-LLM**<br>🔗 [NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)<br>🪪 Apache-2.0 | NVIDIA's optimized inference engine for LLMs with maximum performance on NVIDIA GPUs. |
| **MLC LLM**<br>🔗 [mlc-ai/mlc-llm](https://github.com/mlc-ai/mlc-llm)<br>🪪 Apache-2.0 | Universal deployment solution for LLMs across hardware backends including mobile devices. |

### System Monitoring & Management

| Tool      | Description |
|-----------|-------------|
| **Netdata**<br>🔗 [netdata/netdata](https://github.com/netdata/netdata)<br>🪪 GPL-3.0 | Real-time performance monitoring for systems running AI workloads with GPU monitoring support. |
| **Grafana**<br>🔗 [grafana/grafana](https://github.com/grafana/grafana)<br>🪪 AGPL-3.0 | Observability platform for visualizing metrics from AI systems, model performance, and hardware usage. |
| **Prometheus**<br>🔗 [prometheus/prometheus](https://github.com/prometheus/prometheus)<br>🪪 Apache-2.0 | Monitoring system and time series database for collecting AI system metrics and alerts. |
| **Docker**<br>🔗 [docker/docker-ce](https://github.com/docker/docker-ce)<br>🪪 Apache-2.0 | Containerization platform for deploying and managing local AI tools in isolated environments. |
| **Portainer**<br>🔗 [portainer/portainer](https://github.com/portainer/portainer)<br>🪪 Zlib | Web-based container management tool for Docker environments running AI workloads. |
| **Nvidia-Docker**<br>🔗 [NVIDIA/nvidia-docker](https://github.com/NVIDIA/nvidia-docker)<br>🪪 Apache-2.0 | GPU-accelerated Docker containers for running AI models with NVIDIA GPU support. |