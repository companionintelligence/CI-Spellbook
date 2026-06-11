# Evaluation, Observability & Tracing

> Tools for tracing LLM calls in production, evaluating model and agent quality, managing prompts, and enforcing safety guardrails.

## Tracing & Observability Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Arize Phoenix](https://github.com/Arize-ai/phoenix) | Open-source AI observability platform with built-in eval templates and OpenTelemetry support. | Self-hosted, Web | Elastic 2.0 license; OpenInference-native; strong for offline eval and notebook workflows. |
| [Helicone](https://github.com/Helicone/helicone) | Proxy-based LLM observability tool; logs every request by changing a base URL. | Self-hosted, Web | Simplest integration of any platform; no SDK changes required. |
| [Langfuse](https://github.com/langfuse/langfuse) | Open-source LLM engineering platform with tracing, prompt management, evals, and datasets. | Self-hosted, Web | MIT license; ClickHouse backend for high-volume storage; broad SDK support. |
| [LangSmith](https://github.com/langchain-ai/langsmith-sdk) | LangChain's observability and evaluation platform with deep LangGraph agent visualization. | Web | Strongest fit for LangChain/LangGraph stacks; CI/CD eval support via custom scripting. |
| [MLflow](https://github.com/mlflow/mlflow) | Unified ML platform with LLM tracing, prompt versioning, and multi-provider auto-instrumentation. | Self-hosted, Web | Apache 2.0; auto-traces OpenAI, LangChain, LlamaIndex, DSPy, AutoGen. |
| [OpenLLMetry](https://github.com/traceloop/openllmetry) | OpenTelemetry-based instrumentation for LLM calls to OpenAI, Anthropic, vector DBs, and more. | Cross-platform | Apache 2.0; plug into any existing OTel stack; Python/TS/Go/Ruby. |
| [W&B Weave](https://github.com/wandb/weave) | W&B's LLM tracing and evaluation layer with decorator-based instrumentation. | Web | Best fit for teams already on W&B for training; @weave.op() makes tracing trivial. |

## Evaluation Frameworks & Benchmarks

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [DeepEval](https://github.com/confident-ai/deepeval) | Pytest-style LLM unit testing framework with built-in metrics for RAG and agents. | Cross-platform | Apache 2.0; closest to a standard pytest workflow for LLM outputs. |
| [Inspect (UK AISI)](https://github.com/UKGovernmentBEIS/inspect_ai) | UK AI Safety Institute's open framework for rigorous LLM evaluations with 200+ pre-built evals. | Cross-platform | MIT license; used for frontier model safety evals; composable scorers and agents. |
| [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | EleutherAI's evaluation suite; official integration point for most public LLM benchmarks. | Cross-platform | MIT license; de facto standard for comparing open-weight model releases. |
| [Ragas](https://github.com/explodinggradients/ragas) | Evaluation framework for RAG pipelines with retrieval and generation metrics. | Cross-platform | Apache 2.0; reference tool for RAG quality assessment. |
| [SWE-bench](https://github.com/princeton-nlp/SWE-bench) | Benchmark of real GitHub issues requiring code changes; standard for agent coding capability. | Cross-platform | MIT license; SWE-bench Verified and SWE-bench Pro are the current canonical variants. |
| [Terminal-Bench](https://github.com/TerminalBench/TerminalBench) | Benchmark for AI agents on realistic, hard terminal-environment tasks. | Cross-platform | Used alongside SWE-bench for evaluating CLI-native agents like Claude Code. |

## Prompt & Experiment Management

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Agenta](https://github.com/agenta-ai/agenta) | Open-source LLM engineering platform for prompt versioning, evaluation, and deployment. | Self-hosted, Web | MIT license; good for teams wanting self-hosted prompt registry with eval integration. |
| [Braintrust](https://github.com/brainlid/braintrust) | AI evaluation platform with CI/CD quality gating, scoring, and merge-blocking workflows. | Web | Strong fit for teams that gate releases on eval scores; no per-seat pricing. |
| [Comet Opik](https://github.com/comet-ml/opik) | LLM observability and evaluation from Comet, with trace logging and LLM-as-a-judge metrics. | Self-hosted, Web | Apache 2.0; integrates with existing Comet experiment tracking for ML teams. |
| [Portkey](https://github.com/portkey-ai/gateway) | LLM gateway with built-in observability, caching, routing, and fallback across 100+ providers. | Self-hosted, Web | MIT license; single integration point for multi-provider setups with automatic cost tracking. |
| [promptfoo](https://github.com/promptfoo/promptfoo) | CLI for testing prompts and agents across multiple providers; includes red-teaming and pentesting. | Cross-platform | MIT license; YAML-driven; acquired by OpenAI 2025; used by OpenAI and Anthropic internally. |
| [TruLens](https://github.com/truera/trulens) | Open-source eval and tracing library focused on RAG and agent chain feedback loops. | Cross-platform | Apache 2.0; TruLens Evals provides reference feedback functions for context relevance and groundedness. |

## Guardrails & Safety

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Guardrails AI](https://github.com/guardrails-ai/guardrails) | Python framework for input/output validation, PII detection, and content risk mitigation. | Cross-platform | Apache 2.0; Guardrails Index benchmark (Feb 2025) covers 24 guardrails across 6 categories. |
| [LLM Guard](https://github.com/protectai/llm-guard) | Security toolkit for scanning LLM inputs and outputs for prompt injection and sensitive data. | Cross-platform | MIT license; lightweight; good for adding safety checks to existing inference pipelines. |
| [NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails) | NVIDIA's programmable guardrail toolkit for LLM conversational systems using Colang DSL. | Self-hosted | Apache 2.0; state-machine approach to dialog control; LangChain dependency now optional. |

## Proprietary Tools Worth Knowing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AgentOps](https://github.com/AgentOps-AI/agentops) | Agent observability platform with time-travel debugging and support for 400+ frameworks. | Web | Freemium; standout feature is trace replay for multi-step agent sessions. |
| [Datadog LLM Observability](https://www.datadoghq.com/product/llm-observability/) | Enterprise LLM monitoring integrated into the Datadog observability stack. | Web | Best fit for teams already on Datadog; adds LLM traces to existing APM dashboards. |
| [Galileo](https://www.rungalileo.io/) | Evaluation and monitoring platform focused on hallucination detection and data quality. | Web | Purpose-built hallucination metrics; strongest for RAG and fine-tuning pipelines. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Langfuse Cookbook](https://github.com/langfuse/langfuse/tree/main/cookbook) | Integration examples for tracing with LangChain, OpenAI SDK, LlamaIndex, and more. | Web | Primary hands-on reference for Langfuse; updated frequently with new provider integrations. |
| [Inspect AI Documentation](https://inspect.aisi.org.uk/) | Official docs for UK AISI's Inspect framework covering solvers, scorers, and agent evals. | Web | Rigorous and detailed; valuable even when not using Inspect directly. |
| [OpenAI Cookbook — Evals](https://developers.openai.com/cookbook/topic/evals) | OpenAI's recipes for evaluating agents, LLM-as-a-judge, and agentic improvement loops. | Web | Covers macro evals, self-evolving agents, and Langfuse integration (updated through 2026). |
| [Awesome AI Evaluation Guide](https://github.com/hparreao/Awesome-AI-Evaluation-Guide) | Curated guide to evaluating LLMs, RAG systems, and agentic AI in production. | Web | Implementation-focused; covers metrics, frameworks, and production deployment patterns. |
