# Project notes

Scope was kept to the prescribed time limit; I would have done more with more time.

Notes on architecture and decisions for the frontend coding challenge.

## Setup

Start the backend API first (from project root: `docker-compose up` or see main README). Then install and run the app:

```sh
cd app
bun install
bun dev
```

---

## Requirements checklist (README)

**Core requirements**

1. **Asset List View** — Done. I display all assets from the API with name, type, location, and status. Tile View and Table View (desktop); tiles only on mobile.
2. **Telemetry Display** — Done. Dashboard shows a grouped telemetry chart for all assets; individual asset view shows the four metrics (temperature, pressure, vibration, power) with live WebSocket updates.
3. **Power Consumption Visualization** — Done. Charts show history (solid) and forecast (dashed), tooltips include efficiency, and I handle positive (consumption) and negative (generation) values.
4. **Configuration Form** — Done. Edit (per asset) opens a modal with a full form. **Client-side validation** matches the API rules (enums, numeric ranges, email, string lengths). **Server-side errors** are shown in an alert on failed save. Success closes the modal.

**Bonus**

- **Real-time updates**: WebSocket used on the individual asset view for live telemetry.
- **Responsive design**: Mobile vs desktop (e.g. Tile/Table hidden on mobile), collapsible sections.
- **State management**: Pinia stores for assets, selection, telemetry, and power.
- **Testing**: Not implemented; would add unit/integration tests given more time. If I had more time I would also refactor and organize components further, add tests for API calls, and tests around form validation.

---

## Where data comes from / configuration storage

- **Assets**: The API serves a **static list** of 5 assets (`GET /api/assets`). I do not create/update/delete assets from the frontend; the list is fixed in the backend.
- **Telemetry**: **Generated on each request** by the API (realistic random values per asset type/status). Not stored; I fetch once on load and on the asset page I also use the WebSocket for live updates.
- **Power**: **Generated on request** (history + forecast). I fetch and cache per asset in the power store.
- **Configurations**: There is **no database**. The API stores configurations **in memory** (see `api/API_NOTES.md`: “Configurations are stored in-memory (reset on restart)”). When you submit the Edit form I `POST /api/configuration`; the backend saves it in a dict. Data persists until the API process restarts. So **yes, you can update configuration data** — it is stored in the API’s memory and returned by `GET /api/configuration/{asset_id}` until the server restarts.

- **Note:** The configuration form and API update correctly on save. I was primarily focused on the key endpoints for data (assets, telemetry, power). I added a **refresh** that patches the assets store with the new name/location after save so the individual page (and tiles/table) update without refetching. We are **not** using `GET /api/configurations` or a configurations store to drive displayed name/location. If I had more time I would load configurations (e.g. on app init) into a store and derive display name/location from config when present, and would work on more of this and related polish.

---

## Styling and design system

- I aim to use **Vuetify out of the box as much as possible** as the design system: standard components, spacing utilities (e.g. `gap-2`, `mt-1`, `mb-2`), typography classes (`text-body-2`, `text-subtitle-1`), and minimal custom CSS. Custom styles are kept to layout or one-off tweaks (e.g. chart containers, asset name bullet) rather than overriding Vuetify’s look and feel.

---

## Chart data: state and loading

### Why load all telemetry and power once (after assets load)

- The API exposes **GET /api/telemetry/{asset_id}** and **GET /api/power/{asset_id}** per asset. There are only **5 assets**, so at most 5 + 5 = 10 requests.
- Loading **all** telemetry and power once after the assets list is loaded gives:
  - **Instant toggles**: Charts only filter by which assets are selected; no extra requests when the user turns an asset on/off.
  - **One loading phase**: A single "loading" state for chart data, then the UI is ready.
  - **Simple mental model**: Data is cached by asset id; selection only controls what is shown.
- I did **not** choose "load one asset first to shape the UI" because with 5 assets the extra complexity isn't worth it; I type the UI from the API and load everything in one go.

### Why separate state for chart data (telemetry + power stores)

- **Selection** (which assets are "on" for each chart) is already in the selection store (`telemetryIds`, `powerIds`). That stays the source of truth for *what to show*.
- **Chart data** (the actual API responses) lives in dedicated stores keyed by asset id:
  - **Telemetry**: one snapshot per asset (temperature, pressure, vibration, power_consumption, status).
  - **Power**: one payload per asset (history + forecast arrays, metadata).
- Charts then **derive** what to render: e.g. "selected telemetry" = `telemetryIds.map(id => telemetryByAsset[id]).filter(Boolean)`, and the same idea for power. So I keep:
  - One place that owns "all telemetry/power I've fetched".
  - Selection only referencing that data; no duplicate state.

### Summary

| Decision              | Choice                                      | Reason                                                                 |
|-----------------------|---------------------------------------------|-----------------------------------------------------------------------|
| When to load          | Once, after assets list is loaded           | Only 5 assets; 10 requests is cheap; toggles stay instant.            |
| Load one asset first  | No                                          | Unnecessary with 5 assets; I type from API and load all.              |
| Where to keep data    | Dedicated stores keyed by asset_id          | Single source of truth; charts filter by selection store.             |

See `app/README.md` for how this ties into the app (API modules, stores, and mount-time loading).

---

## Individual asset view (click-through)

- Clicking an asset (tile or table row) navigates to **`/asset/:id`**, an individual asset page for better detail viewing.
- **Live telemetry**: The individual view connects to the **WebSocket** (`ws://localhost:8000/ws/telemetry`) and shows the four telemetry fields (temperature, pressure, vibration, power) for that asset, updating in real time.
- **Power consumption**: A dedicated power chart for that asset (history + forecast) is shown on the same page, so users can see detailed power data without the dashboard’s multi-asset chart.
- Edit opens a **configuration modal**; the rest of the layout (asset header, telemetry, power chart) is always visible (no collapse on the individual page).

---

## Asset name + color bullet: `AssetNameTag` component

- **What it is:** A single reusable component that shows an asset’s **name** with its **color bullet** (same palette index as in the telemetry/power charts), so the same asset has the same colour everywhere.
- **Sizes:** `size="small"` for **tiles** and **table** (same compact look), `size="large"` for the **asset detail header** (individual asset page). One component, consistent behaviour, different visual weight.
- **Used in:** Asset tiles (dashboard), table Name column (dashboard), and asset detail header (individual asset page). `AssetNameTags` (plural) is the list variant used where I show multiple asset names (e.g. “selected” tags); `AssetNameTag` (singular) is the single-asset display with size control.

---

## Vue Router deprecation warning

- In the console you may see: **`[Vue Router warn]: The next() callback in navigation guards is deprecated. Return the value instead of calling next(value).`**
- This is **not from my app** — I don’t register any navigation guards. It comes from **Vuetify** (its overlay/back-button logic in `node_modules/vuetify/lib/composables/router.js` uses the old `(to, from, next) => …` API). Vue Router 5 prefers guards to return a value or Promise instead of calling `next()`.
- With more time I would **fix it via a patch** (e.g. postinstall script or patch-package) that updates Vuetify’s guard to the return-based API, or **investigate further** (e.g. upgrade Vuetify when they ship the fix, or narrow down any other source). For now it’s a known, harmless console warning.

---

## Highcharts accessibility

- I set **`accessibility.enabled: false`** globally (in `main.ts` via `Highcharts.setOptions`) to suppress the console warning about including the `accessibility.js` module.
- With more time I would ensure accessibility standards are met: enable Highcharts accessibility and/or include the module, add keyboard and screen-reader support for charts, and align with WCAG where applicable.
