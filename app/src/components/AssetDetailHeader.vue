<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import type { Asset } from '@/types'
import { computed } from 'vue'
import AssetNameTag from '@/components/AssetNameTag.vue'

const props = defineProps<{ asset: Asset }>()
const emit = defineEmits<{ edit: [] }>()


const statusColor = computed(() => {
  const s = props.asset.status.toLowerCase()
  if (s === 'operational') return 'success'
  if (s === 'standby') return 'warning'
  if (s === 'maintenance') return 'error'
  return 'default'
})
</script>

<template>
  <div class="asset-detail-header">
    <div class="d-flex align-center justify-space-between flex-wrap gap-3 mb-3">
      <AssetNameTag :asset="asset" size="large" />
      <v-btn color="primary" variant="tonal" @click="emit('edit')">Edit</v-btn>
    </div>
    <div class="d-flex flex-wrap align-center gap-3 text-body-2 detail-meta">
      <span class="detail-type">{{ asset.type }}</span>
      <v-chip size="small" :color="statusColor" variant="tonal">{{ asset.status }}</v-chip>
      <span class="d-inline-flex align-center gap-1 detail-location">
        <v-icon :icon="`svg:${mdiMapMarker}`" size="small" />
        {{ asset.location }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.asset-detail-header {
  margin-bottom: 24px;
}
.detail-meta {
  gap: 24px;
}
.detail-type {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
.detail-location {
  flex-shrink: 0;
}
</style>
