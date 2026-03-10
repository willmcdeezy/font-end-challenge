<script setup lang="ts">
import { computed } from 'vue'
import type { Options } from 'highcharts'
import { useSelectionStore } from '@/stores/selection'
import { usePowerStore } from '@/stores/power'
import { useAssetsStore } from '@/stores/assets'

const selection = useSelectionStore()
const powerStore = usePowerStore()
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
    chart: { type: 'line', ...darkTheme.chart },
    title: { text: undefined, ...darkTheme.title },
    xAxis: { type: 'datetime', ...darkTheme.xAxis },
    yAxis: {
      title: { text: 'Power (kW)', style: { color: '#9e9e9e' } },
      crosshair: true,
      gridLineColor: '#424242',
      labels: { style: { color: '#9e9e9e' } },
      lineColor: '#424242',
      tickColor: '#424242',
    },
    legend: { enabled: series.length > 0, ...darkTheme.legend },
    tooltip: {
      shared: true,
      xDateFormat: '%Y-%m-%d %H:%M',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f} kW</b><br/>Efficiency: <b>{point.efficiency:.1f}%</b><br/>',
      ...darkTheme.tooltip,
    },
    series,
    credits: { enabled: false },
  }
})
</script>

<template>
  <highcharts :options="chartOptions" />
</template>
