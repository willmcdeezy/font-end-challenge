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
    <div class="detail-meta text-body-2">
      <div class="d-flex align-center detail-meta-row">
        <span class="detail-type">{{ asset.type }}</span>
        <v-chip size="small" :color="statusColor" variant="tonal">{{ asset.status }}</v-chip>
      </div>
      <div class="detail-location mt-2">
        <span class="d-inline-flex align-center gap-1">
          <v-icon :icon="`svg:${mdiMapMarker}`" size="small" />
          {{ asset.location }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asset-detail-header {
  margin-bottom: 24px;
}
.detail-meta {
  display: flex;
  flex-direction: column;
}
.detail-meta-row {
  gap: 32px;
}
.detail-type {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
</style>
