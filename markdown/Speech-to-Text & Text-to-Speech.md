# Speech-to-Text & Text-to-Speech

> Comprehensive tools for converting speech to text and generating natural-sounding speech. Supports real-time streaming, batch processing, multilingual models, and on-device or cloud deployments.

## Usage Guidelines

- **Speech-to-Text Pipelines**: Choose between streaming (low-latency) and batch (high-accuracy) modes. Configure chunk sizes, punctuation models, and noise suppression for best results.
- **Text-to-Speech Pipelines**: Decide on on-device (privacy, offline) vs cloud (higher quality, scalability) synthesis. Use SSML for prosody control, caching for repeat phrases, and voice cloning for personalization.
- **Model Selection**: Balance accuracy vs performance by selecting appropriate model sizes (e.g., Whisper tiny for mobile, large for broadcast-quality).

## Speech-to-Text Tools

| Tool | Core Architecture(s) | Key Features | Performance & Real-Time | Multilingual | Customization | Strengths | Limitations |
|------|----------------------|--------------|------------------------|--------------|--------------|-----------|-------------|
| **OpenAI Whisper**<br>🪪 MIT<br>🔗 [Code](https://github.com/openai/whisper) / [Docs](https://platform.openai.com/docs/guides/speech-to-text) | Transformer (Encoder-Decoder) | Multilingual transcription & translation, noise resilience, model sizes | Large: 2.73%/7.94% WER, not real-time by default; community variants improve | >50 languages | Limited without fine-tuning; possible | High accuracy, robust, multilingual, translation | High compute, not real-time, limited domain adaptation |
| **Faster Whisper / whisper.cpp / WhisperX**<br>🪪 MIT, BSD-2-Clause<br>🔗 [Faster Whisper](https://github.com/guillaumekln/faster-whisper) / [whisper.cpp](https://github.com/ggerganov/whisper.cpp) / [WhisperX](https://github.com/m-bain/whisperX) | Optimized Whisper (CTranslate2, C++, VAD) | Speed/memory improvements, word-level timestamps, diarization | Similar accuracy, much faster, real-time possible | Same as Whisper | Same as Whisper, plus variant features | Addresses Whisper's speed/memory/real-time | Depends on Whisper, more complex |
| **Wav2Vec 2.0 (Meta AI)**<br>🪪 MIT<br>🔗 [Code](https://github.com/pytorch/fairseq/tree/main/examples/wav2vec) / [Docs](https://ai.facebook.com/blog/wav2vec-20-state-of-the-art-speech-recognition-for-everyone/) | Transformer, Self-supervised | Self-supervised pre-training, high customizability | 1.8%/3.3% WER, real-time possible | Primarily English, fine-tunable | Highly customizable, easy to fine-tune | Excellent with fine-tuning, low-resource support | Complex setup, needs fine-tuning for best results |
| **SpeechBrain**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/speechbrain/speechbrain) / [Docs](https://speechbrain.readthedocs.io/) | PyTorch toolkit (Transformers, Conformer, etc.) | Holistic toolkit, supports Whisper/Wav2Vec2, diarization, enhancement | 2.01%/4.52% WER, real-time evolving | Many datasets/languages via fine-tuning | Highly customizable, YAML configs | Comprehensive, SOTA, Hugging Face integration | Complex for beginners, real-time still evolving |
| **sherpa-onnx (k2-fsa)**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/k2-fsa/sherpa-onnx) / [Docs](https://k2-fsa.github.io/sherpa/onnx/) | Next-gen Kaldi, ONNX, Zipformer, Whisper | Offline, embedded, real-time streaming/non-streaming, TTS, VAD, diarization | 2.21%/4.79% WER, real-time, embedded | Chinese, English, Korean, French, etc. | Supports many pre-trained models, ONNX deploy | Great for offline/embedded, broad support | Benchmarks often refer to icefall recipes |
| **Vosk API**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/alphacep/vosk-api) / [Docs](https://alphacephei.com/vosk/) | Kaldi-based | Offline, lightweight, real-time, reconfigurable vocab, speaker ID | 5.69%/9.85% WER, real-time, zero-latency | >20 languages | Custom language models possible | Lightweight, offline, easy integration | Small models less accurate, large models less lightweight |
| **Kaldi**<br>🪪 Apache 2.0<br>🔗 [Code](https://github.com/kaldi-asr/kaldi) / [Docs](https://kaldi-asr.org/doc/) | GMM-HMM, DNN-HMM, End-to-End | Highly flexible, research-focused, cross-compile | Depends on recipe, real-time possible | Many via recipes | Extremely flexible, customizable | Ultimate flexibility, research toolkit | Very complex, steep learning curve |

## Example: Transcribe Audio with Whisper

```python
from whisper import WhisperModel

model = WhisperModel("base")
audio_path = "podcast_episode.mp3"

# Transcribe the audio file
segments, info = model.transcribe(audio_path)

# Print the transcript
for segment in segments:
    print(f"{segment.start:.2f}s - {segment.end:.2f}s: {segment.text}")

# Optional: Save to file
with open("transcript.txt", "w") as f:
    for segment in segments:
        f.write(f"{segment.start:.2f} - {segment.end:.2f}: {segment.text}\n")
```

## Text-to-Speech Tools

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
