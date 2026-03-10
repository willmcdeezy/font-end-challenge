import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ViewMode = 'tiles' | 'table'

export const useSelectionStore = defineStore('selection', () => {
  const telemetryIds = ref<Set<string>>(new Set())
  const powerIds = ref<Set<string>>(new Set())
  const viewMode = ref<ViewMode>('tiles')

  const telemetryList = computed(() => Array.from(telemetryIds.value))
  const powerList = computed(() => Array.from(powerIds.value))

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  function setTelemetrySelection(ids: string[]) {
    telemetryIds.value = new Set(ids)
  }

  function setPowerSelection(ids: string[]) {
    powerIds.value = new Set(ids)
  }

  return {
    telemetryIds,
    powerIds,
    viewMode,
    telemetryList,
    powerList,
    setViewMode,
    setTelemetrySelection,
    setPowerSelection,
  }
})
