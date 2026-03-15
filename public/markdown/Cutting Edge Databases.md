# Data Platforms, Backup, Storage & Sync

> This section brings together modern data stores with the practical systems that keep your data durable, portable, and easy to move.

## Databases & Data Infrastructure

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [WrenAI](https://github.com/Canner/WrenAI) | Natural-language BI over databases with SQL and chart generation. | Web, Self-hosted | Useful when analytics needs a user-friendly surface. |
| [ByteStash](https://github.com/jordan-dalby/ByteStash) | Self-hosted code snippet storage built with React and Node.js. | Self-hosted | Good for internal engineering knowledge. |
| [DB Browser for SQLite](https://github.com/sqlitebrowser/sqlitebrowser) | Desktop GUI for inspecting and editing SQLite databases. | Cross-platform | Essential utility for lightweight data work. |
| [drawDB](https://github.com/drawdb-io/drawdb) | Diagram editor and SQL generator for database schemas. | Cross-platform, Self-hosted, Web | Good for fast schema communication. |
| [Liam ERD](https://github.com/liam-hq/liam) | Generates readable ER diagrams from existing databases. | Web, Self-hosted | Best for visualizing live schema state. |
| [JSON Crack](https://github.com/AykutSarac/jsoncrack.com) | Interactive visualization for JSON, YAML, XML, and CSV. | Cross-platform, Web | Useful for making complex structures readable. |
| [Grist](https://github.com/gristlabs/grist-core) | Spreadsheet-database hybrid for collaborative data workflows. | Self-hosted, Web | Strong fit for teams that outgrow plain spreadsheets. |

## Backup Tools

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Backrest](https://github.com/garethgeorge/backrest) | Web UI and orchestrator for restic backups. | Cross-platform, Self-hosted | Great companion if you already use restic. |
| [Borg](https://github.com/borgbackup/borg) | Deduplicating encrypted backup tool. | Cross-platform | Reliable choice for scriptable backups. |
| [Cryptomator](https://github.com/cryptomator/cryptomator) | Client-side encryption for cloud-synced files. | Cross-platform, Mobile | Good for secure personal archives. |
| [Duplicacy](https://github.com/gilbertchen/duplicacy) | Encrypted cloud backup with deduplication. | Cross-platform | Useful for multi-backend backup strategies. |
| [Duplicati](https://github.com/duplicati/duplicati) | Encrypted backup tool with scheduling and cloud targets. | Cross-platform | Friendly option for desktop users. |
| [Kopia](https://github.com/kopia/kopia) | Fast encrypted backup with CLI and GUI. | Cross-platform | Strong modern alternative in this category. |
| [Rclone](https://github.com/rclone/rclone) | Swiss-army knife for syncing with cloud storage. | Cross-platform | Critical building block for moving data around. |
| [Restic](https://github.com/restic/restic) | Fast encrypted backup program. | Cross-platform | Excellent default for server and workstation backup. |
| [rustic](https://github.com/rustic-rs/rustic) | Rust-powered backup system inspired by restic. | Cross-platform | Good when you want a newer Rust implementation. |
| [Vorta](https://github.com/borgbase/vorta) | Desktop backup client for Borg. | Cross-platform | Simplifies Borg for GUI-oriented workflows. |

## Storage Platforms

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Ceph](https://github.com/ceph/ceph) | Distributed object, block, and file storage platform. | Self-hosted | Fit for serious infrastructure and homelabs. |
| [Maestral](https://github.com/samschott/maestral) | Open-source Dropbox client for macOS and Linux. | macOS, Linux | Nice lightweight sync client. |
| [myDrive](https://github.com/subnub/myDrive) | Self-hosted Google Drive-style clone. | Self-hosted | Useful for simple personal cloud setups. |
| [Nextcloud](https://github.com/nextcloud/server) | Full self-hosted file, collaboration, and app platform. | Cross-platform, Mobile, Self-hosted | Broadest self-hosted cloud stack. |
| [OpenCloud](https://github.com/opencloud-eu/opencloud) | Modern platform for file management and sharing. | Cross-platform, Mobile, Self-hosted | Good option for sovereign cloud setups. |
| [ownCloud](https://github.com/owncloud/core) | Mature self-hosted file synchronization platform. | Cross-platform, Mobile, Self-hosted | Still relevant for classic private cloud deployments. |
| [Seafile](https://github.com/haiwen/seafile) | Sync and sharing platform with strong file organization features. | Cross-platform, Mobile, Self-hosted | Great for fast sync and large libraries. |

## Sync & Transfer

| Tool | Description | Platforms | Notes |
| --- | --- | --- | --- |
| [Rsync](https://github.com/RsyncProject/rsync) | Fast incremental file transfer and synchronization. | Cross-platform | Core primitive for many automation workflows. |
| [Syncthing](https://github.com/syncthing/syncthing) | Continuous peer-to-peer file sync. | Cross-platform | Excellent for cloudless sync between devices. |
| [Syncthing Tray](https://github.com/Martchus/syncthingtray) | Tray integration for Syncthing. | Windows, Linux | Handy for desktop-heavy workflows. |
| [syncthing-macos](https://github.com/syncthing/syncthing-macos) | Native macOS application bundle for Syncthing. | macOS | Easier setup on Apple hardware. |
| [LocalSend](https://github.com/localsend/localsend) | Cross-platform local network transfer tool. | Cross-platform | Great replacement for ad hoc file handoff. |
| [PairDrop](https://github.com/schlagmichdoch/PairDrop) | Browser-based local transfer inspired by AirDrop. | Web | Useful for frictionless short-range sharing. |
