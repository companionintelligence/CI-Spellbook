# Creative Media, Design & AI Art Tools

> This section combines AI image stacks with the broader creative toolchain: graphics, CAD, whiteboards, video editors, and media processing.

## AI Image & Diffusion Workflows

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | Stable Diffusion web interface with a large ecosystem of extensions. | Self-hosted | Reference UI for many workflows; largely superseded by Forge for performance. |
| [ComfyUI](https://github.com/Comfy-Org/ComfyUI) | Node-based diffusion workflow builder supporting image and video generation. | Self-hosted | Default choice for modular, reusable pipelines; NVIDIA NVFP4/FP8 support in 2026. |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | Minimal diffusion interface emphasising prompting over configuration. | Self-hosted | Good starting point for creators wanting less setup overhead. |
| [InvokeAI](https://github.com/invoke-ai/InvokeAI) | Creative engine for image generation with polished web UI and workflow library. | Cross-platform, Self-hosted | Strong for professional canvas-based inpainting and batch workflows. |
| [krita-ai-diffusion](https://github.com/Acly/krita-ai-diffusion) | AI diffusion plugin for Krita: inpaint, outpaint, generate from canvas. | Cross-platform | 10k+ stars; uses ComfyUI backend; v1.51 released June 2026. |
| [SD.Next](https://github.com/vladmandic/sdnext) | All-in-one image and video generation UI supporting many backends. | Self-hosted | Good when you want breadth including video in a single install. |
| [SwarmUI](https://github.com/mcmonkeyprojects/SwarmUI) | Modular Stable Diffusion interface with performance focus and queue management. | Cross-platform | Useful for power-user controls and multi-GPU setups. |
| [WebUI Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) | Performance-tuned Stable Diffusion UI branch with lower VRAM requirements. | Self-hosted | Preferred over A1111 for speed on consumer GPUs. |

## AI Video Generation

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [FramePack](https://github.com/lllyasviel/FramePack) | Next-frame prediction model for long video generation at constant VRAM usage. | Self-hosted | Works on 6 GB GPU; from the Fooocus/Forge author. |
| [HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) | Tencent's open-source video generation model; v1.5 is 8.3B params, Apache 2.0. | Self-hosted | Strong natural motion and physics; 75-second renders on RTX 4090. |
| [LTX-Video](https://github.com/Lightricks/LTX-Video) | Lightricks' open-source video model; v2.3 supports native 4K/50fps with audio. | Self-hosted | Fastest open model for iteration; 22B params, Apache 2.0 licensed. |
| [Wan2.2](https://github.com/Wan-Video/Wan2.2) | Alibaba's open MoE video model for text-to-video and image-to-video. | Self-hosted | Leads photorealism benchmarks; lightweight 1.3B variant runs on 8 GB VRAM. |

## AI 3D Generation

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) | Tencent's two-stage 3D generation model: shape + PBR texture synthesis. | Self-hosted | v2.1 runs shape generation on 6 GB VRAM; best consumer-friendly option. |
| [TRELLIS](https://github.com/microsoft/TRELLIS) | Microsoft's structured 3D latent model (CVPR 2025); text/image to mesh/Gaussian. | Self-hosted | Production-grade PBR output; TRELLIS.2-4B is current flagship. |
| [TripoSR](https://github.com/VAST-AI-Research/TripoSR) | Fast single-image to 3D reconstruction model; sub-second inference. | Self-hosted | MIT licensed; 6–8 GB VRAM; 117k+ monthly HuggingFace downloads. |

## Graphics, Design & Illustration

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Blender](https://github.com/blender/blender) | Full 3D creation suite for modeling, animation, and rendering. | Cross-platform | Core tool for open creative pipelines. |
| [Graphite](https://github.com/GraphiteEditor/Graphite) | Open 2D design suite with procedural, node-based editing. | Web | Worth tracking for next-gen illustration workflows. |
| [Krita](https://github.com/KDE/krita) | Full-featured digital painting application. | Cross-platform | Pairs naturally with krita-ai-diffusion for AI-assisted painting. |
| [Penpot](https://github.com/penpot/penpot) | Open design and prototyping platform. | Web | Strong self-hostable collaborative design alternative. |
| [Pencil2D](https://github.com/pencil2d/pencil) | Hand-drawn 2D animation tool. | Cross-platform | Good for lightweight traditional animation workflows. |
| [PixiEditor](https://github.com/PixiEditor/PixiEditor) | Universal editor for pixel art and 2D creation. | Cross-platform | Good for sprite and pixel-focused work. |

## CAD, Whiteboards & Diagrams

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [CadQuery](https://github.com/CadQuery/cadquery) | Python-based parametric CAD framework. | Cross-platform | Excellent for programmable geometry. |
| [drawDB](https://github.com/drawdb-io/drawdb) | SQL diagram editor with export support. | Cross-platform, Self-hosted, Web | Helpful for schema communication. |
| [drawio-desktop](https://github.com/jgraph/drawio-desktop) | Desktop build of draw.io for diagrams. | Cross-platform | Reliable default for diagrams. |
| [Excalidraw](https://github.com/excalidraw/excalidraw) | Hand-drawn style collaborative whiteboard. | Self-hosted, VS Code | Great for diagrams and low-friction sketching. |
| [FreeCAD](https://github.com/FreeCAD/FreeCAD) | Cross-platform parametric 3D modeler. | Cross-platform | Open baseline for mechanical design. |
| [OpenSCAD](https://github.com/openscad/openscad) | Script-driven solid modeling tool. | Cross-platform | Great for code-native fabrication work. |
| [QCAD](https://github.com/qcad/qcad) | 2D CAD application with DXF support. | Cross-platform | Good for drafting workflows. |

## Audio, Video & Media Processing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Audacity](https://github.com/audacity/audacity) | Open audio editor for recording and cleanup. | Cross-platform | Core tool for quick audio editing. |
| [HandBrake](https://github.com/HandBrake/HandBrake) | Video transcoder for preparing and compressing footage. | Cross-platform | Standard utility for media conversion. |
| [Kdenlive](https://github.com/KDE/kdenlive) | Non-linear video editor. | Cross-platform | Good full-featured editor for general work. |
| [LosslessCut](https://github.com/mifi/lossless-cut) | Fast trimming without re-encoding. | Cross-platform | Perfect for quick edits and clip extraction. |
| [OBS Studio](https://github.com/obsproject/obs-studio) | Live streaming and screen recording suite. | Cross-platform | The default open recording tool. |
| [Olive](https://github.com/olive-editor/olive) | Open-source non-linear video editor. | Cross-platform | Worth tracking as it matures. |
| [OpenCut](https://github.com/OpenCut-app/OpenCut) | Open-source browser-native short-form video editor. | Web | Good fit for browser-native video work. |
| [OpenUtau](https://github.com/openutau/OpenUtau) | Open singing synthesis platform. | Cross-platform | Useful for vocal synthesis workflows. |
| [Shotcut](https://github.com/mltframework/shotcut) | Cross-platform video editor based on MLT framework. | Cross-platform | Strong established editor. |

## Image Processing & Cleanup

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [chaiNNer](https://github.com/chaiNNer-org/chaiNNer) | Node-based image processing and enhancement workflow tool. | Cross-platform | Good for repeatable image pipelines. |
| [darktable](https://github.com/darktable-org/darktable) | Photography workflow and RAW developer. | Cross-platform | Good open RAW workflow. |
| [ImageMagick](https://github.com/ImageMagick/ImageMagick) | Scriptable image processing suite. | Cross-platform | Essential for automation and batch jobs. |
| [RapidRAW](https://github.com/CyberTimon/RapidRAW) | GPU-accelerated non-destructive RAW editor. | Cross-platform | Worth tracking for performance-focused editing. |
| [RawTherapee](https://github.com/RawTherapee/RawTherapee) | Cross-platform raw photo processing application. | Cross-platform | Great alternative raw editor. |
| [Upscayl](https://github.com/upscayl/upscayl) | Open-source AI image upscaler. | Cross-platform | Easy win for image restoration and enlargement. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [FLUX.1 dev](https://github.com/black-forest-labs/flux) | Black Forest Labs' flagship open-weight T2I model; 12B params, non-commercial licence. | Open weights | Best open image model for prompt adherence and photorealism in 2026. |
| [FLUX.2 dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) | Successor with multi-reference editing (up to 10 sources) and 4MP output. | Open weights, Hosted API | FLUX.2 klein is Apache 2.0; dev is source-available non-commercial. |
| [HunyuanImage](https://github.com/Tencent-Hunyuan/HunyuanImage-3.0) | Tencent's 80B MoE autoregressive image model for generation and editing. | Open weights | Strong multilingual prompting; good complement to FLUX for CJK languages. |
| [Qwen-Image](https://github.com/QwenLM/Qwen-Image) | Alibaba's 20B unified generation+editing model; v2.0 is 7B, top AI Arena ranking. | Hosted API | v2.0 open weights not yet released as of June 2026; available via API. |
| [Stable Diffusion 3.5](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) | Stability AI's MMDiT-based T2I model; SD3.5 Large is 8B params. | Open weights | Strong community LoRA ecosystem; needs 18 GB VRAM for the large variant. |
| [Imagen 4](https://deepmind.google/models/imagen/) | Google DeepMind hosted T2I model; GA in Gemini API as of Feb 2026; up to 2K output. | Hosted API | Three tiers: Ultra, Flagship, and Fast. |
| [Kling 3.0](https://kling.ai/) | Kuaishou's hosted video model; 15 s clips at 4K/60fps in one pass. | Hosted API | Multiple entries in the top-10 of 2026 video leaderboards. |
| [Midjourney](https://www.midjourney.com/) | Hosted T2I/T2V service; V8 generation current as of spring 2026. | Hosted API | Still the benchmark for aesthetic quality among hosted image generators. |
| [Sora 2](https://openai.com/sora) | OpenAI hosted video+audio model; consumer app discontinued April 2026. | Hosted API | Deprecated — API shuts down Sept 2026; avoid new pipelines on it. |
| [Veo 3.1](https://deepmind.google/models/veo/) | Google DeepMind hosted video model with native 48kHz audio generation. | Hosted API | Consistent top-3 on video leaderboards; available via Gemini API. |
| [TRELLIS.2](https://github.com/microsoft/TRELLIS.2) | Microsoft's 4B-param image-to-3D model; outputs PBR meshes and 3D Gaussians. | Open weights | Best production-grade open 3D generator; successor to TRELLIS. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Stable Diffusion Art](https://stable-diffusion-art.com/) | Deep-dive tutorials and ready-to-run workflows for ComfyUI, A1111, and Forge. | Web | Best all-round reference for local diffusion workflows. |
| [ComfyUI Wiki](https://comfyui-wiki.com/en/tutorial/basic) | Official community wiki with basic-to-advanced node tutorials; updated Jan 2026. | Web | Good first stop for node-graph fundamentals. |
| [Udemy — Generative AI with SD & ComfyUI](https://www.udemy.com/course/generative-ai-with-stable-diffusion-and-comfyui/) | Structured course covering SD, ComfyUI, and FLUX workflows. | Web | Good paid option for a guided curriculum. |
| [ComfyUI YouTube Series](https://www.youtube.com/playlist?list=PL-pohOSaL8P9kLZP8tQ1K1QWdZEgwiBM0) | Video tutorial series from installation to advanced ComfyUI techniques. | Web | Useful for visual learners new to node-based generation. |
| [Krita AI Diffusion Docs](https://github.com/Acly/krita-ai-diffusion/wiki) | Official wiki for the krita-ai-diffusion plugin covering setup and features. | Web | Essential if using AI generation inside Krita canvas. |
