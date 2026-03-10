<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import { usePowerStore } from '@/stores/power'
import AssetDetailHeader from '@/components/AssetDetailHeader.vue'
import AssetTelemetryLive from '@/components/AssetTelemetryLive.vue'
import AssetPowerChart from '@/components/AssetPowerChart.vue'
import ConfigurationModal from '@/components/ConfigurationModal.vue'

const route = useRoute()
const router = useRouter()
const assetsStore = useAssetsStore()
const powerStore = usePowerStore()

const assetId = computed(() => route.params.id as string)
const asset = computed(() => assetsStore.list.find((a) => a.id === assetId.value) ?? null)

const configModalOpen = ref(false)

onMounted(async () => {
  if (!assetsStore.list.length) await assetsStore.load()
  if (assetId.value && !powerStore.getByAssetId(assetId.value)) {
    await powerStore.loadAll([assetId.value])
  }
})

watch(assetId, async (id) => {
  if (id && !powerStore.getByAssetId(id)) {
    await powerStore.loadAll([id])
  }
})

function openEdit() {
  configModalOpen.value = true
}

function goBack() {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div v-if="asset" class="asset-detail-view">
    <v-btn color="primary" variant="tonal" class="mb-3" @click="goBack">← Back to dashboard</v-btn>
    <AssetDetailHeader :asset="asset" @edit="openEdit" />

    <section class="mb-6">
      <h2 class="text-subtitle-1 font-weight-medium mb-2">Telemetry (live)</h2>
      <AssetTelemetryLive :asset-id="asset.id" />
    </section>

    <section class="mb-6">
      <h2 class="text-subtitle-1 font-weight-medium mb-2">Power consumption</h2>
      <div class="chart-container chart-container--tall">
        <AssetPowerChart :asset-id="asset.id" />
      </div>
    </section>

    <ConfigurationModal v-model="configModalOpen" :asset="asset" @saved="() => {}" />
  </div>

  <div v-else class="text-body-1">
    <p class="mb-4">Asset not found.</p>
    <v-btn color="primary" variant="tonal" @click="goBack">Back to dashboard</v-btn>
  </div>
</template>

<style scoped>
.asset-detail-view {
  max-width: 900px;
}
@media (min-width: 960px) {
  .asset-detail-view {
    margin-left: auto;
    margin-right: auto;
  }
}
.chart-container {
  min-height: 280px;
  height: 280px;
}
.chart-container--tall {
  min-height: 400px;
  height: 400px;
}
</style>
