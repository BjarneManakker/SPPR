import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CountersView from '../views/CountersView.vue'
import AboutView from '../views/AboutView.vue'
import GamesView from '../views/GamesView.vue'
import Nexus from '@/views/NexusView.vue'
import NexusExtra from '@/views/NexusExtraView.vue'
import OverOns from '@/views/OverOnsView.vue'


const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/counters',
      name: 'counters',
      component: CountersView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/over-ons',
      name: 'over-ons',
      component: OverOns,
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView,
    },
    {
      path: '/nexus',
      name: 'Nexus',
      component: Nexus
    },
    {
      path: '/nexus/extra',
      name: 'NexusExtra',
      component: NexusExtra
    },
  ],
})

export default router