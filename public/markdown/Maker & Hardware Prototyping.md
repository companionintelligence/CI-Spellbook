# Maker & Hardware Prototyping

> **From idea to physical prototype with modern tools and AI assistance**  
> This guide covers the 2026 maker ecosystem—microcontrollers, single-board computers, AI accelerators, 3D printing, PCB design, and the software tools that tie them together.  
> Whether you're building IoT devices, robots, or custom hardware, these tools will help you prototype faster and ship smarter.

## Quick Start: Choosing Your Platform

| Project Type | Recommended Platform | Why |
|--------------|---------------------|-----|
| **Simple IoT Sensors** | ESP32-C3 / ESP32-S3 | WiFi/BLE, cheap, Arduino-compatible |
| **Complex IoT with Display** | ESP32-S3 + LVGL | Graphics support, touch, fast |
| **Local AI/ML Inference** | Raspberry Pi 5 + Hailo-8L | NPU acceleration, Linux, community |
| **Edge AI/Vision** | Jetson Orin Nano / Coral Dev Board | CUDA/TPU, production-ready |
| **Robotics** | Raspberry Pi 5 / Jetson | ROS2 support, compute power |
| **Wearables** | nRF52840 / ESP32-S3 Mini | Low power, BLE, small form factor |
| **Industrial IoT** | Raspberry Pi CM5 / ESP32-P4 | Reliability, long-term support |

---

## Microcontrollers

### ESP32 Family (2026)

| Board | Key Features | Best For | Price Range |
|-------|--------------|----------|-------------|
| **ESP32-S3**<br>🔗 [espressif.com](https://www.espressif.com/en/products/socs/esp32-s3)<br>🪪 Open Hardware | Dual-core, WiFi/BLE, vector instructions, USB OTG | AI/ML at edge, displays, USB devices | $3-8 |
| **ESP32-C6**<br>🔗 [espressif.com](https://www.espressif.com/en/products/socs/esp32-c6) | RISC-V, WiFi 6, Thread/Zigbee, Matter | Smart home, low power IoT | $2-5 |
| **ESP32-C3**<br>🔗 [espressif.com](https://www.espressif.com/en/products/socs/esp32-c3) | RISC-V, WiFi/BLE, ultra-low cost | Simple IoT, cost-sensitive | $1-3 |
| **ESP32-P4**<br>🔗 [espressif.com](https://www.espressif.com/en/products/socs/esp32-p4) | Dual RISC-V, HMI focus, AI accelerator | Industrial HMI, advanced graphics | $5-10 |
| **ESP32-H2**<br>🔗 [espressif.com](https://www.espressif.com/en/products/socs/esp32-h2) | Thread/Zigbee only, low power | Matter devices, mesh networks | $2-4 |

### Arduino & Compatible

| Board | Key Features | Best For | Price Range |
|-------|--------------|----------|-------------|
| **Arduino UNO R4 WiFi**<br>🔗 [arduino.cc](https://store.arduino.cc/products/uno-r4-wifi)<br>🪪 Open Hardware | Renesas RA4M1, WiFi, LED matrix | Learning, education, prototyping | $27 |
| **Arduino Nano ESP32**<br>🔗 [arduino.cc](https://store.arduino.cc/products/nano-esp32) | ESP32-S3 in Nano form factor | Arduino ecosystem with ESP32 power | $20 |
| **Arduino Nano 33 BLE Sense Rev2**<br>🔗 [arduino.cc](https://store.arduino.cc/products/nano-33-ble-sense-rev2) | IMU, microphone, gesture, TinyML | Wearables, edge ML | $33 |
| **Arduino Portenta H7**<br>🔗 [arduino.cc](https://store.arduino.cc/products/portenta-h7) | Dual-core, industrial, WiFi/BLE | Professional IoT, industrial | $99 |
| **Seeed XIAO ESP32S3**<br>🔗 [seeedstudio.com](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html) | Tiny form factor, camera support | Wearables, space-constrained | $6 |
| **Adafruit Feather**<br>🔗 [adafruit.com](https://www.adafruit.com/category/943) | Ecosystem of compatible boards | Battery projects, modular design | $15-35 |

### Other Microcontrollers

| Board | Key Features | Best For | Price Range |
|-------|--------------|----------|-------------|
| **Raspberry Pi Pico 2**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-pico-2/)<br>🪪 Open Hardware | RP2350, dual ARM/RISC-V cores | Cost-effective projects, PIO | $5 |
| **Teensy 4.1**<br>🔗 [pjrc.com](https://www.pjrc.com/store/teensy41.html) | 600MHz ARM, USB host, audio | Audio projects, high performance | $32 |
| **STM32 Nucleo**<br>🔗 [st.com](https://www.st.com/en/evaluation-tools/stm32-nucleo-boards.html) | Professional ARM development | Industrial, professional | $15-50 |
| **nRF52840**<br>🔗 [nordicsemi.com](https://www.nordicsemi.com/Products/nRF52840) | BLE 5.0, Thread, USB, low power | Wearables, BLE devices | $10-25 |

---

## Single Board Computers

### Raspberry Pi Family

| Board | Key Features | Best For | Price |
|-------|--------------|----------|-------|
| **Raspberry Pi 5**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-5/)<br>🪪 Open Hardware | 2.4GHz quad-core, PCIe, AI Kit support | General purpose, home server, AI | $60-80 |
| **Raspberry Pi 5 + AI Kit (Hailo-8L)**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/ai-kit/) | 13 TOPS NPU, camera AI | Edge AI, vision projects | $130 |
| **Raspberry Pi CM5**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/compute-module-5/) | Compute Module form factor | Industrial, custom carrier boards | $45-95 |
| **Raspberry Pi Zero 2 W**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) | Compact, quad-core, WiFi | Space-constrained, battery | $15 |
| **Raspberry Pi 400**<br>🔗 [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-400/) | Keyboard with Pi built-in | Desktop replacement, education | $70 |

### NVIDIA Jetson

| Board | Key Features | Best For | Price |
|-------|--------------|----------|-------|
| **Jetson Orin Nano 8GB**<br>🔗 [nvidia.com/jetson](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) | 40 TOPS, Ampere GPU, 8GB | Edge AI, robotics, vision | $499 |
| **Jetson Orin NX 16GB**<br>🔗 [nvidia.com/jetson](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) | 100 TOPS, 16GB, PCIe | Advanced AI, autonomous systems | $599 |
| **Jetson AGX Orin**<br>🔗 [nvidia.com/jetson](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) | 275 TOPS, industrial grade | High-performance edge, research | $1,999 |

### Other SBCs

| Board | Key Features | Best For | Price |
|-------|--------------|----------|-------|
| **Orange Pi 5 Plus**<br>🔗 [orangepi.org](http://www.orangepi.org/) | RK3588, 8K video, NPU | Media center, AI projects | $89-149 |
| **Banana Pi BPI-M7**<br>🔗 [banana-pi.org](https://www.banana-pi.org/) | RK3588, dual 2.5G ethernet | NAS, networking | $119 |
| **BeagleBone AI-64**<br>🔗 [beagleboard.org](https://www.beagleboard.org/boards/beaglebone-ai-64) | TDA4VM, 8 TOPS vision AI | Industrial AI, robotics | $189 |
| **LattePanda 3 Delta**<br>🔗 [lattepanda.com](https://www.lattepanda.com/) | x86 Intel N100, Windows/Linux | x86 compatibility needed | $269 |
| **Radxa Rock 5B**<br>🔗 [radxa.com](https://radxa.com/products/rock5/5b) | RK3588, 32GB RAM option | Power user, development | $79-169 |

---

## AI Accelerators & Edge ML

### Hardware Accelerators

| Accelerator | Performance | Interface | Best For | Price |
|-------------|-------------|-----------|----------|-------|
| **Google Coral USB**<br>🔗 [coral.ai](https://coral.ai/products/accelerator/)<br>🪪 Proprietary | 4 TOPS (int8) | USB 3.0 | TensorFlow Lite, classification | $60 |
| **Google Coral M.2/PCIe**<br>🔗 [coral.ai](https://coral.ai/products/m2-accelerator/) | 4 TOPS (int8) | M.2/PCIe | Embedded AI, always-on | $25-35 |
| **Hailo-8**<br>🔗 [hailo.ai](https://hailo.ai/products/hailo-8/) | 26 TOPS | M.2/PCIe | High-performance edge AI | ~$100 |
| **Hailo-8L (Pi AI Kit)**<br>🔗 [hailo.ai](https://hailo.ai/products/hailo-8l/) | 13 TOPS | M.2 | Raspberry Pi 5 AI projects | $70 |
| **Intel Neural Compute Stick 2**<br>🔗 [intel.com](https://www.intel.com/content/www/us/en/developer/tools/neural-compute-stick/overview.html) | ~100 GOPS | USB | OpenVINO inference | $69 |
| **AMD Ryzen AI**<br>🔗 [amd.com](https://www.amd.com/en/products/ryzen-ai) | Up to 50 TOPS | Integrated | Laptop/PC AI | Built-in |

### Edge ML Frameworks

| Framework | Description | Best For |
|-----------|-------------|----------|
| **TensorFlow Lite**<br>🔗 [tensorflow.org/lite](https://www.tensorflow.org/lite)<br>🪪 Apache-2.0 | Mobile/embedded inference | Cross-platform, Coral TPU |
| **ONNX Runtime**<br>🔗 [onnxruntime.ai](https://onnxruntime.ai/)<br>🪪 MIT | Cross-platform inference | Multi-framework models |
| **OpenVINO**<br>🔗 [docs.openvino.ai](https://docs.openvino.ai/)<br>🪪 Apache-2.0 | Intel hardware optimization | Intel CPUs/GPUs/NPUs |
| **TensorRT**<br>🔗 [developer.nvidia.com/tensorrt](https://developer.nvidia.com/tensorrt) | NVIDIA GPU optimization | Jetson, NVIDIA GPUs |
| **Edge Impulse**<br>🔗 [edgeimpulse.com](https://www.edgeimpulse.com/)<br>🪪 Freemium | End-to-end edge ML | TinyML, quick deployment |
| **MicroPython AI**<br>🔗 [micropython.org](https://micropython.org/) | Python on microcontrollers | Rapid prototyping |

---

## 3D Printing

### FDM Printers (Filament)

| Printer | Build Volume | Key Features | Best For | Price |
|---------|--------------|--------------|----------|-------|
| **Bambu Lab P1S**<br>🔗 [bambulab.com](https://bambulab.com/en/p1) | 256×256×256mm | Multi-color, fast, enclosed | Reliable workhorse | $699 |
| **Bambu Lab X1 Carbon**<br>🔗 [bambulab.com](https://bambulab.com/en/x1) | 256×256×256mm | Carbon fiber, Lidar, AI camera | Engineering materials | $1,199 |
| **Prusa MK4S**<br>🔗 [prusa3d.com](https://www.prusa3d.com/category/original-prusa-mk4s/)<br>🪪 Open Hardware | 250×210×220mm | Input shaping, open-source | Makers who mod | $799 |
| **Creality K1 Max**<br>🔗 [creality.com](https://www.creality.com/products/creality-k1-max-3d-printer) | 300×300×300mm | Fast CoreXY, large volume | Big prints, budget | $599 |
| **Voron 2.4**<br>🔗 [vorondesign.com](https://vorondesign.com/)<br>🪪 GPL | 350×350×350mm | DIY kit, highly customizable | Advanced makers | $1,200+ (kit) |
| **Ender-3 V3**<br>🔗 [creality.com](https://www.creality.com/) | 220×220×250mm | Budget CoreXY, fast | Budget, beginners | $199 |

### Resin Printers (SLA/MSLA)

| Printer | Build Volume | Key Features | Best For | Price |
|---------|--------------|--------------|----------|-------|
| **Elegoo Saturn 4 Ultra**<br>🔗 [elegoo.com](https://www.elegoo.com/) | 218×122×260mm | 12K resolution, fast | Detailed miniatures | $319 |
| **Anycubic Photon Mono M7 Pro**<br>🔗 [anycubic.com](https://www.anycubic.com/) | 219×123×250mm | 14K resolution | Ultra-detail | $349 |
| **Formlabs Form 4**<br>🔗 [formlabs.com](https://formlabs.com/3d-printers/form-4/)<br>🪪 Commercial | 200×125×210mm | Professional, bio-compatible | Dental, jewelry, pro | $4,499 |
| **Prusa SL1S Speed**<br>🔗 [prusa3d.com](https://www.prusa3d.com/category/original-prusa-sl1s-speed/) | 127×80×150mm | Open-source, reliable | Open ecosystem | $1,599 |

### Slicers & Software

| Software | Description | Best For |
|----------|-------------|----------|
| **PrusaSlicer**<br>🔗 [prusa3d.com/prusaslicer](https://www.prusa3d.com/prusaslicer/)<br>🪪 AGPL-3.0 | Open-source, feature-rich | FDM, SLA, advanced users |
| **Bambu Studio**<br>🔗 [bambulab.com](https://bambulab.com/en/download/studio)<br>🪪 AGPL-3.0 | Bambu printers, fast | Bambu Lab ecosystem |
| **OrcaSlicer**<br>🔗 [github.com/SoftFever/OrcaSlicer](https://github.com/SoftFever/OrcaSlicer)<br>🪪 AGPL-3.0 | Fork with extra features | Multi-brand, calibration |
| **Cura**<br>🔗 [ultimaker.com/cura](https://ultimaker.com/software/ultimaker-cura/)<br>🪪 LGPL-3.0 | Wide printer support | Beginners, compatibility |
| **Chitubox**<br>🔗 [chitubox.com](https://www.chitubox.com/) | Resin slicing | Most resin printers |
| **Lychee Slicer**<br>🔗 [lychee.mango3d.io](https://mango3d.io/lychee-slicer-for-sla-702702702702702702702702/) | Resin with auto-supports | Resin, miniatures |

### 3D Design Software

| Software | Description | Best For |
|----------|-------------|----------|
| **Fusion 360**<br>🔗 [autodesk.com/fusion-360](https://www.autodesk.com/products/fusion-360/)<br>🪪 Free for hobbyists | Parametric CAD, CAM | Mechanical design |
| **Onshape**<br>🔗 [onshape.com](https://www.onshape.com/en/)<br>🪪 Free tier | Browser-based CAD | Collaboration, no install |
| **FreeCAD**<br>🔗 [freecad.org](https://www.freecad.org/)<br>🪪 LGPL-2.1 | Open-source parametric | Open-source purists |
| **OpenSCAD**<br>🔗 [openscad.org](https://openscad.org/)<br>🪪 GPL-3.0 | Code-based 3D modeling | Programmatic design |
| **Blender**<br>🔗 [blender.org](https://www.blender.org/)<br>🪪 GPL | 3D modeling, sculpting | Organic shapes, art |
| **Shapr3D**<br>🔗 [shapr3d.com](https://www.shapr3d.com/) | iPad/Mac CAD | Mobile design |

---

## PCB Design & Electronics

### PCB Design Software

| Software | Description | Best For | Price |
|----------|-------------|----------|-------|
| **KiCad**<br>🔗 [kicad.org](https://www.kicad.org/)<br>🪪 GPL-3.0 | Full-featured open-source | Professional, open-source | Free |
| **EasyEDA Pro**<br>🔗 [easyeda.com](https://easyeda.com/)<br>🪪 Free | Browser-based, JLCPCB integrated | Quick prototypes | Free |
| **Altium Designer**<br>🔗 [altium.com](https://www.altium.com/) | Industry standard | Professional, teams | $$$$ |
| **Autodesk Eagle**<br>🔗 [autodesk.com/eagle](https://www.autodesk.com/products/eagle/) | Fusion 360 integration | Hobbyist, small boards | Free tier |
| **Flux**<br>🔗 [flux.ai](https://www.flux.ai/) | AI-assisted, browser-based | Modern workflows | Free tier |

### PCB Manufacturing

| Service | Lead Time | Min Qty | Features |
|---------|-----------|---------|----------|
| **JLCPCB**<br>🔗 [jlcpcb.com](https://jlcpcb.com/) | 1-3 days | 5 | Cheap, assembly, 3D printing |
| **PCBWay**<br>🔗 [pcbway.com](https://www.pcbway.com/) | 2-4 days | 5 | Good assembly, flexible |
| **OSH Park**<br>🔗 [oshpark.com](https://oshpark.com/) | ~12 days | 3 | US-based, purple boards |
| **Aisler**<br>🔗 [aisler.net](https://aisler.net/) | 5-8 days | 3 | EU-based, quality |
| **NextPCB**<br>🔗 [nextpcb.com](https://www.nextpcb.com/) | 3-5 days | 5 | Free assembly prototypes |

### Test Equipment

| Equipment | Description | Price Range |
|-----------|-------------|-------------|
| **Digital Multimeter**<br>🔗 Various | Voltage, current, resistance | $20-200 |
| **Logic Analyzer**<br>🔗 [saleae.com](https://www.saleae.com/) | Digital signal debugging | $150-500 |
| **Oscilloscope**<br>🔗 [rigol.com](https://www.rigolna.com/) | Waveform analysis | $300-2000 |
| **USB Power Meter**<br>🔗 Various | Power consumption testing | $20-50 |
| **Thermal Camera**<br>🔗 [flir.com](https://www.flir.com/) | Heat detection | $200-500 |

---

## Development Environments

### Microcontroller IDEs

| IDE | Description | Best For |
|-----|-------------|----------|
| **PlatformIO**<br>🔗 [platformio.org](https://platformio.org/)<br>🪪 Apache-2.0 | Multi-platform embedded IDE | Professional embedded, CI/CD |
| **Arduino IDE 2.x**<br>🔗 [arduino.cc](https://www.arduino.cc/en/software)<br>🪪 GPL-3.0 | Official Arduino IDE | Beginners, Arduino boards |
| **ESP-IDF**<br>🔗 [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/)<br>🪪 Apache-2.0 | Official ESP32 framework | Advanced ESP32 development |
| **STM32CubeIDE**<br>🔗 [st.com](https://www.st.com/stm32cubeide)<br>🪪 Free | STM32 development | STM32 MCUs |
| **Thonny**<br>🔗 [thonny.org](https://thonny.org/)<br>🪪 MIT | Python for beginners | MicroPython, education |
| **VS Code + Extensions**<br>🔗 [code.visualstudio.com](https://code.visualstudio.com/) | General-purpose with plugins | Flexibility, customization |

### Firmware & RTOS

| Framework | Description | Best For |
|-----------|-------------|----------|
| **FreeRTOS**<br>🔗 [freertos.org](https://www.freertos.org/)<br>🪪 MIT | Real-time operating system | Multi-tasking embedded |
| **Zephyr RTOS**<br>🔗 [zephyrproject.org](https://www.zephyrproject.org/)<br>🪪 Apache-2.0 | Linux Foundation RTOS | Professional IoT, standards |
| **MicroPython**<br>🔗 [micropython.org](https://micropython.org/)<br>🪪 MIT | Python for microcontrollers | Rapid prototyping |
| **CircuitPython**<br>🔗 [circuitpython.org](https://circuitpython.org/)<br>🪪 MIT | Adafruit's MicroPython fork | Beginners, Adafruit boards |
| **Rust Embedded**<br>🔗 [rust-embedded.org](https://www.rust-embedded.org/) | Memory-safe embedded Rust | Safety-critical systems |
| **RIOT OS**<br>🔗 [riot-os.org](https://www.riot-os.org/)<br>🪪 LGPL-2.1 | IoT-focused OS | Low-power IoT devices |

---

## Robotics

### Robot Platforms

| Platform | Description | Best For | Price |
|----------|-------------|----------|-------|
| **Boston Dynamics Spot**<br>🔗 [bostondynamics.com](https://www.bostondynamics.com/spot) | Quadruped robot | Inspection, research | $74,500 |
| **Unitree Go2**<br>🔗 [unitree.com](https://www.unitree.com/go2/) | Affordable quadruped | Research, education | $1,600-2,800 |
| **TurtleBot 4**<br>🔗 [turtlebot.com](https://www.turtlebot.com/)<br>🪪 Apache-2.0 | ROS2 learning platform | Learning ROS2 | $1,200-1,800 |
| **iRobot Create 3**<br>🔗 [edu.irobot.com](https://edu.irobot.com/what-we-offer/create3) | Education robot platform | Education, ROS2 | $299 |
| **NVIDIA JetBot**<br>🔗 [nvidia.com/jetbot](https://developer.nvidia.com/embedded/learn/jetbot) | AI robot kit | Edge AI, vision | $250 (kit) |
| **OpenManipulator**<br>🔗 [emanual.robotis.com](https://emanual.robotis.com/docs/en/platform/openmanipulator_x/overview/)<br>🪪 Apache-2.0 | Robot arm platform | Manipulation research | $500-1,000 |

### Robotics Software

| Software | Description | Best For |
|----------|-------------|----------|
| **ROS 2 (Jazzy)**<br>🔗 [ros.org](https://www.ros.org/)<br>🪪 Apache-2.0 | Robot Operating System | Production robotics |
| **Isaac Sim**<br>🔗 [nvidia.com/isaac-sim](https://developer.nvidia.com/isaac-sim) | NVIDIA robot simulation | Training, synthetic data |
| **Gazebo**<br>🔗 [gazebosim.org](https://gazebosim.org/)<br>🪪 Apache-2.0 | Robot simulation | ROS integration |
| **PyBullet**<br>🔗 [pybullet.org](https://pybullet.org/)<br>🪪 Zlib | Physics simulation | RL training, research |
| **MuJoCo**<br>🔗 [mujoco.org](https://mujoco.org/)<br>🪪 Apache-2.0 | Physics engine (DeepMind) | Research, RL |
| **MoveIt 2**<br>🔗 [moveit.ros.org](https://moveit.ros.org/)<br>🪪 BSD | Motion planning | Arm manipulation |

---

## Sensors & Actuators

### Common Sensors

| Sensor Type | Popular Options | Interface | Use Case |
|-------------|-----------------|-----------|----------|
| **IMU (Motion)** | MPU6050, BMI270, ICM-42688 | I2C/SPI | Orientation, motion tracking |
| **Temperature** | DHT22, BME280, DS18B20 | 1-Wire/I2C | Environmental monitoring |
| **Distance** | HC-SR04, VL53L1X, TFmini | GPIO/I2C/UART | Proximity, ranging |
| **Camera** | OV2640, IMX219, IMX477 | CSI/USB | Vision, AI inference |
| **LiDAR** | RPLidar A1, Slamtec A2M12 | UART | SLAM, mapping |
| **GPS** | NEO-6M, NEO-M8N, ZED-F9P | UART | Location tracking |
| **Air Quality** | SGP40, SCD40, PMS5003 | I2C/UART | Environment monitoring |
| **Current/Power** | INA219, INA3221 | I2C | Power monitoring |

### Actuators & Motors

| Type | Popular Options | Driver | Use Case |
|------|-----------------|--------|----------|
| **Servo** | SG90, MG996R, Dynamixel | PWM/TTL | Positioning, joints |
| **Stepper** | NEMA17, NEMA23 | A4988, TMC2209 | Precise motion, 3D printers |
| **DC Motor** | N20, 775, brushless | TB6612, L298N | Wheels, fans |
| **Linear Actuator** | Actuonix, Firgelli | H-bridge | Push/pull motion |
| **Solenoid** | Various | MOSFET | Locks, valves |

---

## Connectivity & Protocols

### Wireless

| Protocol | Range | Power | Best For |
|----------|-------|-------|----------|
| **WiFi 6** | 30-100m | High | High bandwidth, home IoT |
| **BLE 5.x** | 30-100m | Low | Wearables, beacons |
| **Thread** | Mesh | Low | Smart home, Matter |
| **Zigbee** | Mesh | Low | Home automation |
| **LoRa** | 2-15km | Very Low | Long range, rural IoT |
| **Matter** | Varies | Varies | Interop standard |

### Wired

| Protocol | Speed | Distance | Best For |
|----------|-------|----------|----------|
| **I2C** | 100-400kbps | 1m | Sensors, short distance |
| **SPI** | 1-50Mbps | 0.5m | Displays, fast peripherals |
| **UART** | 115200bps typical | 15m | Serial communication |
| **CAN Bus** | 1Mbps | 40m | Automotive, industrial |
| **RS-485** | 10Mbps | 1200m | Industrial, long distance |
| **Ethernet** | 1-10Gbps | 100m | High bandwidth |

---

## Example: ESP32-S3 with TensorFlow Lite

```cpp
#include <Arduino.h>
#include <TensorFlowLite_ESP32.h>
#include "model.h"  // Your converted TFLite model

// Allocate tensor arena
constexpr int kTensorArenaSize = 100 * 1024;
uint8_t tensor_arena[kTensorArenaSize];

tflite::MicroInterpreter* interpreter;
TfLiteTensor* input;
TfLiteTensor* output;

void setup() {
    Serial.begin(115200);
    
    // Load the model
    const tflite::Model* model = tflite::GetModel(g_model);
    
    // Set up the interpreter
    static tflite::MicroMutableOpResolver<10> resolver;
    resolver.AddFullyConnected();
    resolver.AddSoftmax();
    // Add other ops as needed
    
    static tflite::MicroInterpreter static_interpreter(
        model, resolver, tensor_arena, kTensorArenaSize);
    interpreter = &static_interpreter;
    
    interpreter->AllocateTensors();
    input = interpreter->input(0);
    output = interpreter->output(0);
    
    Serial.println("Model loaded!");
}

void loop() {
    // Fill input tensor with sensor data
    // input->data.f[0] = sensorValue;
    
    // Run inference
    TfLiteStatus invoke_status = interpreter->Invoke();
    if (invoke_status != kTfLiteOk) {
        Serial.println("Invoke failed!");
        return;
    }
    
    // Read output
    float prediction = output->data.f[0];
    Serial.printf("Prediction: %.2f\n", prediction);
    
    delay(100);
}
```

---

## Getting Started Checklist

1. **Choose your compute platform**: ESP32 for simple IoT, Pi 5 for complex projects
2. **Set up development environment**: PlatformIO or Arduino IDE
3. **Get essential tools**: Multimeter, soldering iron, jumper wires
4. **Design your first PCB**: Start with KiCad or EasyEDA
5. **Print a custom enclosure**: Use Fusion 360 → PrusaSlicer → printer
6. **Add connectivity**: WiFi for home, LoRa for remote
7. **Integrate sensors**: Start with simple (temperature) before complex (camera)
8. **Consider power**: Battery life, solar, USB-C power delivery

---

## Resources

- [Adafruit Learning System](https://learn.adafruit.com/)
- [SparkFun Tutorials](https://learn.sparkfun.com/)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)
- [Hackaday](https://hackaday.com/)
- [NVIDIA Jetson Developer](https://developer.nvidia.com/embedded-computing)
- [Edge Impulse Documentation](https://docs.edgeimpulse.com/)
