
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/PageLessonStart.vue'), 
      }, 
      { 
        path: '/lesson-play', 
        component: () => import('pages/PageLessonPlay.vue'), 
      }, 
      { 
        path: '/settings', 
        component: () => import('pages/PageSettings.vue') 
      },
      { 
        path: '/list', 
        component: () => import('pages/PageList.vue') 
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
