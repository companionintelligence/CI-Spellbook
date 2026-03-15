# Security, Privacy & Network Access

> Practical privacy and security tools for real machines: blockers, password managers, VPNs, authentication layers, firewalls, and network diagnostics.

## Ad Blocking & Privacy Protection

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) | Network-wide DNS blocker for ads and trackers. | Self-hosted, Chromium, Firefox | Good household-wide privacy baseline. |
| [Blocky](https://github.com/0xERR0R/blocky) | Fast DNS proxy with ad-blocking features. | Self-hosted | Good lightweight infrastructure blocker. |
| [hBlock](https://github.com/hectorm/hblock) | Host-based domain block list generator. | Cross-platform | Simple option for local blocking. |
| [Pi-hole](https://github.com/pi-hole/pi-hole) | Classic self-hosted ad-blocking DNS sinkhole. | Self-hosted | Still one of the best home-network defaults. |
| [wBlock](https://github.com/0xCUB3/wBlock) | Safari-focused ad and privacy blocker. | macOS | Good Apple-only option. |
| [Zen Privacy](https://github.com/ZenPrivacy/zen-desktop) | Desktop ad blocker and privacy guard. | Cross-platform | Useful for endpoint-level blocking. |

## Authentication & Secrets

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [2FAS](https://github.com/twofas/2fas-android) | Two-factor authentication app. | Mobile | Good general-purpose OTP option. |
| [2FAuth](https://github.com/Bubka/2FAuth) | Self-hosted web app for managing 2FA tokens. | Self-hosted | Good for self-hosted OTP management. |
| [Aegis](https://github.com/beemdevelopment/Aegis) | Android authenticator focused on secure token storage. | Android | One of the strongest Android OTP apps. |
| [authelia](https://github.com/authelia/authelia) | Single sign-on and multi-factor portal for self-hosted apps. | Self-hosted | Strong reverse-proxy companion. |
| [Zitadel](https://github.com/zitadel/zitadel) | Identity infrastructure platform. | Self-hosted | Good when you need a modern auth layer. |
| [Infisical](https://github.com/Infisical/infisical) | Secret management, certificates, and privileged access platform. | Cross-platform, Web, Self-hosted | Strong choice for teams and infra. |

## Password Managers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AliasVault](https://github.com/aliasvault/aliasvault) | Password manager with aliasing and self-hosting support. | Mobile, Chromium, Firefox | Good privacy-focused alternative. |
| [Bitwarden](https://github.com/bitwarden/server) | Open password manager for individuals and teams. | Cross-platform, Mobile, Browsers | Mature and broadly supported. |
| [KeePassXC](https://github.com/keepassxreboot/keepassxc) | Community-driven desktop password manager. | Cross-platform | Great local-first password vault. |
| [LessPass](https://github.com/lesspass/lesspass) | Stateless password generation. | Cross-platform, Browsers | Useful for users who prefer derived secrets. |
| [Passbolt](https://github.com/passbolt/passbolt_api) | Password manager for teams. | Cross-platform, Self-hosted, Browsers | Strong fit for group credential sharing. |
| [Vaultwarden](https://github.com/dani-garcia/vaultwarden) | Lightweight Bitwarden-compatible server. | Self-hosted | Excellent self-hosted password vault. |

## Firewalls & Endpoint Security

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [ClamAV](https://github.com/Cisco-Talos/clamav) | Open-source antivirus engine. | Cross-platform, Self-hosted | Good baseline scanning component. |
| [BunkerWeb](https://github.com/bunkerity/bunkerweb) | Modern open-source web application firewall. | Self-hosted | Good for exposed web services. |
| [LuLu](https://github.com/objective-see/LuLu) | Free outbound firewall for macOS. | macOS | Excellent endpoint firewall on Apple devices. |
| [SafeLine](https://github.com/chaitin/SafeLine) | Self-hosted WAF and reverse proxy. | Self-hosted | Good if you want app protection at the edge. |

## VPN & Remote Network Access

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Algo](https://github.com/trailofbits/algo) | Scripts for provisioning a personal VPN. | Cross-platform | Good for cloud-hosted personal VPN setups. |
| [Amnezia](https://github.com/amnezia-vpn/amnezia-client) | VPN client for desktop and mobile. | Cross-platform | Useful for end-user VPN access. |
| [EasyTier](https://github.com/EasyTier/EasyTier) | Decentralized mesh VPN with WireGuard support. | Cross-platform | Good peer-to-peer secure networking option. |
| [Gluetun](https://github.com/qdm12/gluetun) | VPN client container with optional proxy features. | Self-hosted | Great for routing other containers through a VPN. |
| [headscale](https://github.com/juanfont/headscale) | Self-hosted control plane compatible with Tailscale-style networking. | Self-hosted | Excellent for private tailnet-style deployments. |
| [NetBird](https://github.com/netbirdio/netbird) | WireGuard overlay network with policy and SSO support. | Cross-platform | Strong team-friendly VPN layer. |
| [Netmaker](https://github.com/gravitl/netmaker) | Distributed virtual network orchestration with WireGuard. | Self-hosted, Web | Good for larger self-hosted mesh setups. |
| [OpenVPN](https://github.com/OpenVPN/openvpn) | Traditional open-source VPN daemon. | Cross-platform | Good when legacy interoperability matters. |
| [Tailscale](https://github.com/tailscale/tailscale) | Mesh VPN built on WireGuard principles. | Self-hosted | Extremely easy for user-facing secure access. |
| [WireGuard Easy](https://github.com/wg-easy/wg-easy) | Simplified WireGuard VPN with admin UI. | Self-hosted | Great for quick self-hosted VPN rollout. |
| [ZeroTier](https://github.com/zerotier/ZeroTierOne) | Overlay network that behaves like a smart Ethernet switch. | Cross-platform, Mobile | Good for flexible cross-network connectivity. |

## Network Visibility

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Scanopy](https://github.com/scanopy/scanopy) | Network documentation that updates itself. | Self-hosted, Web, Cross-platform | Good for inventory and topology awareness. |
| [Sniffnet](https://github.com/GyulyVGC/sniffnet) | Friendly network traffic monitor. | Cross-platform | Great for high-level traffic visibility. |
| [trippy](https://github.com/fujiapple852/trippy) | Network diagnostic TUI. | Cross-platform | Useful for path and latency debugging. |
| [Wireshark](https://github.com/wireshark/wireshark) | Deep packet inspection and protocol analysis. | Cross-platform | Still the standard for network investigation. |
