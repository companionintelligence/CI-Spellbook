# Local AI Stack (Local-First Tools)

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
---

## 2026 Model Recommendations

| Use Case | Model | Size | Notes |
|----------|-------|------|-------|
| **General Assistant** | Llama 3.3 70B | 40GB Q4 | Best open-weights general model |
| **Coding** | DeepSeek-Coder-V3 | 37GB Q4 | State-of-the-art code generation |
| **Reasoning** | Qwen 2.5-72B | 42GB Q4 | Strong math and logic |
| **Small & Fast** | Llama 3.2 3B | 2GB Q4 | Great for Raspberry Pi 5 / Mac Mini |
| **Balanced** | Mistral Large 2 (123B) | 70GB Q4 | Multilingual, instruction-following |
| **Creative Writing** | Mixtral 8x22B | 80GB Q4 | MoE architecture, diverse outputs |
| **Vision-Language** | Llama 3.2-Vision 11B | 7GB Q4 | Multimodal understanding |
| **Edge Devices** | Phi-3.5-mini 3.8B | 2.5GB | Optimized for constrained hardware |

---
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
| **Ollama**<br>🔗 [ollama.com](https://ollama.com)<br>🪪 MIT | Simple local LLM runner with one-line model downloads and REST API. Now supports vision models, tool calling, and structured outputs. |
| **LM Studio**<br>🔗 [lmstudio.ai](https://lmstudio.ai)<br>🪪 Proprietary (Free) | Cross-platform GUI with local server mode, MLX support for Apple Silicon, and GGUF model browser. Supports vision and embedding models. |
| **llama.cpp**<br>🔗 [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)<br>🪪 MIT | Fast, portable C/C++ inference engine. Supports speculative decoding, vision models, grammar-constrained generation, and Vulkan GPU backend. |
| **SGLang**<br>🔗 [sgl-project/sglang](https://github.com/sgl-project/sglang)<br>🪪 Apache-2.0 | High-performance serving framework with RadixAttention for efficient prefix caching. 5x faster than vLLM for some workloads. |
| **vLLM**<br>🔗 [vllm-project/vllm](https://github.com/vllm-project/vllm)<br>🪪 Apache-2.0 | Production-ready serving with PagedAttention, continuous batching, and multi-GPU support. The standard for high-throughput inference. |
| **TensorRT-LLM**<br>🔗 [NVIDIA/TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM)<br>🪪 Apache-2.0 | NVIDIA's optimized inference engine. Best performance on NVIDIA GPUs with FP8 quantization and advanced kernels. |
| **KoboldCpp**<br>🔗 [LostRuins/koboldcpp](https://github.com/LostRuins/koboldcpp)<br>🪪 AGPL-3.0 | Easy-to-use LLM runner with web UI, story mode, and GPU/CPU support. Focused on creative writing and roleplay. |
| **GPT4All**<br>🔗 [nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)<br>🪪 Apache-2.0 | Multi-platform LLM runner with built-in RAG and local vector DB. Great for beginners with polished UI. |
| **MLX**<br>🔗 [ml-explore/mlx](https://github.com/ml-explore/mlx)<br>🪪 MIT | Apple's ML framework optimized for Apple Silicon. Native support for Llama, Mistral, and other architectures. |
| **ExLlamaV2**<br>🔗 [turboderp/exllamav2](https://github.com/turboderp/exllamav2)<br>🪪 MIT | Fastest inference for EXL2/GPTQ quantized models on consumer GPUs. Great memory efficiency. |

### Chat UI / Front-Ends

| Tool      | Description |
|-----------|-------------|
| **OpenWebUI**<br>🔗 [open-webui/open-webui](https://github.com/open-webui/open-webui)<br>🪪 MIT | Modern, extensible web chat UI for local LLMs. Multi-user, RAG, pipelines, functions, and tool calling support. The standard chat UI. |
| **Text-Generation WebUI**<br>🔗 [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)<br>🪪 AGPL-3.0 | Feature-rich web UI with huge extension ecosystem. Supports multimodal, training, and advanced generation controls. |
| **SillyTavern**<br>🔗 [SillyTavern/SillyTavern](https://github.com/SillyTavern/SillyTavern)<br>🪪 AGPL-3.0 | Roleplay and character-focused chat UI. Advanced persona management, world info, and multi-backend support. |
| **LibreChat**<br>🔗 [danny-avila/LibreChat](https://github.com/danny-avila/LibreChat)<br>🪪 MIT | Multi-model chat interface supporting Ollama, OpenAI, Anthropic. Plugins, presets, and conversation branching. |
| **Jan**<br>🔗 [janhq/jan](https://github.com/janhq/jan)<br>🪪 AGPL-3.0 | Offline-first chat application with built-in model management. Clean UI, cross-platform, extension system. |
| **Msty**<br>🔗 [msty.app](https://msty.app)<br>🪪 Proprietary (Free) | Beautiful native chat app for Mac/Windows/Linux. Multi-model conversations, RAG, and local-first design. |

### Knowledge-Base / RAG Suites

| Tool      | Description |
|-----------|-------------|
| **AnythingLLM**<br>🔗 [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm)<br>🪪 MIT | Plug-and-play RAG suite with web UI, API, and agent support. Connects to Ollama, OpenAI, and more. Best all-in-one solution. |
| **Dify**<br>🔗 [langgenius/dify](https://github.com/langgenius/dify)<br>🪪 Apache-2.0 | All-in-one platform for building RAG, chatbots, and agent workflows. Visual workflow builder, API, multi-model. |
| **Haystack**<br>🔗 [deepset-ai/haystack](https://github.com/deepset-ai/haystack)<br>🪪 Apache-2.0 | Production-ready Python framework for RAG pipelines. Excellent for custom implementations. |
| **Kotaemon**<br>🔗 [Cinnamon/kotaemon](https://github.com/Cinnamon/kotaemon)<br>🪪 Apache-2.0 | Clean document QA interface with multi-modal RAG, citations, and local model support. Great for PDFs. |
| **PrivateGPT**<br>🔗 [zylon-ai/private-gpt](https://github.com/zylon-ai/private-gpt)<br>🪪 Apache-2.0 | Production-ready local RAG server. API-first design, multiple vector stores, Ollama integration. |
| **Quivr**<br>🔗 [QuivrHQ/quivr](https://github.com/QuivrHQ/quivr)<br>🪪 Apache-2.0 | "Second brain" RAG app. Multi-brain architecture, Slack/Discord integrations, clean UI. |
| **Danswer (Onyx)**<br>🔗 [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx)<br>🪪 MIT | Enterprise-grade RAG with Slack, Confluence, and Google Drive connectors. Self-hosted search. |
| **R2R**<br>🔗 [SciPhi-AI/R2R](https://github.com/SciPhi-AI/R2R)<br>🪪 MIT | Production RAG engine with hybrid search, knowledge graphs, and advanced retrieval strategies. |

### Vector Databases & Embedding Stores

| Tool      | Description |
|-----------|-------------|
| **Qdrant**<br>🔗 [qdrant/qdrant](https://github.com/qdrant/qdrant)<br>🪪 Apache-2.0 | High-performance vector database with filtering, multi-tenancy, and hybrid search. Best overall. |
| **Chroma**<br>🔗 [chroma-core/chroma](https://github.com/chroma-core/chroma)<br>🪪 Apache-2.0 | AI-native embedding database. Simple setup, Python-first, great for prototyping. |
| **LanceDB**<br>🔗 [lancedb/lancedb](https://github.com/lancedb/lancedb)<br>🪪 Apache-2.0 | Serverless vector database built on Lance format. Embedded or cloud, multi-modal support. |
| **Weaviate**<br>🔗 [weaviate/weaviate](https://github.com/weaviate/weaviate)<br>🪪 BSD-3-Clause | Vector database with hybrid search, GraphQL API, and built-in vectorization modules. |
| **Milvus**<br>🔗 [milvus-io/milvus](https://github.com/milvus-io/milvus)<br>🪪 Apache-2.0 | Scalable vector database for billion-scale deployments. GPU support, cloud-native. |
| **pgvector**<br>🔗 [pgvector/pgvector](https://github.com/pgvector/pgvector)<br>🪪 PostgreSQL | Vector similarity search for PostgreSQL. Use your existing database infrastructure. |
| **FAISS**<br>🔗 [facebookresearch/faiss](https://github.com/facebookresearch/faiss)<br>🪪 MIT | Meta's library for efficient similarity search. GPU-optimized, excellent for large-scale. |

### Agent Frameworks & Automation

| Tool      | Description |
|-----------|-------------|
| **LangGraph**<br>🔗 [langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)<br>🪪 MIT | Build stateful, multi-actor agent applications with graph-based workflows. Production-ready. |
| **CrewAI**<br>🔗 [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)<br>🪪 MIT | Framework for orchestrating role-based AI agents. Simple API for multi-agent collaboration. |
| **AutoGen**<br>🔗 [microsoft/autogen](https://github.com/microsoft/autogen)<br>🪪 MIT | Microsoft's multi-agent framework. Supports local models, tool use, and complex conversations. |
| **PydanticAI**<br>🔗 [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai)<br>🪪 MIT | Type-safe AI agent framework from Pydantic team. Structured outputs, dependency injection. |
| **Smolagents**<br>🔗 [huggingface/smolagents](https://github.com/huggingface/smolagents)<br>🪪 Apache-2.0 | HuggingFace's lightweight agent library. Code-first approach, tool calling, multi-step reasoning. |
| **DSPy**<br>🔗 [stanfordnlp/dspy](https://github.com/stanfordnlp/dspy)<br>🪪 MIT | Programming framework for foundation models. Compile prompt chains, optimize pipelines. |
| **OpenAI Agents SDK**<br>🔗 [openai/openai-agents-python](https://github.com/openai/openai-agents-python)<br>🪪 MIT | Official SDK for building agents with handoffs, tools, and guardrails. Works with local APIs. |
| **MetaGPT**<br>🔗 [geekan/MetaGPT](https://github.com/geekan/MetaGPT)<br>🪪 MIT | Multi-agent framework simulating software company roles. Great for code generation tasks. |

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