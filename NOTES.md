# Project notes

Notes on architecture and decisions for the frontend coding challenge.

---

## Chart data: state and loading

### Why load all telemetry and power once (after assets load)

- The API exposes **GET /api/telemetry/{asset_id}** and **GET /api/power/{asset_id}** per asset. There are only **5 assets**, so at most 5 + 5 = 10 requests.
- Loading **all** telemetry and power once after the assets list is loaded gives:
  - **Instant toggles**: Charts only filter by which assets are selected; no extra requests when the user turns an asset on/off.
  - **One loading phase**: A single "loading" state for chart data, then the UI is ready.
  - **Simple mental model**: Data is cached by asset id; selection only controls what is shown.
- We did **not** choose "load one asset first to shape the UI" because with 5 assets the extra complexity isn't worth it; we type the UI from the API and load everything in one go.

### Why separate state for chart data (telemetry + power stores)

- **Selection** (which assets are "on" for each chart) is already in the selection store (`telemetryIds`, `powerIds`). That stays the source of truth for *what to show*.
- **Chart data** (the actual API responses) lives in dedicated stores keyed by asset id:
  - **Telemetry**: one snapshot per asset (temperature, pressure, vibration, power_consumption, status).
  - **Power**: one payload per asset (history + forecast arrays, metadata).
- Charts then **derive** what to render: e.g. "selected telemetry" = `telemetryIds.map(id => telemetryByAsset[id]).filter(Boolean)`, and the same idea for power. So we keep:
  - One place that owns "all telemetry/power we've fetched".
  - Selection only referencing that data; no duplicate state.

### Summary

| Decision              | Choice                                      | Reason                                                                 |
|-----------------------|---------------------------------------------|-----------------------------------------------------------------------|
| When to load          | Once, after assets list is loaded           | Only 5 assets; 10 requests is cheap; toggles stay instant.            |
| Load one asset first  | No                                          | Unnecessary with 5 assets; we type from API and load all.              |
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
- **Used in:** Asset tiles (dashboard), table Name column (dashboard), and asset detail header (individual asset page). `AssetNameTags` (plural) is the list variant used where we show multiple asset names (e.g. “selected” tags); `AssetNameTag` (singular) is the single-asset display with size control.

---

## Highcharts accessibility

- We set **`accessibility.enabled: false`** globally (in `main.ts` via `Highcharts.setOptions`) to suppress the console warning about including the `accessibility.js` module.
- With more time we would ensure accessibility standards are met: enable Highcharts accessibility and/or include the module, add keyboard and screen-reader support for charts, and align with WCAG where applicable.
