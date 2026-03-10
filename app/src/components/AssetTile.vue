<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import type { Asset } from '@/types'
import { useSelectionStore } from '@/stores/selection'
import { computed } from 'vue'

const props = defineProps<{ asset: Asset }>()

const selection = useSelectionStore()

const inTelemetry = computed(() => selection.telemetryIds.has(props.asset.id))
const inPower = computed(() => selection.powerIds.has(props.asset.id))

const statusColor = computed(() => {
  const s = props.asset.status.toLowerCase()
  if (s === 'operational') return 'success'
  if (s === 'standby') return 'warning'
  if (s === 'maintenance') return 'error'
  return 'default'
})

function onEdit() {
  // Placeholder: open configuration form
}
</script>

<template>
  <v-card variant="outlined" class="pa-3 tile-card">
    <div class="d-flex align-center justify-space-between mb-1">
      <span class="text-body-1 font-weight-medium">{{ asset.name }}</span>
      <v-btn size="x-small" variant="text" color="primary" @click="onEdit">Edit</v-btn>
    </div>
    <div class="tile-caption tile-type mb-1">{{ asset.type }}</div>
    <div class="d-flex flex-wrap align-end justify-space-between gap-1 mb-2">
      <v-chip size="x-small" :color="statusColor" variant="tonal">{{ asset.status }}</v-chip>
      <span class="d-inline-flex align-center gap-1 tile-caption">
        <v-icon :icon="`svg:${mdiMapMarker}`" size="x-small" />
        {{ asset.location }}
      </span>
    </div>
    <v-divider class="my-1" />
    <div class="tile-toggles tile-caption">
      <div class="d-flex align-center justify-space-between gap-2">
        <span>Telemetry</span>
        <v-switch
          :model-value="inTelemetry"
          hide-details
          density="compact"
          color="primary"
          class="tile-switch"
          @update:model-value="selection.toggleTelemetry(asset.id)"
        />
      </div>
      <div class="d-flex align-center justify-space-between gap-2">
        <span>Power</span>
        <v-switch
          :model-value="inPower"
          hide-details
          density="compact"
          color="primary"
          class="tile-switch"
          @update:model-value="selection.togglePower(asset.id)"
        />
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.tile-card {
  font-size: 0.75rem;
}
.tile-caption {
  font-size: 0.7rem;
  opacity: 0.85;
}
.tile-type {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
.tile-toggles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tile-switch :deep(.v-switch__track),
.tile-switch :deep(.v-switch__thumb) {
  transform-origin: center;
}
.tile-switch {
  transform: scale(0.72);
  transform-origin: right center;
}
</style>
