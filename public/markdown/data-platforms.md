# Data Platforms, Backup, Storage & Sync

> This section brings together modern data stores with the practical systems that keep your data durable, portable, and easy to move.

## Vector & Analytical Databases

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Chroma](https://github.com/chroma-core/chroma) | Embedding database for AI applications with a simple Python API. | Cross-platform, Self-hosted | Default first choice for RAG prototypes; plan a migration path at scale. |
| [DuckDB](https://github.com/duckdb/duckdb) | In-process analytical SQL database with no server required. | Cross-platform | vss + fts + DuckPGQ extensions add vector, full-text, and graph in one engine. |
| [LanceDB](https://github.com/lancedb/lancedb) | Embedded vector database built on Apache Arrow and Lance format. | Cross-platform | Fastest-growing mindshare in 2026; strong for multimodal and serverless workloads. |
| [Milvus](https://github.com/milvus-io/milvus) | Distributed vector database for billion-scale similarity search. | Self-hosted | Best choice when you need horizontal scale beyond single-node limits. |
| [pgvector](https://github.com/pgvector/pgvector) | Open-source vector similarity search extension for PostgreSQL. | Cross-platform, Self-hosted | v0.9 adds sparse vectors and speed boosts; right default for Postgres shops. |
| [Qdrant](https://github.com/qdrant/qdrant) | Rust-based vector database with filtering, named vectors, and payload indexing. | Self-hosted, Web | Fastest open-source option; recommended when you're not already on Postgres. |
| [SurrealDB](https://github.com/surrealdb/surrealdb) | Multi-model database combining document, graph, and relational in one. | Cross-platform, Self-hosted | Strong fit when data shapes are mixed and evolving. |
| [Weaviate](https://github.com/weaviate/weaviate) | Vector database with native BM25 + dense hybrid search and metadata filtering. | Self-hosted, Web | Best choice for hybrid keyword + semantic search in a single query. |

## Graph Databases

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Apache AGE](https://github.com/apache/age) | Graph database extension for PostgreSQL using Cypher query language. | Self-hosted | Good for adding graph queries to an existing Postgres stack. |
| [FalkorDB](https://github.com/FalkorDB/FalkorDB) | Graph database with property graph model; Redis-compatible API. | Self-hosted | Fast query times; designed for knowledge graphs and RAG graph retrieval. |
| [Neo4j](https://github.com/neo4j/neo4j) | Leading property graph database with Cypher query language. | Self-hosted, Web | Cypher 25 delivers massive query performance improvements over older versions. |

## Databases & Data Infrastructure

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [ByteStash](https://github.com/jordan-dalby/ByteStash) | Self-hosted code snippet storage built with React and Node.js. | Self-hosted | Good for internal engineering knowledge. |
| [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser) | Desktop GUI for inspecting and editing SQLite databases. | Cross-platform | Essential utility for lightweight data work. |
| [drawDB](https://github.com/drawdb-io/drawdb) | Diagram editor and SQL generator for database schemas. | Cross-platform, Self-hosted, Web | Good for fast schema communication. |
| [Grist](https://github.com/gristlabs/grist-core) | Spreadsheet-database hybrid for collaborative data workflows. | Self-hosted, Web | Strong fit for teams that outgrow plain spreadsheets. |
| [JSON Crack](https://github.com/AykutSarac/jsoncrack.com) | Interactive visualization for JSON, YAML, XML, and CSV. | Cross-platform, Web | Useful for making complex structures readable. |
| [libSQL](https://github.com/tursodatabase/libsql) | Open-contribution SQLite fork with native vector search and async support. | Cross-platform | Foundation of Turso's hosted offering; embedded-friendly. |
| [Liam ERD](https://github.com/liam-hq/liam) | Generates readable ER diagrams from existing databases. | Web, Self-hosted | Best for visualizing live schema state. |
| [WrenAI](https://github.com/Canner/WrenAI) | Natural-language BI over databases with SQL and chart generation. | Web, Self-hosted | Useful when analytics needs a user-friendly surface. |

## Local-First Sync & CRDT Engines

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Automerge](https://github.com/automerge/automerge) | CRDT library with Rust/WASM core for JSON-like nested state sync. | Cross-platform | Good for mobile apps needing complex nested collaborative state. |
| [ElectricSQL](https://github.com/electric-sql/electric) | Local-first Postgres sync with CRDT-backed conflict resolution; rebuilt in 2024. | Cross-platform | Start with PGlite + Electric for coherent Postgres local-first web apps. |
| [PowerSync](https://github.com/powersync-ja/powersync-service) | Postgres-to-SQLite sync engine with flexible sync rules; production-tested. | Cross-platform, Self-hosted | Most stable local-first option as of 2026; strong mobile support. |
| [Yjs](https://github.com/yjs/yjs) | Most-deployed CRDT library (~920K weekly downloads); bindings for many editors. | Cross-platform | The default choice for collaborative text and structured state. |
| [Zero](https://github.com/rocicorp/mono) | Reactive sync engine from the Replicache team; query-powered state sync. | Cross-platform | Cutting-edge web DX; good for new projects wanting query-driven sync. |

## Backup Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Backrest](https://github.com/garethgeorge/backrest) | Web UI and orchestrator for restic backups. | Cross-platform, Self-hosted | Great companion if you already use restic. |
| [Borg](https://github.com/borgbackup/borg) | Deduplicating encrypted backup tool. | Cross-platform | Reliable choice for scriptable backups. |
| [Cryptomator](https://github.com/cryptomator/cryptomator) | Client-side encryption for cloud-synced files. | Cross-platform, Mobile | Good for secure personal archives. |
| [Duplicacy](https://github.com/gilbertchen/duplicacy) | Encrypted cloud backup with deduplication. | Cross-platform | Useful for multi-backend backup strategies. |
| [Duplicati](https://github.com/duplicati/duplicati) | Encrypted backup tool with scheduling and cloud targets. | Cross-platform | Friendly option for desktop users. |
| [Kopia](https://github.com/kopia/kopia) | Fast encrypted backup with CLI and GUI. | Cross-platform | Strong modern alternative in this category. |
| [Rclone](https://github.com/rclone/rclone) | Swiss-army knife for syncing with cloud storage. | Cross-platform | Critical building block for moving data around. |
| [Restic](https://github.com/restic/restic) | Fast encrypted backup program. | Cross-platform | Excellent default for server and workstation backup. |
| [rustic](https://github.com/rustic-rs/rustic) | Rust-powered backup system inspired by restic. | Cross-platform | Good when you want a newer Rust implementation. |
| [Vorta](https://github.com/borgbase/vorta) | Desktop backup client for Borg. | Cross-platform | Simplifies Borg for GUI-oriented workflows. |

## Storage Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Ceph](https://github.com/ceph/ceph) | Distributed object, block, and file storage platform. | Self-hosted | Fit for serious infrastructure and homelabs. |
| [Garage](https://git.deuxfleurs.fr/Deuxfleurs/garage) | Lightweight Rust S3-compatible object store; ~50 MB RAM, geo-distributed. | Self-hosted | Best MinIO replacement for small clusters; MinIO CE archived Feb 2026. |
| [Maestral](https://github.com/samschott/maestral) | Open-source Dropbox client for macOS and Linux. | macOS, Linux | Archived by its owner (read-only). Nice lightweight sync client. |
| [myDrive](https://github.com/subnub/myDrive) | Self-hosted Google Drive-style clone. | Self-hosted | Useful for simple personal cloud setups. |
| [Nextcloud](https://github.com/nextcloud/server) | Full self-hosted file, collaboration, and app platform. | Cross-platform, Mobile, Self-hosted | Broadest self-hosted cloud stack. |
| [OpenCloud](https://github.com/opencloud-eu/opencloud) | Modern platform for file management and sharing. | Cross-platform, Mobile, Self-hosted | Good option for sovereign cloud setups. |
| [ownCloud](https://github.com/owncloud/core) | Mature self-hosted file synchronization platform. | Cross-platform, Mobile, Self-hosted | Still relevant for classic private cloud deployments. |
| [SeaweedFS](https://github.com/seaweedfs/seaweedfs) | High-performance distributed object store with S3-compatible API. | Self-hosted | Apache 2.0; actively maintained; good MinIO alternative at scale. |
| [Seafile](https://github.com/haiwen/seafile) | Sync and sharing platform with strong file organization features. | Cross-platform, Mobile, Self-hosted | Great for fast sync and large libraries. |

## Sync & Transfer

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [LocalSend](https://github.com/localsend/localsend) | Cross-platform local network transfer tool. | Cross-platform | Great replacement for ad hoc file handoff. |
| [PairDrop](https://github.com/schlagmichdoch/PairDrop) | Browser-based local transfer inspired by AirDrop. | Web | Useful for frictionless short-range sharing. |
| [Rsync](https://github.com/RsyncProject/rsync) | Fast incremental file transfer and synchronization. | Cross-platform | Core primitive for many automation workflows. |
| [Syncthing](https://github.com/syncthing/syncthing) | Continuous peer-to-peer file sync. | Cross-platform | Excellent for cloudless sync between devices. |
| [Syncthing Tray](https://github.com/Martchus/syncthingtray) | Tray integration for Syncthing. | Windows, Linux | Handy for desktop-heavy workflows. |
| [syncthing-macos](https://github.com/syncthing/syncthing-macos) | Native macOS application bundle for Syncthing. | macOS | Easier setup on Apple hardware. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [DuckDB for AI: Vector Search & RAG](https://calmops.com/database/duckdb/duckdb-ai/) | How to use DuckDB's vss extension for ML pipelines and RAG. | Web | Good entry point for adding vector search to analytical workflows. |
| [Local-First Web Architecture 2026](https://www.smashingmagazine.com/2026/05/architecture-local-first-web-development/) | Smashing Magazine deep-dive on sync engines, CRDTs, and local-first patterns. | Web | Best overview article for understanding the local-first stack choices. |
| [Vector DB for RAG — Hands-On Guide](https://learnopencv.com/vector-db-and-rag-pipeline-for-document-rag/) | LearnOpenCV walkthrough of building a full document RAG pipeline. | Web | Practical code examples covering Chroma, Qdrant, Milvus, and pgvector. |
