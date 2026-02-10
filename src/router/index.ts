import { createRouter, createWebHistory } from 'vue-router'
import ToolsIndexView from '../views/ToolsIndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/tools'
    },
    {
      path: '/tools',
      name: 'tools',
      component: ToolsIndexView
    },
    {
      path: '/tools/placement-grouper',
      name: 'placement-grouper',
      component: () => import('../views/tools/PlacementGrouperView.vue')
    },
    {
      path: '/tools/azimuth-visualizer',
      name: 'azimuth-visualizer',
      component: () => import('../views/tools/AzimuthVisualizerView.vue')
    }
  ]
})

export default router
