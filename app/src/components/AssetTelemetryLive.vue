<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Telemetry } from '@/types'
import { WS_BASE } from '@/api/client'

const props = defineProps<{ assetId: string }>()

const telemetry = ref<Telemetry | null>(null)
const connected = ref(false)
const error = ref<string | null>(null)

let ws: WebSocket | null = null

function connect() {
  error.value = null
  const url = `${WS_BASE}/ws/telemetry`
  ws = new WebSocket(url)

  ws.onopen = () => {
    connected.value = true
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data as string)
      if (msg.type === 'telemetry_update' && Array.isArray(msg.data)) {
        const forAsset = msg.data.find((d: { asset_id: string }) => d.asset_id === props.assetId)
        if (forAsset) {
          telemetry.value = forAsset as Telemetry
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  ws.onerror = () => {
    error.value = 'WebSocket error'
  }

  ws.onclose = () => {
    connected.value = false
    ws = null
  }
}

function disconnect() {
  if (ws) {
    ws.close()
    ws = null
  }
  connected.value = false
  telemetry.value = null
}

watch(
  () => props.assetId,
  () => {
    disconnect()
    if (props.assetId) connect()
  }
)

onMounted(() => {
  if (props.assetId) connect()
})

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <div class="asset-telemetry-live">
    <div v-if="error" class="text-caption text-error mb-2">{{ error }}</div>
    <div v-else-if="!connected" class="text-caption text-medium-emphasis mb-2">Connecting to live telemetry…</div>
    <div v-else class="text-caption text-success mb-2">Live</div>

    <v-sheet v-if="telemetry" variant="tonal" rounded="lg" class="pa-4 telemetry-grid">
      <div class="telemetry-item">
        <span class="telemetry-label">Temperature</span>
        <span class="telemetry-value">{{ telemetry.temperature }} °C</span>
      </div>
      <div class="telemetry-item">
        <span class="telemetry-label">Pressure</span>
        <span class="telemetry-value">{{ telemetry.pressure }} psi</span>
      </div>
      <div class="telemetry-item">
        <span class="telemetry-label">Vibration</span>
        <span class="telemetry-value">{{ telemetry.vibration }}</span>
      </div>
      <div class="telemetry-item">
        <span class="telemetry-label">Power</span>
        <span class="telemetry-value">{{ telemetry.power_consumption }} kW</span>
      </div>
    </v-sheet>
    <v-sheet v-else variant="tonal" rounded="lg" class="pa-4 text-medium-emphasis">
      Waiting for telemetry data…
    </v-sheet>
  </div>
</template>

<style scoped>
.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}
.telemetry-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.telemetry-label {
  font-size: 0.75rem;
  opacity: 0.85;
}
.telemetry-value {
  font-weight: 600;
  font-size: 1rem;
}
</style>
