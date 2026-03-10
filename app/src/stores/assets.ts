import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Asset } from '@/types'
import { fetchAssets } from '@/api/assets'

export const useAssetsStore = defineStore('assets', () => {
  const list = ref<Asset[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      list.value = await fetchAssets()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load assets'
    } finally {
      loading.value = false
    }
  }

  function updateAsset(
    id: string,
    patch: Partial<Pick<Asset, 'name' | 'location'>>
  ) {
    const asset = list.value.find((a) => a.id === id)
    if (asset && patch.name !== undefined) asset.name = patch.name
    if (asset && patch.location !== undefined) asset.location = patch.location
  }

  return { list, loading, error, load, updateAsset }
})
