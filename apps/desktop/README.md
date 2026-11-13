# Companion Spellbook desktop shell

Tauri 2 packages the Spellbook Vite app for macOS and Windows. The shelves are
bundled markdown, so the catalog works offline. This shell does not host or
modify the catalog content.

```sh
cd apps/desktop
npm install
npm run dev
npm run build
```

The identifier `computer.ci.spellbook` is provisional. Before store submission,
reserve the permanent bundle ID and complete app artwork, code signing, macOS
notarization, privacy declarations, and a manual release workflow. This shell
is not a submitted or store-ready binary.
