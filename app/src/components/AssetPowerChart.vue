<script setup lang="ts">
import { computed } from 'vue'
import type { Options } from 'highcharts'
import { usePowerStore } from '@/stores/power'
import { useAssetsStore } from '@/stores/assets'

const props = defineProps<{ assetId: string }>()

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
  legend: { itemStyle: { color: '#e0e0e0' }, itemHoverStyle: { color: '#fff' } },
  tooltip: {
    backgroundColor: '#2d2d2d',
    borderColor: '#424242',
    style: { color: '#e0e0e0' },
    xDateFormat: '%Y-%m-%d %H:%M',
    pointFormat:
      '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y:.1f} kW</b><br/>Efficiency: <b>{point.efficiency:.1f}%</b><br/>',
  },
}

const chartOptions = computed<Options>(() => {
  const p = powerStore.getByAssetId(props.assetId)
  const asset = assetsStore.list.find((a) => a.id === props.assetId)
  const name = asset?.name ?? props.assetId

  if (!p) {
    return {
      chart: { type: 'line', ...darkTheme.chart },
      title: { text: 'Power consumption', ...darkTheme.title },
      series: [],
      credits: { enabled: false },
    }
  }

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

  return {
    chart: { type: 'line', ...darkTheme.chart },
    title: { text: 'Power consumption', ...darkTheme.title },
    xAxis: { type: 'datetime', ...darkTheme.xAxis },
    yAxis: {
      title: { text: 'Power (kW)', style: { color: '#9e9e9e' } },
      crosshair: true,
      gridLineColor: '#424242',
      labels: { style: { color: '#9e9e9e' } },
      lineColor: '#424242',
      tickColor: '#424242',
    },
    legend: { ...darkTheme.legend, enabled: true },
    tooltip: { shared: true, ...darkTheme.tooltip },
    series: [
      { name: `${name} (history)`, type: 'line', data: historyPoints },
      { name: `${name} (forecast)`, type: 'line', data: forecastPoints, dashStyle: 'Dash' },
    ],
    credits: { enabled: false },
  }
})
</script>

<template>
  <highcharts :options="chartOptions" />
</template>
