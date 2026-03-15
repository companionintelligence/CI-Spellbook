# Self-Hosting, Home Server & Smart Home Platforms

> This card gathers the operational side of the stack: dashboards, automation, server platforms, media management, homelab apps, and smart-home tooling.

## Dashboards & Home Server Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Cockpit](https://github.com/cockpit-project/cockpit) | Web interface for managing servers. | Linux | Good general-purpose admin UI. |
| [dashdot](https://github.com/MauriceNino/dashdot) | Modern personal server dashboard. | Self-hosted | Useful for smaller homelabs. |
| [Dashy](https://github.com/Lissy93/dashy) | Highly customizable dashboard and start page. | Self-hosted | Great front door for a homelab. |
| [Glance](https://github.com/glanceapp/glance) | Self-hosted homepage for feeds and widgets. | Self-hosted | Good minimalist dashboard. |
| [homepage](https://github.com/gethomepage/homepage) | Application dashboard with service integrations. | Self-hosted | Strong balance of polish and utility. |
| [CasaOS](https://github.com/IceWhaleTech/CasaOS) | Personal cloud and home server management layer. | Linux | Good simple home-server entry point. |
| [Cosmos](https://github.com/azukaar/Cosmos-Server) | Secure self-hosted home server platform. | Self-hosted | Strong if you want auth and hardening built in. |
| [Runtipi](https://github.com/runtipi/runtipi) | One-command home server platform with one-click apps. | Self-hosted | Fast path to a service-rich homelab. |
| [Sandstorm](https://github.com/sandstorm-io/sandstorm) | Web app package platform with a security-first model. | Self-hosted | Good for sandboxed self-hosted apps. |

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
| [ESPHome](https://github.com/esphome/esphome) | Device firmware tooling for ESP-based automation hardware. | Self-hosted | Essential for DIY sensors and controllers. |
| [evcc](https://github.com/evcc-io/evcc) | Energy and EV charging orchestration. | Cross-platform, Self-hosted | Great for solar and EV-aware homes. |
| [Gladys](https://github.com/GladysAssistant/Gladys) | Privacy-first home assistant platform. | Self-hosted | Good alternative home automation stack. |
| [Home Assistant](https://github.com/home-assistant/core) | Local-first home automation platform. | Cross-platform, Self-hosted | Still the center of the DIY smart-home universe. |
| [EOS](https://github.com/Akkudoktor-EOS/EOS) | Energy optimization system for batteries and household devices. | Cross-platform, Self-hosted | Worth tracking for smart energy management. |

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
| [Tube Archivist](https://github.com/tubearchivist/tubearchivist?tab=readme-ov-file#installing) | Self-hosted YouTube media server and archive. | Self-hosted | Good for long-term video archiving. |

## Surveillance & Media Requests

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Frigate](https://github.com/blakeblackshear/frigate) | NVR with local object detection. | Self-hosted | Great fit for AI-enabled camera setups. |
| [Scrypted](https://github.com/koush/scrypted) | Video integration and automation platform. | Self-hosted | Strong glue layer between cameras and smart homes. |
| [Viseron](https://github.com/roflcoopter/viseron) | Local-only NVR and computer vision stack. | Self-hosted | Good privacy-first surveillance option. |
| [ZoneMinder](https://github.com/ZoneMinder/zoneminder) | Long-running CCTV and camera monitoring platform. | Self-hosted | Mature traditional surveillance stack. |
| [Bazarr](https://github.com/morpheus65535/bazarr) | Subtitle companion for media libraries. | Cross-platform, Self-hosted | Great alongside automation media stacks. |
| [Jellyseerr](https://github.com/Fallenbagel/jellyseerr) | Media request and discovery manager. | Self-hosted | Useful when a household shares media servers. |
| [Radarr](https://github.com/Radarr/Radarr) | Movie management automation. | Cross-platform, Self-hosted | Core piece of many home media stacks. |
| [Sonarr](https://github.com/Sonarr/Sonarr) | TV management automation. | Cross-platform, Self-hosted | Common complement to Radarr. |
