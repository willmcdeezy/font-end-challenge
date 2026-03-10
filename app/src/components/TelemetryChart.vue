<script setup lang="ts">
import { computed } from 'vue'
import type { Options } from 'highcharts'
import { useSelectionStore } from '@/stores/selection'
import { useTelemetryStore } from '@/stores/telemetry'
import { useAssetsStore } from '@/stores/assets'
import { ASSET_CHART_PALETTE } from '@/constants/chartColors'

const selection = useSelectionStore()
const telemetryStore = useTelemetryStore()
const assetsStore = useAssetsStore()

const chartOptions = computed<Options>(() => {
  const ids = Array.from(selection.telemetryIds)
  const categories = ['Temperature (°C)', 'Pressure (psi)', 'Vibration', 'Power (kW)']

  const series = ids
    .map((id) => {
      const t = telemetryStore.getByAssetId(id)
      if (!t) return null
      const asset = assetsStore.list.find((a) => a.id === id)
      const name = asset?.name ?? id
      return {
        name,
        type: 'column' as const,
        data: [t.temperature, t.pressure, t.vibration, t.power_consumption],
      }
    })
    .filter(Boolean) as Array<{ name: string; type: 'column'; data: number[] }>

  return {
    chart: { type: 'column' },
    colors: ASSET_CHART_PALETTE,
    title: { text: undefined },
    xAxis: { categories },
    yAxis: {
      title: { text: undefined },
      min: 0,
    },
    legend: { enabled: series.length > 1 },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      column: {
        grouping: true,
        dataLabels: { enabled: false },
      },
    },
    series,
    credits: { enabled: false },
  }
})
</script>

<template>
  <highcharts :options="chartOptions" />
</template>
