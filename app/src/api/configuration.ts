import { get, post } from './client'
import type { AssetConfiguration } from '@/types'

export function fetchConfiguration(assetId: string): Promise<AssetConfiguration> {
  return get<AssetConfiguration>(`/api/configuration/${encodeURIComponent(assetId)}`)
}

export function saveConfiguration(config: AssetConfiguration): Promise<AssetConfiguration> {
  return post<AssetConfiguration>('/api/configuration', config)
}
