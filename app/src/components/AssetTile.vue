<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import type { Asset } from '@/types'
import { useAssetsStore } from '@/stores/assets'
import { assetColorByIndex } from '@/constants/chartColors'
import { computed } from 'vue'

const props = defineProps<{ asset: Asset }>()

const assetsStore = useAssetsStore()

const assetColor = computed(() => {
  const index = assetsStore.list.findIndex((a) => a.id === props.asset.id)
  return index >= 0 ? assetColorByIndex(index) : '#888'
})

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
    <div class="d-flex align-center justify-space-between mb-1 gap-2">
      <span class="d-inline-flex align-center gap-3 tile-name-row">
        <span class="tile-bullet" :style="{ backgroundColor: assetColor }" aria-hidden="true" />
        <span class="tile-name text-body-1 font-weight-medium">{{ asset.name }}</span>
      </span>
      <v-btn size="x-small" variant="text" color="primary" @click="onEdit">Edit</v-btn>
    </div>
    <div class="tile-caption tile-type mb-1">{{ asset.type }}</div>
    <div class="d-flex flex-wrap align-end justify-space-between gap-1">
      <v-chip size="x-small" :color="statusColor" variant="tonal">{{ asset.status }}</v-chip>
      <span class="d-inline-flex align-center gap-1 tile-caption">
        <v-icon :icon="`svg:${mdiMapMarker}`" size="x-small" />
        {{ asset.location }}
      </span>
    </div>
  </v-card>
</template>

<style scoped>
.tile-card {
  font-size: 0.75rem;
}
.tile-name-row {
  min-width: 0;
}
.tile-bullet {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
}
.tile-name {
  font-size: 0.9375rem;
}
.tile-caption {
  font-size: 0.7rem;
  opacity: 0.85;
}
.tile-type {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
</style>
