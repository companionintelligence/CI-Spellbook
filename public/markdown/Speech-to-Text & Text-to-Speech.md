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

## Advanced Voice Processing & Enhancement

| Tool | Primary Purpose | Key Features | Quality & Performance | Supported Formats | Integration | Use Cases |
|------|-----------------|--------------|----------------------|------------------|-------------|-----------|
| **Real-Time-Voice-Cloning**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/CorentinJ/Real-Time-Voice-Cloning) | Real-time voice synthesis and cloning | Live microphone input, speaker encoding, neural vocoding | Good quality, ~1-2 second latency | WAV, MP3 input; WAV output | Python library, microphone integration | Live voice conversion, streaming |
| **Tortoise TTS**<br>🪪 Apache 2.0<br>🔗 [GitHub](https://github.com/neonbjb/tortoise-tts) | Ultra-realistic text-to-speech generation | Multi-voice cloning, emotional control, fine-grained conditioning | Extremely high quality, slow generation (minutes per sentence) | WAV, supports voice reference files | Python API, batch processing | High-quality audiobook production, film dubbing |
| **Bark (Suno AI)**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/suno-ai/bark) | Generative audio model for speech and sounds | Non-verbal communication, multiple languages, sound effects | High quality, includes laughter/sighs, moderate speed | WAV output, text input with special tokens | HuggingFace integration, simple API | Creative audio, podcasts, storytelling |
| **YourTTS**<br>🪪 MPL-2.0<br>🔗 [GitHub](https://github.com/Edresson/YourTTS) | Zero-shot multi-speaker TTS | Voice conversion, emotion transfer, accent control | Good quality, faster than Tortoise | WAV, supports reference audio | Coqui TTS integration | Multilingual content, voice personalization |
| **RVC (Retrieval-based Voice Conversion)**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI) | Real-time voice conversion and training | Custom model training, real-time processing, pitch control | High quality with good training data | Multiple audio formats | WebUI, batch processing | Voice modification, singing synthesis |
| **so-vits-svc**<br>🪪 LGPL-3.0<br>🔗 [GitHub](https://github.com/svc-develop-team/so-vits-svc) | Singing voice conversion | Musical pitch control, breath/vibrato modeling, cross-gender conversion | Excellent for singing, good speech quality | WAV, FLAC, supports MIDI | Training pipeline, inference tools | Music production, vocal synthesis |
| **MockingBird**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/babysor/MockingBird) | Chinese-focused real-time voice cloning | Chinese language optimization, web interface, real-time synthesis | Good quality for Chinese, moderate for other languages | WAV, MP3 | Web UI, Python API | Chinese content creation, dubbing |

## Noise Reduction & Audio Enhancement

| Tool | Primary Purpose | Enhancement Type | Technology | Performance | Integration | Best Use Cases |
|------|-----------------|------------------|------------|-------------|-------------|----------------|
| **Facebook Denoiser**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/facebookresearch/denoiser) | Real-time speech enhancement | Background noise removal, echo cancellation | Deep learning (Conv-TasNet) | Real-time processing, high quality | Python library, streaming support | Video calls, podcast cleanup, live streaming |
| **DeepFilterNet**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/Rikorose/DeepFilterNet) | Real-time noise suppression | Noise reduction, speech enhancement | Deep neural filtering | Low latency, excellent quality | Python/Rust, ONNX export | Production audio, real-time applications |
| **SpeechBrain Enhancement**<br>🪪 Apache 2.0<br>🔗 [GitHub](https://github.com/speechbrain/speechbrain) | Multi-task speech enhancement | Noise reduction, dereverberation, source separation | Various architectures (LSTM, Transformer) | State-of-the-art results | Full training pipeline | Research, custom enhancement models |
| **Real-ESRGAN Audio**<br>🪪 BSD-3-Clause<br>🔗 [GitHub](https://github.com/ai-forever/Real-ESRGAN) | Audio super-resolution | Upsampling, quality enhancement | GAN-based super-resolution | High quality upsampling | Python library | Audio restoration, quality improvement |
| **AudioSR**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/haoheliu/AudioSR) | Audio super-resolution and enhancement | Bandwidth extension, quality improvement | Diffusion models | Excellent restoration quality | Simple Python API | Archive restoration, quality enhancement |
| **CleanUNet**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/NVIDIA/CleanUNet) | Speech denoising and enhancement | Noise removal, artifact reduction | U-Net architecture with self-attention | High quality, GPU-optimized | PyTorch implementation | Professional audio cleanup |

## Voice Activity Detection & Segmentation

| Tool | Detection Type | Accuracy | Real-time Capability | Languages | Integration | Use Cases |
|------|----------------|----------|----------------------|-----------|-------------|-----------|
| **py-webrtcvad**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/wiseman/py-webrtcvad) | Voice Activity Detection | Good, optimized for speech | Real-time, low latency | Language agnostic | Simple Python wrapper | Live transcription, voice triggers |
| **SileroVAD**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/snakers4/silero-vad) | Voice Activity Detection | High accuracy, robust | Real-time capable | Language agnostic | ONNX models, PyTorch | Production VAD, preprocessing |
| **pyannote.audio**<br>🪪 MIT<br>🔗 [GitHub](https://github.com/pyannote/pyannote-audio) | Speaker diarization, VAD, segmentation | State-of-the-art | Near real-time | Multiple languages | HuggingFace integration | Meeting transcription, speaker identification |
| **speechbrain VAD**<br>🪪 Apache 2.0<br>🔗 [SpeechBrain](https://speechbrain.github.io/speechbrain/) | Voice Activity Detection | High accuracy | Configurable latency | Multilingual | Full training pipeline | Custom VAD training, research |
| **NVIDIA NeMo VAD**<br>🪪 Apache 2.0<br>🔗 [GitHub](https://github.com/NVIDIA/NeMo) | Enterprise-grade VAD | Production quality | Real-time optimized | Multilingual | Enterprise integration | Large-scale applications, ASR preprocessing |
| **Resemblyzer**<br>🪪 Apache 2.0<br>🔗 [GitHub](https://github.com/resemble-ai/Resemblyzer) | Speaker verification and clustering | Good for speaker identification | Batch processing optimized | Language agnostic | Simple Python API | Speaker verification, voice clustering |

## Language-Specific Optimizations

| Language/Region | Specialized Tools | Key Features | Performance Notes | Availability |
|-----------------|-------------------|--------------|-------------------|--------------|
| **Chinese** | PaddleSpeech, WeNet, FunASR | Mandarin/Cantonese support, tone recognition | Excellent for Chinese dialects | Open source, commercial options |
| **Japanese** | ESPnet, Julius, ReazonSpeech | Hiragana/Katakana/Kanji handling | Good accent variation support | Research and commercial |
| **Arabic** | Arabic Speech Corpus, NVIDIA NeMo | Dialect variation, right-to-left text | Improving, dialect-specific models | Limited but growing |
| **Indian Languages** | AI4Bharat, IndicWav2Vec | 20+ Indian languages, code-switching | Good for major languages | Open source initiative |
| **European** | Mozilla Common Voice, SpeechBrain | 50+ European languages | Varies by language | Strong open source support |
| **African Languages** | Masakhane, Google Research | Underrepresented language support | Emerging, limited data | Research-focused |

## Real-Time Processing & Streaming

### WebRTC Integration Example

```python
# Example: Real-time speech processing with WebRTC
import asyncio
import websockets
import json
import numpy as np
from scipy.io import wavfile
import torch
import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration

class RealTimeSTTProcessor:
    def __init__(self, model_name="openai/whisper-base"):
        self.processor = WhisperProcessor.from_pretrained(model_name)
        self.model = WhisperForConditionalGeneration.from_pretrained(model_name)
        self.sample_rate = 16000
        self.chunk_duration = 5  # seconds
        self.chunk_samples = self.sample_rate * self.chunk_duration
        
    def preprocess_audio(self, audio_chunk):
        """Preprocess audio chunk for model input"""
        # Convert to mono if stereo
        if len(audio_chunk.shape) > 1:
            audio_chunk = np.mean(audio_chunk, axis=1)
        
        # Resample if necessary
        if len(audio_chunk) != self.chunk_samples:
            # Simple resampling (use librosa for production)
            audio_chunk = np.resize(audio_chunk, self.chunk_samples)
        
        return audio_chunk
    
    def transcribe_chunk(self, audio_chunk):
        """Transcribe a single audio chunk"""
        try:
            # Preprocess
            audio_chunk = self.preprocess_audio(audio_chunk)
            
            # Process with Whisper
            inputs = self.processor(
                audio_chunk,
                sampling_rate=self.sample_rate,
                return_tensors="pt"
            )
            
            # Generate transcription
            with torch.no_grad():
                predicted_ids = self.model.generate(**inputs)
                transcription = self.processor.batch_decode(
                    predicted_ids, skip_special_tokens=True
                )[0]
            
            return transcription.strip()
        
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""
    
    async def process_stream(self, websocket, path):
        """Handle WebSocket connection for real-time processing"""
        audio_buffer = np.array([])
        
        try:
            async for message in websocket:
                data = json.loads(message)
                
                if data['type'] == 'audio':
                    # Decode audio data (base64 or binary)
                    audio_data = np.frombuffer(
                        data['audio'], dtype=np.float32
                    )
                    
                    # Add to buffer
                    audio_buffer = np.concatenate([audio_buffer, audio_data])
                    
                    # Process complete chunks
                    while len(audio_buffer) >= self.chunk_samples:
                        chunk = audio_buffer[:self.chunk_samples]
                        audio_buffer = audio_buffer[self.chunk_samples:]
                        
                        # Transcribe chunk
                        transcription = self.transcribe_chunk(chunk)
                        
                        if transcription:
                            # Send result back
                            result = {
                                'type': 'transcription',
                                'text': transcription,
                                'timestamp': data.get('timestamp', 0)
                            }
                            await websocket.send(json.dumps(result))
        
        except websockets.exceptions.ConnectionClosed:
            print("WebSocket connection closed")
        except Exception as e:
            print(f"Stream processing error: {e}")

# WebSocket server setup
def start_realtime_server():
    processor = RealTimeSTTProcessor()
    
    start_server = websockets.serve(
        processor.process_stream, 
        "localhost", 
        8765
    )
    
    print("Real-time STT server started on ws://localhost:8765")
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

# start_realtime_server()
```

### Voice Activity Detection Pipeline

```python
# Example: Advanced VAD with noise reduction
import numpy as np
import librosa
import torch
import torchaudio
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps

class AdvancedVADPipeline:
    def __init__(self, vad_model='silero', enhancement_model=None):
        # Load VAD model
        if vad_model == 'silero':
            self.vad_model = load_silero_vad()
        
        # Optional: Load enhancement model
        self.enhancement_model = enhancement_model
        self.sample_rate = 16000
        
    def enhance_audio(self, audio):
        """Apply noise reduction and enhancement"""
        if self.enhancement_model is None:
            return audio
        
        # Apply noise reduction (placeholder)
        # In practice, use Facebook Denoiser, DeepFilterNet, etc.
        enhanced = audio  # Placeholder
        
        return enhanced
    
    def detect_speech_segments(self, audio_path, return_seconds=True):
        """Detect speech segments in audio file"""
        # Read audio
        wav = read_audio(audio_path, sampling_rate=self.sample_rate)
        
        # Enhance audio
        wav_enhanced = self.enhance_audio(wav)
        
        # Get speech timestamps
        speech_timestamps = get_speech_timestamps(
            wav_enhanced, 
            self.vad_model,
            sampling_rate=self.sample_rate
        )
        
        if return_seconds:
            # Convert to seconds
            speech_segments = [
                {
                    'start': ts['start'] / self.sample_rate,
                    'end': ts['end'] / self.sample_rate,
                    'duration': (ts['end'] - ts['start']) / self.sample_rate
                }
                for ts in speech_timestamps
            ]
        else:
            speech_segments = speech_timestamps
        
        return speech_segments
    
    def extract_speech_chunks(self, audio_path, min_duration=1.0, max_duration=30.0):
        """Extract speech chunks suitable for transcription"""
        # Load audio
        audio, sr = librosa.load(audio_path, sr=self.sample_rate)
        
        # Get speech segments
        segments = self.detect_speech_segments(audio_path)
        
        # Filter and merge segments
        filtered_chunks = []
        current_chunk = None
        
        for segment in segments:
            duration = segment['duration']
            
            # Skip very short segments
            if duration < min_duration:
                continue
            
            # Split long segments
            if duration > max_duration:
                # Split into smaller chunks
                start_time = segment['start']
                while start_time < segment['end']:
                    chunk_end = min(start_time + max_duration, segment['end'])
                    filtered_chunks.append({
                        'start': start_time,
                        'end': chunk_end,
                        'duration': chunk_end - start_time
                    })
                    start_time = chunk_end
            else:
                # Merge adjacent short segments
                if (current_chunk is not None and 
                    segment['start'] - current_chunk['end'] < 2.0 and
                    current_chunk['duration'] + duration < max_duration):
                    # Merge with current chunk
                    current_chunk['end'] = segment['end']
                    current_chunk['duration'] = current_chunk['end'] - current_chunk['start']
                else:
                    # Start new chunk
                    if current_chunk:
                        filtered_chunks.append(current_chunk)
                    current_chunk = segment.copy()
        
        # Add final chunk
        if current_chunk:
            filtered_chunks.append(current_chunk)
        
        return filtered_chunks
    
    def process_long_audio(self, audio_path, transcription_func, max_workers=4):
        """Process long audio file with optimal chunking"""
        import concurrent.futures
        
        # Extract optimal speech chunks
        chunks = self.extract_speech_chunks(audio_path)
        
        # Load audio for chunk extraction
        audio, sr = librosa.load(audio_path, sr=self.sample_rate)
        
        def process_chunk(chunk):
            start_sample = int(chunk['start'] * sr)
            end_sample = int(chunk['end'] * sr)
            chunk_audio = audio[start_sample:end_sample]
            
            # Save chunk temporarily or pass directly to transcription
            result = transcription_func(chunk_audio)
            
            return {
                'start': chunk['start'],
                'end': chunk['end'],
                'text': result,
                'duration': chunk['duration']
            }
        
        # Process chunks in parallel
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            results = list(executor.map(process_chunk, chunks))
        
        # Sort by start time
        results.sort(key=lambda x: x['start'])
        
        return results

# Usage example
def example_vad_pipeline():
    pipeline = AdvancedVADPipeline()
    
    # Example transcription function
    def simple_transcription(audio_chunk):
        # Placeholder - integrate with your STT model
        return f"Transcribed {len(audio_chunk)} samples"
    
    # Process long audio file
    results = pipeline.process_long_audio(
        "long_podcast.wav",
        simple_transcription,
        max_workers=2
    )
    
    # Generate transcript with timestamps
    for result in results:
        print(f"[{result['start']:.2f}-{result['end']:.2f}s]: {result['text']}")

# example_vad_pipeline()
```

## Text-to-Speech Optimization & Quality Enhancement

### Voice Cloning with Quality Control

```python
# Example: Advanced voice cloning with quality assessment
import torch
import torchaudio
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import librosa
from scipy.stats import pearsonr

class VoiceCloningPipeline:
    def __init__(self, tts_model='coqui', quality_threshold=0.8):
        self.tts_model = tts_model
        self.quality_threshold = quality_threshold
        self.reference_embeddings = {}
        
    def extract_voice_embedding(self, audio_path):
        """Extract voice embedding for similarity comparison"""
        # Load audio
        audio, sr = librosa.load(audio_path, sr=16000)
        
        # Extract features (simplified - use proper speaker embedding model)
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
        embedding = np.mean(mfccs, axis=1)
        
        return embedding
    
    def assess_audio_quality(self, audio_path):
        """Assess audio quality metrics"""
        audio, sr = librosa.load(audio_path)
        
        # Signal-to-noise ratio estimation
        rms = librosa.feature.rms(y=audio)[0]
        snr_estimate = np.mean(rms) / (np.std(rms) + 1e-8)
        
        # Spectral rolloff (frequency content)
        rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sr)[0]
        high_freq_content = np.mean(rolloff) / (sr / 2)
        
        # Zero crossing rate (speech naturalness)
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        speech_naturalness = 1 - abs(np.mean(zcr) - 0.1)  # Optimal around 0.1
        
        # Combined quality score
        quality_score = (
            min(snr_estimate / 10, 1.0) * 0.4 +
            high_freq_content * 0.3 +
            max(speech_naturalness, 0) * 0.3
        )
        
        return {
            'overall_quality': quality_score,
            'snr_estimate': snr_estimate,
            'high_freq_content': high_freq_content,
            'speech_naturalness': speech_naturalness
        }
    
    def clone_voice_with_validation(self, reference_audio, text, target_path, max_attempts=3):
        """Clone voice with quality validation and retry logic"""
        # Extract reference embedding
        ref_embedding = self.extract_voice_embedding(reference_audio)
        
        best_result = None
        best_quality = 0
        
        for attempt in range(max_attempts):
            # Generate speech (placeholder - integrate with actual TTS)
            generated_audio = self.generate_speech(text, reference_audio)
            
            # Save temporary file for assessment
            temp_path = f"temp_generation_{attempt}.wav"
            torchaudio.save(temp_path, generated_audio, 22050)
            
            # Assess quality
            quality_metrics = self.assess_audio_quality(temp_path)
            
            # Check voice similarity
            gen_embedding = self.extract_voice_embedding(temp_path)
            similarity = cosine_similarity([ref_embedding], [gen_embedding])[0][0]
            
            # Combined score
            combined_score = (
                quality_metrics['overall_quality'] * 0.6 +
                similarity * 0.4
            )
            
            print(f"Attempt {attempt + 1}: Quality={quality_metrics['overall_quality']:.3f}, "
                  f"Similarity={similarity:.3f}, Combined={combined_score:.3f}")
            
            if combined_score > best_quality:
                best_quality = combined_score
                best_result = {
                    'audio': generated_audio,
                    'quality_metrics': quality_metrics,
                    'similarity': similarity,
                    'combined_score': combined_score
                }
            
            # Early exit if quality threshold met
            if combined_score >= self.quality_threshold:
                break
        
        # Save best result
        if best_result and best_result['combined_score'] >= self.quality_threshold:
            torchaudio.save(target_path, best_result['audio'], 22050)
            return best_result
        else:
            raise ValueError(f"Could not generate voice clone meeting quality threshold "
                           f"({self.quality_threshold}). Best score: {best_quality:.3f}")
    
    def generate_speech(self, text, reference_audio):
        """Generate speech using TTS model (placeholder)"""
        # This would integrate with actual TTS models like:
        # - Coqui XTTS
        # - Tortoise TTS
        # - YourTTS
        # - OpenVoice
        
        # Placeholder: Generate random audio
        duration = len(text) * 0.1  # Rough estimate
        samples = int(22050 * duration)
        audio = torch.randn(1, samples) * 0.1  # Placeholder
        
        return audio
    
    def batch_voice_cloning(self, reference_audio, text_list, output_dir, prefix="cloned"):
        """Clone multiple texts with the same reference voice"""
        from pathlib import Path
        
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        results = []
        
        for i, text in enumerate(text_list):
            output_path = output_dir / f"{prefix}_{i:03d}.wav"
            
            try:
                result = self.clone_voice_with_validation(
                    reference_audio, text, str(output_path)
                )
                
                results.append({
                    'text': text,
                    'output_path': str(output_path),
                    'quality_score': result['combined_score'],
                    'success': True
                })
                
                print(f"✓ Generated: {output_path} (Quality: {result['combined_score']:.3f})")
                
            except Exception as e:
                results.append({
                    'text': text,
                    'output_path': None,
                    'error': str(e),
                    'success': False
                })
                
                print(f"✗ Failed: {text[:50]}... - {e}")
        
        return results

# Usage example
def example_voice_cloning():
    pipeline = VoiceCloningPipeline()
    
    texts = [
        "Hello, this is a test of voice cloning technology.",
        "The weather today is absolutely beautiful.",
        "I hope this voice sounds natural and clear.",
        "Thank you for listening to this demonstration."
    ]
    
    results = pipeline.batch_voice_cloning(
        reference_audio="reference_voice.wav",
        text_list=texts,
        output_dir="./cloned_voices",
        prefix="demo"
    )
    
    # Summary
    successful = sum(1 for r in results if r['success'])
    average_quality = np.mean([r['quality_score'] for r in results if r['success']])
    
    print(f"\nBatch cloning complete:")
    print(f"- Successful: {successful}/{len(results)}")
    print(f"- Average quality: {average_quality:.3f}")

# example_voice_cloning()
```

## Production Deployment & Scaling

### Microservice Architecture Example

```python
# Example: Production TTS/STT microservice with FastAPI
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
import aiofiles
import tempfile
import uuid
from typing import List, Optional
from pydantic import BaseModel
import redis
import json
from celery import Celery

# FastAPI app
app = FastAPI(title="Speech Processing API", version="1.0.0")

# Redis for caching
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Celery for background tasks
celery_app = Celery('speech_processing', broker='redis://localhost:6379')

# Request/Response models
class TranscriptionRequest(BaseModel):
    language: Optional[str] = "auto"
    model: Optional[str] = "whisper-base"
    timestamp: Optional[bool] = True
    
class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "default"
    speed: Optional[float] = 1.0
    language: Optional[str] = "en"

class TranscriptionResponse(BaseModel):
    text: str
    confidence: float
    segments: Optional[List[dict]] = None
    processing_time: float

# Background task for long audio processing
@celery_app.task
def process_long_audio(file_path: str, options: dict):
    """Process long audio files in background"""
    # Your long audio processing logic here
    # Return task result
    return {
        'status': 'completed',
        'transcription': 'Processed transcription...',
        'file_path': file_path
    }

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    request: TranscriptionRequest = TranscriptionRequest()
):
    """Transcribe uploaded audio file"""
    
    # Validate file type
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be audio format")
    
    # Generate cache key
    file_content = await file.read()
    cache_key = f"transcription:{hash(file_content)}"
    
    # Check cache
    cached_result = redis_client.get(cache_key)
    if cached_result:
        return TranscriptionResponse(**json.loads(cached_result))
    
    # Save temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(file_content)
        temp_path = temp_file.name
    
    try:
        # Process with STT model
        import time
        start_time = time.time()
        
        # Your STT processing logic here
        # This is a placeholder
        transcription_result = {
            "text": "Placeholder transcription result",
            "confidence": 0.95,
            "segments": [
                {"start": 0.0, "end": 2.5, "text": "Placeholder segment"}
            ],
            "processing_time": time.time() - start_time
        }
        
        # Cache result
        redis_client.setex(
            cache_key, 
            3600,  # 1 hour cache
            json.dumps(transcription_result)
        )
        
        return TranscriptionResponse(**transcription_result)
        
    finally:
        # Cleanup
        import os
        os.unlink(temp_path)

@app.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    """Generate speech from text"""
    
    # Generate cache key
    cache_key = f"tts:{hash(request.text + request.voice + str(request.speed))}"
    
    # Check cache
    cached_audio = redis_client.get(cache_key)
    if cached_audio:
        return StreamingResponse(
            io.BytesIO(cached_audio),
            media_type="audio/wav",
            headers={"Content-Disposition": "attachment; filename=speech.wav"}
        )
    
    # Generate speech
    # Your TTS processing logic here
    # This is a placeholder
    import io
    audio_data = b"placeholder_audio_data"  # Replace with actual generation
    
    # Cache result
    redis_client.setex(cache_key, 1800, audio_data)  # 30 minutes cache
    
    return StreamingResponse(
        io.BytesIO(audio_data),
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=speech.wav"}
    )

@app.post("/process-long-audio")
async def process_long_audio_endpoint(file: UploadFile = File(...)):
    """Process long audio files asynchronously"""
    
    # Save file for background processing
    file_id = str(uuid.uuid4())
    file_path = f"/tmp/long_audio_{file_id}.wav"
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Queue background task
    task = process_long_audio.delay(file_path, {})
    
    return {
        "task_id": task.id,
        "status": "processing",
        "message": "Audio file queued for processing"
    }

@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    """Check status of background task"""
    result = celery_app.AsyncResult(task_id)
    
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "redis_connected": redis_client.ping(),
        "models_loaded": True  # Check your model loading status
    }

# Docker deployment configuration
DOCKER_COMPOSE = """
version: '3.8'
services:
  speech-api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - celery-worker
    volumes:
      - ./models:/app/models
  
  celery-worker:
    build: .
    command: celery -A main.celery_app worker --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - ./models:/app/models
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - speech-api
"""

# Kubernetes deployment example
KUBERNETES_DEPLOYMENT = """
apiVersion: apps/v1
kind: Deployment
metadata:
  name: speech-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: speech-api
  template:
    metadata:
      labels:
        app: speech-api
    spec:
      containers:
      - name: speech-api
        image: speech-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: REDIS_URL
          value: "redis://redis-service:6379"
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: model-storage
          mountPath: /app/models
      volumes:
      - name: model-storage
        persistentVolumeClaim:
          claimName: model-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: speech-api-service
spec:
  selector:
    app: speech-api
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Performance Benchmarking & Testing

```python
# Example: Comprehensive speech processing benchmark suite
import time
import numpy as np
import pandas as pd
from typing import Dict, List, Any
import matplotlib.pyplot as plt
import seaborn as sns
from dataclasses import dataclass
import concurrent.futures
from pathlib import Path

@dataclass
class BenchmarkResult:
    model_name: str
    audio_duration: float
    processing_time: float
    memory_usage: float
    accuracy_score: float
    real_time_factor: float
    
class SpeechProcessingBenchmark:
    def __init__(self, test_audio_dir: str):
        self.test_audio_dir = Path(test_audio_dir)
        self.results: List[BenchmarkResult] = []
        
    def benchmark_stt_model(self, model, model_name: str, audio_files: List[str]):
        """Benchmark a single STT model"""
        results = []
        
        for audio_file in audio_files:
            # Load audio and get duration
            audio_duration = self.get_audio_duration(audio_file)
            
            # Measure processing time and memory
            start_time = time.time()
            memory_before = self.get_memory_usage()
            
            # Process audio
            transcription = model.transcribe(audio_file)
            
            processing_time = time.time() - start_time
            memory_after = self.get_memory_usage()
            memory_usage = memory_after - memory_before
            
            # Calculate metrics
            real_time_factor = processing_time / audio_duration
            
            # Calculate accuracy (if ground truth available)
            accuracy_score = self.calculate_accuracy(
                transcription, 
                self.get_ground_truth(audio_file)
            )
            
            result = BenchmarkResult(
                model_name=model_name,
                audio_duration=audio_duration,
                processing_time=processing_time,
                memory_usage=memory_usage,
                accuracy_score=accuracy_score,
                real_time_factor=real_time_factor
            )
            
            results.append(result)
        
        return results
    
    def benchmark_tts_model(self, model, model_name: str, test_texts: List[str]):
        """Benchmark a single TTS model"""
        results = []
        
        for i, text in enumerate(test_texts):
            text_length = len(text)
            expected_duration = text_length * 0.08  # Rough estimate: 80ms per character
            
            start_time = time.time()
            memory_before = self.get_memory_usage()
            
            # Generate speech
            audio = model.synthesize(text)
            actual_duration = len(audio) / 22050  # Assuming 22050 Hz
            
            processing_time = time.time() - start_time
            memory_after = self.get_memory_usage()
            memory_usage = memory_after - memory_before
            
            # Calculate metrics
            real_time_factor = processing_time / actual_duration
            
            # Quality assessment (placeholder)
            quality_score = self.assess_tts_quality(audio, text)
            
            result = BenchmarkResult(
                model_name=model_name,
                audio_duration=actual_duration,
                processing_time=processing_time,
                memory_usage=memory_usage,
                accuracy_score=quality_score,
                real_time_factor=real_time_factor
            )
            
            results.append(result)
        
        return results
    
    def run_comparative_benchmark(self, models: Dict[str, Any], test_type: str = "stt"):
        """Run benchmark across multiple models"""
        all_results = []
        
        if test_type == "stt":
            audio_files = list(self.test_audio_dir.glob("*.wav"))[:10]  # Limit for demo
            
            for model_name, model in models.items():
                print(f"Benchmarking {model_name}...")
                results = self.benchmark_stt_model(model, model_name, audio_files)
                all_results.extend(results)
        
        elif test_type == "tts":
            test_texts = [
                "Hello, this is a test sentence.",
                "The quick brown fox jumps over the lazy dog.",
                "In a hole in the ground there lived a hobbit.",
                "To be or not to be, that is the question.",
                "Machine learning is transforming how we interact with technology."
            ]
            
            for model_name, model in models.items():
                print(f"Benchmarking {model_name}...")
                results = self.benchmark_tts_model(model, model_name, test_texts)
                all_results.extend(results)
        
        self.results.extend(all_results)
        return all_results
    
    def generate_benchmark_report(self, output_path: str = "benchmark_report.html"):
        """Generate comprehensive benchmark report"""
        df = pd.DataFrame([vars(r) for r in self.results])
        
        # Calculate summary statistics
        summary = df.groupby('model_name').agg({
            'processing_time': ['mean', 'std', 'min', 'max'],
            'memory_usage': ['mean', 'std'],
            'accuracy_score': ['mean', 'std'],
            'real_time_factor': ['mean', 'std']
        }).round(3)
        
        # Create visualizations
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        
        # Processing time comparison
        sns.boxplot(data=df, x='model_name', y='processing_time', ax=axes[0,0])
        axes[0,0].set_title('Processing Time Distribution')
        axes[0,0].tick_params(axis='x', rotation=45)
        
        # Real-time factor
        sns.barplot(data=df, x='model_name', y='real_time_factor', ax=axes[0,1])
        axes[0,1].set_title('Real-time Factor (lower is better)')
        axes[0,1].axhline(y=1.0, color='red', linestyle='--', label='Real-time threshold')
        axes[0,1].tick_params(axis='x', rotation=45)
        axes[0,1].legend()
        
        # Memory usage
        sns.barplot(data=df, x='model_name', y='memory_usage', ax=axes[1,0])
        axes[1,0].set_title('Memory Usage (MB)')
        axes[1,0].tick_params(axis='x', rotation=45)
        
        # Accuracy scores
        sns.barplot(data=df, x='model_name', y='accuracy_score', ax=axes[1,1])
        axes[1,1].set_title('Accuracy/Quality Score')
        axes[1,1].tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        plt.savefig('benchmark_results.png', dpi=300, bbox_inches='tight')
        
        # Generate HTML report
        html_report = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Speech Processing Benchmark Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; }}
                table {{ border-collapse: collapse; width: 100%; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                th {{ background-color: #f2f2f2; }}
                .summary {{ background-color: #f9f9f9; padding: 20px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <h1>Speech Processing Benchmark Report</h1>
            
            <div class="summary">
                <h2>Summary Statistics</h2>
                {summary.to_html()}
            </div>
            
            <h2>Detailed Results</h2>
            {df.to_html(index=False)}
            
            <h2>Performance Visualizations</h2>
            <img src="benchmark_results.png" alt="Benchmark Results" style="max-width: 100%;">
            
            <h2>Recommendations</h2>
            <ul>
                <li>Best for real-time applications: {df.loc[df['real_time_factor'].idxmin(), 'model_name']}</li>
                <li>Highest accuracy: {df.loc[df['accuracy_score'].idxmax(), 'model_name']}</li>
                <li>Most memory efficient: {df.loc[df['memory_usage'].idxmin(), 'model_name']}</li>
            </ul>
        </body>
        </html>
        """
        
        with open(output_path, 'w') as f:
            f.write(html_report)
        
        print(f"Benchmark report saved to {output_path}")
        return summary
    
    def get_audio_duration(self, audio_file: str) -> float:
        """Get audio file duration in seconds"""
        import librosa
        y, sr = librosa.load(audio_file)
        return len(y) / sr
    
    def get_memory_usage(self) -> float:
        """Get current memory usage in MB"""
        import psutil
        return psutil.Process().memory_info().rss / 1024 / 1024
    
    def calculate_accuracy(self, prediction: str, ground_truth: str) -> float:
        """Calculate transcription accuracy (WER-based)"""
        if not ground_truth:
            return 0.0
        
        # Simple word-level accuracy (replace with proper WER calculation)
        pred_words = prediction.lower().split()
        true_words = ground_truth.lower().split()
        
        correct = sum(1 for p, t in zip(pred_words, true_words) if p == t)
        total = max(len(pred_words), len(true_words))
        
        return correct / total if total > 0 else 0.0
    
    def get_ground_truth(self, audio_file: str) -> str:
        """Get ground truth transcription for audio file"""
        # Look for corresponding .txt file
        txt_file = Path(audio_file).with_suffix('.txt')
        if txt_file.exists():
            return txt_file.read_text().strip()
        return ""
    
    def assess_tts_quality(self, audio: np.ndarray, text: str) -> float:
        """Assess TTS quality (placeholder implementation)"""
        # This would implement actual quality metrics like:
        # - MOS (Mean Opinion Score) prediction
        # - Intelligibility testing
        # - Naturalness assessment
        # - PESQ/STOI scores
        
        # Placeholder: random score
        return np.random.uniform(0.7, 0.95)

# Usage example
def run_speech_benchmark():
    benchmark = SpeechProcessingBenchmark("./test_audio")
    
    # Mock models for demonstration
    class MockSTTModel:
        def __init__(self, name):
            self.name = name
        
        def transcribe(self, audio_file):
            time.sleep(np.random.uniform(0.5, 2.0))  # Simulate processing
            return f"Mock transcription from {self.name}"
    
    # Define models to benchmark
    stt_models = {
        "Whisper-base": MockSTTModel("whisper-base"),
        "Whisper-large": MockSTTModel("whisper-large"),
        "Wav2Vec2": MockSTTModel("wav2vec2"),
        "SpeechBrain": MockSTTModel("speechbrain")
    }
    
    # Run benchmark
    results = benchmark.run_comparative_benchmark(stt_models, test_type="stt")
    
    # Generate report
    summary = benchmark.generate_benchmark_report()
    print("\nBenchmark Summary:")
    print(summary)

# run_speech_benchmark()
```
