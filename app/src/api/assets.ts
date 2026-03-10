import { get } from './client'
import type { Asset } from '@/types'

export function fetchAssets() {
  return get<Asset[]>('/api/assets')
}
