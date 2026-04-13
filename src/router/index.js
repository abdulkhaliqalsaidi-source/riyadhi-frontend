import { createRouter, createWebHistory } from 'vue-router'
import Home      from '../views/Home.vue'
import Services  from '../views/Services.vue'
import Contact   from '../views/Contact.vue'
import Dashboard from '../views/Dashboard.vue'
import Login     from '../views/Login.vue'
import NotFound  from '../views/NotFound.vue'

const routes = [
  { path: '/',          component: Home },
  { path: '/services',  component: Services },
  { path: '/contact',   component: Contact },
  { path: '/login',     component: Login,     meta: { guest: true } },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Navigation guard
router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guest && token) {
    return { path: '/dashboard' }
  }
})

export default router
