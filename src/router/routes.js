
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { 
        path: '/lesson-start', 
        component: () => import('pages/lesson-start.vue'), 
      }, 
      { 
        path: '/lesson-play', 
        component: () => import('pages/lesson-play.vue'), 
      }, 
      { 
        path: '/settings', 
        component: () => import('pages/PageSettings.vue') 
      },
      { 
        path: '/table', 
        component: () => import('pages/PageTable.vue') 
      }
    ]
  },
  { 
    path: '/auth', 
    component: () => import('layouts/NoHeader.vue'),
    children:[
      {
        path:'',
        component:() => import('pages/PageAuth.vue')
      }
    ] 
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
