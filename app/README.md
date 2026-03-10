# app

Asset management dashboard (Vue 3 + Vite + TypeScript).

## Notes

- **Single route** (`/`): asset list (tiles or table) with telemetry and power chart sections below. No separate pages; back = clear selection when we add detail flow later.
- **Asset tiles**: Cards show name, id, chips for status (color by operational/standby/maintenance), type, location. Per-tile toggles for “include in telemetry” and “include in power.” Edit button is placeholder for configuration form.
- **View toggle**: Dashboard layout component supports Tiles (default) vs Table for the asset list. Telemetry and power charts show only when at least one asset is selected for each.
- **State**: Pinia — `assets` (list, load), `selection` (telemetryIds, powerIds, viewMode, toggles).
- **API**: `src/api/` for fetch helpers; types in `src/types/`. Telemetry/power API patterns and Highcharts next.

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
