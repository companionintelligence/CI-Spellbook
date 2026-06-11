# Smart Home & HomeLab Security

## Quickstart (2026)

1. Segment your network: put IoT on its own VLAN/SSID with strict egress rules.
2. Pick a control plane: **Home Assistant** (plus **MQTT** if you have many devices).
3. Add visibility: uptime checks + basic dashboards/alerts.
4. Keep video local: an NVR (e.g., Frigate) with on-device detection where possible.
5. Back up configs and secrets (and test restores).

> Centralized guide to open-source home automation and security platforms. Integrate smart devices, secure access, and build monitoring pipelines with these tools.

## Usage Guidelines

- Establish a secure home network: separate IoT devices on isolated VLANs or subnets.
- Use **Home Assistant** as the primary control plane; leverage community add-ons for devices.
- Automate alerts and monitoring: integrate **Uptime Kuma** for service health, **Plausible Analytics** for privacy-friendly metrics.
- Secure video feeds: run **Frigate** or **ZoneMinder** locally, enable on-device object detection to avoid cloud dependencies.
- Backup configurations and use version control (Git) for automation scripts and YAML configs.
- Plan for redundancy: mirror critical services (NVR, automation hub) on secondary devices or virtual machines.

## Home Automation Platforms

| Tool | Description | Key Features | Best For |
|------|-------------|--------------|----------|
| **Home Assistant**<br>🔗 [Website](https://www.home-assistant.io/) | Open-source home automation platform | 1000+ integrations, local control, automation engine, mobile app | Privacy-focused users, advanced automation |
| **OpenHAB**<br>🔗 [Website](https://www.openhab.org/) | Vendor and technology agnostic open source automation software | Java-based, rule engine, extensive bindings, cloud connector | Java developers, enterprise environments |
| **Hubitat Elevation**<br>🔗 [Website](https://hubitat.com/) | Local processing smart home hub | Z-Wave/Zigbee support, local processing, rule machine, cloud backup | Users wanting local control with commercial support |
| **Node-RED**<br>🔗 [Website](https://nodered.org/) | Flow-based development tool for visual programming | Visual flow editor, extensive node library, MQTT support | Visual programmers, IoT prototyping |
| **Domoticz**<br>🔗 [Website](https://www.domoticz.com/) | Lightweight home automation system | Multi-platform, hardware/protocol support, web interface | Lightweight setups, Raspberry Pi users |
| **Jeedom**<br>🔗 [Website](https://www.jeedom.com/) | Home automation platform with marketplace | Plugin marketplace, scenarios, mobile app, voice control | French users, plugin ecosystem |

## Smart Device Integration

| Tool | Description | Protocol Support | Integration |
|------|-------------|------------------|-------------|
| **Zigbee2MQTT**<br>🔗 [GitHub](https://github.com/Koenkk/zigbee2mqtt) | Bridge between Zigbee devices and MQTT | Zigbee 3.0, 2000+ supported devices | Home Assistant, OpenHAB, Node-RED |
| **Tasmota**<br>🔗 [Website](https://tasmota.github.io/docs/) | Alternative firmware for ESP8266/ESP32 devices | WiFi, MQTT, HTTP, multiple sensors | DIY devices, Sonoff switches |
| **ESPHome**<br>🔗 [Website](https://esphome.io/) | Configuration-based firmware for ESP devices | YAML config, OTA updates, native HA API | Home Assistant users, custom sensors |
| **Z-Wave JS**<br>🔗 [GitHub](https://github.com/zwave-js/node-zwave-js) | Modern Z-Wave driver for Node.js | Z-Wave protocol, security, mesh networking | Home Assistant Z-Wave integration |
| **Matter**<br>🔗 [Website](https://csa-iot.org/all-solutions/matter/) | Universal smart home connectivity standard | Thread, WiFi, Ethernet, vendor interoperability | Future-proof smart home setups |

## Video Surveillance & NVR

| Tool | Description | Key Features | Best For |
|------|-------------|--------------|----------|
| **Frigate**<br>🔗 [GitHub](https://github.com/blakeblackshear/frigate) | NVR with local object detection | AI object detection, MQTT integration, clips/snapshots | Home Assistant users, AI detection |
| **ZoneMinder**<br>🔗 [Website](https://zoneminder.com/) | Full-featured video security system | Motion detection, alerts, streaming, mobile app | Traditional CCTV setups, enterprise |
| **MotionEye**<br>🔗 [GitHub](https://github.com/motioneye-project/motioneye) | Web frontend for motion daemon | Simple setup, streaming, mobile access | Basic surveillance, easy setup |
| **Viseron**<br>🔗 [GitHub](https://github.com/roflcoopter/viseron) | AI computer vision NVR | TensorFlow integration, face recognition, zones | AI-powered surveillance |
| **Shinobi**<br>🔗 [GitLab](https://gitlab.com/Shinobi-Systems/Shinobi) | Scalable CCTV NVR system | API, plugins, face recognition, cloud storage | Scalable installations |
| **Blue Iris**<br>🔗 [Website](https://blueirissoftware.com/) | Windows-based video security software | AI detection, mobile alerts, PTZ control | Windows users, professional setups |
| **Moonfire NVR**<br>🔗 [GitHub](https://github.com/scottlamb/moonfire-nvr) | Network video recorder | High efficiency, web interface, timeline view | Storage-conscious users |
| **Agent DVR**<br>🔗 [Website](https://www.ispyconnect.com/download) | AI-powered video surveillance | Cloud AI, local processing, alerts | Mixed cloud/local setups |

## Security & Access Control

| Tool | Description | Key Features | Use Cases |
|------|-------------|--------------|-----------|
| **Fail2Ban**<br>🔗 [Website](https://www.fail2ban.org/) | Intrusion prevention software | Log monitoring, IP banning, customizable filters | SSH protection, web server security |
| **Pi-hole**<br>🔗 [Website](https://pi-hole.net/) | Network-wide ad blocker | DNS sinkhole, admin interface, query logging | Ad blocking, malware protection |
| **AdGuard Home**<br>🔗 [GitHub](https://github.com/AdguardTeam/AdguardHome) | Network-wide ad and tracker blocker | DNS filtering, parental controls, statistics | Enhanced ad blocking |
| **pfSense**<br>🔗 [Website](https://www.pfsense.org/) | Open source firewall and router | VPN server, traffic shaping, intrusion detection | Network security, VPN access |
| **OPNsense**<br>🔗 [Website](https://opnsense.org/) | Firewall and routing platform | Web interface, plugins, high availability | Modern firewall management |
| **Vaultwarden**<br>🔗 [GitHub](https://github.com/dani-garcia/vaultwarden) | Bitwarden server implementation | Password management, secure sharing, 2FA | Self-hosted password management |
| **Authelia**<br>🔗 [Website](https://www.authelia.com/) | Authentication and authorization server | 2FA, SSO, LDAP integration, access control | Single sign-on, access control |

## Monitoring & Analytics

| Tool | Description | Key Features | Monitoring Focus |
|------|-------------|--------------|------------------|
| **Uptime Kuma**<br>🔗 [GitHub](https://github.com/louislam/uptime-kuma) | Self-hosted monitoring tool | Status pages, notifications, multiple protocols | Service availability |
| **Grafana**<br>🔗 [Website](https://grafana.com/) | Observability and monitoring platform | Dashboards, alerting, data source integration | Metrics visualization |
| **Prometheus**<br>🔗 [Website](https://prometheus.io/) | Monitoring and alerting toolkit | Time-series DB, service discovery, alerting | Infrastructure monitoring |
| **Zabbix**<br>🔗 [Website](https://www.zabbix.com/) | Enterprise monitoring solution | Agent/agentless monitoring, auto-discovery | Network and server monitoring |
| **LibreNMS**<br>🔗 [Website](https://www.librenms.org/) | Network monitoring system | SNMP monitoring, alerting, graphing | Network device monitoring |
| **Netdata**<br>🔗 [Website](https://www.netdata.cloud/) | Real-time performance monitoring | Real-time metrics, alarms, distributed | System performance monitoring |
| **PRTG**<br>🔗 [Website](https://www.paessler.com/prtg) | Network monitoring (free up to 100 sensors) | Easy setup, comprehensive monitoring | Windows environments |

## Energy Management

| Tool | Description | Key Features | Integration |
|------|-------------|--------------|-------------|
| **Emoncms**<br>🔗 [Website](https://emoncms.org/) | Open-source energy monitoring | Data logging, visualization, feeds | Energy monitors, IoT sensors |
| **OpenEnergyMonitor**<br>🔗 [Website](https://openenergymonitor.org/) | Open-source energy monitoring | Hardware/software ecosystem, real-time data | DIY energy monitoring |
| **Solar Assistant**<br>🔗 [Website](https://solar-assistant.io/) | Solar power monitoring | Inverter integration, MQTT, web dashboard | Solar installations |
| **PVOutput**<br>🔗 [Website](https://pvoutput.org/) | Solar generation tracking | Community platform, performance comparison | Solar performance tracking |

## Voice Assistants & AI

| Tool | Description | Key Features | Privacy Level |
|------|-------------|--------------|---------------|
| **Rhasspy**<br>🔗 [Website](https://rhasspy.readthedocs.io/) | Open source voice assistant | Offline processing, intent recognition, TTS/STT | Fully offline/private |
| **Mycroft AI**<br>🔗 [Website](https://mycroft.ai/) | Open source voice assistant | Skills marketplace, customizable wake words | Privacy-focused |
| **OpenAI Whisper (local)**<br>🔗 [GitHub](https://github.com/openai/whisper) | Speech recognition system | High accuracy, multiple languages, local processing | Offline speech recognition |
| **Piper TTS**<br>🔗 [GitHub](https://github.com/rhasspy/piper) | Fast neural text to speech | Multiple voices, offline, lightweight | Local text-to-speech |
| **Willow**<br>🔗 [Website](https://heywillow.io/) | Open source voice assistant | ESP32-based, offline wake word, Home Assistant | Privacy-focused, hardware-based |

## Backup & Data Management

| Tool | Description | Key Features | Backup Type |
|------|-------------|--------------|-------------|
| **Duplicati**<br>🔗 [Website](https://www.duplicati.com/) | Backup client with encryption | Web interface, encryption, cloud backends | Incremental backups |
| **Restic**<br>🔗 [Website](https://restic.net/) | Fast, secure backup program | Deduplication, encryption, multiple backends | Command-line backups |
| **Borg Backup**<br>🔗 [Website](https://www.borgbackup.org/) | Deduplicating backup program | Space-efficient, encryption, incremental | Advanced deduplication |
| **Syncthing**<br>🔗 [Website](https://syncthing.net/) | Continuous file synchronization | P2P sync, versioning, privacy-focused | File synchronization |
| **rsync**<br>🔗 [Website](https://rsync.samba.org/) | Fast incremental file transfer | Delta encoding, network efficiency | File transfers/backups |

## Network Storage & Media

| Tool | Description | Key Features | Media Features |
|------|-------------|--------------|----------------|
| **OpenMediaVault**<br>🔗 [Website](https://www.openmediavault.org/) | NAS solution based on Debian | Web management, plugins, RAID support | SMB/NFS shares, media streaming |
| **TrueNAS Scale**<br>🔗 [Website](https://www.truenas.com/) | Enterprise storage with containers | ZFS, hyperconverged, Kubernetes apps | Enterprise features, app ecosystem |
| **Nextcloud**<br>🔗 [Website](https://nextcloud.com/) | Self-hosted cloud platform | File sync, calendar, contacts, apps | Personal cloud, collaboration |
| **Jellyfin**<br>🔗 [Website](https://jellyfin.org/) | Media server software | Streaming, transcoding, client apps | Media streaming, no licensing |
| **Plex**<br>🔗 [Website](https://www.plex.tv/) | Media server platform | Easy setup, remote access, apps | User-friendly media streaming |
| **Emby**<br>🔗 [Website](https://emby.media/) | Media server solution | DVR, live TV, mobile sync | Media management with premium features |

## IoT & Sensor Platforms

| Tool | Description | Key Features | Sensor Types |
|------|-------------|--------------|--------------|
| **Mosquitto**<br>🔗 [Website](https://mosquitto.org/) | MQTT broker | Lightweight, SSL/TLS support, bridge mode | All MQTT devices |
| **InfluxDB**<br>🔗 [Website](https://www.influxdata.com/) | Time-series database | High write throughput, retention policies | Sensor data storage |
| **ThingsBoard**<br>🔗 [Website](https://thingsboard.io/) | IoT platform | Device management, dashboards, rule engine | Enterprise IoT |
| **Blynk**<br>🔗 [Website](https://blynk.io/) | IoT platform with mobile apps | Drag-and-drop interface, notifications | Mobile-first IoT |
| **Arduino IoT Cloud**<br>🔗 [Website](https://create.arduino.cc/iot/) | Arduino's IoT platform | Arduino integration, webhooks, dashboard | Arduino ecosystem |

## Advanced Integrations

### Home Assistant Add-ons & Integrations

| Add-on/Integration | Description | Use Case |
|-------------------|-------------|----------|
| **HACS**<br>🔗 [GitHub](https://github.com/hacs/integration) | Home Assistant Community Store | Custom components and themes |
| **AppDaemon**<br>🔗 [Website](https://appdaemon.readthedocs.io/) | Python automation platform | Complex automation logic |
| **ESPHome**<br>🔗 [Website](https://esphome.io/) | ESP device integration | Custom sensors and devices |
| **Zigbee2MQTT**<br>🔗 [GitHub](https://github.com/Koenkk/zigbee2mqtt) | Zigbee to MQTT bridge | Zigbee device integration |
| **Node-RED**<br>🔗 [Website](https://nodered.org/) | Visual flow programming | Complex integrations |

### Example: Complete Home Security Setup

```yaml
# Home Assistant configuration.yaml excerpt
automation:
  - alias: "Security Alert"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door
        to: 'on'
    condition:
      - condition: state
        entity_id: alarm_control_panel.home
        state: 'armed_away'
    action:
      - service: notify.mobile_app
        data:
          title: "Security Alert"
          message: "Front door opened while armed"
      - service: light.turn_on
        entity_id: light.security_lights
      - service: camera.record
        entity_id: camera.front_door
```

### Docker Compose Stack Example

```yaml
version: '3.8'
services:
  homeassistant:
    container_name: homeassistant
    image: homeassistant/home-assistant:stable
    volumes:
      - ./config:/config
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    network_mode: host

  mosquitto:
    container_name: mosquitto
    image: eclipse-mosquitto
    volumes:
      - ./mosquitto:/mosquitto
    ports:
      - "1883:1883"
      - "9001:9001"
    restart: unless-stopped

  frigate:
    container_name: frigate
    image: blakeblackshear/frigate:stable
    volumes:
      - ./frigate/config.yml:/config/config.yml
      - ./frigate/storage:/media/frigate
    ports:
      - "5000:5000"
    restart: unless-stopped

  uptime-kuma:
    container_name: uptime-kuma
    image: louislam/uptime-kuma
    volumes:
      - ./uptime-kuma:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
```

## Security Best Practices

### Network Segmentation
- Isolate IoT devices on separate VLAN
- Use firewall rules to restrict device communication
- Implement network access control (NAC)

### Device Security
- Change default passwords on all devices
- Enable automatic security updates
- Regularly audit connected devices
- Use VPN for remote access

### Data Protection
- Encrypt sensitive data at rest and in transit
- Regular automated backups
- Version control for configurations
- Monitor access logs
