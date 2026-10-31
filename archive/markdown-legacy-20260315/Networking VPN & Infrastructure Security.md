# Networking & Infrastructure Security

## Quickstart (2026)

- **Remote access**: WireGuard or an overlay mesh (Tailscale + Headscale).
- **Inbound web**: Caddy/Traefik in front of services + automatic TLS.
- **Segmentation**: VLANs / separate SSIDs for IoT, guests, and core services.
- **Observability**: metrics + logs + basic IDS/IPS alerts (start small).
- **Reproducibility**: keep config in git; automate with Ansible/Terraform.

> Enhance connectivity and secure your infrastructure with modern networking, VPNs, and orchestration tools. This guide covers both enterprise-scale and home-lab scenarios.

## Overview

> From web servers and reverse proxies to self-hosted VPNs and container orchestration, choose tools based on scale, security requirements, and ease of management.

## Usage Guidelines

- Plan network segmentation: isolate services via VLANs, subnets, and firewalls.
- Automate certificate management with Let's Encrypt (Certbot, Caddy, Traefik).
- Use zero-trust VPNs (WireGuard, Tailscale/Headscale) for secure remote access.
- Monitor performance and security with logs, metrics, and IDS/IPS solutions.
- Deploy container orchestration platforms (CapRover, Portainer) for microservice management.
- Backup configurations and use Infrastructure as Code (Terraform, Ansible) for reproducibility.

## Web Servers & Reverse Proxies

| Tools | Description | Notes |
|-------|-------------|-------|
| **Nginx**<br>📜 BSD 2-Clause<br>🔗 [Docs](https://nginx.org/en/docs/) / [Download](https://nginx.org/en/download.html) | High-performance web server and reverse proxy | Supports SSL, load balancing, and multiplexing |
| **Nginx Proxy Manager**<br>📜 Apache 2.0<br>🔗 [Docs](https://nginxproxymanager.com/guide/) / [Download](https://github.com/jc21/nginx-proxy-manager/releases) | GUI for managing Nginx reverse proxy with SSL support | Ideal for managing multiple services with Let's Encrypt integration |
| **Caddy**<br>📜 Apache 2.0<br>🔗 [Docs](https://caddyserver.com/docs/) / [Download](https://github.com/caddyserver/caddy/releases) | Automatic HTTPS-enabled web server | Simplifies TLS management with automatic certificate provisioning |
| **Apache HTTP Server**<br>📜 Apache License 2.0<br>🔗 [Docs](https://httpd.apache.org/docs/) / [Download](https://httpd.apache.org/download.cgi) | Versatile and widely-used web server | Extensive module ecosystem and configuration flexibility |
| **Traefik**<br>📜 MIT<br>🔗 [Docs](https://doc.traefik.io/traefik/) / [Download](https://github.com/traefik/traefik/releases) | Modern HTTP reverse proxy and load balancer | Dynamic service discovery and Let's Encrypt integration |
| **HAProxy**<br>📜 GPL v2<br>🔗 [Docs](https://docs.haproxy.org/) / [Download](https://www.haproxy.org/download/) | High-performance TCP/HTTP load balancer | Enterprise-grade features, excellent for high-traffic scenarios |
| **Cloudflare Tunnel**<br>📜 Commercial/Free<br>🔗 [Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) / [Download](https://github.com/cloudflare/cloudflared) | Secure tunnel to expose local services | No open ports required, built-in DDoS protection |

## VPN & Overlay Networking

| Tools | Description | Notes |
|-------|-------------|-------|
| **WireGuard**<br>📜 GPLv2<br>🔗 [Docs](https://www.wireguard.com/) / [Download](https://www.wireguard.com/install/) | Simple and fast VPN protocol | Known for its performance and ease of configuration |
| **Netmaker**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.netmaker.io/) / [Download](https://github.com/gravitl/netmaker/releases) | WireGuard-based network management platform | Facilitates mesh VPNs and site-to-site connections |
| **Headscale**<br>📜 MIT<br>🔗 [Docs](https://github.com/juanfont/headscale#documentation) / [Download](https://github.com/juanfont/headscale/releases) | Self-hosted coordination server for Tailscale clients | Enables Tailscale-like networks without relying on Tailscale's servers |
| **Nebula**<br>📜 Apache 2.0<br>🔗 [Docs](https://github.com/slackhq/nebula#readme) / [Download](https://github.com/slackhq/nebula/releases) | Scalable overlay networking tool | Developed by Slack for internal networking |
| **Innernet**<br>📜 Apache 2.0<br>🔗 [Docs](https://github.com/graphcore/innernet#readme) / [Download](https://github.com/graphcore/innernet/releases) | Private network system built on WireGuard | Designed for managing internal networks securely |
| **OpenVPN**<br>📜 GPL v2<br>🔗 [Docs](https://openvpn.net/community-resources/) / [Download](https://openvpn.net/community-downloads/) | Traditional SSL/TLS VPN solution | Mature, widely supported, more complex than WireGuard |
| **PiVPN**<br>📜 MIT<br>🔗 [Docs](https://www.pivpn.io/) / [Download](https://github.com/pivpn/pivpn) | Simple VPN installer for Raspberry Pi | Supports both OpenVPN and WireGuard |
| **Pritunl**<br>📜 AGPL v3<br>🔗 [Docs](https://docs.pritunl.com/) / [Download](https://pritunl.com/) | Enterprise VPN server with web UI | OpenVPN-based with management interface |

## Security & Monitoring Tools

| Tools | Description | Notes |
|-------|-------------|-------|
| **Fail2Ban**<br>📜 GPL v2<br>🔗 [Docs](https://github.com/fail2ban/fail2ban/wiki) / [Download](https://github.com/fail2ban/fail2ban) | Intrusion prevention software | Bans IPs after failed login attempts |
| **CrowdSec**<br>📜 MIT<br>🔗 [Docs](https://docs.crowdsec.net/) / [Download](https://github.com/crowdsecurity/crowdsec) | Collaborative security engine | Community-driven threat intelligence |
| **Suricata**<br>📜 GPL v2<br>🔗 [Docs](https://docs.suricata.io/) / [Download](https://suricata.io/download/) | Network IDS/IPS and security monitoring | High-performance threat detection |
| **OSSEC**<br>📜 GPL v2<br>🔗 [Docs](https://www.ossec.net/docs/) / [Download](https://www.ossec.net/download/) | Host-based intrusion detection system | Log analysis, integrity checking, alerting |
| **Wazuh**<br>📜 GPL v2<br>🔗 [Docs](https://documentation.wazuh.com/) / [Download](https://wazuh.com/install/) | Security monitoring platform | OSSEC fork with modern UI and features |
| **pfSense**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.netgate.com/pfsense/en/latest/) / [Download](https://www.pfsense.org/download/) | Open-source firewall and router | Feature-rich network security appliance |
| **OPNsense**<br>📜 BSD 2-Clause<br>🔗 [Docs](https://docs.opnsense.org/) / [Download](https://opnsense.org/download/) | pfSense fork with modern UI | Easier to use, frequent updates |

## Network Monitoring & Analytics

| Tools | Description | Notes |
|-------|-------------|-------|
| **Zabbix**<br>📜 GPL v2<br>🔗 [Docs](https://www.zabbix.com/documentation) / [Download](https://www.zabbix.com/download) | Enterprise monitoring solution | Comprehensive network, server, and application monitoring |
| **Nagios Core**<br>📜 GPL v2<br>🔗 [Docs](https://www.nagios.org/documentation/) / [Download](https://www.nagios.org/downloads/) | Infrastructure monitoring system | Plugin-based architecture, industry standard |
| **LibreNMS**<br>📜 GPL v3<br>🔗 [Docs](https://docs.librenms.org/) / [Download](https://www.librenms.org/) | Network monitoring system | Auto-discovery, modern web interface |
| **PRTG Network Monitor**<br>📜 Commercial/Free (100 sensors)<br>🔗 [Docs](https://www.paessler.com/manuals/prtg) / [Download](https://www.paessler.com/prtg/download) | Comprehensive network monitoring | Easy setup, great for Windows environments |
| **Pandora FMS**<br>📜 GPL v2<br>🔗 [Docs](https://pandorafms.com/manual/) / [Download](https://pandorafms.com/community/) | Flexible monitoring solution | Network, server, and application monitoring |
| **Cacti**<br>📜 GPL v2<br>🔗 [Docs](https://www.cacti.net/info/docs) / [Download](https://www.cacti.net/download_cacti.php) | Network graphing solution | RRDtool-based performance graphing |
| **ntopng**<br>📜 GPL v3<br>🔗 [Docs](https://www.ntop.org/guides/ntopng/) / [Download](https://www.ntop.org/products/traffic-analysis/ntop/) | High-speed web-based traffic analysis | Real-time network traffic monitoring |

## DNS & Certificate Management

| Tools | Description | Notes |
|-------|-------------|-------|
| **Pi-hole**<br>📜 EUPL-1.2<br>🔗 [Docs](https://docs.pi-hole.net/) / [Download](https://pi-hole.net/) | Network-wide ad blocker | DNS sinkhole with web interface |
| **AdGuard Home**<br>📜 GPL v3<br>🔗 [Docs](https://github.com/AdguardTeam/AdguardHome/wiki) / [Download](https://github.com/AdguardTeam/AdguardHome) | Network-wide ad and tracker blocker | More features than Pi-hole, single binary |
| **Unbound**<br>📜 BSD<br>🔗 [Docs](https://unbound.docs.nlnetlabs.nl/) / [Download](https://nlnetlabs.nl/projects/unbound/download/) | Validating, recursive DNS resolver | Security-focused, DNSSEC support |
| **PowerDNS**<br>📜 GPL v2<br>🔗 [Docs](https://doc.powerdns.com/) / [Download](https://www.powerdns.com/) | Authoritative DNS server | High-performance, API-driven |
| **Certbot**<br>📜 Apache 2.0<br>🔗 [Docs](https://certbot.eff.org/docs/) / [Download](https://certbot.eff.org/) | Let's Encrypt certificate client | Automated SSL/TLS certificate management |
| **acme.sh**<br>📜 GPL v3<br>🔗 [Docs](https://github.com/acmesh-official/acme.sh/wiki) / [Download](https://github.com/acmesh-official/acme.sh) | ACME protocol client | Pure shell script, many DNS providers |
| **Lego**<br>📜 MIT<br>🔗 [Docs](https://go-acme.github.io/lego/) / [Download](https://github.com/go-acme/lego) | Let's Encrypt client and ACME library | Written in Go, extensive DNS provider support |

## Infrastructure as Code & Automation

| Tools | Description | Notes |
|-------|-------------|-------|
| **Ansible**<br>📜 GPL v3<br>🔗 [Docs](https://docs.ansible.com/) / [Download](https://www.ansible.com/) | Agentless automation platform | Configuration management, deployment, orchestration |
| **Terraform**<br>📜 Mozilla Public License 2.0<br>🔗 [Docs](https://www.terraform.io/docs) / [Download](https://www.terraform.io/downloads) | Infrastructure as code tool | Multi-cloud resource provisioning |
| **Pulumi**<br>📜 Apache 2.0<br>🔗 [Docs](https://www.pulumi.com/docs/) / [Download](https://www.pulumi.com/docs/get-started/install/) | Modern infrastructure as code | Uses familiar programming languages |
| **SaltStack**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.saltproject.io/) / [Download](https://saltproject.io/) | Configuration management and remote execution | Event-driven automation, scalable |
| **Chef**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.chef.io/) / [Download](https://www.chef.io/downloads) | Configuration management tool | Infrastructure as code, compliance automation |

## Server Management & Orchestration (Additional)

| Tools | Description | Notes |
|-------|-------------|-------|
| **YunoHost**<br>📜 GNU AGPLv3<br>🔗 [Docs](https://yunohost.org/docs) / [Download](https://yunohost.org/install) | Democratize self-hosting for non-experts | Non-experts, Small orgs; Guided image install |
| **CasaOS**<br>📜 Apache 2.0<br>🔗 [Docs](https://wiki.casaos.io) / [Download](https://get.casaos.io) | Simple personal cloud, Docker ecosystem | Beginners, Home users; One-liner script install |
| **Dokku**<br>📜 MIT<br>🔗 [Docs](https://dokku.com/docs/) / [Download](https://dokku.com/docs/getting-started/installation/) | Lightweight PaaS, Heroku alternative | Developers; CLI-based setup |
| **CapRover**<br>📜 Apache 2.0 + Appendix<br>🔗 [Docs](https://caprover.com/docs/) / [Download](https://caprover.com/docs/get-started.html) | Easy PaaS, app/database deployment | Developers; Docker Swarm, auto SSL |
| **Portainer CE**<br>📜 Zlib<br>🔗 [Docs](https://docs.portainer.io/) / [Download](https://docs.portainer.io/start/install-ce/) | Container management UI (Docker, Kubernetes) | All levels; Easy Docker run |
| **Sandstorm.io**<br>📜 Apache 2.0<br>🔗 [Docs](https://docs.sandstorm.io/) / [Download](https://sandstorm.io/install) | Secure web app package manager | Security-focused; Sandboxed grains |
| **FreedomBox**<br>📜 GNU AGPLv3<br>🔗 [Docs](https://wiki.debian.org/FreedomBox) / [Download](https://freedombox.org/download/) | Private server for non-experts, privacy focus | Non-experts; Debian-based image |
| **OpenMediaVault**<br>📜 GNU GPLv3<br>🔗 [Docs](https://docs.openmediavault.org/) / [Download](https://www.openmediavault.org/download.html) | NAS solution, extendable via plugins | Home/SOHO; Plugin ecosystem |
| **Cosmos Cloud**<br>📜 Apache 2.0 + Commons Clause<br>🔗 [Docs](https://cosmos-cloud.io/doc/) / [Download](https://cosmos-cloud.io/doc/) | Secure & easy self-hosting platform | Security-focused; integrated backup & SSO |
