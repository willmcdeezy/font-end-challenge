import { get } from './client'
import type { Telemetry } from '@/types'

export function fetchTelemetry(assetId: string): Promise<Telemetry> {
  return get<Telemetry>(`/api/telemetry/${encodeURIComponent(assetId)}`)
}

/**
 * Fetch telemetry for all given asset IDs in parallel.
 * Use after assets are loaded (e.g. on mount). Fails fast if any request fails.
 */
export async function fetchAllTelemetry(assetIds: string[]): Promise<Telemetry[]> {
  if (assetIds.length === 0) return []
  const results = await Promise.all(assetIds.map((id) => fetchTelemetry(id)))
  return results
}
