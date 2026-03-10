import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Telemetry } from '@/types'
import { fetchAllTelemetry } from '@/api/telemetry'

export const useTelemetryStore = defineStore('telemetry', () => {
  const byAssetId = ref<Record<string, Telemetry>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const telemetryList = computed(() => Object.values(byAssetId.value))

  async function loadAll(assetIds: string[]) {
    if (assetIds.length === 0) {
      byAssetId.value = {}
      return
    }
    loading.value = true
    error.value = null
    try {
      const results = await fetchAllTelemetry(assetIds)
      const next: Record<string, Telemetry> = {}
      for (const t of results) {
        next[t.asset_id] = t
      }
      byAssetId.value = next
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load telemetry'
    } finally {
      loading.value = false
    }
  }

  function getByAssetId(id: string): Telemetry | undefined {
    return byAssetId.value[id]
  }

  return { byAssetId, loading, error, telemetryList, loadAll, getByAssetId }
})
