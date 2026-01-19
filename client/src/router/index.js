import useAuthStore from '@/stores/authStore'
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
      meta: { requiresAdmin: true },
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
          redirect: '/admin/content-management/list',
          children: [
            {
              path: 'add',
              name: 'add',
              component: () =>  import('../views/Admin/addContent.vue'),
              meta: {title: 'Thêm nội dung'}
            },
            {
              path: 'list',
              name: 'list',
              component: () =>  import('../views/Admin/ListContent.vue'),
              meta: {title: 'Danh sách nội dung'}
            },
          ]
        },
        {
          path: 'user-management',
          name: 'user-management',
          component: () => import('../views/Admin/UserManagement.vue'),
          meta: { title: 'Quản lý tài khoản' }
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth/Auth.vue'),
      children : [
        {
          path: '',
          redirect: '/auth/dang-nhap'
        },
        {
          path: 'dang-nhap',
          name: 'dang-nhap',
          component: () => import('../views/Auth/Signin.vue'),
          meta: { title : 'Đăng nhập'}
        },
        {
          path: 'dang-ky',
          name: 'dang-ky',
          component: () => import('../views/Auth/Signup.vue'),
          meta: { title: 'Đăng ký'}
        }
      ]
    }
  ],
  scrollBehavior(to, from, savePosition){
    return {top: 0}
  }
})

//set title
router.afterEach((to) => {
  document.title = to.meta.title || 'YG Travel'
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if(to.meta.requiresAdmin){
    if(authStore.isLogIn && authStore.isAdmin){
      next();
    }
    else{
      next("/");
    }
  }
  else{
    next();
  }
})

export default router
