# Communication, Collaboration & Speech Tools

> Messaging, collaboration, mail, meetings, speech pipelines, and voice capture all live here. The focus is practical communication infrastructure, not just chat apps.

## Speech, TTS & Transcription

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Chatterbox](https://github.com/resemble-ai/chatterbox) | MIT-licensed TTS with voice cloning; 11k+ stars, 1M+ HuggingFace downloads. | Cross-platform, Self-hosted | Outperforms ElevenLabs in blind tests; Turbo variant is 350M params. |
| [Dia](https://github.com/nari-labs/dia) | 1.6B-param TTS for ultra-realistic multi-speaker dialogue with nonverbal cues. | Cross-platform, Self-hosted | Apache 2.0; Dia2 adds realtime streaming; needs ~10 GB VRAM. |
| [F5-TTS](https://github.com/SWivid/F5-TTS) | Flow-matching zero-shot TTS trained on 100K hours; seamless code-switching. | Cross-platform, Self-hosted | CC-BY-NC 4.0 (non-commercial); inference RTF of 0.15. |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | CTranslate2-based reimplementation of Whisper; 4× faster on same hardware. | Cross-platform, Self-hosted | Good drop-in for batch and server transcription workloads. |
| [Fish Speech](https://github.com/fishaudio/fish-speech) | SOTA open-source multilingual TTS with zero-shot voice cloning from 3–10 s audio. | Cross-platform, Self-hosted | 26k+ stars; strong ElevenLabs alternative; v1.5 focuses on EN/ZH/JA. |
| [GPT-SoVITS-WebUI](https://github.com/RVC-Boss/GPT-SoVITS) | Few-shot voice cloning and TTS toolkit with web interface. | Cross-platform, Self-hosted | Useful for custom voice experiments. |
| [Handy](https://github.com/cjpais/Handy) | Offline speech-to-text application for macOS. | macOS | Good simple desktop transcription tool. |
| [Hyprnote](https://github.com/fastrepl/hyprnote) | AI notepad for meetings and speech capture with local processing. | Cross-platform | Useful for rapid meeting summaries. |
| [Kokoro](https://github.com/hexgrad/kokoro) | Lightweight 82 M-parameter TTS model with Apache-licensed weights. | Cross-platform, Self-hosted | 54 preset voices; no cloning; 210× real-time on GPU; good for edge. |
| [Meetily](https://github.com/Zackriya-Solutions/meeting-minutes) | Privacy-first local meeting assistant with diarization and summaries. | Windows, macOS | Strong fit for offline meeting capture. |
| [omi](https://github.com/BasedHardware/omi) | Wearable capture device for automatic transcription. | Mobile | Good for ambient capture workflows. |
| [TEN Agent](https://github.com/TEN-framework/TEN-Agent) | Conversational voice agent framework for multimodal pipelines. | Self-hosted | Useful when you need voice-first agents. |
| [VoiceInk](https://github.com/Beingpax/VoiceInk) | Fast voice-to-text utility for macOS. | macOS | Good for dictation into any app. |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | C/C++ port of OpenAI Whisper optimised for local CPU/GPU inference. | Cross-platform | Standard starting point for on-device speech recognition. |
| [WhisperLiveKit](https://github.com/QuentinFuxa/WhisperLiveKit) | Streaming speech recognition toolkit built on Whisper. | Self-hosted | Useful for live and semi-live transcription systems. |
| [WhisperX](https://github.com/m-bain/whisperX) | Whisper with word-level timestamps, speaker diarization, and batch inference. | Cross-platform, Self-hosted | 60–70× real-time; adds diarization missing from base Whisper. |

## Voice Pipelines & Real-time Agents

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [LiveKit Agents](https://github.com/livekit/agents) | WebRTC-first real-time voice AI agent framework; treats audio/video as first class. | Self-hosted | Best for low-latency voice agents needing tight infra integration. |
| [Pipecat](https://github.com/pipecat-ai/pipecat) | Python framework for building STT → LLM → TTS voice and multimodal pipelines. | Self-hosted | Flexible transport; supports multi-agent handoffs and flows. |

## Messaging & Chat

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [bitchat](https://github.com/permissionlesstech/bitchat) | Bluetooth mesh chat with minimal infrastructure requirements. | Mobile | Interesting off-grid communication option. |
| [Legcord](https://github.com/Legcord/Legcord) | Lightweight desktop client compatible with Discord workflows. | Cross-platform | Useful if you want a custom desktop client. |
| [Signal](https://github.com/signalapp/Signal-Android) | Private messenger focused on secure end-to-end encrypted communication. | Cross-platform | Strong baseline for private messaging. |
| [SimpleX](https://github.com/simplex-chat/simplex-chat) | Messaging network designed without global user identifiers. | Cross-platform | Good privacy-forward communication stack. |
| [Telegram Desktop](https://github.com/telegramdesktop/tdesktop) | Desktop Telegram client. | Cross-platform | Useful when Telegram is already part of the workflow. |

## Collaboration & Meetings

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Element](https://github.com/element-hq/element-web) | Matrix protocol client for chat, calling, and federation. | Web | Good if Matrix is your federation and bridging layer. |
| [Jitsi Meet](https://github.com/jitsi/jitsi-meet) | Self-hostable web-based video conferencing platform. | Web | Reliable open video meeting stack. |
| [Mattermost](https://github.com/mattermost/mattermost) | Team collaboration platform focused on self-hosting and controlled deployments. | Self-hosted | Good internal chat platform. |
| [Mumble](https://github.com/mumble-voip/mumble) | Low-latency voice chat software. | Cross-platform | Great for gaming and private voice servers. |
| [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) | Secure comms platform for teams; Community edition up to 100 concurrent users. | Self-hosted, Web | Note: Pro plan retired April 2026; Community is free self-hosted. |
| [Zulip](https://github.com/zulip/zulip) | Threaded team chat optimized for focused technical conversations. | Self-hosted, Web | Excellent for long-lived technical discussions. |

## Mail & Async Communication

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Himalaya](https://github.com/pimalaya/himalaya) | CLI email client. | Cross-platform | Good for terminal-heavy mail workflows. |
| [Inbox Zero](https://github.com/elie222/inbox-zero) | AI-assisted email triage and inbox management app. | Web, Self-hosted | Good for taming high-volume inboxes. |
| [Mailspring](https://github.com/Foundry376/Mailspring) | Fast desktop mail client. | Cross-platform | Good all-purpose mail UI. |
| [Proton Mail](https://github.com/ProtonMail/WebClients) | Web clients for Proton encrypted mail workflows. | Cross-platform, Mobile | Useful if you already rely on Proton services. |
| [Thunderbird](https://github.com/thunderbird/thunderbird-android) | Mature mail and productivity client. | Cross-platform | Still one of the best open mail clients. |
| [Tuta Mail](https://github.com/tutao/tutanota) | Secure email service and client ecosystem. | Android | Good privacy-oriented mail option. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [NVIDIA Parakeet-TDT](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) | NVIDIA NeMo ASR model; ~3380× real-time on GPU; v3 covers 25 languages. | Open weights | Fastest open STT available; tops the Open ASR leaderboard for speed. |
| [Whisper Large v3](https://huggingface.co/openai/whisper-large-v3) | OpenAI's multilingual STT model; 99-language support; MIT licensed. | Open weights | Still the community reference for offline multilingual transcription. |
| [Cartesia Sonic](https://cartesia.ai/) | Hosted low-latency TTS API; Sonic 3.5 current with ~82ms end-to-end latency. | Hosted API | Top-tier for latency-sensitive voice agent pipelines. |
| [Deepgram Nova-3](https://deepgram.com/) | Hosted STT API; conversational Flux model adds <300ms end-of-turn detection. | Hosted API | Strong for real-time transcription with EOT detection. |
| [ElevenLabs Eleven v3](https://elevenlabs.io/) | Hosted TTS; expressive inline tags ([whispers], [laughs]); 70+ languages. | Hosted API | Still a benchmark for expressive, emotionally varied speech. |
| [OpenAI Realtime-2](https://platform.openai.com/docs/guides/realtime) | Unified speech-to-speech model collapsing STT+TTS; GPT-5-class reasoning. | Hosted API | Released May 2026; ideal for voice agents that need reasoning mid-call. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Pipecat Docs](https://docs.pipecat.ai/) | Official documentation covering STT→LLM→TTS pipeline construction. | Web | Best starting point for building voice agent pipelines with Python. |
| [LiveKit Agents Docs](https://docs.livekit.io/agents/) | Official docs for building real-time WebRTC voice agents with LiveKit. | Web | Good for WebRTC-native voice agent architectures. |
| [Hugging Face Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard) | Live benchmark leaderboard for open-source STT models by WER. | Web | Essential reference for choosing an STT model for a given language. |
| [Northflank STT Benchmark Guide](https://northflank.com/blog/best-open-source-speech-to-text-stt-model-in-2026-benchmarks) | In-depth 2026 comparison of open-source STT models with benchmark data. | Web | Good for a data-driven STT model selection. |
