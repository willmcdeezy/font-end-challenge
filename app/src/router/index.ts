import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Dashboard', component: () => import('@/views/DashboardView.vue') },
    {
      path: '/asset/:id',
      name: 'AssetDetail',
      component: () => import('@/views/AssetDetailView.vue'),
      props: true,
    },
  ],
})

export default router
