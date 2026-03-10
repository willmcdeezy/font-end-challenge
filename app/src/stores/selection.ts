import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ViewMode = 'tiles' | 'table'

export const useSelectionStore = defineStore('selection', () => {
  const telemetryIds = ref<Set<string>>(new Set())
  const powerIds = ref<Set<string>>(new Set())
  const viewMode = ref<ViewMode>('tiles')

  const telemetryList = computed(() => Array.from(telemetryIds.value))
  const powerList = computed(() => Array.from(powerIds.value))

  function toggleTelemetry(id: string) {
    const next = new Set(telemetryIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    telemetryIds.value = next
  }

  function togglePower(id: string) {
    const next = new Set(powerIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    powerIds.value = next
  }

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  return {
    telemetryIds,
    powerIds,
    viewMode,
    telemetryList,
    powerList,
    toggleTelemetry,
    togglePower,
    setViewMode,
  }
})
