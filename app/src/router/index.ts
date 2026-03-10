import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Assets', component: () => import('@/views/AssetListView.vue') },
    { path: '/telemetry', name: 'Telemetry', component: () => import('@/views/TelemetryView.vue') },
    { path: '/power', name: 'Power', component: () => import('@/views/PowerView.vue') },
    { path: '/configuration', name: 'Configuration', component: () => import('@/views/ConfigurationView.vue') },
  ],
})

export default router
