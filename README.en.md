# dsh-wechat-ui

A **WeChat-inspired skin** for the DeepSeek Harness (DSH) Web UI.

> 中文文档见 [README.md](./README.md)。This is an *inspired-by* redesign, **not** an official Tencent/WeChat product. WeChat and related trademarks belong to Tencent; this plugin is unaffiliated with and unendorsed by Tencent.

## Features

- **WeChat green** `#07C160` brand accent (send button, focus ring, highlights)
- **Light-gray chat surface** `#EDEDED` with white panels/cards
- **Classic send bubble** `#95EC69` with dark text
- **WeChat-style conversation layout**: your messages right-aligned in green bubbles with a green "我" avatar; assistant replies left-aligned in white bubbles with a brand-colored "D" avatar (pure CSS pseudo-elements — no DOM injection, no network requests)
- Flat, small-radius (4–8px) surfaces; light **and** dark themes (dark follows WeChat dark mode: `#111111` base, deep-green bubbles)
- **Two platform variants**, auto-selected via the host's `<html data-platform>`:
  - **Windows**: classic `#EDEDED` chat surface, 4px flat corners, YaHei font, no elevation
  - **macOS**: soft `#F0F0F2` gray (`#1C1C1E` in dark), 10px corners, PingFang font, vibrancy menus and soft shadows
- Pure CSS design-token overrides: zero runtime dependencies, no component replacement, never touches conversation data; uninstall/disable restores the stock UI completely

## Install

Requires DSH `>=0.2.0-rc.2 <0.3.0-0`.

```bash
# from GitHub (after publication)
dsh plugin --profile desktop add github:JAKE1266/dsh-wechat-ui

# from a local checkout
dsh plugin --profile desktop add link:/absolute/path/to/dsh-wechat-ui
```

Restart DSH to apply. If another skin plugin is active (e.g. `dsh-zcode-ui` or
`dsh-doubao-ui`), remove it from the profile first to avoid token conflicts:

```bash
dsh plugin --profile desktop remove dsh-zcode-ui
```

## How it works

DSH's Web UI consumes `--dsw-alias-*` / `--dsw-static-*` CSS design tokens.
This plugin overrides ~186 tokens at `:root:root body` / `:root:root body[data-ds-dark-theme]`
specificity, plus a small structural layer keyed only on **stable host attributes**
(`data-chat-flow-kind`, `data-slot`, `data-message-bubble`, `data-composer-card`, …) —
never on CSS-module hash class names, so upstream rebuilds don't break the skin.

The client half registers via `window.__ModuleLoader__.load` and wraps all work in
`ctx.effect` with full teardown; every failure path degrades to a silent no-op
(a throwing entry factory would white-screen the whole Web shell).

## Development

```bash
node scripts/build.mjs   # bundle src/ -> client/client.js (committed)
node test/run-all.mjs    # zero-dependency verification suite
```

| Path | Purpose |
|---|---|
| `src/tokens.mjs` | All design values: light/dark palettes, geometry, structural + chat-layout CSS |
| `src/client.mjs` | Browser-half source (idempotent style injection + teardown) |
| `client/client.js` | Build artifact (factory-style CJS; install needs no build step) |
| `lib/index.mjs` | Host-half placeholder (no tools/services/routes) |
| `cordis.patch.yml` | Profile-layer mount declaration |
| `test/run-all.mjs` | vm-sandbox execution, token parity, injection idempotency, teardown, manifest audit |

To recolor: edit `src/tokens.mjs`, then rebuild. Check
`<html data-dsh-wechat-skin="1.1.0">` in DevTools to confirm the skin is active.

## Design provenance & disclaimer

Color values are *derived* from the publicly observable look of WeChat Desktop
(well-known values such as `#07C160`, `#EDEDED`, `#95EC69`) and adapted for WCAG
contrast and DSH token semantics. Nothing was extracted from any copyrighted
artifact. See the Chinese README for the full disclaimer.

## License

MIT