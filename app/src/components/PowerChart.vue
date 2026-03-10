<script setup lang="ts">
import { computed } from 'vue'
import type { Options } from 'highcharts'
import { useSelectionStore } from '@/stores/selection'
import { usePowerStore } from '@/stores/power'
import { useAssetsStore } from '@/stores/assets'

const selection = useSelectionStore()
const powerStore = usePowerStore()
const assetsStore = useAssetsStore()

const chartOptions = computed<Options>(() => {
  const ids = Array.from(selection.powerIds)

  const series = ids
    .map((id) => {
      const p = powerStore.getByAssetId(id)
      if (!p) return null
      const asset = assetsStore.list.find((a) => a.id === id)
      const name = asset?.name ?? id
      const historyPoints = p.history.map((d) => ({
        x: new Date(d.timestamp).getTime(),
        y: d.power_kw,
        efficiency: d.efficiency,
      }))
      const forecastPoints = p.forecast.map((d) => ({
        x: new Date(d.timestamp).getTime(),
        y: d.power_kw,
        efficiency: d.efficiency,
      }))
      return [
        { name: `${name} (history)`, type: 'line' as const, data: historyPoints },
        { name: `${name} (forecast)`, type: 'line' as const, data: forecastPoints, dashStyle: 'Dash' },
      ]
    })
    .filter(Boolean)
    .flat() as Array<{ name: string; type: 'line'; data: Array<{ x: number; y: number; efficiency: number }>; dashStyle?: string }>

  return {
    chart: { type: 'line' },
    title: { text: undefined },
    xAxis: { type: 'datetime' },
    yAxis: {
      title: { text: 'Power (kW)' },
      crosshair: true,
    },
    legend: { enabled: series.length > 0 },
    tooltip: {
      shared: true,
      xDateFormat: '%Y-%m-%d %H:%M',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f} kW</b><br/>Efficiency: <b>{point.efficiency:.1f}%</b><br/>',
    },
    series,
    credits: { enabled: false },
  }
})
</script>

<template>
  <highcharts :options="chartOptions" />
</template>
