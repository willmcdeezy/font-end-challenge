<script setup lang="ts">
import { mdiMapMarker } from '@mdi/js'
import { useDisplay } from 'vuetify'
import { useAssetsStore } from '@/stores/assets'
import { useSelectionStore } from '@/stores/selection'
import { onMounted, ref } from 'vue'
import AssetTile from '@/components/AssetTile.vue'

const assetsStore = useAssetsStore()
const selection = useSelectionStore()
const { mobile } = useDisplay()
const assetsExpanded = ref<number[]>([0])
const telemetryExpanded = ref<number[]>([0])
const powerExpanded = ref<number[]>([0])

onMounted(() => {
  assetsStore.load()
})

function statusColor(status: string) {
  const s = status.toLowerCase()
  if (s === 'operational') return 'success'
  if (s === 'standby') return 'warning'
  if (s === 'maintenance') return 'error'
  return 'default'
}
</script>

<template>
  <div>
    <!-- Assets section: expandable (accordion); section title "Assets", click to fold/unfold -->
    <v-expansion-panels v-model="assetsExpanded" class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-title>Assets</v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- Tiles | Table: no border; selected has dark background -->
          <div class="d-flex align-center flex-wrap gap-2 mb-4">
            <v-btn-toggle
              class="assets-view-toggle"
              :model-value="selection.viewMode"
              mandatory
              density="compact"
              variant="text"
              @update:model-value="selection.setViewMode($event)"
            >
              <v-btn value="tiles" size="small">Tiles</v-btn>
              <v-tooltip v-if="mobile" text="Only available on desktop" location="top">
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    value="table"
                    size="small"
                    disabled
                  >
                    Table
                  </v-btn>
                </template>
              </v-tooltip>
              <v-btn v-else value="table" size="small">Table</v-btn>
            </v-btn-toggle>
          </div>

          <v-progress-linear v-if="assetsStore.loading" indeterminate class="mb-4" />
          <v-alert v-else-if="assetsStore.error" type="error" :text="assetsStore.error" class="mb-4" />

          <template v-else>
            <!-- Desktop: tiles or table. Mobile: tiles only (table disabled above). -->
            <v-row v-if="selection.viewMode === 'tiles'" class="mb-6">
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
            <th class="text-center table-toggle-col">Telemetry</th>
            <th class="text-center table-toggle-col">Power</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="asset in assetsStore.list" :key="asset.id">
            <td class="table-type-col">{{ asset.type }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.location }}</td>
            <td>
              <v-chip size="small" :color="statusColor(asset.status)" variant="tonal">{{ asset.status }}</v-chip>
            </td>
            <td class="text-center table-toggle-col">
              <v-switch
                :model-value="selection.telemetryIds.has(asset.id)"
                hide-details
                density="compact"
                color="primary"
                @update:model-value="selection.toggleTelemetry(asset.id)"
              />
            </td>
            <td class="text-center table-toggle-col">
              <v-switch
                :model-value="selection.powerIds.has(asset.id)"
                hide-details
                density="compact"
                color="primary"
                @update:model-value="selection.togglePower(asset.id)"
              />
            </td>
            <td>
              <v-btn size="small" variant="text" color="primary">Edit</v-btn>
            </td>
          </tr>
            </tbody>
          </v-table>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Telemetry section: always visible, collapsible; empty chart when no data -->
    <v-expansion-panels v-model="telemetryExpanded" class="mb-4">
      <v-expansion-panel>
        <v-expansion-panel-title>Telemetry</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="chart-placeholder">
            <p v-if="selection.telemetryList.length > 0" class="text-body-2 text-medium-emphasis mb-2">
              Selected: {{ selection.telemetryList.join(', ') }}
            </p>
            <p v-else class="text-body-2 text-medium-emphasis mb-2">
              Select assets above to include in telemetry.
            </p>
            <div class="chart-empty" aria-hidden="true">Chart (not connected)</div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Power section: always visible, collapsible; empty chart when no data -->
    <v-expansion-panels v-model="powerExpanded">
      <v-expansion-panel>
        <v-expansion-panel-title>Power consumption</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="chart-placeholder">
            <p v-if="selection.powerList.length > 0" class="text-body-2 text-medium-emphasis mb-2">
              Selected: {{ selection.powerList.join(', ') }}
            </p>
            <p v-else class="text-body-2 text-medium-emphasis mb-2">
              Select assets above to include in power chart.
            </p>
            <div class="chart-empty" aria-hidden="true">Chart (not connected)</div>
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
.table-assets th.table-toggle-col,
.table-assets td.table-toggle-col {
  width: 1%;
  white-space: nowrap;
  vertical-align: middle;
}
.table-assets th.table-toggle-col {
  text-align: center;
}
.table-type-col {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
}
.chart-placeholder {
  min-height: 120px;
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
