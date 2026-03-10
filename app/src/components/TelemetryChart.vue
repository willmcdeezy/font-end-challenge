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

const darkTheme = {
  chart: { backgroundColor: '#1e1e1e' },
  title: { style: { color: '#e0e0e0', fontSize: '14px' } },
  xAxis: {
    labels: { style: { color: '#9e9e9e' } },
    lineColor: '#424242',
    tickColor: '#424242',
  },
  yAxis: {
    title: { style: { color: '#9e9e9e' } },
    labels: { style: { color: '#9e9e9e' } },
    gridLineColor: '#424242',
    lineColor: '#424242',
    tickColor: '#424242',
  },
  legend: {
    itemStyle: { color: '#e0e0e0' },
    itemHoverStyle: { color: '#fff' },
  },
  tooltip: {
    backgroundColor: '#2d2d2d',
    borderColor: '#424242',
    style: { color: '#e0e0e0' },
  },
}

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
    chart: { type: 'column', ...darkTheme.chart },
    colors: ASSET_CHART_PALETTE,
    title: { text: undefined, ...darkTheme.title },
    xAxis: { categories, ...darkTheme.xAxis },
    yAxis: {
      ...darkTheme.yAxis,
      title: { ...darkTheme.yAxis.title, text: undefined },
      min: 0,
      tickInterval: 50,
    },
    legend: { enabled: series.length > 1, ...darkTheme.legend },
    tooltip: { shared: true, ...darkTheme.tooltip },
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
