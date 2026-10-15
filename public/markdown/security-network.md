# Security, Privacy & Network Access

> Practical privacy and security tools for real machines: blockers, password managers, VPNs, authentication layers, firewalls, reverse proxies, and network diagnostics.

## Ad Blocking & DNS Filtering

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) | Network-wide DNS blocker for ads and trackers. | Self-hosted | Good household-wide privacy baseline. |
| [Blocky](https://github.com/0xERR0R/blocky) | Fast DNS proxy with ad-blocking and custom resolution rules. | Self-hosted | Good lightweight infrastructure blocker. |
| [hBlock](https://github.com/hectorm/hblock) | Host-based domain block list generator. | Cross-platform | Simple option for local blocking. |
| [Pi-hole](https://github.com/pi-hole/pi-hole) | Classic self-hosted ad-blocking DNS sinkhole. | Self-hosted | Still one of the best home-network defaults. |
| [Technitium DNS](https://github.com/TechnitiumSoftware/DnsServer) | Self-hosted authoritative and recursive DNS server with a web UI. | Self-hosted, Cross-platform | Flexible; good for advanced DNS control including DoH/DoT. |
| [wBlock](https://github.com/0xCUB3/wBlock) | Safari-focused ad and privacy blocker. | macOS | Good Apple-only option. |
| [Zen Privacy](https://github.com/irbis-sh/zen-desktop) | Desktop ad blocker and privacy guard. | Cross-platform | Useful for endpoint-level blocking. |

## Authentication & Identity

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [2FAS](https://github.com/twofas/2fas-android) | Two-factor authentication app. | Mobile | Good general-purpose OTP option. |
| [2FAuth](https://github.com/Bubka/2FAuth) | Self-hosted web app for managing 2FA tokens. | Self-hosted | Good for self-hosted OTP management. |
| [Aegis](https://github.com/beemdevelopment/Aegis) | Android authenticator focused on secure token storage. | Android | One of the strongest Android OTP apps. |
| [Authelia](https://github.com/authelia/authelia) | Single sign-on and multi-factor portal for self-hosted apps. | Self-hosted | Strong reverse-proxy companion. |
| [Authentik](https://github.com/goauthentik/authentik) | Full-featured identity provider supporting SSO, SAML, OAuth2, LDAP. | Self-hosted | ~22k stars; v2026.5 current; strong Okta/Auth0 alternative. |
| [Pocket ID](https://github.com/pocket-id/pocket-id) | Lightweight OIDC provider with passkey-only authentication. | Self-hosted | Simple option when Authentik/Keycloak is overkill. |
| [Zitadel](https://github.com/zitadel/zitadel) | Identity infrastructure platform with enterprise features. | Self-hosted | Good when you need a modern auth layer. |

## Secrets Management

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Infisical](https://github.com/Infisical/infisical) | Secret management, certificates, and privileged access platform. | Cross-platform, Web, Self-hosted | Strong choice for teams and infra. |

## Password Managers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AliasVault](https://github.com/aliasvault/aliasvault) | Password manager with aliasing and self-hosting support. | Mobile, Chromium, Firefox | Good privacy-focused alternative. |
| [Bitwarden](https://github.com/bitwarden/server) | Open password manager for individuals and teams. | Cross-platform, Mobile, Chromium | Mature and broadly supported. |
| [KeePassXC](https://github.com/keepassxreboot/keepassxc) | Community-driven desktop password manager. | Cross-platform | Great local-first password vault. |
| [LessPass](https://github.com/lesspass/lesspass) | Stateless password generation. | Cross-platform, Chromium | Useful for users who prefer derived secrets. |
| [Passbolt](https://github.com/passbolt/passbolt_api) | Password manager for teams. | Cross-platform, Self-hosted, Chromium | Strong fit for group credential sharing. |
| [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | Lightweight Bitwarden-compatible self-hosted server. | Self-hosted | Excellent self-hosted password vault. |

## Firewalls & Endpoint Security

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [BunkerWeb](https://github.com/bunkerity/bunkerweb) | Modern open-source web application firewall. | Self-hosted | Good for exposed web services. |
| [ClamAV](https://github.com/Cisco-Talos/clamav) | Open-source antivirus engine. | Cross-platform, Self-hosted | Good baseline scanning component. |
| [LuLu](https://github.com/objective-see/LuLu) | Free outbound firewall for macOS. | macOS | Excellent endpoint firewall on Apple devices. |
| [SafeLine](https://github.com/chaitin/SafeLine) | Self-hosted WAF and reverse proxy. | Self-hosted | Good if you want app protection at the edge. |

## Reverse Proxies & Tunnels

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Caddy](https://github.com/caddyserver/caddy) | Multi-platform HTTP/1-2-3 web server and reverse proxy with automatic HTTPS. | Cross-platform, Self-hosted | v2.11 current; simplest path to TLS-everywhere. |
| [Nginx Proxy Manager](https://github.com/NginxProxyManager/nginx-proxy-manager) | Web UI for managing Nginx proxy hosts with Let's Encrypt support. | Self-hosted | Good entry-level reverse proxy for homelabs. |
| [Pangolin](https://github.com/fosrl/pangolin) | Identity-aware VPN and tunneled reverse proxy built on WireGuard. | Self-hosted | ~19k stars; self-hosted Cloudflare Tunnel alternative with zero-trust auth. |
| [Traefik](https://github.com/traefik/traefik) | Cloud-native HTTP reverse proxy and load balancer with automatic service discovery. | Self-hosted, Cross-platform | v3.7 current; ~64k stars; excellent Docker/K8s integration. |

## VPN & Remote Network Access

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Algo](https://github.com/trailofbits/algo) | Scripts for provisioning a personal WireGuard/IPsec VPN. | Cross-platform | Good for cloud-hosted personal VPN setups. |
| [Amnezia](https://github.com/amnezia-vpn/amnezia-client) | VPN client for desktop and mobile with obfuscation support. | Cross-platform, Mobile | Useful in high-censorship environments. |
| [EasyTier](https://github.com/EasyTier/EasyTier) | Decentralized mesh VPN with WireGuard support. | Cross-platform | Good peer-to-peer secure networking option. |
| [Gluetun](https://github.com/passteque/gluetun) | VPN client container with optional proxy features. | Self-hosted | Great for routing other containers through a VPN. |
| [Headscale](https://github.com/juanfont/headscale) | Self-hosted control plane compatible with the Tailscale client stack. | Self-hosted | Excellent for private tailnet-style deployments without cloud dependency. |
| [NetBird](https://github.com/netbirdio/netbird) | Fully self-hosted WireGuard mesh with zero-trust policy and SSO. | Cross-platform | v0.65+ includes built-in reverse proxy; strong team-facing VPN. |
| [Netmaker](https://github.com/gravitl/netmaker) | Distributed virtual network orchestration with WireGuard. | Self-hosted, Web | Good for larger self-hosted mesh setups. |
| [OpenVPN](https://github.com/OpenVPN/openvpn) | Traditional open-source VPN daemon. | Cross-platform | Good when legacy interoperability matters. |
| [Tailscale](https://github.com/tailscale/tailscale) | Mesh VPN built on WireGuard with cloud coordination. | Cross-platform, Mobile | Easiest user-facing secure access; best relay network. |
| [WireGuard Easy](https://github.com/wg-easy/wg-easy) | Simplified WireGuard VPN with admin UI. | Self-hosted | Great for quick self-hosted VPN rollout. |
| [ZeroTier](https://github.com/zerotier/ZeroTierOne) | Overlay network that behaves like a smart Ethernet switch. | Cross-platform, Mobile | Good for flexible cross-network connectivity. |

## Network Visibility & Diagnostics

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Scanopy](https://github.com/scanopy/scanopy) | Network documentation that updates itself. | Self-hosted, Web, Cross-platform | Good for inventory and topology awareness. |
| [Sniffnet](https://github.com/GyulyVGC/sniffnet) | Friendly network traffic monitor. | Cross-platform | Great for high-level traffic visibility. |
| [trippy](https://github.com/fujiapple852/trippy) | Network diagnostic TUI combining traceroute and ping. | Cross-platform | Useful for path and latency debugging. |
| [Wireshark](https://github.com/wireshark/wireshark) | Deep packet inspection and protocol analysis. | Cross-platform | Still the standard for network investigation. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Awesome Privacy](https://github.com/pluja/awesome-privacy) | Curated list of privacy-respecting software alternatives. | Web | Good starting point for evaluating data-respecting tools. |
| [Privacy Guides](https://www.privacyguides.org/) | Community-maintained guide to private tools and practices. | Web | Well-maintained; good for evaluating everyday privacy choices. |
| [Techno Tim — Self-Hosting Security Guide](https://technotim.com/posts/self-hosting-security/) | Guide covering firewalls, reverse proxies, auth, and hardening. | Web | Practical and regularly updated. |
| [Self-Hosted.show Podcast](https://selfhosted.show/) | Weekly podcast covering self-hosting news and tools. | Web | Good for staying current on the self-hosting ecosystem. |
| [Wolfgang's Channel](https://www.youtube.com/@WolfgangsChannel) | Video guides on VPNs, DNS, and privacy-focused self-hosting. | Web | Strong on network security topics. |
