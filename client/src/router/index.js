import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { title: 'Trang chủ' }
    },
    {
      path: '/travel-map',
      name: 'travel',
      component: () => import('../views/TravelMap.vue'),
      meta: { title: 'Travel Map' }
    },
    {
      path: '/gioi-thieu',
      name: 'about',
      component: () => import('../views/About.vue'),
      meta: { title: 'Giới thiệu' }
    },
    {
      path: '/lien-he',
      name: 'contact',
      component: () => import('../views/Contact.vue'),
      meta: { title: 'Liên hệ' }
    },
    {
      path: '/diem-den',
      name: 'destination',
      component: () => import('../views/Destination.vue'),
      meta: { title: 'Điểm đến' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin/admin.vue'),
      children : [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/Admin/Dashboard.vue'),
          meta: { title: 'Bảng điều khiển' }
        },
        {
          path: 'content-management',
          name: 'content-management',
          component: () => import('../views/Admin/ContentManagement.vue'),
          meta: { title: 'Quản lý nội dung' }
        },
        {
          path: 'user-management',
          name: 'user-management',
          component: () => import('../views/Admin/UserManagement.vue'),
          meta: { title: 'Quản lý tài khoản' }
        }
      ]
    }
  ],
})

//set title
router.afterEach((to) => {
  document.title = to.meta.title || 'YG Travel'
})

export default router
