# Desktop Systems, OS Tools & Window Management

> This section now covers the day-to-day desktop stack: operating systems, launchers, window managers, system utilities, and machine-level tooling.

## Operating Systems & Desktop Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Bazzite](https://github.com/ublue-os/bazzite) | Gaming-focused immutable Fedora spin with Steam and gaming mode pre-configured. | Linux | Best low-friction gaming desktop on immutable Linux. |
| [COSMIC](https://github.com/pop-os/cosmic-epoch) | Rust-based desktop environment from System76; stable since Dec 2025 (v1.0+). | Linux | Rolling release; Epoch 2 roadmap underway in 2026. |
| [Omarchy](https://github.com/omacom/omarchy) | Opinionated Linux distribution focused on a polished modern setup. | Linux | Worth tracking if you want a curated Linux environment. |
| [openmediavault](https://github.com/openmediavault/openmediavault) | NAS-oriented operating system and management layer. | Linux | Good for storage-heavy home setups. |
| [Puter](https://github.com/HeyPuter/puter) | Web-based personal cloud environment and internet OS concept. | Web | Interesting if you want app-like workflows in the browser. |
| [SerenityOS](https://github.com/SerenityOS/serenity) | Independent hobbyist operating system with its own userland. | Linux | Best for OS exploration and systems curiosity. |
| [umbrelOS](https://github.com/getumbrel/umbrel) | Home server OS for running apps locally. | Linux | Smooth entry point for self-hosted services. |
| [YunoHost](https://github.com/YunoHost/yunohost) | Friendly server administration layer for self-hosting. | Linux | Good if you want easier service management. |
| [Ventoy](https://github.com/ventoy/Ventoy) | Puts several ISO files on one USB drive and boots them directly. | Windows, Linux | GPL-3.0; ~80k stars. |
| [macUSB](https://github.com/Kruszoneq/macUSB) | Creates bootable USB drives from macOS installers. | macOS | MIT; ~3.4k stars. |
| [WinApps](https://github.com/winapps-org/winapps) | Runs Windows apps such as Microsoft Office on Linux desktops (GNOME and KDE). | Linux | ~16k stars; GitHub did not detect a license. |
| [Sikarugir](https://github.com/Sikarugir-App/Sikarugir) | Makes Wine-wrapped app bundles that run Windows software on macOS. | macOS | ~4k stars; GitHub did not detect a license. |

## Desktop Utilities & Launchers

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Albert](https://github.com/albertlauncher/albert) | Fast cross-platform keyboard launcher. | Cross-platform | Useful when you want a simple launcher core. |
| [AltTab](https://github.com/lwouis/alt-tab-macos) | Windows-style app switching on macOS. | macOS | Excellent default upgrade for Apple desktops. |
| [chezmoi](https://github.com/twpayne/chezmoi) | Manage dotfiles across machines with templating and secret encryption. | Cross-platform, CLI | Best-in-class dotfile manager; Go templates + age encryption. |
| [Cork](https://github.com/buresdv/Cork) | Homebrew GUI for package management. | macOS | Good for managing casks visually. |
| [Flow Launcher](https://github.com/Flow-Launcher/Flow.Launcher) | Quick app and file launcher for Windows. | Windows | Great launcher foundation on Windows. |
| [Ice](https://github.com/jordanbaird/Ice) | Menu bar manager for macOS. | macOS | Great for decluttering the top bar. |
| [Leader Key](https://github.com/mikker/LeaderKey) | Fast launcher and command surface. | macOS | Good alternative to heavier launchers. |
| [Raycast](https://www.raycast.com/) | Command launcher and productivity shell. | macOS | Strong everyday command surface. |
| [Ulauncher](https://github.com/Ulauncher/Ulauncher) | Linux app launcher with extension support. | Linux | Good daily launcher for Linux desktops. |

## Window Management & Compositors

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [AeroSpace](https://github.com/nikitabobko/AeroSpace) | i3-style tiling window manager for macOS. | macOS | Strong keyboard-driven workspace manager. |
| [Amethyst](https://github.com/ianyh/Amethyst) | Automatic tiling for macOS. | macOS | Good starting point for tiling without heavy setup. |
| [FlashSpace](https://github.com/wojciech-kulik/FlashSpace) | Fast virtual workspace manager. | macOS | Useful for multi-space workflows. |
| [GlazeWM](https://github.com/glzr-io/glazewm) | Tiling window manager for Windows. | Windows | Great if you want i3-like structure on Windows. |
| [Hyprland](https://github.com/hyprwm/Hyprland) | Dynamic tiling Wayland compositor with smooth animations and rich plugin support. | Linux | Rapidly adopted; best-looking tiling Wayland option in 2026. |
| [i3](https://github.com/i3/i3) | Classic tiling window manager for Linux. | Linux | Stable and still highly relevant. |
| [Loop](https://github.com/MrKai77/Loop) | Elegant window management for macOS. | macOS | Good polished middle ground between snap and full tiling. |
| [niri](https://github.com/niri-wm/niri) | Scrollable-tiling Wayland compositor where new windows never resize existing ones. | Linux | 10k+ stars; good modern approach for multi-app layouts. |
| [Rectangle](https://github.com/rxhanson/Rectangle) | Keyboard-driven window snapping. | macOS | Strong low-friction upgrade for almost anyone. |
| [yabai](https://github.com/asmvik/yabai) | Binary-space tiling window manager for macOS. | macOS | Power-user choice for deep automation. |

## Terminal Emulators

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Ghostty](https://github.com/ghostty-org/ghostty) | Fast, GPU-accelerated terminal using platform-native UI; v1.3+ in 2026. | macOS, Linux | Now in Ubuntu 26.04 repos; non-profit backed. |
| [Kitty](https://github.com/kovidgoyal/kitty) | GPU-accelerated terminal with tabs, splits, and a remote-control protocol. | Cross-platform | Strong power-user choice; scriptable via kitten API. |
| [WezTerm](https://github.com/wezterm/wezterm) | GPU-accelerated terminal and multiplexer configurable with Lua. | Cross-platform | Good cross-platform pick with built-in mux. |
| [Tabby](https://github.com/Eugeny/tabby) | Modern terminal app for Windows, macOS and Linux. | Cross-platform | MIT; ~75k stars. |

## Monitoring, Input & Quality-of-Life Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [btop](https://github.com/aristocratos/btop) | Resource monitor with a polished terminal UI. | Cross-platform | Excellent terminal dashboard. |
| [Clipboard](https://github.com/Slackadays/Clipboard) | Modern clipboard manager. | Cross-platform | Useful on any machine with heavy copy/paste workflows. |
| [CopyQ](https://github.com/hluk/CopyQ) | Advanced clipboard manager with scripting and history. | Cross-platform | Good if you want scripting and history. |
| [Glances](https://github.com/nicolargo/glances) | Cross-platform system monitor. | Cross-platform, Self-hosted | Great remote-friendly monitoring tool. |
| [Kanata](https://github.com/jtroo/kanata) | Advanced keyboard remapping and comfort layer. | Cross-platform | Great for ergonomic layouts. |
| [Karabiner-Elements](https://github.com/pqrs-org/Karabiner-Elements) | Deep keyboard customization on macOS. | macOS | Still the standard for advanced remaps. |
| [Maccy](https://github.com/p0deje/Maccy) | Lightweight clipboard manager. | macOS | Clean, simple, and reliable. |
| [Pearcleaner](https://github.com/alienator88/Pearcleaner) | App cleaner for macOS. | macOS | Good for removing leftover files cleanly. |
| [Stats](https://github.com/exelban/stats) | Menu bar system monitor. | macOS | Great lightweight monitoring. |
| [LACT](https://github.com/ilya-zlobintsev/LACT) | Configures and monitors GPUs on Linux, including clocks and fan curves. | Linux | MIT; ~5.8k stars. |
| [QtScrcpy](https://github.com/barry-ran/QtScrcpy) | Qt app that shows and controls an Android screen in real time, via scrcpy. | Cross-platform | Apache-2.0; ~33k stars. |

## Tutorials & Learning

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Arch Wiki — Hyprland](https://wiki.archlinux.org/title/Hyprland) | Community-maintained setup guide for Hyprland on Arch-based systems. | Web | Best first reference when configuring Hyprland. |
| [chezmoi docs](https://www.chezmoi.io/) | Official documentation and quick-start for the chezmoi dotfile manager. | Web | Covers templating, secrets, and multi-machine workflows. |
| [Ghostty docs](https://ghostty.org/docs) | Official Ghostty documentation covering config, keybindings, and libghostty. | Web | Well written; check release notes for new features. |
| [Hyprland wiki](https://wiki.hypr.land/) | Official reference for Hyprland configuration and plugin development. | Web | Versioned for latest git; actively updated. |
| [The Missing Semester (MIT)](https://missing.csail.mit.edu/) | Practical course on shell, editors, dotfiles, and OS tooling. | Web | Good foundation for anyone building a custom desktop setup. |
