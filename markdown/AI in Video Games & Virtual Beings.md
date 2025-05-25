# AI in Video Games & Virtual Beings

> Dive into AI-driven NPCs, virtual characters, and immersive worlds using state-of-the-art behavior engines and SDKs. This guide covers frameworks for dialogue, emotion, and real-time integration in game engines and web platforms.

## Overview

> From adaptive NPC behavior to full character pipelines, these tools enable lifelike interactions based on LLMs, procedural AI, and RL planners. Leverage SDKs for Unity, Unreal, or web to bring virtual beings to life.

## Usage Guidelines

- Select an engine that fits your target platform (Unity, Unreal, or browser-based). Evaluate license and hosted vs self-hosted deployment.
- Prototype with provided SDKs and sample avatars (e.g., Ready Player Me, MetaHumans) to understand integration and animation pipelines.
- Combine dialogue models with custom memory modules to retain context across sessions.
- For web demos, use REST/WebSocket APIs; for games, integrate native SDKs and manage performance budgets (batch requests, caching).
- Monitor user engagement and collect telemetry to refine behavior trees and prompt templates.

| Tool | Description | AI/LLM/Tech Stack | Supported Avatar Formats | Integrations (SDKs/APIs) |
|------|-------------|-------------------|------------------------|-------------------------|
| **Artificial Agency**<br>[Website](https://artificial.agency) | AI-driven NPC behavior engine for games. NPCs have goals, memory, adaptive behaviors, and respond to live game events. Focus on unscripted, lifelike interactions. | Proprietary LLM-powered engine (dialogue, decision-making, behavior trees, RL planners) | Agnostic (works with any 3D character in supported engines) | Game Engine SDKs (Unity, Unreal planned), API for runtime integration |
| **Inworld AI**<br>[Website](https://inworld.ai) [Docs](https://docs.inworld.ai) | Interactive AI characters/NPCs with multimodal AI. Studio for character creation, memory, emotion, safety, TTS/STT, and 20+ ML models for realistic interaction. | Multiple LLMs: Inworld Llama 3.1 70B, OpenAI GPT-4o, GPT-3.5, extensible to others | Engine-agnostic; supports Ready Player Me, MetaHumans, custom rigged 3D models | Unity SDK, Unreal Plugin, REST API/WebSocket, web/mobile support |
| **Charisma.ai**<br>[Website](https://charisma.ai) [Docs](https://docs.charisma.ai) | Interactive storytelling and digital actors. Visual story editor, AI-augmented dialogue, 3D avatars, lip-sync, 1000+ AI voices, real-time player conversations, Unity/Unreal/Web SDKs. | Multiple LLMs: OpenAI GPT-4/3.5, Anthropic Claude, Meta LLaMA, script-based blending | 3D avatars via Unity/Unreal; sample avatars (Reallusion), custom FBX/GLTF, MetaHumans | Unity/Unreal SDKs, Web SDK, REST API |
| **Soul Machines**<br>[Website](https://soulmachines.com) [Docs](https://docs.soulmachines.com) | Photorealistic “Digital People” with real-time emotion, facial animation, and conversation. LLM-agnostic, cloud-based, advanced facial rig, empathy, and affective computing. | LLM-agnostic; default NLP or connect GPT-4, IBM Watson, Azure, etc.; custom emotion/voice modules | Proprietary avatars (Digital DNA), no external model import, advanced facial rig | Web embedding, REST APIs, cloud/on-premise deployment, SDKs for scenarios |
| **Virbe**<br>[Website](https://virbe.ai) [Docs](https://docs.virbe.ai) | Framework for deploying AI-powered 3D virtual beings. Avatar/AI/deployment connectors, real-time rendering, AI Behavior Editor, analytics, “create once – deploy anywhere.” | AI-model agnostic: Rasa, Dialogflow, GPT-3/4, custom NLP, TTS/STT, hybrid | Ready Player Me, MetaHumans, Reallusion, Daz3D, Virbe templates, custom rigged models | SDKs: JavaScript, Unity, Unreal, web/mobile/kiosk, REST API, cloud dashboard |
| **Virtual Beings (KuteEngine)**<br>[Website](https://virtualbeings.co) | Behavioral AI engine for lifelike 3D characters. Realistic emotions, memory, full-body procedural animation, Unity plugin, focus on emergent behavior and VR/AR. | Custom behavior AI (not LLM-based); RL, procedural animation, emotional states | Unity humanoid rigs (FBX/GLB), MetaHumans (Unreal, in progress), quadrupeds | Unity SDK, Unreal plugin (coming), on-device runtime, developer community |
