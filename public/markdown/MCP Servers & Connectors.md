# MCP Servers & Connectors

> Model Context Protocol (MCP) is an open standard from Anthropic that lets AI agents connect to external tools, data sources, and services through a unified protocol.

## Registries & Catalogs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [MCP Official Registry](https://registry.modelcontextprotocol.io/) | Community-driven metadata registry for public MCP servers; backed by Anthropic, GitHub, PulseMCP, and Microsoft. | Web | Launched Sept 2025; 9,600+ server records; the canonical discovery endpoint. |
| [Awesome MCP Servers](https://github.com/appcypher/awesome-mcp-servers) | Curated GitHub list of MCP servers organised by category with descriptions and links. | Web | Good breadth; community-maintained; useful for browsing before committing to a registry. |
| [PulseMCP](https://www.pulsemcp.com/servers) | Daily-updated MCP server directory with 17,000+ listings and LLM compatibility notes. | Web | Largest independent directory; good for discovering niche or new servers quickly. |
| [Smithery](https://smithery.ai/) | MCP server marketplace with hosted remote servers and a CLI install path. | Web | 7,000+ servers; can run servers on Smithery's infra or install locally; OAuth modal support. |

## Reference & Official Servers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [MCP Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) | Fetches web URLs and converts HTML to markdown for efficient LLM consumption. | Cross-platform | Official reference server; good first MCP to wire up for web-aware agents. |
| [MCP Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) | Secure local file read/write/search with configurable access controls. | Cross-platform | Official reference; restrict root path carefully in production. |
| [MCP Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) | Read, search, and manipulate Git repositories from an agent. | Cross-platform | Official reference; useful for code-review and changelog workflows. |
| [MCP Memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) | Knowledge-graph persistent memory layer for storing entities and relationships across sessions. | Cross-platform | Official reference; best paired with an agent that needs cross-session recall. |
| [MCP Sequential Thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking) | Guides LLMs through explicit thought sequences for structured problem-solving. | Cross-platform | Official reference; effective for tasks that benefit from step-by-step decomposition. |

## Developer & Code

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Context7](https://github.com/upstash/context7) | Injects up-to-date library documentation and code examples directly into LLM context. | Cross-platform | Reduces hallucinated APIs; requires a Context7 API key; actively maintained by Upstash. |
| [GitHub MCP](https://github.com/github/github-mcp-server) | Official GitHub server for repos, issues, pull requests, code search, and Actions. | Cross-platform | Ships with Claude Code by default; the reference integration for developer workflows. |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Browser automation via Playwright: navigation, screenshots, form fill, and DOM inspection. | Cross-platform | Official Microsoft server; preferred over Puppeteer for headful browser tasks. |

## Data, Search & Web

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Brave Search MCP](https://github.com/brave/brave-search-mcp-server) | Web, image, video, news, and local search via the Brave Search API. | Cross-platform | Official Brave server (the old reference server is archived); requires API key. |
| [Exa MCP](https://github.com/exa-labs/exa-mcp-server) | Semantic and similarity-based web search from Exa AI for research-oriented queries. | Cross-platform | Strong for "find content like this" queries; complements keyword search tools. |
| [Postgres MCP Pro](https://github.com/crystaldba/postgres-mcp) | PostgreSQL server with health checks, index tuning, EXPLAIN, and safe SQL execution. | Cross-platform | Community successor to the archived reference server; configurable read/write access. |
| [Supabase MCP](https://github.com/supabase/mcp-server-supabase) | Manages Supabase projects: databases, auth, storage, edge functions, and SQL workflows. | Cross-platform | Official Supabase server; best for teams already on the Supabase platform. |

## Productivity & Communications

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Atlassian MCP](https://github.com/sooperset/mcp-atlassian) | Connects AI agents to Confluence and Jira; supports cloud and on-premises deployments. | Cross-platform | Community server with strong adoption; good for engineering team knowledge workflows. |
| [Google Workspace MCP](https://github.com/taylorwilsdon/google_workspace_mcp) | Gmail, Drive, Calendar, Docs, Sheets, Slides, and Tasks access with OAuth 2.1. | Cross-platform | Most feature-complete Workspace server; scope OAuth narrowly; MIT licensed. |
| [Notion MCP](https://github.com/makenotion/notion-mcp-server) | Official Notion server for reading, searching, and writing pages and databases. | Web, Cross-platform | Official Notion release; supports workspace search across connected tools like Slack and Jira. |
| [Slack MCP](https://github.com/korotovsky/slack-mcp-server) | Fetches messages, searches conversations, posts content, and manages reactions in Slack. | Cross-platform | Leading community server (official reference archived); stdio, SSE, and HTTP transports. |

## Gateways, Proxies & Security

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [FastMCP Horizon](https://gofastmcp.com/) | Enterprise MCP gateway from the FastMCP team with SSO, RBAC, audit logs, and observability. | Self-hosted | Adds production governance on top of the dominant OSS framework. |
| [MCP Auth Proxy](https://github.com/sigbit/mcp-auth-proxy) | Drop-in OAuth 2.1/OIDC proxy for MCP servers; no server code changes required. | Self-hosted | Verified with Claude, Cursor, GitHub Copilot; supports Google, GitHub, Okta, Auth0. |
| [MCP Gateway & Registry](https://github.com/agentic-community/mcp-gateway-registry) | Enterprise gateway combining OAuth auth, dynamic tool discovery, and Keycloak/Entra integration. | Self-hosted | Good for teams centralising many MCP servers under one governed access layer. |
| [MCP OAuth Gateway](https://github.com/atrawog/mcp-oauth-gateway) | Adds OAuth 2.1 with dynamic client registration to any MCP server as a sidecar. | Self-hosted | Zero modification to target servers; uses GitHub as identity provider by default. |

## Frameworks & SDKs

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [FastMCP](https://github.com/jlowin/fastmcp) | High-level Python framework for building MCP servers and clients with minimal boilerplate. | Cross-platform | The dominant Python MCP framework; wraps and extends the official SDK. |
| [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) | Official low-level Python SDK for building MCP servers and clients. | Cross-platform | Use when you need full protocol control; FastMCP wraps this for everyday use. |
| [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | Official TypeScript SDK for MCP servers and clients; published as @modelcontextprotocol/sdk. | Cross-platform | Ideal when your stack is Node/TypeScript; well-maintained by the core MCP team. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Anthropic MCP Introduction](https://www.anthropic.com/news/model-context-protocol) | Anthropic's original announcement and architecture overview for the Model Context Protocol. | Web | The authoritative starting point; explains the motivation, spec, and official server examples. |
| [Anthropic MCP Course](https://anthropic.skilljar.com/introduction-to-model-context-protocol) | Anthropic's official course covering MCP server and client implementation with the Python SDK. | Web | Structured self-paced learning; good for developers new to the MCP ecosystem. |
| [DeepLearning.AI: MCP with Anthropic](https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic/) | Short hands-on course on building rich-context AI apps using MCP, made with Anthropic. | Web | Practical exercises; good complement to the official docs; free to audit. |
| [MCP Spec & Docs](https://modelcontextprotocol.io/docs) | Official MCP specification, architecture reference, and SDK documentation. | Web | Ground truth for protocol details, transport types, and versioning; updated with each spec release. |
