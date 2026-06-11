# Embeddings & Vector Pipelines

> Tools and models for generating embeddings, parsing documents, chunking text, reranking results, and wiring together retrieval-augmented generation pipelines.

## Embedding Frameworks & Servers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Infinity](https://github.com/michaelfeil/infinity) | High-throughput embedding/reranking server with CUDA, ROCm, CPU, Metal support. | Self-hosted | Supports dense, CLIP, CLAP, and ColPali models via single API. |
| [LangChain](https://github.com/langchain-ai/langchain) | Broad LLM application framework with built-in embedding and retrieval abstractions. | Cross-platform | Agent orchestration now lives in LangGraph; use both together. |
| [LlamaIndex](https://github.com/run-llama/llama_index) | RAG-focused framework with advanced retrieval, chunking, and embedding pipelines. | Cross-platform | Best for data-heavy ingestion; pairs well with LangGraph for agents. |
| [Text Embeddings Inference](https://github.com/huggingface/text-embeddings-inference) | HuggingFace blazing-fast inference server for embedding and classification models. | Self-hosted, Linux | Supports Qwen3, ModernBERT, Jina, BGE, Nomic, and more. |
| [txtai](https://github.com/neuml/txtai) | All-in-one embeddings database combining vector, sparse, and graph indexes. | Self-hosted | Good single-library choice when you want search + LLM workflow in one. |

## RAG Pipeline Orchestration

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [DSPy](https://github.com/stanfordnlp/dspy) | Stanford framework for compiling and optimizing LLM pipelines with typed signatures. | Cross-platform | Use when you want auto-optimized prompting and pipeline reproducibility. |
| [Haystack](https://github.com/deepset-ai/haystack) | Modular production NLP/RAG framework with hybrid search and pipeline composition. | Self-hosted | Strong hybrid keyword+semantic search; good enterprise baseline. |
| [RAGatouille](https://github.com/bclavie/RAGatouille) | ColBERT late-interaction retrieval library; token-level matching for high precision. | Cross-platform | Often outperforms dense-only retrieval; wraps well as a LangChain tool. |

## Document Parsing & Ingestion

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Docling](https://github.com/DS4SD/docling) | IBM document converter for PDF, DOCX, PPTX, HTML with semantic chunking output. | Cross-platform | First-class LlamaIndex/LangChain integrations; best for structured enterprise docs. |
| [Jina Reader](https://github.com/jina-ai/reader) | Converts any URL or uploaded file to clean LLM-ready Markdown via r.jina.ai prefix. | Web, Self-hosted | Stateless OSS branch re-synced with SaaS in April 2026; S3 caching optional. |
| [Kreuzberg](https://github.com/Goldziher/kreuzberg) | Async Python document extraction library for text from PDFs, images, Office files. | Cross-platform | Lightweight alternative to Unstructured; async-native, minimal dependencies. |
| [Marker](https://github.com/VikParuchuri/marker) | Converts PDFs, DOCX, PPTX, EPUB to Markdown/JSON using Surya OCR; GPU/CPU/MPS. | Cross-platform | Recommended general-purpose default; good accuracy/speed balance. |
| [MinerU](https://github.com/opendatalab/MinerU) | Shanghai AI Lab PDF-to-Markdown engine; top accuracy on complex layouts and CJK. | Cross-platform | Best choice for academic papers, scanned docs, or CJK content. |
| [Unstructured](https://github.com/Unstructured-IO/unstructured) | Broad-format ingestion pipeline supporting PDF, email, HTML, spreadsheets, and more. | Self-hosted, Web | Best for heterogeneous source ingestion; table extraction lags Docling/MinerU. |

## Chunking & Preprocessing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Chonkie](https://github.com/chonkie-ai/chonkie) | Fast, lightweight dedicated text chunking library with semantic and recursive modes. | Cross-platform | Focused and dependency-light; good when chunking is the only concern. |
| [LangChain TextSplitters](https://github.com/langchain-ai/langchain) | Recursive, character, token, and semantic splitters built into LangChain core. | Cross-platform | RecursiveCharacterTextSplitter remains a solid general-purpose default. |
| [LlamaIndex NodeParsers](https://github.com/run-llama/llama_index) | Sophisticated node parsers with hierarchical, semantic, and auto-merge strategies. | Cross-platform | Best-in-class for RAG-optimized chunking within the LlamaIndex ecosystem. |
| [semantic-text-splitter](https://github.com/benbrandt/text-splitter) | Rust-backed semantic splitter with Python/WASM bindings; fast and embedding-aware. | Cross-platform | Good choice when chunking throughput matters in high-volume ingestion. |

## Rerankers & Retrieval Quality

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [FlashRank](https://github.com/PrithivirajDamodaran/FlashRank) | Ultra-fast CPU reranker using TinyBERT/MiniLM cross-encoders; sub-20ms latency. | Cross-platform | Best pick for tight latency budgets on CPU-only infrastructure. |
| [RAGatouille](https://github.com/bclavie/RAGatouille) | ColBERT late-interaction retrieval; creates token-level vectors for precise matching. | Cross-platform | Listed above; also the go-to for ColBERT-based reranking. |
| [rerankers](https://github.com/AnswerDotAI/rerankers) | Unified lightweight API for cross-encoders, ColBERT, RankLLM, and Cohere rerankers. | Cross-platform | Lowest-friction way to swap between reranking backends. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [BGE-M3](https://huggingface.co/BAAI/bge-m3) | BAAI multilingual embedding; 568M params, 100+ languages, up to 8192 tokens. | Open weights | Supports dense, sparse, and multi-vector (ColBERT) retrieval in one model. |
| [BGE Reranker v2.5](https://huggingface.co/BAAI/bge-reranker-v2.5-gemma2-lightweight) | BAAI lightweight reranker based on Gemma2; supports token compression and layerwise ops. | Open weights | Good quality/cost balance for production reranking. |
| [bge-multilingual-gemma2](https://huggingface.co/BAAI/bge-multilingual-gemma2) | BAAI 9B multilingual embedding model based on Gemma 2; SOTA on MIRACL/MTEB. | Open weights | Use when multilingual retrieval quality matters more than size. |
| [Jina Embeddings v3](https://huggingface.co/jinaai/jina-embeddings-v3) | Jina 570M model with 8192-token context; long-document and late-chunking support. | Open weights | Strong on long documents; available via Jina API or self-hosted. |
| [Nomic Embed v2](https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe) | MoE embedding model with 8192-token context; competitive open-source quality. | Open weights | Longest context among practical open-source embedding options. |
| [Qwen3-Embedding](https://huggingface.co/Qwen/Qwen3-Embedding) | Alibaba instruction-aware multilingual embedding; flexible 256–2048 dim output. | Open weights | One of the top-ranked open models on MTEB as of mid-2026. |
| [voyage-3-large](https://docs.voyageai.com/docs/embeddings) | Voyage AI hosted embedding model; top retrieval quality in commercial benchmarks. | Hosted API | Recommended for production pipelines where quality outweighs self-hosting cost. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Best Chunking Strategies for RAG 2026](https://www.firecrawl.dev/blog/best-chunking-strategies-rag) | Firecrawl overview of recursive, semantic, and late-chunking strategies. | Web | Good reference for deciding chunking approach in a new pipeline. |
| [Best Embedding Models 2026](https://milvus.io/blog/choose-embedding-model-rag-2026.md) | Milvus comparison of 10 embedding models for RAG with benchmarks. | Web | Practical guide with MTEB numbers and cost vs. quality trade-offs. |
| [Document Parsing for Production RAG](https://medium.com/@manikandan_t/document-parsing-for-production-rag-architecture-tradeoffs-and-when-to-use-what-7a89ab0af7b7) | Architecture trade-offs for Docling, Marker, MinerU, and Unstructured. | Web | Useful for choosing a parser under real production constraints. |
| [Reranking in RAG — Cross-Encoders & FlashRank](https://medium.com/@vaibhav-p-dixit/reranking-in-rag-cross-encoders-cohere-rerank-flashrank-c7d40c685f6a) | Practical walkthrough of reranker options with latency and accuracy data. | Web | Good starting point before adding a reranker to an existing pipeline. |
| [TEI Docs — Text Embeddings Inference](https://huggingface.co/docs/text-embeddings-inference/index) | HuggingFace official docs for deploying embedding servers at scale. | Web | Essential reference for self-hosting TEI in production. |
