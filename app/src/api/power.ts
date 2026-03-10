import { get } from './client'
import type { PowerHistory } from '@/types'

export function fetchPower(assetId: string): Promise<PowerHistory> {
  return get<PowerHistory>(`/api/power/${encodeURIComponent(assetId)}`)
}

/**
 * Fetch power history/forecast for all given asset IDs in parallel.
 * Use after assets are loaded (e.g. on mount). Fails fast if any request fails.
 */
export async function fetchAllPower(assetIds: string[]): Promise<PowerHistory[]> {
  if (assetIds.length === 0) return []
  const results = await Promise.all(assetIds.map((id) => fetchPower(id)))
  return results
}
