import Vue from 'vue'
import VueRouter from 'vue-router'
import workingTime from '../pages/PageWorkingTime'
import accueil from '../pages/Accueil'
import chartManager from '../pages/PageChartManager'
import clocks from '../pages/PageClocks'
import users from '../components/Users.vue'
import espacePerso from '../pages/PageEspacePerso.vue'
import espaceManager from '../pages/PageEspaceManager.vue'
import login from '../pages/Login.vue'
import teams from '../pages/PageTeams.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/accueil',
    },
    {
      path: '/login',
      name: 'Login',
      component: login,
    },
    {
      path: '/accueil',
      component: accueil,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/workingtime',
          component: workingTime,
          meta: { requiresAuth: true },
        },
        {
          path: '/chartManager',
          component: chartManager,
          meta: { requiresAuth: true },
        },
        {
          path: '/clocks',
          component: clocks,
          meta: { requiresAuth: true },
        },
        {
          path: '/users',
          name: 'Users',
          component: users,
          meta: { requiresAuth: true },
        },
        {
          path: '/teams',
          name: 'Teams',
          component: teams,
          meta: { requiresAuth: true },
        },
        {
          path: '/accueil/',
          name: 'EspacePerso',
          component: espacePerso,
          meta: { requiresAuth: true },
        },
        {
          path: '/managers',
          name: 'EspaceManager',
          component: espaceManager,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  // listes des pages non restreins
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    return next('/login')
  } else {
    next()
  }
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     const token = JSON.parse(localStorage.getItem('user'))
//     if (token == null) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath },
//       })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
