import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PowerHistory } from '@/types'
import { fetchAllPower } from '@/api/power'

export const usePowerStore = defineStore('power', () => {
  const byAssetId = ref<Record<string, PowerHistory>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const powerList = computed(() => Object.values(byAssetId.value))

  async function loadAll(assetIds: string[]) {
    if (assetIds.length === 0) {
      byAssetId.value = {}
      return
    }
    loading.value = true
    error.value = null
    try {
      const results = await fetchAllPower(assetIds)
      const next: Record<string, PowerHistory> = {}
      for (const p of results) {
        next[p.asset_id] = p
      }
      byAssetId.value = next
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load power data'
    } finally {
      loading.value = false
    }
  }

  function getByAssetId(id: string): PowerHistory | undefined {
    return byAssetId.value[id]
  }

  return { byAssetId, loading, error, powerList, loadAll, getByAssetId }
})
