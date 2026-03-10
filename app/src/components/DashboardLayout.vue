<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { useAssetsStore } from '@/stores/assets'
import { useSelectionStore } from '@/stores/selection'
import { useTelemetryStore } from '@/stores/telemetry'
import { usePowerStore } from '@/stores/power'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AssetTile from '@/components/AssetTile.vue'
import AssetNameTag from '@/components/AssetNameTag.vue'
import TelemetryChart from '@/components/TelemetryChart.vue'
import PowerChart from '@/components/PowerChart.vue'

const assetsStore = useAssetsStore()
const selection = useSelectionStore()
const telemetryStore = useTelemetryStore()
const powerStore = usePowerStore()
const router = useRouter()
const { mobile } = useDisplay()
const assetsExpanded = ref<number[]>([0])
const telemetryExpanded = ref<number[]>([0])
const powerExpanded = ref<number[]>([0])

onMounted(async () => {
  await assetsStore.load()
  if (assetsStore.error) return
  const assetIds = assetsStore.list.map((a) => a.id)
  if (assetIds.length === 0) return
  selection.setTelemetrySelection(assetIds)
  selection.setPowerSelection(assetIds)
  await Promise.all([
    telemetryStore.loadAll(assetIds),
    powerStore.loadAll(assetIds),
  ])
})

function statusColor(status: string) {
  const s = status.toLowerCase()
  if (s === 'operational') return 'success'
  if (s === 'standby') return 'warning'
  if (s === 'maintenance') return 'error'
  return 'default'
}

function goToAsset(id: string) {
  router.push({ name: 'AssetDetail', params: { id } })
}
</script>

<template>
  <div>
    <!-- Assets section: expandable (accordion); section title "Assets", click to fold/unfold -->
    <v-expansion-panels v-model="assetsExpanded" class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-title>Assets</v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Tiles | Table: no border; selected has dark background. Hidden on mobile (tiles only). -->
          <div v-if="!mobile" class="d-flex align-center flex-wrap gap-2 mb-4">
            <v-btn-toggle
              class="assets-view-toggle"
              :model-value="selection.viewMode"
              mandatory
              density="compact"
              variant="text"
              @update:model-value="selection.setViewMode($event)"
            >
              <v-btn value="tiles" size="small">Tile View</v-btn>
              <v-btn value="table" size="small">Table View</v-btn>
            </v-btn-toggle>
          </div>

          <v-progress-linear v-if="assetsStore.loading" indeterminate class="mb-4" />
          <v-alert v-else-if="assetsStore.error" type="error" :text="assetsStore.error" class="mb-4" />

          <template v-else>
            <!-- Desktop: tiles or table. Mobile: always tiles (toggle hidden). -->
            <v-row v-if="selection.viewMode === 'tiles' || mobile" class="mb-6">
              <v-col v-for="asset in assetsStore.list" :key="asset.id" cols="12" sm="6" md="4" lg="3">
                <AssetTile :asset="asset" />
              </v-col>
            </v-row>
            <v-table v-else class="mb-6 table-assets">
        <thead>
          <tr>
            <th class="table-type-col">Type</th>
            <th>Name</th>
            <th>
              <span class="d-inline-flex align-center gap-1">
                <v-icon :icon="`svg:${mdiMapMarker}`" size="small" />
                Location
              </span>
            </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="asset in assetsStore.list"
            :key="asset.id"
            class="table-assets-row"
            @click="goToAsset(asset.id)"
          >
            <td class="table-type-col">{{ asset.type }}</td>
            <td>
              <AssetNameTag :asset="asset" size="small" />
            </td>
            <td>{{ asset.location }}</td>
            <td>
              <v-chip size="small" :color="statusColor(asset.status)" variant="tonal">{{ asset.status }}</v-chip>
            </td>
          </tr>
            </tbody>
          </v-table>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Telemetry section: always visible, collapsible; multibar chart when assets selected -->
    <v-expansion-panels v-model="telemetryExpanded" class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-title>Telemetry</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="chart-placeholder">
            <template v-if="selection.telemetryIds.size > 0 && !telemetryStore.loading">
              <TelemetryChart class="chart-container chart-container--tall" />
            </template>
            <div v-else-if="selection.telemetryIds.size === 0" class="chart-empty" aria-hidden="true">
              Chart (select assets above)
            </div>
            <div v-else class="chart-empty" aria-hidden="true">Loading telemetry…</div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Power section: always visible, collapsible; line chart when assets selected -->
    <v-expansion-panels v-model="powerExpanded">
      <v-expansion-panel>
        <v-expansion-panel-title>Power consumption</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="chart-placeholder">
            <template v-if="selection.powerIds.size > 0 && !powerStore.loading">
              <PowerChart class="chart-container" />
            </template>
            <div v-else-if="selection.powerIds.size === 0" class="chart-empty" aria-hidden="true">
              Chart (select assets above)
            </div>
            <div v-else class="chart-empty" aria-hidden="true">Loading power data…</div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
.assets-view-toggle :deep(.v-btn-toggle) {
  border: none;
  box-shadow: none;
}
.assets-view-toggle :deep(.v-btn) {
  border: none;
}
.assets-view-toggle :deep(.v-btn.v-btn--active) {
  background: rgba(0, 0, 0, 0.12);
}
.table-type-col {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
.table-assets-row {
  cursor: pointer;
}
.table-assets-row:hover {
  background: rgba(0, 0, 0, 0.04);
}
.chart-placeholder {
  min-height: 120px;
}
.chart-container {
  min-height: 280px;
  height: 280px;
}
.chart-container--tall {
  min-height: 400px;
  height: 400px;
}
.chart-empty {
  align-items: center;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.38);
  display: flex;
  font-size: 0.875rem;
  justify-content: center;
  min-height: 200px;
  padding: 1rem;
}
</style>
