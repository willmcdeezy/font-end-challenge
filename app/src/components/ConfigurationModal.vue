<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Asset } from '@/types'
import type { AssetConfiguration } from '@/types'
import { fetchConfiguration, saveConfiguration } from '@/api/configuration'
import ModalCloseButton from '@/components/ModalCloseButton.vue'

const props = defineProps<{
  asset: Asset
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const form = ref<Partial<AssetConfiguration>>({})

const priorityOptions = [
  { value: 'low', title: 'Low' },
  { value: 'medium', title: 'Medium' },
  { value: 'high', title: 'High' },
  { value: 'critical', title: 'Critical' },
]
const maintenanceModeOptions = [
  { value: 'scheduled', title: 'Scheduled' },
  { value: 'predictive', title: 'Predictive' },
  { value: 'reactive', title: 'Reactive' },
]
const operatingModeOptions = [
  { value: 'continuous', title: 'Continuous' },
  { value: 'intermittent', title: 'Intermittent' },
  { value: 'on_demand', title: 'On demand' },
]

const defaultConfig = (): Partial<AssetConfiguration> => ({
  asset_id: props.asset.id,
  name: props.asset.name,
  location: props.asset.location,
  priority: 'medium',
  maintenance_mode: 'predictive',
  operating_mode: 'continuous',
  maintenance_interval_days: 30,
  max_runtime_hours: 50000,
  warning_threshold_percent: 85,
  max_temperature_celsius: 80,
  max_pressure_psi: 200,
  efficiency_target_percent: 85,
  power_factor: 0.95,
  load_capacity_percent: 100,
  alert_email: '',
  notes: '',
})

async function loadConfig() {
  if (!props.modelValue || !props.asset) return
  loading.value = true
  error.value = null
  try {
    const existing = await fetchConfiguration(props.asset.id)
    form.value = { ...existing }
  } catch {
    form.value = defaultConfig()
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.modelValue, props.asset?.id] as const,
  ([open, id]) => {
    if (open && id) {
      loadConfig()
    } else {
      form.value = {}
    }
  },
  { immediate: true }
)

async function onSubmit() {
  if (!form.value || !props.asset) return
  saving.value = true
  error.value = null
  try {
    const payload: AssetConfiguration = {
      asset_id: form.value.asset_id ?? props.asset.id,
      name: form.value.name ?? props.asset.name,
      location: form.value.location ?? props.asset.location,
      priority: form.value.priority ?? 'medium',
      maintenance_mode: form.value.maintenance_mode ?? 'predictive',
      operating_mode: form.value.operating_mode ?? 'continuous',
      maintenance_interval_days: form.value.maintenance_interval_days ?? 30,
      max_runtime_hours: form.value.max_runtime_hours ?? 50000,
      warning_threshold_percent: form.value.warning_threshold_percent ?? 85,
      max_temperature_celsius: form.value.max_temperature_celsius ?? 80,
      max_pressure_psi: form.value.max_pressure_psi ?? 200,
      efficiency_target_percent: form.value.efficiency_target_percent ?? 85,
      power_factor: form.value.power_factor ?? 0.95,
      load_capacity_percent: form.value.load_capacity_percent ?? 100,
      alert_email: form.value.alert_email ?? '',
      notes: form.value.notes,
    }
    await saveConfiguration(payload)
    emit('saved')
    emit('update:modelValue', false)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save configuration'
  } finally {
    saving.value = false
  }
}

function onClose() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Edit configuration</span>
        <ModalCloseButton aria-label="Close" @close="onClose" />
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading" indeterminate class="mb-4" />
        <v-alert v-else-if="error" type="error" :text="error" class="mb-4" dismissible />

        <v-form v-if="!loading && form.asset_id" @submit.prevent="onSubmit">
          <v-text-field
            v-model="form.name"
            label="Name"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => !!v && v.length >= 3 && v.length <= 100 || '3–100 characters']"
          />
          <v-text-field
            v-model="form.location"
            label="Location"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => !!v || 'Required', (v) => !v || v.length <= 200 || 'Max 200 characters']"
          />
          <v-select
            v-model="form.priority"
            label="Priority"
            :items="priorityOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-select
            v-model="form.maintenance_mode"
            label="Maintenance mode"
            :items="maintenanceModeOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-select
            v-model="form.operating_mode"
            label="Operating mode"
            :items="operatingModeOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model.number="form.maintenance_interval_days"
            label="Maintenance interval (days)"
            type="number"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 1 && v <= 365 || '1–365']"
          />
          <v-text-field
            v-model.number="form.max_runtime_hours"
            label="Max runtime (hours)"
            type="number"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 1 && v <= 100000 || '1–100000']"
          />
          <v-text-field
            v-model.number="form.warning_threshold_percent"
            label="Warning threshold (%)"
            type="number"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 0 && v <= 100 || '0–100']"
          />
          <v-text-field
            v-model.number="form.max_temperature_celsius"
            label="Max temperature (°C)"
            type="number"
            step="0.1"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= -50 && v <= 200 || '-50–200']"
          />
          <v-text-field
            v-model.number="form.max_pressure_psi"
            label="Max pressure (psi)"
            type="number"
            step="0.1"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 0 && v <= 10000 || '0–10000']"
          />
          <v-text-field
            v-model.number="form.efficiency_target_percent"
            label="Efficiency target (%)"
            type="number"
            step="0.1"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 0 && v <= 100 || '0–100']"
          />
          <v-text-field
            v-model.number="form.power_factor"
            label="Power factor"
            type="number"
            step="0.01"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= -1 && v <= 1 && v !== 0 || '-1 to 1, not 0']"
          />
          <v-text-field
            v-model.number="form.load_capacity_percent"
            label="Load capacity (%)"
            type="number"
            step="0.1"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => v >= 0 && v <= 150 || '0–150']"
          />
          <v-text-field
            v-model="form.alert_email"
            label="Alert email"
            type="email"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[(v) => !v || /.+@.+\..+/.test(v) || 'Valid email']"
          />
          <v-textarea
            v-model="form.notes"
            label="Notes (optional)"
            variant="outlined"
            density="compact"
            rows="2"
            class="mb-2"
            :rules="[(v) => !v || (typeof v === 'string' && v.length <= 500) || 'Max 500 characters']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onClose">Cancel</v-btn>
        <v-btn color="primary" :loading="saving" :disabled="loading" @click="onSubmit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
