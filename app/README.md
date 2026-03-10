# app

Asset management dashboard (Vue 3 + Vite + TypeScript).

## Notes

- **Single route** (`/`): asset list (tiles or table) with telemetry and power chart sections below. No separate pages; back = clear selection when we add detail flow later.
- **Asset tiles**: Cards show name, type (mono), chips for status (color by operational/standby/maintenance), location with icon. Per-tile toggles for “include in telemetry” and “include in power.” Edit button is placeholder for configuration form.
- **View toggle**: Tiles | Table as borderless buttons; selected state highlighted with dark background. Table option is **desktop only** — on tablet/mobile the Table button is disabled with tooltip “Only available on desktop” so we keep one layout (tiles) for small screens and use the collapsible Assets section as the mobile fix.
- **Collapsible Assets section**: The Assets block is an expandable panel (accordion). Section title “Assets” is always visible; clicking it folds or expands the content (view toggle + tiles or table). When collapsed, the toggle and list/table are hidden. This gives mobile a single “Assets” header to tap to show/hide the list without a separate full-screen flow.
- **State**: Pinia — `assets` (list, load), `selection` (telemetryIds, powerIds, viewMode, toggles). Chart data in dedicated stores: `telemetry` (by asset id), `power` (by asset id). See project root **NOTES.md** for why we load all telemetry/power once after assets and keep data keyed by asset id.
- **API**: `src/api/` for fetch helpers; types in `src/types/`. Telemetry and power fetched once on mount (after assets load); charts filter by selection.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Type-Check, Compile and Minify for Production

```sh
bun run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
