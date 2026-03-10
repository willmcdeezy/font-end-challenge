<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import type { Asset } from '@/types'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import AssetNameTag from '@/components/AssetNameTag.vue'

const props = defineProps<{ asset: Asset }>()

const router = useRouter()

const statusColor = computed(() => {
  const s = props.asset.status.toLowerCase()
  if (s === 'operational') return 'success'
  if (s === 'standby') return 'warning'
  if (s === 'maintenance') return 'error'
  return 'default'
})

function goToAsset() {
  router.push({ name: 'AssetDetail', params: { id: props.asset.id } })
}
</script>

<template>
  <v-card variant="outlined" class="pa-3 tile-card tile-card--clickable" @click="goToAsset">
    <div class="d-flex align-center mb-1 tile-name-row">
      <AssetNameTag :asset="asset" size="small" />
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
.tile-card--clickable {
  cursor: pointer;
}
.tile-card--clickable:hover {
  background: rgba(0, 0, 0, 0.02);
}
.tile-name-row {
  min-width: 0;
}
.tile-caption {
  font-size: 0.7rem;
  opacity: 0.85;
}
.tile-type {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
</style>
