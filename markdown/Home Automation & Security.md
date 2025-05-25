# Home Automation & Security

> Centralized guide to open-source home automation and security platforms. Integrate smart devices, secure access, and build monitoring pipelines with these tools.

## Usage Guidelines

- Establish a secure home network: separate IoT devices on isolated VLANs or subnets.
- Use **Home Assistant** as the primary control plane; leverage community add-ons for devices.
- Automate alerts and monitoring: integrate **Uptime Kuma** for service health, **Plausible Analytics** for privacy-friendly metrics.
- Secure video feeds: run **Frigate** or **ZoneMinder** locally, enable on-device object detection to avoid cloud dependencies.
- Backup configurations and use version control (Git) for automation scripts and YAML configs.
- Plan for redundancy: mirror critical services (NVR, automation hub) on secondary devices or virtual machines.

## Home Automation Tools

| Tool                  | Description                              | Link      |
|-----------------------|------------------------------------------|-----------|
| **Home Assistant**    | Open-source home automation platform      | [Website](https://www.home-assistant.io/) |
| **eufy_security**     | Integration for Eufy security devices    | [GitHub](https://github.com/fuatakgun/eufy_security) |
| **Llama 3 Home Assistant** | Llama 3 integration for Home Assistant control | [Guide](https://fixtse.com/tags/home-assistant) |
| **NGINX Proxy Manager** | Reverse proxy for Home Assistant        | [GitHub](https://github.com/hassio-addons/addon-nginx-proxy-manager) |
| **Uptime Kuma**       | Self-hosted monitoring tool              | [GitHub](https://github.com/louislam/uptime-kuma) |
| **Plausible Analytics** | Privacy-friendly web analytics          | [Website](https://plausible.io/) |

## Video Security Tools

| Tool           | Description                        | Link      |
|----------------|------------------------------------|-----------|
| **camera.ui**  | NVR-like UI for RTSP cameras       | [GitHub](https://github.com/seydx/camera.ui) |
| **iSpyConnect**| IP camera streaming software        | [Download](https://www.ispyconnect.com/download) |
| **ZoneMinder** | Full-featured video security system| [Docs](https://zoneminder.readthedocs.io/en/stable/) |
| **SentryShot** | Video management system            | [GitHub](https://github.com/SentryShot/sentryshot) |
| **Frigate**    | NVR with local object detection    | [GitHub](https://github.com/blakeblackshear/frigate) |
| **MotionEye**  | Web frontend for motion daemon      | [GitHub](https://github.com/motioneye-project/motioneye) |
| **Viseron**    | AI computer vision NVR             | [GitHub](https://github.com/roflcoopter/viseron) |
| **Shinobi**    | Scalable CCTV NVR system           | [GitLab](https://gitlab.com/Shinobi-Systems/Shinobi) |
| **Moonfire NVR** | Network video recorder            | [GitHub](https://github.com/scottlamb/moonfire-nvr) |
