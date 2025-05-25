# Companion Intelligence Spellbook: Card Content

---

## Local-First AI Tools

**Local-First AI Tools Directory**

Below is a quick-reference directory of leading local-first AI tools grouped by function. Use it as a jump-off for building or expanding a home workstation stack—every entry links to the project’s home page or GitHub repo so you can dive straight into docs, downloads, and community.

### LLM Runners / Hosting

| Tool      | Description |
|-----------|-------------|
| **Ollama**<br>🔗 [ollama.com](https://ollama.com)<br>🪪 MIT | Simple local LLM runner with one-line model downloads and REST API. Great for desktop and dev use. |
| **LM Studio**<br>🔗 [lmstudio.ai](https://lmstudio.ai)<br>🪪 AGPL-3.0 | Cross-platform GUI for running, managing, and chatting with local LLMs. Supports many model formats. |
| **llama.cpp**<br>🔗 [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)<br>🪪 MIT | Fast, portable C/C++ inference engine for Llama-family and compatible models. CLI and server modes. |
| **KoboldCpp**<br>🔗 [LostRuins/koboldcpp](https://github.com/LostRuins/koboldcpp)<br>🪪 AGPL-3.0 | Easy-to-use LLM runner with web UI, story mode, and GPU/CPU support. Focused on creative writing. |
| **GPT4All**<br>🔗 [nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)<br>🪪 Apache-2.0 | Multi-platform LLM runner and chat UI. Supports many models, with easy install and local vector DB. |

### Chat UI / Front-Ends

| Tool      | Description |
|-----------|-------------|
| **OpenWebUI**<br>🔗 [open-webui/open-webui](https://github.com/open-webui/open-webui)<br>🪪 AGPL-3.0 | Modern, extensible web chat UI for local LLMs (Ollama, llama.cpp, etc). Multi-user, plugin support. |
| **Text-Generation WebUI**<br>🔗 [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui)<br>🪪 AGPL-3.0 | Feature-rich web UI for running, chatting, and experimenting with local LLMs. Huge extension ecosystem. |
| **SillyTavern**<br>🔗 [SillyTavern/SillyTavern](https://github.com/SillyTavern/SillyTavern)<br>🪪 GPL-3.0 | Roleplay and character-focused chat UI for local and remote LLMs. Integrates with KoboldCpp, OAI, and more. |

### Knowledge-Base / RAG Suites

| Tool      | Description |
|-----------|-------------|
| **AnythingLLM**<br>🔗 [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm)<br>🪪 AGPL-3.0 | Plug-and-play RAG suite for connecting docs, files, and data to local or remote LLMs. Easy setup, web UI. |
| **Haystack**<br>🔗 [deepset-ai/haystack](https://github.com/deepset-ai/haystack)<br>🪪 Apache-2.0 | Flexible Python framework for building RAG, search, and question-answering pipelines. Many integrations. |
| **Dify**<br>🔗 [langgenius/dify](https://github.com/langgenius/dify)<br>🪪 Apache-2.0 | All-in-one platform for building RAG, chatbots, and agent workflows. Web UI, API, and multi-model support. |

#### How to use these tables
- Pick a backbone – choose an LLM runner (Ollama or llama.cpp) that fits your hardware.
- Add a chat UI – wire it to OpenWebUI or Text-Gen WebUI for a browser-based experience.
- Attach data or workflows – AnythingLLM or Haystack for RAG; Flowise or n8n for orchestration.
- Layer on agents and automations – CrewAI / AutoGen for multi-step tasks; n8n triggers to integrate email, Slack, or IoT.
- Spin up creative tools – ComfyUI or Stable-Diffusion WebUI for image pipelines.
- Persist vectors & fine-tune – drop Qdrant/Chroma alongside Axolotl or H2O LLM Studio when you’re ready to train or store embeddings.

Mix-and-match to suit your goals—everything here is open-source and self-hostable, letting you craft a private, powerful AI workstation without relying on cloud APIs.

---

## AI-Assisted Code Development

| Tool | Description |
|------|-------------|
| **Aider**<br>🔗 [paul-gauthier/aider](https://github.com/paul-gauthier/aider)<br>🪪 Apache-2.0 | AI pair programmer for your terminal. Edits code in your repo using local or remote LLMs, tracks context, and supports multi-file refactoring. |
| **CodeGeeX**<br>🔗 [THUDM/CodeGeeX](https://github.com/THUDM/CodeGeeX)<br>🪪 Apache-2.0 (Code) | Multilingual code generation model and toolkit. Supports VS Code, JetBrains, and web IDEs. Model weights and code are open source. |
| **Codeium**<br>🔗 [codeium.com](https://www.codeium.com/)<br>🪪 MIT (Core) | Fast, privacy-focused code completion for 70+ languages. Free for individuals, with local/on-prem options for enterprise. |
| **Sourcegraph Cody**<br>🔗 [sourcegraph/cody](https://github.com/sourcegraph/cody)<br>🪪 Apache-2.0 | Context-aware AI coding assistant. Deep codebase search, chat, and code generation. Integrates with Sourcegraph and IDEs. |
| **Tabnine**<br>🔗 [tabnine.com](https://www.tabnine.com/)<br>🪪 MIT (Core) | AI code completion for all major IDEs. Free basic plan, self-hosted and enterprise options. Focus on privacy and team collaboration. |
| **PolyCoder**<br>🔗 [VHellendoorn/PolyCoder](https://github.com/VHellendoorn/PolyCoder)<br>🪪 MIT | Open-source code LLM (GPT-2 architecture) trained on C. Research project from CMU. Model and code available. |
| **PocketPal AI**<br>🔗 [PocketPalAI/PocketPal](https://github.com/PocketPalAI/PocketPal)<br>🪪 MIT | Mobile AI assistant for iOS/Android. Runs small LLMs on-device for private, offline chat and code help. |
| **Continue**<br>🔗 [continuedev/continue](https://github.com/continuedev/continue)<br>🪪 Apache-2.0 | Open-source autopilot for VS Code and JetBrains. Brings Copilot-like chat, code completion, and context to your IDE using local or remote LLMs. |
| **Cursor**<br>🔗 [cursor.so](https://www.cursor.so/)<br>🪪 Commercial (Free tier) | AI-powered code editor with built-in chat, refactoring, and context awareness. Supports local and cloud LLMs. Free and paid plans. |
| **Open Interpreter**<br>🔗 [open-interpreter/open-interpreter](https://github.com/open-interpreter/open-interpreter)<br>🪪 MIT | Run code, scripts, and natural language commands in your terminal with LLMs. Supports local and remote models, file editing, and automation. |

---

## Cutting Edge Databases

### Top AI Vector Databases

| Tool | Description |
|------|-------------|
| **Milvus**<br>🔗 [milvus.io](https://milvus.io)<br>🪪 Apache 2.0 | Highly scalable, distributed vector database for AI, supporting billions of embeddings and fast similarity search. Integrates with major ML frameworks and deploys on Kubernetes, Docker, or cloud. |
| **Weaviate**<br>🔗 [weaviate/weaviate](https://github.com/weaviate/weaviate)<br>🪪 BSD 3-Clause | Cloud-native vector DB with hybrid search (vector + structured), auto-vectorization modules, multi-tenancy, and strong security. Scales to billions of objects and integrates with OpenAI, Cohere, and more. |
| **Qdrant**<br>🔗 [qdrant.tech](https://qdrant.tech)<br>🪪 Apache 2.0 | Rust-based, high-performance vector search engine with fast approximate nearest neighbor queries, metadata filtering, and distributed, cloud-native scaling. OpenAPI and multi-language clients. |
| **Chroma**<br>🔗 [chroma-core/chroma](https://github.com/chroma-core/chroma)<br>🪪 Apache 2.0 | Lightweight, developer-friendly embedding DB for LLM apps. Runs locally or at scale, integrates with LangChain/LlamaIndex, and supports text/image embeddings for RAG and semantic search. |
| **Faiss**<br>🔗 [facebookresearch/faiss](https://github.com/facebookresearch/faiss)<br>🪪 MIT | Efficient C++/Python library for vector similarity search and clustering. Supports huge datasets, GPU acceleration, and many indexing methods. Widely used as a backend for custom vector search. |

### Top GPU-Based & High Performance Databases

| Tool | Description |
|------|-------------|
| **ClickHouse**<br>🔗 [clickhouse.com](https://clickhouse.com)<br>🪪 Apache 2.0 | Ultra-fast, columnar OLAP DB for real-time analytics on massive datasets. Distributed, horizontally scalable, and supports advanced SQL. Used for petabyte-scale analytics and dashboards. |
| **DuckDB**<br>🔗 [duckdb/duckdb](https://github.com/duckdb/duckdb)<br>🪪 MIT | Embedded, in-process analytics DB ("SQLite for analytics"). Vectorized, columnar engine for fast OLAP queries on local files (CSV, Parquet). No server needed, ideal for data science and ETL. |
| **HeavyDB**<br>🔗 [heavyai/heavydb](https://github.com/heavyai/heavydb)<br>🪪 Apache 2.0 | GPU-accelerated SQL DB for interactive analytics on large datasets. Excels at geospatial queries and real-time rendering. Caches hot data in GPU memory for sub-second response times. |
| **QuestDB**<br>🔗 [questdb.io](https://questdb.io)<br>🪪 Apache 2.0 | High-performance, open-source time-series DB. Columnar, memory-mapped storage, SIMD, and JIT SQL for millions of records/sec. Ideal for financial, IoT, and real-time analytics workloads. |

### Top Multi-Model Databases

| Tool | Description |
|------|-------------|
| **OrientDB**<br>🔗 [orientdb.org](https://www.orientdb.org)<br>🪪 Apache 2.0 | Multi-model DB: graph, document, and key-value in one. Fast graph traversals, ACID, SQL+Gremlin, and horizontal scaling. Used for social, fraud, and knowledge graph use cases. |
| **Apache Ignite**<br>🔗 [ignite.apache.org](https://ignite.apache.org)<br>🪪 Apache 2.0 | Distributed, in-memory multi-model DB and compute platform. Key-value, SQL, and ACID support. RAM-first for ultra-low latency, with optional disk persistence and strong clustering. |
| **FoundationDB**<br>🔗 [foundationdb.org](https://www.foundationdb.org)<br>🪪 Apache 2.0 | Distributed, ACID, ordered key-value store with multi-model layers (documents, graphs, SQL). Strong fault tolerance, serializability, and proven reliability at scale (used by Apple). |
| **ArangoDB**<br>🔗 [arangodb.com](https://www.arangodb.com)<br>🪪 BSL 1.1 (Apache 2.0 after 4 yrs) | Native multi-model DB: graph, document, and key-value. Unified AQL query language, smart joins, sharding, and built-in microservices. Community edition is BSL 1.1 (converts to Apache 2.0 after 4 years). |

---

## Top Public Data Sources

| Name | Overview | Data Types | Access | Format | License | AI Relevance |
|------|----------|-----------|--------|--------|---------|-------------|
| **Data.gov (US)**<br>🔗 [data.gov](https://data.gov) | Central US government open data portal. 300k+ datasets, updated regularly. | Gov, climate, health, geospatial, economy, more | Portal, API (CKAN, metadata) | CSV, JSON, XML, GIS | Public domain (federal) | Authoritative US data for civic, enviro, and analytics AI |
| **Data.europa.eu (EU)**<br>🔗 [data.europa.eu](https://data.europa.eu) | EU-wide open data portal. 1.6M+ datasets, multilingual, active. | Stats, geospatial, legal, research | Portal, API, SPARQL | RDF, CSV, JSON, machine-readable | CC BY 4.0/editorial, dataset-specific | EU data for economic, social, regulatory AI |
| **Wikidata**<br>🔗 [wikidata.org](https://wikidata.org) | Structured, multilingual knowledge base. Public domain, real-time updates. | Entities, properties, relationships | SPARQL, API, dumps | JSON, RDF | CC0 (public domain) | Knowledge graphs, NER, semantic AI |
| **OpenWeatherMap**<br>🔗 [openweathermap.org](https://openweathermap.org) | Global weather, forecast, and climate data. Free & paid API, active. | Weather, air quality, UV, solar, historical | API (key), bulk download | JSON, XML, CSV | Free & paid, commercial on paid | Weather, travel, smart home, enviro AI |
| **Open Food Facts**<br>🔗 [openfoodfacts.org](https://openfoodfacts.org) | Crowdsourced food product database. Free, open, nightly updates. | Ingredients, nutrition, allergens | API, dumps (CSV, Parquet, MongoDB) | JSON, CSV, Parquet | ODbL, CC BY-SA (images) | Nutrition, food tracking, health AI |
| **Kaggle Datasets**<br>🔗 [kaggle.com/datasets](https://kaggle.com/datasets) | 482k+ datasets for ML/AI. Community, API, and direct download. | Tabular, text, image, audio, video | API, download, Kernels | CSV, JSON, SQLite, images | Varies (CC, ODbL, Apache, MIT, etc.) | Model training, experimentation, learning |
| **Common Crawl**<br>🔗 [commoncrawl.org](https://commoncrawl.org) | Massive open web crawl data, updated monthly. Billions of web pages for NLP, search, and AI. | Web pages, text, metadata | Bulk download (AWS S3, HTTP) | WARC, JSON, CSV | CC BY 4.0 | Web-scale LLM, search, NLP, AI |
| **The World Bank Data**<br>🔗 [data.worldbank.org](https://data.worldbank.org) | Global development, economic, and social indicators. 200+ countries, 50+ years. | Economics, health, education, environment | Portal, API, bulk download | CSV, JSON, XML | CC BY 4.0 | Economic, social, and policy AI |
| **OpenStreetMap**<br>🔗 [openstreetmap.org](https://www.openstreetmap.org) | Global, crowdsourced map and geospatial data. Routinely updated, open and editable. | Maps, geospatial, POI, roads, buildings | API, bulk download, planet dumps | XML, PBF, GeoJSON, CSV | ODbL | Geospatial AI, navigation, smart cities |
| **UCI ML Repository**<br>🔗 [archive.ics.uci.edu/ml](https://archive.ics.uci.edu/ml/index.php) | Classic machine learning datasets for research and education. 600+ datasets. | Tabular, text, image, time series | Direct download | CSV, TXT, ARFF | Varies (mostly public domain/CC) | ML benchmarking, education, research |
| **Google Dataset Search**<br>🔗 [datasetsearch.research.google.com](https://datasetsearch.research.google.com) | Meta-aggregator for millions of datasets across the web. Search by topic, format, or license. | All types (tabular, text, image, etc.) | Portal (links to source) | Varies | Varies | Discovery for any AI/ML project |
| **US Census Bureau**<br>🔗 [census.gov/data](https://www.census.gov/data.html) | Authoritative US population, housing, and economic data. Decennial census, ACS, and more. | Demographics, economics, geography | Portal, API, bulk download | CSV, JSON, shapefiles | Public domain (US federal) | Demographic, policy, and social AI |
| **Eurostat**<br>🔗 [ec.europa.eu/eurostat](https://ec.europa.eu/eurostat/data/database) | Official statistics for the European Union. Economy, population, health, and more. | Economics, demographics, health, labor | Portal, API, bulk download | TSV, CSV, SDMX | CC BY 4.0 | EU analytics, policy, and research AI |
| **NASA Open Data**<br>🔗 [data.nasa.gov](https://data.nasa.gov) | Space, earth science, satellite imagery, and mission data. Open and regularly updated. | Imagery, science, telemetry, research | Portal, API, bulk download | CSV, JSON, images, NetCDF | US Gov/Public domain | Remote sensing, earth/space AI |
| **WHO Open Data**<br>🔗 [who.int/data](https://www.who.int/data) | Global health, disease, and COVID-19 data. Authoritative and open. | Health, disease, epidemiology | Portal, API, bulk download | CSV, XLSX, JSON | CC BY-NC-SA 3.0 IGO | Health, epidemiology, global AI |
| **IMDb Datasets**<br>🔗 [imdb.com/interfaces](https://www.imdb.com/interfaces/) | Movies, TV, and entertainment metadata. Updated daily, free for personal/non-commercial use. | Movies, TV, people, ratings | Bulk download | TSV | Non-commercial, see site | Recommender, NER, media AI |

---

## AI Art Generation: Images, 3D, and Video

### AI Image Generation Tools

| Name & Info | Primary Focus/Description | Underlying AI Model(s) Supported | Key Features | Output Quality & Style Versatility | Ease of Use & Community Perception | System Requirements |
|-------------|--------------------------|----------------------------------|--------------|------------------------------------|------------------------------------|---------------------|
| **AUTOMATIC1111 Stable Diffusion WebUI (A1111)**<br>🪪 AGPL-3.0<br>🔗 [GitHub](https://github.com/AUTOMATIC1111/stable-diffusion-webui)<br>📄 [GitHub Wiki](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki) | Feature-rich web UI for Stable Diffusion, extensive community support. | SD1.x, SD2.x, SDXL, custom checkpoints/LoRAs. | GUI, Txt2img, Img2img, Inpainting, Outpainting, ControlNet, LoRAs, Upscaling, Face Restore, API. | High, very versatile due to model/LoRA support. | Feature-rich but can be complex for beginners. Large community, many extensions. Some find it slower than alternatives. | Win/Lin/Mac; Python 3.10.6; NVidia (2GB+ VRAM, 4GB+ rec.), AMD; 16GB RAM; 10GB+ disk. |
| **ComfyUI**<br>🪪 GPL-3.0<br>🔗 [GitHub](https://github.com/comfyanonymous/ComfyUI)<br>📄 [Documentation](https://comfyui.github.io/documentation/) | Powerful and modular graph/node-based interface for Stable Diffusion pipelines. | SD1.x, SD2.x, SDXL, SDXL Turbo, SD3, SD3.5, Stable Cascade, PixArt, many others including video/audio models. | Node-based UI, extreme flexibility, efficient (re-executes changes only), smart VRAM management, ControlNet, LoRAs, Model Merging, API. | Very High, extremely versatile due to pipeline control and broad model support. | Steep learning curve due to nodes; highly valued by power users for control and cutting-edge features. | Win/Lin/Mac; Python 3.12 rec.; NVidia, AMD, Intel, Apple Silicon (1GB+ VRAM), CPU. |
| **InvokeAI**<br>🪪 Apache-2.0<br>🔗 [GitHub](https://github.com/invoke-ai/InvokeAI)<br>📄 [Documentation](https://invoke.ai/) | Creative engine for Stable Diffusion with a polished WebUI, Unified Canvas, and node system. | SD1.5, SD2.0, SDXL, FLUX; .ckpt & diffusers models. | GUI + Nodes, Unified Canvas (in/outpaint), Model/Embedding Manager, Upscaling, Workflow Editor. | High, good versatility, strong for interactive editing. | Polished UI, easier for inpainting than A1111 for some. Good balance of features/usability. | Win10+/Mac14+/Lin; Python 3.10-3.12; NVidia (4GB+ VRAM for SD1.5, 8GB+ for SDXL), AMD (Linux); 8-32GB+ RAM. |
| **Fooocus**<br>🪪 GPL-3.0<br>🔗 [GitHub](https://github.com/lllyasviel/Fooocus)<br>📄 [Documentation](https://github.com/lllyasviel/Fooocus) | User-friendly SDXL-focused GUI, emphasizing prompts over parameters (Midjourney-like). | Primarily SDXL, supports Civitai SDXL models. | Simplified UI, offline GPT-2 prompt processing, automated quality improvements, Inpaint/Outpaint, Upscale, FaceSwap, Image Prompt (ControlNet-like). | High quality for SDXL with minimal effort. Less versatile for non-SDXL. | Very easy to use, excellent for quick, high-quality SDXL results. LTS status (bug fixes only). | Win/Lin/Mac; Python; NVidia (4GB+ VRAM), AMD (8GB+ VRAM), CPU (32GB RAM). |
| **Krita AI Diffusion Plugin**<br>🪪 GPL-3.0<br>🔗 [GitHub](https://github.com/lnyanzi/krita-ai-diffusion)<br>📄 [kritaaidiffusion.com](https://kritaaidiffusion.com) | Integrates Stable Diffusion (SD1.5, SDXL, partial SD3/Flux) into Krita painting software. | SD1.5, SDXL, partial Flux/SD3. | Krita Plugin, Inpaint, Outpaint, Generate, Refine, Live Painting, ControlNet, IP-Adapter, Upscaling. Uses ComfyUI backend. | Good, leverages Krita's tools for artistic control. | Intuitive for Krita users, excellent for artist-led AI generation and editing. | Krita 5.2.0+; Win/Lin/Mac; Python; GPU rec. (6GB+ VRAM). |
| **GIMP AI Plugins with OpenVINO (Intel)**<br>🪪 Apache-2.0<br>🔗 [GitHub](https://github.com/GIMP-AI/GIMP-AI)<br>📄 [User Guides](https://github.com/GIMP-AI/GIMP-AI/wiki) | AI plugins for GIMP 3 using OpenVINO for Intel hardware. Includes SD functionality. | SD 1.5, SDXL, SD3 (Medium, Turbo), ControlNets. | GIMP Plugin, Super-Res, Seg., SD (Txt2img, Img2img, Inpaint, ControlNet). | Dependent on specific SD models used via OpenVINO. | Aims to integrate AI into GIMP workflows. Focused on Intel hardware. | GIMP 3; Python 3; OpenVINO; Win/Lin; Intel Hardware (CPU, iGPU, NPU). |

### 3D Model Generation Tools

| Name & Info | Primary Focus/Description | Generation Method(s) | Underlying AI Technology | Key Features | Supported Output Formats | Ease of Use & Community Perception | System Requirements |
|-------------|--------------------------|----------------------|-------------------------|--------------|-------------------------|------------------------------------|---------------------|
| **Hunyuan3D-2 (Tencent)**<br>🪪 Custom License<br>🔗 [GitHub](https://github.com/Tencent/Hunyuan3D-2)<br>📄 [ComfyUI Wiki](https://comfyui-wiki.com/en/tutorial/advanced/3d/huanyuan3d-2) | Image/Text to High-Res Textured 3D Assets. | Image-to-3D, Text-to-3D (via extension). | Diffusion Transformer (shape), Diffusion (texture). | High-res shape & texture, Blender addon, ComfyUI support, Turbo/Mini/MV models. | GLB, OBJ, other via Trimesh. | High quality, but complex setup for some. Mesh topology can be an issue. Active community. | Lin/Win/Mac; PyTorch; 6GB+ VRAM (shape), 16-24.5GB+ (shape+texture). |
| **Point-E (OpenAI)**<br>🪪 MIT License<br>🔗 [GitHub](https://github.com/openai/point-e)<br>📄 [Paper](https://arxiv.org/abs/2212.08751) | Text/Image to 3D Point Cloud, then Mesh. | Text-to-Point Cloud, Image-to-Point Cloud, Point Cloud-to-Mesh. | Diffusion (point cloud), SDF Regression (mesh). | Fast generation, converts point clouds to meshes. | Point Cloud (.ply), Mesh (.ply, .obj via WebUI). | Fast but output quality is lower-res, noisy. Text model limited. | Python, PyTorch. Single GPU (1-2 min/sample). ~6.5GB VRAM (img2pc), ~1.7GB (pc2mesh) on 3090. |
| **point-e-webui (tonymacx86PRO)**<br>🪪 MIT License<br>🔗 [GitHub](https://github.com/tonymacx86PRO/point-e-webui) | Local WebUI for Point-E. | (Utilizes Point-E) | (Utilizes Point-E) | Simplifies Point-E usage, provides OBJ output. | .ply (point cloud & mesh), .obj (mesh). | Makes Point-E more accessible. Limited community feedback in snippets. | Python 3.10.6, Git, PyTorch. |
| **A3D Editor (n0neye)**<br>🪪 AGPL-3.0 (Editor), MIT (ComfyUI node)<br>🔗 [GitHub](https://github.com/n0neye/A3D) | Hybrid 3D editor with AI asset generation and rendering. | Image-to-3D (via Fal.ai), Scene Composition, Depth-guided rendering. | External APIs (Fal.ai for 3D gen), ComfyUI integration. | Pose control, scene building, 2D/3D asset import, AI rendering. | Input: common 3D models. Output: Color/depth to ComfyUI. Specific 3D export not detailed. | Early beta, aims for lightweight prototyping. Windows only. | Windows. Fal.ai API key / ComfyUI setup for AI features. |
| **302.AI 3D Modeling (Open-Source Version)**<br>🪪 MIT License<br>🔗 [GitHub](https://github.com/302ai/302_ai_3d_modeling) | Image-to-3D and Text-to-Image-to-3D conversion. | Image-to-3D, Text-to-Image then Image-to-3D. | "Advanced AI technology" (specific model not detailed, likely API-based). | Multi-angle preview, multi-language UI, dark mode. | Specific formats not detailed; "more formats planned". | Easy to use online. Small OS community. Frontend for larger platform. | Node.js, pnpm. (Web application). |
| **Neuralangelo (NVIDIA)**<br>🪪 NVIDIA Source Code License<br>🔗 [GitHub](https://github.com/NVlabs/Neuralangelo)<br>📄 [Project Page](https://research.nvidia.com/labs/nvlabs/Neuralangelo/) | High-fidelity 3D surface reconstruction from video. | Video-to-3D (Reconstruction). | Neural Surface Rendering, Multi-res Hash Grids, SDFs. | Textured mesh extraction, COLMAP integration, very high detail. | .ply (mesh), can be textured. | Produces highly detailed reconstructions. Complex setup, high VRAM. Reconstruction, not direct generation. | Linux (Docker/conda); PyTorch; CUDA; >=24GB VRAM (can be lowered). |

### Video Generation Tools

| Name & Info | Primary Focus/Description | Generation Type(s) | Underlying AI Model(s)/Tech | Key Features | Ease of Use & Community Perception | System Requirements |
|-------------|--------------------------|--------------------|----------------------------|--------------|------------------------------------|---------------------|
| **Stable Video Diffusion (SVD) (Stability AI)**<br>🪪 Stability AI Community License<br>🔗 [GitHub](https://github.com/Stability-AI/generative-models)<br>📄 [HuggingFace](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid) | Image-to-video diffusion model for short clips. | Image-to-Video. | Latent Diffusion. | 14/25 frames, 576x1024, temporal consistency focus. | Accessible via ComfyUI on lower VRAM. Quality preferred in some evals. No text control. | High VRAM (A100 80GB) for fast gen; <10GB VRAM possible in ComfyUI. |
| **AnimateDiff**<br>🪪 Apache-2.0<br>🔗 [Official](https://github.com/guoyww/AnimateDiff)<br>📄 [Project Page](https://github.com/guoyww/AnimateDiff#readme) | Plug-and-play module to animate existing T2I models (SD1.5, SDXL). | Image-to-Video (animating T2I outputs), Text-to-Animation (via T2I model), Video-to-Video (with ControlNet). | Motion Modules, MotionLoRA. | Integrates with SD models, MotionLoRA camera control, SparseCtrl, ComfyUI/A1111 extensions. | Popular for animating personalized T2I models. Extensions ease use. Generic motion if not guided. | NVidia GPU (8GB+ VRAM for T2V, 10GB+ for V2V), PyTorch >=2.0 (Forge). ~13GB VRAM for SDXL. |
| **VideoCrafter (AILab-CVC)**<br>🪪 Apache-2.0 (non-commercial)<br>🔗 [GitHub](https://github.com/AILab-CVC/VideoCrafter)<br>📄 [Project Page](https://github.com/AILab-CVC/VideoCrafter#readme) | Toolbox for T2V and I2V generation, research-focused. | Text-to-Video, Image-to-Video. | Diffusion Models. | LongerCrafter/FreeNoise for longer videos, VideoCrafter2 (improved motion). | Research tool. Non-commercial license limits broad use. | Python 3.8.5. GPU (A100 40GB mentioned for specific outputs). |
| **Open-Sora (hpcaitech)**<br>🪪 Apache-2.0<br>🔗 [GitHub](https://github.com/hpcaitech/Open-Sora)<br>📄 [Reports](https://github.com/hpcaitech/Open-Sora#reports) | Initiative to reproduce Sora-like video generation efficiently. | Text-to-Video, Image-to-Video, Video-to-Video. | Diffusion Transformers (DiT), Custom VAEs (e.g., Video DC-AE). | Various resolutions/lengths (up to 720p/768px, ~16s), aspect ratios, motion score control, prompt refinement. | Actively developed, user-friendly aim. Good performance, cost-effective training. Setup can be involved. | Python 3.10, PyTorch >=2.4.0. High-end GPUs for best results (H100); consumer GPUs (RTX 3090 24GB) for lower-res/shorter. |
| **HunyuanVideo (Tencent)**<br>🪪 Custom License<br>🔗 [GitHub](https://github.com/Tencent/HunyuanVideo) | Large (13B+ params) video foundation model for T2V and I2V. | Text-to-Video, Image-to-Video. | Transformer, MLLM Text Encoder, 3D VAE. | High-res (up to 720p, 129 frames), prompt rewrite, ComfyUI support (native & wrapper). | High quality output. High VRAM needs are a barrier. Active community. | Linux; Python 3.10.9; CUDA 11.8/12.4; GPU (45-60GB+ VRAM, 80GB rec.). |

---

## Speech-to-Text & Text-to-Speech

### Speech-to-Text Tools

| Tool | Core Architecture(s) | Key Features | Performance & Real-Time | Multilingual | Customization | Strengths | Limitations |
|------|----------------------|--------------|------------------------|--------------|--------------|-----------|-------------|
| **OpenAI Whisper**<br>🪪 MIT<br>🔗 [Code](https://github.com/openai/whisper) / [Docs](https://platform.openai.com/docs/guides/speech-to-text) | Transformer (Encoder-Decoder) | Multilingual transcription & translation, noise resilience, model sizes | Large: 2.73%/7.94% WER, not real-time by default; community variants improve | >50 languages | Limited without fine-tuning; possible | High accuracy, robust, multilingual, translation | High compute, not real-time, limited domain adaptation |
| **Faster Whisper / whisper.cpp / WhisperX**<br>🪪 MIT, BSD-2-Clause<br>🔗 [Faster Whisper](https://github.com/guillaumekln/faster-whisper) / [whisper.cpp](https://github.com/ggerganov/whisper.cpp) / [WhisperX](https://github.com/m-bain/whisperX) | Optimized Whisper (CTranslate2, C++, VAD) | Speed/memory improvements, word-level timestamps, diarization | Similar accuracy, much faster, real-time possible | Same as Whisper | Same as Whisper, plus variant features | Addresses Whisper's speed/memory/real-time | Depends on Whisper, more complex |
| **Wav2Vec 2.0 (Meta AI)**<br>🪪 MIT<br>🔗 [Code](https://github.com/pytorch/fairseq/tree/main/examples/wav2vec) / [Docs](https://ai.facebook.com/blog/wav2vec-20-state-of-the-art-speech-recognition-for-everyone/) | Transformer, Self-supervised | Self-supervised pre-training, high customizability | 1.8%/3.3% WER, real-time possible | Primarily English, fine-tunable | Highly customizable, easy to fine-tune | Excellent with fine-tuning, low-resource support | Complex setup, needs fine-tuning for best results |
| **SpeechBrain**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/speechbrain/speechbrain) / [Docs](https://speechbrain.readthedocs.io/) | PyTorch toolkit (Transformers, Conformer, etc.) | Holistic toolkit, supports Whisper/Wav2Vec2, diarization, enhancement | 2.01%/4.52% WER, real-time evolving | Many datasets/languages via fine-tuning | Highly customizable, YAML configs | Comprehensive, SOTA, Hugging Face integration | Complex for beginners, real-time still evolving |
| **sherpa-onnx (k2-fsa)**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/k2-fsa/sherpa-onnx) / [Docs](https://k2-fsa.github.io/sherpa/onnx/) | Next-gen Kaldi, ONNX, Zipformer, Whisper | Offline, embedded, real-time streaming/non-streaming, TTS, VAD, diarization | 2.21%/4.79% WER, real-time, embedded | Chinese, English, Korean, French, etc. | Supports many pre-trained models, ONNX deploy | Great for offline/embedded, broad support | Benchmarks often refer to icefall recipes |
| **Vosk API**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/alphacep/vosk-api) / [Docs](https://alphacephei.com/vosk/) | Kaldi-based | Offline, lightweight, real-time, reconfigurable vocab, speaker ID | 5.69%/9.85% WER, real-time, zero-latency | >20 languages | Custom language models possible | Lightweight, offline, easy integration | Small models less accurate, large models less lightweight |
| **Kaldi**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/kaldi-asr/kaldi) / [Docs](https://kaldi-asr.org/doc/) | GMM-HMM, DNN-HMM, End-to-End | Highly flexible, research-focused, cross-compile | Depends on recipe, real-time possible | Many via recipes | Extremely flexible, customizable | Ultimate flexibility, research toolkit | Very complex, steep learning curve |

### Text-to-Speech Tools

| Tool | Synthesis Method | Key Features | Quality & Compute | Languages | Strengths | Limitations | Use Cases |
|------|------------------|--------------|------------------|-----------|-----------|-------------|-----------|
| **Coqui XTTS v2**<br>🪪 CPML (Non-commercial)<br>🔗 [Code](https://github.com/coqui-ai/XTTS) / [Docs](https://coqui.ai/docs/xtts/) | Autoregressive, VQ-VAE + GPT2-like | 6s voice cloning, emotion/style transfer, cross-language cloning, 24kHz | High quality, expressive, GPU recommended (<150ms latency) | 17 languages | Excellent voice cloning, multilingual, expressive | Non-commercial, Coqui.ai shut down | Voice cloning, multilingual content (non-commercial) |
| **VITS**<br>🪪 MIT, Apache 2.0<br>🔗 [Code](https://github.com/jaywalnut310/vits) / [Docs](https://github.com/Plachtaa/VITS-fast-fine-tuning) | VAE, Adversarial, Normalizing Flows | End-to-end, natural rhythm/intonation | High quality, MOS ~human, GPU for training, CPU-efficient inference | Multilingual adaptations, En, Ko, etc. | High quality, on-device, base for others | Resource-intensive training | On-device, research, base for Piper |
| **MeloTTS (MyShell.ai)**<br>🪪 MIT<br>🔗 [Code](https://github.com/myshell-ai/MeloTTS) / [Docs](https://docs.myshell.ai/docs/melotts) | Neural (likely) | CPU real-time, multiple accents, mixed Chinese/English | High quality, easy to use, CPU real-time | En (US, UK, IN, AU), Es, Fr, Zh, Ja, Ko | CPU efficient, good quality, multilingual | No voice cloning | Real-time, chatbots, narration |
| **OpenVoice v2 (MyShell.ai)**<br>🪪 MIT<br>🔗 [Code](https://github.com/myshell-ai/OpenVoice) / [Docs](https://docs.myshell.ai/docs/openvoice) | Based on MeloTTS | Instant voice cloning, style control, cross-lingual cloning | Better than v1, less natural than MeloTTS, CPU/GPU, efficient cloning | En, Es, Fr, Ch, Ja, Ko | Powerful cloning, style control, commercial-friendly | Less natural than MeloTTS | Personalized voice, dynamic content |
| **StyleTTS 2**<br>🪪 MIT (code), conditional for models<br>🔗 [Code](https://github.com/yl4579/StyleTTS2) / [Docs](https://styletts2.github.io/) | Style Diffusion, Adversarial, SLMs | Human-level, no reference needed, zero-shot adaptation | Surpasses human (CMOS +0.28), matches on VCTK, complex training | En, Ja, Ch, 14 langs (PL-BERT) | SOTA naturalness, zero-shot adaptation | Complex, nuanced license | High-fidelity, research |
| **Piper (Rhasspy)**<br>🪪 MIT (engine), voices vary<br>🔗 [Code](https://github.com/rhasspy/piper) / [Docs](https://rhasspy.github.io/piper/) | VITS + ONNX | Local, fast, many voices/languages | "Sounds great", varies by voice, efficient (ONNX), runs on Pi | ar, ca, cs, de, en, es, fr, it, nl, pl, pt, ru, zh, etc. | Wide selection, offline, Home Assistant | Voice quality varies, complex licensing | Smart home, offline TTS, alerts |
| **ESPnet-TTS**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/espnet/espnet) / [Docs](https://espnet.github.io/espnet/) | Tacotron 2, FastSpeech, VITS, etc. | Unified toolkit, multi-task, G2P | High quality, customizable, MOS prediction, varies by model | En, Ch, Ja, extensible | Flexible, SOTA, research | Not plug-and-play | TTS research/dev |
| **eSpeak NG**<br>🪪 GPL-3.0+<br>🔗 [Code](https://github.com/espeak-ng/espeak-ng) / [Docs](https://espeak-ng.org/) | Formant Synthesis | Compact, fast, >100 languages/accents | Clear but robotic, very lightweight, CPU | >100 languages/accents | Efficient, vast language support | Robotic quality | Accessibility, embedded, alerts |
| **MaryTTS**<br>🪪 LGPL<br>🔗 [Code](https://github.com/marytts/marytts) / [Docs](https://marytts.github.io/) | Java, Unit Selection/HMM | Modular, voice building tools | Natural for class, older tech, Java-based, moderate | >20 languages | Good multilingual, customizable | Lower quality, Java dep | E-learning, screen readers, research |
| **Spark-TTS**<br>🪪 Not specified<br>🔗 [Code](https://github.com/QwenLM/Spark-TTS) / [Docs](https://github.com/QwenLM/Spark-TTS) | LLM-based (Qwen2.5), BiCodec | Customizable voice, zero-shot cloning | Not specified (new), 500M params | Chinese, English | Novel, customizable | New, limited languages | Research, custom voice |
| **Kokoro**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/1rgs/kokoro) / [Docs](https://github.com/1rgs/kokoro) | Neural (not specified) | Small (82M), real-time CPU | High quality, "Siri-like", very lightweight, CPU/GPU | English only | Efficient, fast, commercial-friendly | English only, less expressive | Real-time CPU apps |
| **Fish Speech v1.5**<br>🪪 BY-CC-NC-SA-4.0<br>🔗 [Code](https://github.com/fishaudio/fish-speech) / [Docs](https://github.com/fishaudio/fish-speech) | Neural (not specified) | Zero/few-shot cloning, low CER/WER, <150ms latency | Low CER/WER (~2% for 5min En), fast inference | En, Ja, Ko, Ch, Fr, De, Ar, Es | Good cloning, multilingual, fast | Non-commercial | Multilingual cloning (non-commercial) |

---

## Networking, VPN, & Infrastructure Security

### Web Servers & Reverse Proxies

| Tools | Description | Notes |
|-------|-------------|-------|
| **Nginx**<br>📜 BSD 2-Clause<br>🔗 [Docs](https://nginx.org/en/docs/) / [Download](https://nginx.org/en/download.html) | High-performance web server and reverse proxy | Supports SSL, load balancing, and multiplexing |
| **Nginx Proxy Manager**<br>📜 Apache 2.0<br>🔗 [Docs](https://nginxproxymanager.com/guide/) / [Download](https://github.com/jc21/nginx-proxy-manager/releases) | GUI for managing Nginx reverse proxy with SSL support | Ideal for managing multiple services with Let's Encrypt integration |
| **Caddy**<br>📜 Apache 2.0<br>🔗 [Docs](https://caddyserver.com/docs/) / [Download](https://github.com/caddyserver/caddy/releases) | Automatic HTTPS-enabled web server | Simplifies TLS management with automatic certificate provisioning |
| **Apache HTTP Server**<br>📜 Apache License 2.0<br>🔗 [Docs](https://httpd.apache.org/docs/) / [Download](https://httpd.apache.org/download.cgi) | Versatile and widely-used web server | Extensive module ecosystem and configuration flexibility |
| **Traefik**<br>📜 MIT<br>🔗 [Docs](https://doc.traefik.io/traefik/) / [Download](https://github.com/traefik/traefik/releases) | Modern HTTP reverse proxy and load balancer | Dynamic service discovery and Let's Encrypt integration |

### VPN & Overlay Networking

| Tools | Description | Notes |
|-------|-------------|-------|
| **WireGuard**<br>📜 GPLv2<br>🔗 [Docs](https://www.wireguard.com/) / [Download](https://www.wireguard.com/install/) | Simple and fast VPN protocol | Known for its performance and ease of configuration |
| **Netmaker**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.netmaker.io/) / [Download](https://github.com/gravitl/netmaker/releases) | WireGuard-based network management platform | Facilitates mesh VPNs and site-to-site connections |
| **Headscale**<br>📜 MIT<br>🔗 [Docs](https://github.com/juanfont/headscale#documentation) / [Download](https://github.com/juanfont/headscale/releases) | Self-hosted coordination server for Tailscale clients | Enables Tailscale-like networks without relying on Tailscale's servers |
| **Nebula**<br>📜 Apache 2.0<br>🔗 [Docs](https://github.com/slackhq/nebula#readme) / [Download](https://github.com/slackhq/nebula/releases) | Scalable overlay networking tool | Developed by Slack for internal networking |
| **Innernet**<br>📜 Apache 2.0<br>🔗 [Docs](https://github.com/graphcore/innernet#readme) / [Download](https://github.com/graphcore/innernet/releases) | Private network system built on WireGuard | Designed for managing internal networks securely |

### Server Management & Orchestration (Additional)

| Tools | Description | Notes |
|-------|-------------|-------|
| **Umbrel**<br>📜 PolyForm Noncommercial 1.0.0<br>🔗 [Docs](https://community.umbrel.com/) / [Download](https://umbrel.com/) | Easy home server/cloud OS, Bitcoin focus initially | Beginners, Home users, Bitcoin enthusiasts; Appliance-like install |
| **YunoHost**<br>📜 GNU AGPLv3<br>🔗 [Docs](https://yunohost.org/docs) / [Download](https://yunohost.org/install) | Democratize self-hosting for non-experts | Non-experts, Small orgs; Guided image install |
| **CasaOS**<br>📜 Apache 2.0<br>🔗 [Docs](https://wiki.casaos.io) / [Download](https://get.casaos.io) | Simple personal cloud, Docker ecosystem | Beginners, Home users; One-liner script install |
| **Dokku**<br>📜 MIT<br>🔗 [Docs](https://dokku.com/docs/) / [Download](https://dokku.com/docs/getting-started/installation/) | Lightweight PaaS, Heroku alternative | Developers; CLI-based setup |
| **CapRover**<br>📜 Apache 2.0 + Appendix<br>🔗 [Docs](https://caprover.com/docs/) / [Download](https://caprover.com/docs/get-started.html) | Easy PaaS, app/database deployment | Developers; Docker Swarm, auto SSL |
| **Portainer CE**<br>📜 Zlib<br>🔗 [Docs](https://docs.portainer.io/) / [Download](https://docs.portainer.io/start/install-ce/) | Container management UI (Docker, Kubernetes) | All levels; Easy Docker run |
| **Sandstorm.io**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.sandstorm.io/) / [Download](https://sandstorm.io/install) | Secure web app package manager | Security-focused; Sandboxed grains |
| **FreedomBox**<br>📜 GNU AGPLv3<br>🔗 [Docs](https://wiki.debian.org/FreedomBox) / [Download](https://freedombox.org/download/) | Private server for non-experts, privacy focus | Non-experts; Debian-based image |
| **OpenMediaVault**<br>📜 GNU GPLv3<br>🔗 [Docs](https://docs.openmediavault.org/) / [Download](https://www.openmediavault.org/download.html) | NAS solution, extendable via plugins | Home/SOHO; Plugin ecosystem |
| **Cosmos Cloud**<br>📜 Apache 2.0 + Commons Clause<br>🔗 [Docs](https://cosmos-cloud.io/doc/) / [Download](https://cosmos-cloud.io/doc/) | Secure & easy self-hosting platform | Security-focused; integrated backup & SSO |

---

## Virtual Machine and Browser Automation and Scrapers

### VM & Browser Automation

| Tool | Type | Key Features | Notes |
|------|------|--------------|-------|
| **OpenAI Operator**<br>[Docs](https://help.openai.com/en/articles/8992066-openai-operator) | Commercial (Part of ChatGPT Plus/Pro) | AI agent that can control a web browser to perform tasks based on natural language instructions, can handle multi-step processes, user can take over if needed. | Currently in a research preview/beta stage. Focuses on automating web-based tasks. Screenshots are used for "seeing" the interface. |
| **Adept AI**<br>[Docs](https://www.adept.ai/act) | Commercial (Waitlist/Early Access) | AI model designed to use software (including web browsers and enterprise tools) like a human, translating natural language commands into actions. | Aims to build a general-purpose AI teammate. Focus is on task completion within existing software interfaces. |
| **MultiOn AI**<br>[Docs](https://multion.ai/) | Commercial (Waitlist/Beta) | AI agent that can autonomously execute tasks on the web, such as booking flights, ordering food, or conducting research by controlling a browser. | Focuses on creating an "AI web agent" that can perform complex online actions based on user requests. |
| **Fuji-Web**<br>[Code](https://github.com/normal-computing/fuji-web) | Open Source (GitHub) | AI agent that lives in the browser's sidepanel, allowing users to give commands for online tasks. | Aims to bring AI-driven task automation directly into the browser. Performance and range of capabilities are still evolving. |
| **Browser Use (Ollama & DeepSeek)**<br>[Code](https://github.com/browser-use/browser-use) | Open Source (Python Library) | Framework for building local AI agents that can control web browsers (e.g., Chrome, Firefox via Playwright) using LLMs like DeepSeek run via Ollama. | More of a developer tool/framework for creating custom AI browser automation agents. Offers privacy through local execution. |
| **Imbue**<br>[Docs](https://imbue.com/) | Commercial (Research/Development) | Building AI agents that can reason and code, with a long-term vision of enabling AI to robustly accomplish complex goals in the real world, including computer usage. | Focused on more general AI capabilities that could underpin advanced UX automation. Still in heavy R&D. |

### Browser Extension Data Scrapers

| Tool | Type | Key Features | Notes |
|------|------|--------------|-------|
| **Web Scraper**<br>[Docs](https://webscraper.io/documentation) [Download](https://chrome.google.com/webstore/detail/web-scraper/jnhgnonknehpejjnehehllkliplmbmhn) | Freemium | Point-and-click interface, handles dynamic sites (JavaScript/AJAX, infinite scroll), sitemap-based, data export (CSV, XLSX), cloud version available. | Widely used, good for visual setup of scraping logic. Can have a learning curve for complex sites. |
| **Instant Data Scraper**<br>[Docs](https://instantdata.scraper.dev/) [Download](https://chrome.google.com/webstore/detail/instant-data-scraper/nhdogjmejiglipccpnnnanhbledajbpd) | Free | Automatically detects tabular data, one-click scrape, dynamic data detection, pagination support, CSV/Excel export. | Very easy to use for simple table and list extraction. May struggle with highly complex or dynamic sites. |
| **Octoparse**<br>[Docs](https://www.octoparse.com/tutorial) [Download](https://chrome.google.com/webstore/detail/octoparse-web-scraper/nhnnhhkfggdpmogdlfihhhdlkobonmhp) | Commercial | No-code visual scraping, pre-built templates for popular sites, handles complex scenarios (login, forms), cloud-based scraping, API access, AI-powered data detection. | Powerful suite that includes a browser extension component. Good for a range of complexities. |
| **Simplescraper**<br>[Docs](https://docs.simplescraper.io/) [Download](https://chrome.google.com/webstore/detail/simplescraper/oknndfeeopgpibecfjljjfbmgleogkbh) | Freemium | Point-and-click, recipe-based scraping for multiple pages, scheduling, integrations (Google Sheets, Airtable, Zapier), AI for data analysis. | User-friendly for many tasks, though complex sites or advanced recipes might require some learning. |
| **Data Miner**<br>[Docs](https://data-miner.io/support) [Download](https://chrome.google.com/webstore/detail/data-miner/nndknepjnldbdbepjfgmncbggmopgden) | Freemium | Point-and-click, large library of public "recipes" for common sites, custom recipe creation, data export options. | Good for quick scrapes with existing recipes. Custom or complex scraping can have a steeper learning curve. |
| **Bardeen.ai**<br>[Docs](https://bardeen.ai/help) [Download](https://chrome.google.com/webstore/detail/bardeen-ai-automation/ihkglimjijgihabmfamfmpgafgikjfkc) | Freemium | AI-powered automation and scraping, integrates with various apps (Google Sheets, Notion, etc.), background execution, pre-built "playbooks." | More than just a scraper; an automation tool that includes robust scraping capabilities. |
| **Listly**<br>[Docs](https://listly.io/docs) [Download](https://chrome.google.com/webstore/detail/listly-web-scraper/ommpcdbdehkdoolbfaebmjfjhboecbpa) | Freemium | Convert web pages to Excel/JSON in one click, schedule daily extraction, detects data in cards/lists. | Focuses on quick conversion of structured data. Good for recurring list extraction. |
| **Apify**<br>[Docs](https://docs.apify.com/) [Download](https://chrome.google.com/webstore/detail/apify/ohffdbbakkgpmjdojagfmlmfgpibjkjj) | Freemium (Platform) | While a broader platform, offers a Chrome extension to easily run "Actors" (serverless cloud programs for web scraping/automation) directly from the browser. | Very powerful and scalable, suitable for developers and complex projects. Extension acts as a frontend. |
| **ispras/web-scraper-chrome-extension**<br>[Code](https://github.com/ispras/web-scraper-chrome-extension) | Open Source (GitHub) | Visual sitemap creation, data extraction from dynamic pages, CSV export. Based on the popular webscraper.io logic. | Actively maintained open-source alternative, good for users familiar with sitemap-based scraping. |

---

## AI in Video Games & Virtual Beings

| Tool | Description | AI/LLM/Tech Stack | Supported Avatar Formats | Integrations (SDKs/APIs) |
|------|-------------|-------------------|------------------------|-------------------------|
| **Artificial Agency**<br>[Website](https://artificial.agency) | AI-driven NPC behavior engine for games. NPCs have goals, memory, adaptive behaviors, and respond to live game events. Focus on unscripted, lifelike interactions. | Proprietary LLM-powered engine (dialogue, decision-making, behavior trees, RL planners) | Agnostic (works with any 3D character in supported engines) | Game Engine SDKs (Unity, Unreal planned), API for runtime integration |
| **Inworld AI**<br>[Website](https://inworld.ai) [Docs](https://docs.inworld.ai) | Interactive AI characters/NPCs with multimodal AI. Studio for character creation, memory, emotion, safety, TTS/STT, and 20+ ML models for realistic interaction. | Multiple LLMs: Inworld Llama 3.1 70B, OpenAI GPT-4o, GPT-3.5, extensible to others | Engine-agnostic; supports Ready Player Me, MetaHumans, custom rigged 3D models | Unity SDK, Unreal Plugin, REST API/WebSocket, web/mobile support |
| **Charisma.ai**<br>[Website](https://charisma.ai) [Docs](https://docs.charisma.ai) | Interactive storytelling and digital actors. Visual story editor, AI-augmented dialogue, 3D avatars, lip-sync, 1000+ AI voices, real-time player conversations, Unity/Unreal/Web SDKs. | Multiple LLMs: OpenAI GPT-4/3.5, Anthropic Claude, Meta LLaMA, script-based blending | 3D avatars via Unity/Unreal; sample avatars (Reallusion), custom FBX/GLTF, MetaHumans | Unity/Unreal SDKs, Web SDK, REST API |
| **Soul Machines**<br>[Website](https://soulmachines.com) [Docs](https://docs.soulmachines.com) | Photorealistic “Digital People” with real-time emotion, facial animation, and conversation. LLM-agnostic, cloud-based, advanced facial rig, empathy, and affective computing. | LLM-agnostic; default NLP or connect GPT-4, IBM Watson, Azure, etc.; custom emotion/voice modules | Proprietary avatars (Digital DNA), no external model import, advanced facial rig | Web embedding, REST APIs, cloud/on-premise deployment, SDKs for scenarios |
| **Virbe**<br>[Website](https://virbe.ai) [Docs](https://docs.virbe.ai) | Framework for deploying AI-powered 3D virtual beings. Avatar/AI/deployment connectors, real-time rendering, AI Behavior Editor, analytics, “create once – deploy anywhere.” | AI-model agnostic: Rasa, Dialogflow, GPT-3/4, custom NLP, TTS/STT, hybrid | Ready Player Me, MetaHumans, Reallusion, Daz3D, Virbe templates, custom rigged models | SDKs: JavaScript, Unity, Unreal, web/mobile/kiosk, REST API, cloud dashboard |
| **Virtual Beings (KuteEngine)**<br>[Website](https://virtualbeings.co) | Behavioral AI engine for lifelike 3D characters. Realistic emotions, memory, full-body procedural animation, Unity plugin, focus on emergent behavior and VR/AR. | Custom behavior AI (not LLM-based); RL, procedural animation, emotional states | Unity humanoid rigs (FBX/GLB), MetaHumans (Unreal, in progress), quadrupeds | Unity SDK, Unreal plugin (coming), on-device runtime, developer community |

---

## Home Automation & Security

### Home Automation Tools

| Tool                  | Description                              | Link      |
|-----------------------|------------------------------------------|-----------|
| **Home Assistant**    | Open-source home automation platform      | [Website](https://www.home-assistant.io/) |
| **eufy_security**     | Integration for Eufy security devices    | [GitHub](https://github.com/fuatakgun/eufy_security) |
| **Llama 3 Home Assistant** | Llama 3 integration for Home Assistant control | [Guide](https://fixtse.com/tags/home-assistant) |
| **NGINX Proxy Manager** | Reverse proxy for Home Assistant        | [GitHub](https://github.com/hassio-addons/addon-nginx-proxy-manager) |
| **Uptime Kuma**       | Self-hosted monitoring tool              | [GitHub](https://github.com/louislam/uptime-kuma) |
| **Plausible Analytics** | Privacy-friendly web analytics          | [Website](https://plausible.io/) |

### Video Security Tools

| Tool           | Description                        | Link      |
|----------------|------------------------------------|-----------|
| **camera.ui**  | NVR-like UI for RTSP cameras       | [GitHub](https://github.com/seydx/camera.ui) |
| **iSpyConnect**| IP camera streaming software        | [Download](https://www.ispyconnect.com/download) |
| **ZoneMinder** | Full-featured video security system| [Docs](https://zoneminder.readthedocs.io/en/stable/) |
| **SentryShot** | Video management system            | [GitHub](https://github.com/SentryShot/sentryshot) |
| **Frigate**    | NVR with local object detection    | [GitHub](https://github.com/blakeblackshear/frigate) |
| **MotionEye**  | Web frontend for motion daemon      | [GitHub](https://github.com/motioneye-project/motioneye) |
| **Viseron**    | AI computer vision NVR             | [GitHub](https://github.com/roflcoopter/viseron) |
| **Shinobi**    | Scalable CCTV NVR system           | [GitLab](https://gitlab.com/Shinobi-Systems/Shinobi) |
| **Moonfire NVR** | Network video recorder            | [GitHub](https://github.com/scottlamb/moonfire-nvr) |

---
