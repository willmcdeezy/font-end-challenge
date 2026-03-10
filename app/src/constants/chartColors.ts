/**
 * Shared palette for asset tiles and telemetry/power charts so the same asset
 * has the same color in the dashboard (color connection between list and charts).
 */
export const ASSET_CHART_PALETTE = [
  '#7cb5ec',
  '#434348',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
  '#f15c80',
  '#e4d354',
  '#2b908f',
  '#f45b5b',
  '#91e8e1',
]

export function assetColorByIndex(index: number): string {
  return ASSET_CHART_PALETTE[index % ASSET_CHART_PALETTE.length]
}
