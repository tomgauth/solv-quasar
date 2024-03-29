
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/PageLesson.vue') 
      }, 
      { 
        path: '/settings', 
        component: () => import('pages/PageSettings.vue') 
      },
      { 
        path: '/auth', 
        component: () => import('pages/PageAuth.vue') 
      },
      { 
        path: '/list', 
        component: () => import('pages/PageList.vue') 
      },
      { 
        path: '/table', 
        component: () => import('pages/PageTable.vue') 
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
