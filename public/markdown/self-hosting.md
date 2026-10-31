# Self-Hosting, Home Server & Smart Home Platforms

> Dashboards, automation, deploy platforms, media servers, smart-home tooling, and homelab operations for self-hosters.

## Dashboards & Home Server Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [CasaOS](https://github.com/IceWhaleTech/CasaOS) | Personal cloud and home server management layer. | Linux | Good simple home-server entry point. |
| [Cockpit](https://github.com/cockpit-project/cockpit) | Web interface for managing servers. | Linux | Good general-purpose admin UI. |
| [dashdot](https://github.com/MauriceNino/dashdot) | Modern personal server dashboard showing system metrics. | Self-hosted | Useful for smaller homelabs. |
| [Dashy](https://github.com/Lissy93/dashy) | Highly customizable dashboard and start page. | Self-hosted | Great front door for a homelab. |
| [Dockge](https://github.com/louislam/dockge) | Reactive self-hosted Docker Compose stack manager with a clean UI. | Self-hosted | Lighter-weight than Portainer for compose-only use. |
| [Glance](https://github.com/glanceapp/glance) | Self-hosted homepage for feeds and widgets. | Self-hosted | Good minimalist dashboard. |
| [homepage](https://github.com/gethomepage/homepage) | Application dashboard with service integrations. | Self-hosted | Strong balance of polish and utility. |
| [Proxmox VE](https://github.com/proxmox/pve-manager) | Open-source server virtualization platform based on KVM and LXC. | Self-hosted, Linux | Industry-standard homelab hypervisor; v9.2 current. |
| [ZimaOS](https://github.com/IceWhaleTech/ZimaOS) | Simplified NAS operating system for home servers. | Self-hosted | ~3k stars; GitHub did not detect a license. |
| [awesome-selfhost-docker](https://github.com/hotheadhacker/awesome-selfhost-docker) | Curated list of self-hosted apps that deploy with Docker. | Self-hosted | ~4k stars; a list, so check each project before use. |

## Deploy & App Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Coolify](https://github.com/coollabsio/coolify) | Open-source self-hostable PaaS; 280+ one-click deployable services. | Self-hosted | v4.0 (May 2026) adds multi-server orchestration and MCP server. |
| [Cosmos](https://github.com/azukaar/Cosmos-Server) | Secure self-hosted home server platform with built-in auth and hardening. | Self-hosted | Strong if you want auth and hardening built in. |
| [Dokploy](https://github.com/Dokploy/dokploy) | Open-source PaaS alternative to Vercel/Netlify with Docker and Compose. | Self-hosted | Younger but fast-growing; ~30k stars as of 2026. |
| [Komodo](https://github.com/moghtech/komodo) | Server and deployment management platform with agent-based architecture. | Self-hosted | Good for multi-server setups; ~10k stars. |
| [Runtipi](https://github.com/runtipi/runtipi) | One-command home server platform with one-click app installs. | Self-hosted | Fast path to a service-rich homelab. |
| [Sandstorm](https://github.com/sandstorm-io/sandstorm) | Web app package platform with a security-first model. | Self-hosted | Good for sandboxed self-hosted apps. |
| [Proxmox VE Helper-Scripts](https://github.com/community-scripts/ProxmoxVE) | Community scripts that create and configure apps and VMs on Proxmox VE. | Self-hosted | MIT; ~30k stars; read each script before running it on a host. |
| [Easy!Appointments](https://github.com/alextselegidis/easyappointments) | Self-hosted appointment scheduler with a public booking page. | Self-hosted | GPL-3.0; ~4.5k stars. |

## Automation & Operations

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Ansible](https://github.com/ansible/ansible) | Automation platform for servers, apps, and infrastructure. | Cross-platform | Core tool for repeatable operations. |
| [Cronicle](https://github.com/jhuckaby/Cronicle) | Distributed job scheduler with a web UI. | Cross-platform, Self-hosted | Useful for orchestrating recurring tasks. |
| [Healthchecks](https://github.com/healthchecks/healthchecks) | Monitoring for cron jobs and background tasks. | Self-hosted, Web | Good safety net for automations. |
| [n8n](https://github.com/n8n-io/n8n) | Workflow automation platform with AI features and many integrations. | Web, Self-hosted | Strong default for visual automation. |
| [Node-RED](https://github.com/node-red/node-red) | Flow-based programming for event-driven apps. | Self-hosted | Excellent for IoT and automation glue. |
| [Script Kit](https://github.com/johnlindquist/kit) | Local automation toolkit for scripts and workflows. | Cross-platform | Great for personal automation surfaces. |
| [Semaphore](https://github.com/semaphoreui/semaphore) | UI and API for Ansible, Terraform, and scripting workflows. | Cross-platform | Good for lightweight ops teams. |

## Smart Home & Energy

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Domoticz](https://github.com/domoticz/domoticz) | Home automation platform for a broad range of devices. | Self-hosted | Mature and flexible. |
| [EOS](https://github.com/Akkudoktor-EOS/EOS) | Energy optimization system for batteries and household devices. | Cross-platform, Self-hosted | Worth tracking for smart energy management. |
| [ESPHome](https://github.com/esphome/esphome) | Firmware tooling for ESP-based DIY sensors and controllers. | Self-hosted | Essential for DIY sensors and controllers. |
| [evcc](https://github.com/evcc-io/evcc) | Energy and EV charging orchestration. | Cross-platform, Self-hosted | Great for solar and EV-aware homes. |
| [Gladys](https://github.com/GladysAssistant/Gladys) | Privacy-first home assistant platform. | Self-hosted | Good alternative home automation stack. |
| [Home Assistant](https://github.com/home-assistant/core) | Local-first home automation platform. | Cross-platform, Self-hosted | Center of the DIY smart-home universe. |
| [Music Assistant](https://github.com/music-assistant/server) | Music library manager connecting streaming services and speakers via HA. | Self-hosted | Active HA add-on; official HA integration as of 2026. |
| [wyoming-satellite](https://github.com/rhasspy/wyoming-satellite) | Remote voice satellite using the Wyoming protocol for local HA voice control. | Self-hosted, Hardware | Archived by its owner (read-only). Key piece of a fully local, private voice pipeline. |
| [Bubble Card](https://github.com/Clooos/Bubble-Card) | Minimalist, customizable card collection for Home Assistant dashboards. | Self-hosted | MIT; ~4.7k stars. |
| [Awesome Home Assistant](https://github.com/frenck/awesome-home-assistant) | Curated list of Home Assistant resources, integrations and tools. | Self-hosted | CC-BY-4.0; ~8.6k stars. |

## Media & Library Servers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [audiobookshelf](https://github.com/advplyr/audiobookshelf) | Self-hosted server for audiobooks and podcasts. | iOS, Android, Self-hosted | Excellent specialized media server. |
| [BookLore](https://github.com/booklore-app/booklore) | Multi-user digital library with reader support. | Self-hosted | Great for curated book collections. |
| [Calibre-Web](https://github.com/janeczku/calibre-web) | Web app for browsing Calibre libraries. | Self-hosted | Strong lightweight ebook server. |
| [Immich](https://github.com/immich-app/immich) | High-performance self-hosted photo and video platform. | Self-hosted | One of the strongest self-hosted media apps. |
| [Jellyfin](https://github.com/jellyfin/jellyfin) | Open media server backend and API. | Self-hosted | Great default for self-hosted streaming. |
| [Kavita](https://github.com/Kareadita/Kavita) | Reading server for comics, manga, and books. | Self-hosted | Good for larger digital reading libraries. |
| [Kodi](https://github.com/xbmc/xbmc) | Media center software with rich frontend support. | Cross-platform, Self-hosted | Useful as a playback layer. |
| [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | Document management system with OCR, tagging, and full-text search. | Self-hosted | ~42k stars; the standard self-hosted document archive. |
| [Tube Archivist](https://github.com/tubearchivist/tubearchivist) | Self-hosted YouTube media server and archive. | Self-hosted | Good for long-term video archiving. |

## Surveillance & Media Requests

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Bazarr](https://github.com/morpheus65535/bazarr) | Subtitle companion for media libraries. | Cross-platform, Self-hosted | Great alongside automation media stacks. |
| [Frigate](https://github.com/blakeblackshear/frigate) | NVR with local object detection. | Self-hosted | Great fit for AI-enabled camera setups. |
| [Seerr (formerly Jellyseerr)](https://github.com/seerr-team/seerr) | Media request and discovery manager for Jellyfin, Plex and Emby. | Self-hosted | Useful when a household shares media servers. |
| [Radarr](https://github.com/Radarr/Radarr) | Movie management automation. | Cross-platform, Self-hosted | Core piece of many home media stacks. |
| [Scrypted](https://github.com/koush/scrypted) | Video integration and automation platform. | Self-hosted | Strong glue layer between cameras and smart homes. |
| [Sonarr](https://github.com/Sonarr/Sonarr) | TV management automation. | Cross-platform, Self-hosted | Common complement to Radarr. |
| [Viseron](https://github.com/roflcoopter/viseron) | Local-only NVR and computer vision stack. | Self-hosted | Good privacy-first surveillance option. |
| [ZoneMinder](https://github.com/ZoneMinder/zoneminder) | Long-running CCTV and camera monitoring platform. | Self-hosted | Mature traditional surveillance stack. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Awesome-Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) | Curated list of self-hosted software alternatives. | Web | Best starting point for discovering new apps. |
| [Jeff Geerling's Blog](https://www.jeffgeerling.com/) | Raspberry Pi, Ansible, and homelab deep-dives. | Web | Reliable technical depth, especially for ARM/SBC content. |
| [r/selfhosted](https://www.reddit.com/r/selfhosted/) | Community forum for self-hosting questions and showcases. | Web | Large active community; good for troubleshooting and discovery. |
| [Techno Tim](https://technotim.com/) | Homelab tutorials covering Proxmox, Docker, K3s, and self-hosted apps. | Web | Frequently updated; good entry point for homelab beginners. |
| [Wolfgang's Channel](https://www.youtube.com/@WolfgangsChannel) | In-depth homelab and self-hosting video guides. | Web | Strong on privacy-focused self-hosting and hardware choices. |
