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
const assetsSheetOpen = ref(false)

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
    <!-- Mobile: Assets button opens bottom sheet -->
    <div v-if="mobile" class="mb-4">
      <v-btn color="primary" variant="tonal" @click="assetsSheetOpen = true">
        Assets
      </v-btn>
      <v-bottom-sheet v-model="assetsSheetOpen" scrollable>
        <v-sheet>
          <div class="pa-3 text-subtitle-1 font-weight-medium">Assets</div>
          <v-divider />
          <v-list v-if="!assetsStore.loading && !assetsStore.error">
            <v-list-item
              v-for="asset in assetsStore.list"
              :key="asset.id"
              class="py-3"
              @click.stop
            >
              <template #title>{{ asset.name }}</template>
              <template #subtitle>
                <span class="d-block">{{ asset.type }}</span>
                <div class="d-flex flex-wrap gap-1 mt-1">
                  <v-chip size="x-small" :color="statusColor(asset.status)" variant="tonal">
                    {{ asset.status }}
                  </v-chip>
                  <v-chip size="x-small" variant="outlined">{{ asset.location }}</v-chip>
                </div>
              </template>
              <template #append>
                <div class="d-flex align-center gap-2">
                  <span class="text-caption text-medium-emphasis">Tel</span>
                  <v-switch
                    :model-value="selection.telemetryIds.has(asset.id)"
                    hide-details
                    density="compact"
                    color="primary"
                    @click.stop
                    @update:model-value="selection.toggleTelemetry(asset.id)"
                  />
                  <span class="text-caption text-medium-emphasis">Power</span>
                  <v-switch
                    :model-value="selection.powerIds.has(asset.id)"
                    hide-details
                    density="compact"
                    color="primary"
                    @click.stop
                    @update:model-value="selection.togglePower(asset.id)"
                  />
                  <v-btn size="small" variant="text" color="primary" @click.stop>Edit</v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <v-progress-linear v-else-if="assetsStore.loading" indeterminate />
          <v-alert v-else-if="assetsStore.error" type="error" :text="assetsStore.error" class="ma-3" />
        </v-sheet>
      </v-bottom-sheet>
    </div>

    <!-- Desktop: view toggle + tiles or table -->
    <template v-if="!mobile">
    <div class="d-flex align-center flex-wrap gap-4 mb-4">
      <span class="text-subtitle-1 font-weight-medium">View</span>
      <v-btn-toggle
        :model-value="selection.viewMode"
        mandatory
        density="compact"
        variant="outlined"
        @update:model-value="selection.setViewMode($event)"
      >
        <v-btn value="tiles" size="small">Tiles</v-btn>
        <v-btn value="table" size="small">Table</v-btn>
      </v-btn-toggle>
    </div>

    <v-progress-linear v-if="assetsStore.loading" indeterminate class="mb-4" />
    <v-alert v-else-if="assetsStore.error" type="error" :text="assetsStore.error" class="mb-4" />

    <template v-else>
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
    </template>

    <!-- Chart placeholders: same on mobile and desktop -->
    <v-sheet v-if="selection.telemetryList.length > 0" class="pa-4 mb-4" rounded border>
      <h3 class="text-h6 mb-2">Telemetry</h3>
      <p class="text-body-2 text-medium-emphasis">Chart placeholder — selected: {{ selection.telemetryList.join(', ') }}</p>
    </v-sheet>
    <v-sheet v-if="selection.powerList.length > 0" class="pa-4" rounded border>
      <h3 class="text-h6 mb-2">Power consumption</h3>
      <p class="text-body-2 text-medium-emphasis">Chart placeholder — selected: {{ selection.powerList.join(', ') }}</p>
    </v-sheet>
  </div>
</template>

<style scoped>
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
</style>
