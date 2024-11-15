import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/HomeView.vue'
import NotFound from '@/views/NotFoundView.vue'
import CreateVotingView from '@/views/CreateVotingView.vue'
import AllVotesView from '@/views/AllVotesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/all-votes',
    name: 'All votes',
    component: AllVotesView,
    props: true,
  },
  {
    path: '/create-voting',
    name: 'CreateVoting',
    component: CreateVotingView,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
