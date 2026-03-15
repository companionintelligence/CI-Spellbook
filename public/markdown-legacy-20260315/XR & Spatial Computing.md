# Spatial Computing (XR & WebXR)

> **Build immersive experiences for the next generation of computing**  
> This guide covers the 2026 landscape of extended reality (XR)—from VR headsets and AR glasses to spatial computing platforms, development tools, and AI-powered 3D content creation.  
> Whether you're building games, enterprise applications, or spatial interfaces, these tools will help you create compelling XR experiences.

## Quick Start: Choosing Your XR Platform

| Goal | Recommended Platform | Why |
|------|---------------------|-----|
| **Consumer VR Games** | Quest 3S / SteamVR | Large user base, mature ecosystem |
| **Enterprise/Training** | Quest Pro / Varjo / HoloLens 2 | Productivity features, passthrough, enterprise support |
| **Spatial Apps** | Vision Pro / Quest 3 | High-quality MR, spatial UI paradigms |
| **Mobile AR** | ARKit / ARCore | Billions of devices, proven frameworks |
| **Web XR** | WebXR + Three.js / A-Frame | Cross-platform, no app store |
| **Prototyping** | Unity + XR Toolkit | Rapid iteration, cross-platform deploy |

---

## VR & MR Headsets (2026)

### Consumer Devices

| Device | Display | Key Features | Best For | Price Range |
|--------|---------|--------------|----------|-------------|
| **Meta Quest 3S**<br>🔗 [meta.com/quest](https://www.meta.com/quest/) | Pancake lenses, color passthrough | Standalone, mixed reality, hand tracking, $299 entry | Gaming, social VR | $299-399 |
| **Meta Quest 3**<br>🔗 [meta.com/quest](https://www.meta.com/quest/) | 4K+ Infinite Display, pancake lenses | Full-color MR, depth sensor, Snapdragon XR2 Gen 2 | Gaming, MR apps | $499-649 |
| **Apple Vision Pro**<br>🔗 [apple.com/vision](https://www.apple.com/vision/) | Micro-OLED 4K per eye | Spatial computing, eye/hand tracking, M2/R1 chips | Productivity, spatial UI | $3,499 |
| **PlayStation VR2**<br>🔗 [playstation.com/psvr2](https://www.playstation.com/en-us/ps-vr2/) | OLED 4K HDR | Eye tracking, haptic feedback, PS5 exclusive | Console gaming | $549 |
| **Valve Index**<br>🔗 [valvesoftware.com/index](https://www.valvesoftware.com/en/index) | LCD 1440×1600, 144Hz | Finger tracking controllers, high refresh | PC VR enthusiasts | $999+ |
| **PICO 4 Ultra**<br>🔗 [picoxr.com](https://www.picoxr.com/) | Pancake lenses, color MR | Standalone, spatial computing, face/eye tracking | Gaming, enterprise | $599 |

### Enterprise & Professional

| Device | Display | Key Features | Best For | Price Range |
|--------|---------|--------------|----------|-------------|
| **Meta Quest Pro 2** | High-res MR cameras | Face/eye tracking, productivity focus | Enterprise, developers | $999+ |
| **Varjo XR-4**<br>🔗 [varjo.com](https://varjo.com/) | Human-eye resolution | 20/20 vision, LiDAR, photorealistic MR | Simulation, training | $3,990 |
| **Microsoft HoloLens 2**<br>🔗 [microsoft.com/hololens](https://www.microsoft.com/en-us/hololens) | See-through waveguide | Enterprise AR, hand tracking, Azure integration | Industrial, training | $3,500 |
| **Magic Leap 2**<br>🔗 [magicleap.com](https://www.magicleap.com/) | Waveguide AR | Dimming, enterprise apps, industrial use | Healthcare, manufacturing | $3,299+ |
| **Vuzix Shield**<br>🔗 [vuzix.com](https://www.vuzix.com/) | Waveguide glasses | Safety-rated, lightweight, enterprise AR | Field service, warehouse | $1,999 |

### AR Glasses (Consumer)

| Device | Form Factor | Key Features | Best For | Availability |
|--------|-------------|--------------|----------|--------------|
| **Meta Ray-Ban**<br>🔗 [ray-ban.com/meta](https://www.ray-ban.com/usa/ray-ban-meta-smart-glasses) | Smart glasses | Camera, speakers, Meta AI, livestreaming | Social, content creation | Available |
| **Xreal Air 2 Ultra**<br>🔗 [xreal.com](https://www.xreal.com/) | AR glasses | 6DoF, spatial display, Steam Link | Portable gaming, productivity | Available |
| **Viture Pro XR**<br>🔗 [viture.com](https://www.viture.com/) | AR glasses | Electrochromic dimming, gaming mode | Entertainment, travel | Available |
| **RayNeo X2**<br>🔗 [rayneo.com](https://www.rayneo.com/) | AR glasses | Full-color waveguide, GPS, translations | Navigation, everyday AR | Available |

---

## XR Development Platforms

### Game Engines & SDKs

| Platform | Description | Key Features | Best For |
|----------|-------------|--------------|----------|
| **Unity XR Toolkit**<br>🔗 [unity.com/xr](https://unity.com/solutions/xr)<br>🪪 Unity License | Cross-platform XR framework | Interaction toolkit, cross-device, visual scripting | Multi-platform XR |
| **Unreal Engine VR**<br>🔗 [unrealengine.com/xr](https://www.unrealengine.com/en-US/xr)<br>🪪 Unreal License | High-fidelity XR development | Nanite, Lumen, MetaHumans, Blueprint | High-end graphics |
| **Godot XR**<br>🔗 [godotengine.org](https://godotengine.org/)<br>🪪 MIT | Open-source game engine with XR | OpenXR support, GDScript, open-source | Indie, open-source |
| **Meta XR SDK**<br>🔗 [developer.meta.com](https://developer.meta.com/)<br>🪪 Proprietary | Quest/Meta platform SDK | Hand tracking, passthrough, spatial anchors | Quest development |
| **visionOS SDK**<br>🔗 [developer.apple.com/visionos](https://developer.apple.com/visionos/)<br>🪪 Apple License | Apple Vision Pro development | SwiftUI 3D, RealityKit, ARKit | Vision Pro apps |
| **OpenXR**<br>🔗 [khronos.org/openxr](https://www.khronos.org/openxr/)<br>🪪 Khronos License | Cross-platform XR standard | Runtime portability, vendor-neutral | Cross-device apps |

### Web XR Development

| Tool | Description | Key Features | Best For |
|------|-------------|--------------|----------|
| **Three.js**<br>🔗 [threejs.org](https://threejs.org/)<br>🪪 MIT | WebGL 3D library | WebXR support, VR/AR modes, extensive ecosystem | Custom 3D web apps |
| **A-Frame**<br>🔗 [aframe.io](https://aframe.io/)<br>🪪 MIT | Web framework for VR | HTML-like syntax, component system, beginner-friendly | Rapid prototyping |
| **Babylon.js**<br>🔗 [babylonjs.com](https://www.babylonjs.com/)<br>🪪 Apache-2.0 | Powerful 3D engine | WebXR, physics, materials, enterprise features | Enterprise web 3D |
| **React Three Fiber**<br>🔗 [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)<br>🪪 MIT | React renderer for Three.js | React patterns, hooks, declarative 3D | React developers |
| **Model Viewer**<br>🔗 [modelviewer.dev](https://modelviewer.dev/)<br>🪪 Apache-2.0 | Web component for 3D | AR quick look, easy embedding, Google-backed | Product visualization |
| **8th Wall**<br>🔗 [8thwall.com](https://www.8thwall.com/)<br>🪪 Commercial | WebAR platform | SLAM, face tracking, world effects | Marketing, campaigns |

### Mobile AR Frameworks

| Framework | Platform | Key Features | Best For |
|-----------|----------|--------------|----------|
| **ARKit**<br>🔗 [developer.apple.com/arkit](https://developer.apple.com/augmented-reality/arkit/)<br>🪪 Apple License | iOS/iPadOS/visionOS | LiDAR, body tracking, object detection | iOS AR apps |
| **ARCore**<br>🔗 [developers.google.com/ar](https://developers.google.com/ar)<br>🪪 Apache-2.0 | Android | Cloud anchors, depth API, geospatial | Android AR apps |
| **Niantic Lightship**<br>🔗 [lightship.dev](https://lightship.dev/)<br>🪪 Commercial | Cross-platform | VPS, semantic segmentation, meshing | Location-based AR |
| **Vuforia**<br>🔗 [ptc.com/vuforia](https://www.ptc.com/en/products/vuforia)<br>🪪 Commercial | Cross-platform | Image/object tracking, model targets | Enterprise AR |
| **Spark AR**<br>🔗 [spark.meta.com](https://spark.meta.com/)<br>🪪 Meta License | Instagram/Facebook | Face filters, world effects, publishing | Social AR filters |

---

## 3D Content Creation for XR

### AI-Powered 3D Generation

| Tool | Description | Key Features | Output Formats |
|------|-------------|--------------|----------------|
| **Meshy**<br>🔗 [meshy.ai](https://www.meshy.ai/)<br>🪪 Commercial | AI 3D model generator | Text/image to 3D, texturing, rigging-ready | GLB, FBX, OBJ |
| **Tripo AI**<br>🔗 [tripo3d.ai](https://www.tripo3d.ai/)<br>🪪 Commercial | Fast AI 3D generation | Sub-second generation, PBR materials | GLB, USDZ |
| **Luma AI Genie**<br>🔗 [lumalabs.ai/genie](https://lumalabs.ai/genie)<br>🪪 Commercial | Text to 3D generation | High quality, multi-view consistency | GLB, USDZ |
| **Rodin Gen-1**<br>🔗 [hyperhuman.deemos.com](https://hyperhuman.deemos.com/rodin)<br>🪪 Commercial | Professional AI 3D | Digital human quality, game-ready assets | FBX, GLB |
| **Hunyuan3D-2**<br>🔗 [github.com/Tencent/Hunyuan3D-2](https://github.com/Tencent/Hunyuan3D-2)<br>🪪 Custom | Open-source 3D generation | Image to 3D, high-res textures | GLB, OBJ |
| **TripoSR**<br>🔗 [github.com/VAST-AI-Research/TripoSR](https://github.com/VAST-AI-Research/TripoSR)<br>🪪 MIT | Fast single-image 3D | Sub-second inference, open-source | OBJ, GLB |
| **InstantMesh**<br>🔗 [github.com/TencentARC/InstantMesh](https://github.com/TencentARC/InstantMesh)<br>🪪 Apache-2.0 | Multi-view to mesh | Fast reconstruction, good topology | OBJ, GLB |

### 3D Scanning & Capture

| Tool | Description | Key Features | Platform |
|------|-------------|--------------|----------|
| **Luma AI**<br>🔗 [lumalabs.ai](https://lumalabs.ai/)<br>🪪 Commercial | NeRF/Gaussian capture | iPhone scanning, high quality | iOS, Web |
| **Polycam**<br>🔗 [poly.cam](https://poly.cam/)<br>🪪 Commercial | 3D scanning app | LiDAR support, room scanning, export | iOS, Android |
| **Reality Capture**<br>🔗 [capturingreality.com](https://www.capturingreality.com/)<br>🪪 Commercial | Photogrammetry software | High accuracy, drone support | Windows |
| **Scaniverse**<br>🔗 [scaniverse.com](https://scaniverse.com/)<br>🪪 Free | Mobile 3D scanner | Free LiDAR scanning, sharing | iOS |
| **3D Scanner App**<br>🔗 [3dscannerapp.com](https://3dscannerapp.com/)<br>🪪 Commercial | Professional scanning | Point cloud, mesh export | iOS |
| **KIRI Engine**<br>🔗 [kiriengine.com](https://www.kiriengine.com/)<br>🪪 Commercial | Cross-platform scanning | AI processing, no LiDAR needed | iOS, Android, Web |

### Traditional 3D Tools for XR

| Tool | Description | Key Features | Best For |
|------|-------------|--------------|----------|
| **Blender**<br>🔗 [blender.org](https://www.blender.org/)<br>🪪 GPL | Open-source 3D suite | Modeling, animation, VR preview | All 3D creation |
| **Adobe Substance 3D**<br>🔗 [substance3d.com](https://www.adobe.com/products/substance3d.html)<br>🪪 Commercial | Material/texture creation | PBR materials, AI tools | Texturing |
| **Gravity Sketch**<br>🔗 [gravitysketch.com](https://www.gravitysketch.com/)<br>🪪 Commercial | VR 3D design | Design in VR, collaboration | Concept design |
| **ShapesXR**<br>🔗 [shapesxr.com](https://www.shapesxr.com/)<br>🪪 Commercial | VR prototyping | Spatial design, storyboarding | UX prototyping |
| **Tvori**<br>🔗 [tvori.co](https://tvori.co/)<br>🪪 Commercial | VR animation | In-VR animation, storyboarding | Animation |

---

## Spatial Audio & Haptics

### Spatial Audio SDKs

| Tool | Description | Key Features | Integration |
|------|-------------|--------------|-------------|
| **Meta Spatial Audio SDK**<br>🔗 [developer.meta.com](https://developer.meta.com/documentation/native/native-audio/) | Quest spatial audio | HRTF, room modeling, Ambisonic | Unity, Unreal |
| **Resonance Audio**<br>🔗 [resonance-audio.github.io](https://resonance-audio.github.io/)<br>🪪 Apache-2.0 | Cross-platform spatial | Room effects, Ambisonics, Unity/Unreal | Unity, Unreal, Web |
| **Steam Audio**<br>🔗 [valvesoftware.github.io/steam-audio](https://valvesoftware.github.io/steam-audio/)<br>🪪 BSD | VR audio propagation | Physics-based, occlusion, HRTF | Unity, Unreal, FMOD |
| **Apple Spatial Audio**<br>🔗 [developer.apple.com](https://developer.apple.com/documentation/avfoundation/audio_track_engineering/building_audio_experiences_with_spatial_audio) | Apple ecosystem | Head tracking, Dolby Atmos | visionOS, iOS |
| **Dolby Atmos for Gaming**<br>🔗 [dolby.com/gaming](https://www.dolby.com/gaming/) | Immersive audio | Object-based audio, 3D positioning | Cross-platform |

### Haptic Feedback

| Device/SDK | Type | Key Features | Platform |
|------------|------|--------------|----------|
| **bHaptics**<br>🔗 [bhaptics.com](https://www.bhaptics.com/) | Haptic vest/gloves | Full-body haptics, SDK | Quest, PCVR |
| **Lofelt (Meta)**<br>🔗 [developer.meta.com](https://developer.meta.com/) | Controller haptics | HD haptics, Unity SDK | Quest |
| **SenseGlove**<br>🔗 [senseglove.com](https://www.senseglove.com/) | Force feedback gloves | Touch simulation, training | Enterprise VR |
| **HaptX**<br>🔗 [haptx.com](https://haptx.com/) | Enterprise haptics | True-contact haptics, enterprise | Enterprise training |
| **CoreHaptics**<br>🔗 [developer.apple.com](https://developer.apple.com/documentation/corehaptics) | iOS haptic engine | Custom patterns, synchronization | iOS, visionOS |

---

## Social VR & Multiplayer

### Social Platforms

| Platform | Description | Key Features | Access |
|----------|-------------|--------------|--------|
| **Horizon Worlds**<br>🔗 [horizon.meta.com](https://www.meta.com/horizon-worlds/) | Meta's social VR | World building, events, avatars | Quest, Web |
| **VRChat**<br>🔗 [vrchat.com](https://vrchat.com/) | User-created social VR | Custom worlds, avatars, Udon scripting | Quest, PCVR |
| **Rec Room**<br>🔗 [recroom.com](https://recroom.com/) | Cross-platform social | Games, building, community | All platforms |
| **ChilloutVR**<br>🔗 [chilloutvr.xyz](https://chilloutvr.xyz/) | Creator-focused social | Custom avatars, worlds, modding | PCVR |
| **Neos VR / Resonite**<br>🔗 [resonite.com](https://resonite.com/) | Collaborative creation | In-VR creation, complex systems | PCVR |

### Multiplayer SDKs

| SDK | Description | Key Features | Best For |
|-----|-------------|--------------|----------|
| **Photon**<br>🔗 [photonengine.com](https://www.photonengine.com/) | Real-time multiplayer | Voice, matchmaking, XR optimized | Production games |
| **Normcore**<br>🔗 [normcore.io](https://normcore.io/) | VR multiplayer | Unity-native, XR focused, low-latency | VR/XR apps |
| **Mirror**<br>🔗 [mirror-networking.com](https://mirror-networking.com/)<br>🪪 MIT | Open-source networking | Unity, self-hosted option | Indie, learning |
| **Netcode for GameObjects**<br>🔗 [unity.com/netcode](https://unity.com/products/netcode) | Unity multiplayer | First-party, reliable transport | Unity games |

---

## Hand & Body Tracking

### Hand Tracking

| Solution | Platform | Key Features | Use Case |
|----------|----------|--------------|----------|
| **Quest Hand Tracking**<br>🔗 [developer.meta.com](https://developer.meta.com/documentation/unity/unity-handtracking/) | Quest | V2.2, pinch gestures, wide FOV | Quest apps |
| **Ultraleap**<br>🔗 [ultraleap.com](https://www.ultraleap.com/) | PCVR, enterprise | High accuracy, mid-air haptics | Enterprise VR |
| **MediaPipe Hands**<br>🔗 [mediapipe.dev](https://mediapipe.dev/)<br>🪪 Apache-2.0 | Cross-platform | Web/mobile, open-source | Prototyping, mobile |
| **Manomotion**<br>🔗 [manomotion.com](https://www.manomotion.com/) | Mobile | Gesture recognition, AR | Mobile AR |

### Body & Face Tracking

| Solution | Platform | Key Features | Use Case |
|----------|----------|--------------|----------|
| **Quest Body Tracking**<br>🔗 [developer.meta.com](https://developer.meta.com/documentation/unity/move-body-tracking/) | Quest 3+ | Full body, fitness | Social VR, fitness |
| **Quest Face Tracking**<br>🔗 [developer.meta.com](https://developer.meta.com/documentation/unity/unity-face-tracking/) | Quest Pro/3 | 63 blend shapes, eye tracking | Avatars, social |
| **MediaPipe Pose**<br>🔗 [mediapipe.dev](https://mediapipe.dev/)<br>🪪 Apache-2.0 | Cross-platform | 33 landmarks, web/mobile | Fitness, motion capture |
| **VIVE Full-Body**<br>🔗 [vive.com/trackers](https://www.vive.com/us/accessory/tracker3/) | SteamVR | Trackers + lighthouse | Full-body VR |
| **SlimeVR**<br>🔗 [slimevr.dev](https://www.slimevr.dev/)<br>🪪 MIT | Open-source | IMU-based, affordable | Community, DIY |

---

## XR Cloud & Streaming

### Cloud XR Streaming

| Service | Description | Key Features | Pricing |
|---------|-------------|--------------|---------|
| **NVIDIA CloudXR**<br>🔗 [nvidia.com/cloudxr](https://www.nvidia.com/en-us/design-visualization/solutions/cloud-xr/) | Enterprise XR streaming | RTX quality, low latency | Enterprise |
| **Meta Quest Link**<br>🔗 [meta.com/quest](https://www.meta.com/quest/setup/) | PC to Quest streaming | Air Link wireless, PCVR games | Free |
| **Virtual Desktop**<br>🔗 [vrdesktop.net](https://www.vrdesktop.net/) | PCVR streaming | Low latency, SSW support | $19.99 |
| **Steam Link**<br>🔗 [store.steampowered.com](https://store.steampowered.com/app/353380/Steam_Link/) | Steam VR streaming | SteamVR support, mobile | Free |
| **PlutoSphere**<br>🔗 [plutosphere.com](https://www.plutosphere.com/) | Cloud PCVR | No PC needed, cloud gaming | Subscription |

### XR Analytics & Testing

| Tool | Description | Key Features | Use Case |
|------|-------------|--------------|----------|
| **Cognitive3D**<br>🔗 [cognitive3d.com](https://cognitive3d.com/) | XR analytics | Gaze heatmaps, engagement metrics | UX research |
| **Tobii Pro**<br>🔗 [tobiipro.com](https://www.tobiipro.com/) | Eye tracking analytics | Research grade, attention analysis | Research |
| **Retinad**<br>🔗 [retinad.com](https://www.retinad.com/) | VR eye tracking | Performance optimization | Development |

---

## Example: Unity VR Project Setup

```csharp
using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

public class VRInteractionSetup : MonoBehaviour
{
    [SerializeField] private XRDirectInteractor leftHandInteractor;
    [SerializeField] private XRDirectInteractor rightHandInteractor;
    
    void Start()
    {
        // Configure interaction layers
        leftHandInteractor.interactionLayers = InteractionLayerMask.GetMask("Grabbable");
        rightHandInteractor.interactionLayers = InteractionLayerMask.GetMask("Grabbable");
        
        // Setup haptic feedback on grab
        leftHandInteractor.selectEntered.AddListener(OnGrab);
        rightHandInteractor.selectEntered.AddListener(OnGrab);
    }
    
    private void OnGrab(SelectEnterEventArgs args)
    {
        // Haptic pulse on successful grab
        var controller = args.interactorObject as XRBaseController;
        controller?.SendHapticImpulse(0.5f, 0.1f);
    }
}
```

## Example: WebXR with Three.js

```javascript
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Add controllers
const controllerModelFactory = new XRControllerModelFactory();
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);
scene.add(controller1);
scene.add(controller2);

// Add controller models
const controllerGrip1 = renderer.xr.getControllerGrip(0);
controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
scene.add(controllerGrip1);

// Add interactive object
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 1.5, -1);
scene.add(cube);

// Animation loop
function animate() {
    renderer.setAnimationLoop(() => {
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    });
}
animate();
```

---

## Getting Started Checklist

1. **Choose your target device**: Quest 3 for broad reach, Vision Pro for premium spatial
2. **Pick your engine**: Unity for cross-platform, Unreal for graphics, web for accessibility
3. **Set up development environment**: Install SDKs, enable developer mode on device
4. **Start with interaction**: Learn hand tracking and controller input first
5. **Add spatial audio**: Immersion dramatically improves with good audio
6. **Test on device early**: Desktop previews don't capture real XR experience
7. **Consider accessibility**: Include comfort options, alternative inputs
8. **Plan for performance**: XR requires consistent high frame rates (72-120fps)

---

## Resources

- [Meta Quest Developer Documentation](https://developer.meta.com/)
- [Apple visionOS Documentation](https://developer.apple.com/visionos/)
- [Unity XR Documentation](https://docs.unity3d.com/Manual/XR.html)
- [WebXR Device API](https://immersiveweb.dev/)
- [OpenXR Specification](https://registry.khronos.org/OpenXR/)
- [XR Design Guidelines (Meta)](https://developer.meta.com/resources/design-for-mixed-reality/)
