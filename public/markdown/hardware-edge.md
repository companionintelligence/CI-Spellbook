# Hardware, STEM, Robotics & Edge Labs

> Hardware projects rarely live in one lane. This card spans maker tools, embedded firmware, drones, robotics, simulation, and practical STEM software.

## Dev Boards & Single-Board Computers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [ESP32 (Espressif)](https://www.espressif.com/en/products/socs) | Low-cost Wi-Fi/BLE microcontroller SoC family. | Hardware | S3 for AI/camera; C6 adds Wi-Fi 6 + Matter/Zigbee; RISC-V trend. |
| [NVIDIA Jetson Orin Nano Super](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) | Edge AI compute module delivering up to 67 TOPS. | Hardware | $249 dev kit; JetPack 7.2 targets Q2 2026. |
| [NVIDIA Jetson Thor](https://developer.nvidia.com/embedded/jetson-modules) | High-end robotics module with up to 2070 FP4 TFLOPS AI compute. | Hardware | Targets full humanoid and autonomous vehicle workloads. |
| [Raspberry Pi 5](https://www.raspberrypi.com/products/raspberry-pi-5/) | Quad-core Cortex-A76 SBC with PCIe, RTC, and dual 4K display. | Hardware | Available 2–16 GB; PCIe slot enables NVMe expansion. |

## Maker & Embedded Foundations

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Arduino IDE](https://github.com/arduino/arduino-ide) | Cross-platform IDE for Arduino and related boards. | Cross-platform | The default entry point for hobby microcontrollers. |
| [ESPHome](https://github.com/esphome/esphome) | Config-driven firmware for ESP devices. | Self-hosted | Excellent for sensors and home automation nodes. |
| [OpenRGB](https://github.com/CalcProgrammer1/OpenRGB) | RGB lighting control without vendor lock-in. | Cross-platform | Useful for hardware customization and testing. |
| [PlatformIO](https://platformio.org/) | Embedded build system and IDE ecosystem. | Cross-platform | Strong upgrade once projects get more complex. |
| [Serial Studio](https://github.com/Serial-Studio/Serial-Studio) | Telemetry dashboard for serial and wireless data sources. | Cross-platform | Great for observing live device data. |

## Engineering & CAD

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [CadQuery](https://github.com/CadQuery/cadquery) | Python parametric CAD scripting framework. | Cross-platform | Excellent for programmable fabrication work. |
| [CQ-editor](https://github.com/CadQuery/CQ-editor) | GUI editor for CadQuery workflows. | Cross-platform | Good if you want code and previews together. |
| [FreeCAD](https://github.com/FreeCAD/FreeCAD) | Full parametric 3D modeler. | Cross-platform | v1.1.1 (April 2026); broadest open-source CAD tool. |
| [KiCad](https://github.com/KiCad/kicad-source-mirror) | Open PCB design suite. | Cross-platform | v10 current; best default for open electronics design. |
| [LibrePCB](https://github.com/LibrePCB/LibrePCB) | Intuitive EDA suite for schematics and boards. | Cross-platform | Good lower-friction alternative to KiCad. |
| [OpenSCAD](https://github.com/openscad/openscad) | Programmable solid modeling platform. | Cross-platform | Excellent for precise repeatable parts. |

## 3D Printing

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Klipper](https://github.com/Klipper3d/klipper) | High-performance 3D printer firmware running on a host computer. | Self-hosted, Hardware | Standard for advanced printers; pairs with Moonraker/Mainsail. |
| [Mainsail](https://github.com/mainsail-crew/mainsail) | Modern web interface for Klipper-based 3D printers. | Self-hosted, Web | Polished Klipper frontend; pairs well with Moonraker. |
| [OrcaSlicer](https://github.com/OrcaSlicer/OrcaSlicer) | Feature-rich G-code slicer supporting Bambu, Prusa, Voron, and Klipper. | Cross-platform | Active; v2.3.x stable; strong calibration tooling. |

## Autonomy, Drones & Robotics

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Apollo](https://github.com/ApolloAuto/apollo) | Autonomous driving platform. | Self-hosted | Major open stack for driving research. |
| [ArduPilot](https://github.com/ArduPilot/ardupilot) | Open-source autopilot firmware for air, ground, and water vehicles. | Hardware | Widely used in hobby and research robotics. |
| [Autoware](https://github.com/autowarefoundation/autoware) | Open autonomous driving stack. | Self-hosted | Strong community around automotive autonomy. |
| [Betaflight](https://github.com/betaflight/betaflight) | Open-source flight controller firmware for FPV drones. | Hardware | Calendar-versioned; 2026.6 release adds altitude and position hold. |
| [LeRobot](https://github.com/huggingface/lerobot) | End-to-end robot learning library with imitation and RL support. | Cross-platform | v0.5 (March 2026) adds humanoid support and VLA fine-tuning. |
| [MissionPlanner](https://github.com/ArduPilot/MissionPlanner) | Ground control station for ArduPilot. | Windows | Useful for planning and telemetry. |
| [OpenArm](https://github.com/enactic/openarm) | Open-source humanoid arm project. | Cross-platform | Good example of accessible physical AI hardware. |
| [openpilot](https://github.com/commaai/openpilot) | Driver assistance platform for supported vehicles. | Linux | Good reference point for practical autonomy. |
| [PX4 Autopilot](https://github.com/PX4/PX4-Autopilot) | Cross-platform drone autopilot software. | Cross-platform | One of the most important open drone stacks. |
| [QGroundControl](https://github.com/mavlink/qgroundcontrol) | Cross-platform drone control station. | Cross-platform, Mobile | Strong general-purpose ground station. |
| [ROS 2](https://github.com/ros2/ros2) | Robot Operating System 2 middleware and toolchain. | Cross-platform, Linux | Lyrical Luth (LTS, May 2026) is the recommended release. |
| [Webots](https://github.com/cyberbotics/webots) | Robot simulator. | Cross-platform | Strong for robotics experimentation and teaching. |
| [XLeRobot](https://github.com/Vector-Wangel/XLeRobot) | Practical low-cost dual-arm home robot project. | Hardware | Useful reference for ambitious maker robotics. |
| [WebODM](https://github.com/WebODM/WebODM) | Web app that turns drone photos into maps, 3D models and point clouds. | Self-hosted | AGPL-3.0; ~4.2k stars; OpenDroneMap project. |

## Firmware, Mesh & Field Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [EdgeTX](https://github.com/EdgeTX/edgetx) | Firmware for RC radios. | Hardware | Good if you work in drone and RC ecosystems. |
| [INAV](https://github.com/iNavFlight/inav) | Navigation-enabled flight control software. | Hardware | Useful for GPS-aware craft and robotics. |
| [Meshtastic](https://github.com/meshtastic/firmware) | Off-grid mesh communication firmware for LoRa radios. | Hardware | Great for field networking and portable comms. |
| [Meshtastic ecosystem](https://meshtastic.org/) | Radios, apps, and relay patterns around the Meshtastic protocol. | Cross-platform | Good complement when planning portable comms. |

## Simulation & Science

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [A/B Street](https://github.com/a-b-street/abstreet) | Transportation planning and traffic simulation software. | Cross-platform | Useful when mobility and city systems matter. |
| [GoldenCheetah](https://github.com/GoldenCheetah/GoldenCheetah) | Performance analytics for cyclists and endurance athletes. | Cross-platform | Good example of specialized STEM software. |
| [OpenRocket](https://github.com/openrocket/openrocket) | Model rocketry simulator. | Cross-platform | Great for hobbyist aerospace experimentation. |
| [Stellarium](https://github.com/Stellarium/stellarium) | Real-time sky and astronomy visualization. | Cross-platform | Excellent educational and planning tool. |
| [SUMO](https://github.com/eclipse-sumo/sumo) | Traffic simulation suite for large networks. | Cross-platform | Good for research and scenario modeling. |

## Notable Models

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [GR00T N1.5 / N1.7](https://huggingface.co/nvidia/GR00T-N1.5-3B) | NVIDIA's open VLA model for humanoid robot control. | Open weights | Integrated into LeRobot v0.4+; targets full-body manipulation. |
| [pi0 / pi0-FAST](https://huggingface.co/blog/pi0) | Physical Intelligence's vision-language-action model family. | Open weights | pi0-FAST uses FAST tokenization; 5x faster training vs diffusion VLAs. |
| [SmolVLA](https://huggingface.co/lerobot/smolvla_base) | Compact VLA model for resource-constrained robot deployments. | Open weights | Included in LeRobot; good for edge hardware experimentation. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Jeff Geerling's Blog](https://www.jeffgeerling.com/) | Deep dives on Raspberry Pi, ARM boards, and Ansible. | Web | Reliable technical depth; consistently updated. |
| [LeRobot Tutorial Space](https://huggingface.co/spaces/lerobot/robot-learning-tutorial) | Interactive robot learning tutorial from Hugging Face. | Web | Good entry point for VLA and imitation learning concepts. |
| [MakerWorld](https://makerworld.com/) | 3D model sharing platform by Bambu Lab. | Web | Growing community library for printable parts and designs. |
| [Oscar Liang's FPV Blog](https://oscarliang.com/) | In-depth FPV drone and Betaflight tutorials. | Web | The most thorough reference for FPV hardware and firmware tuning. |
| [r/robotics](https://www.reddit.com/r/robotics/) | Community forum for robotics projects and discussion. | Web | Good for discovering projects and troubleshooting builds. |
