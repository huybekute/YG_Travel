import apiService from '@/services/APIService'
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
      component: () => import('../views/Admin/admin.vue'),
      meta: { requiresAdmin: true },
      children : [
        {
          path: '',
          name: 'admin',
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
          meta: { title : 'Quản lý nội dung'}
        },
        {
          path: 'user-management',
          name: 'user-management',
          component: () => import('../views/Admin/UserManagement.vue'),
          meta: { title: 'Quản lý người dùng' }
        },
        {
          path: 'admin-management',
          name: 'admin-management',
          component: () => import('../views/Admin/AdminManagement.vue'),
          meta: { title: 'Quản lý admin' }
        },
        {
          path: 'contact-management',
          name: 'contact-management',
          component: () => import('../views/Admin/ContactManagement.vue'),
          meta: { title: 'Quản lý liên hệ' }
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('../views/Auth/Auth.vue'),
      children : [
        {
          path: '',
          name: 'auth',
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
    },
    {
      path: '/dieu-khoan-dich-vu',
      name: 'dieu-khoan-dich-vu',
      component: () => import('../views/Terms.vue'),
      meta: { title : 'Điều khoản sử dụng'}
    },
    {
      path: '/chinh-sach-bao-mat',
      name: 'chinh-sach-bao-mat',
      component: () => import('../views/PrivacyPolicy.vue'),
      meta: { title : 'Điều khoản sử dụng'}
    },
    {
      path: '/thong-tin-tai-khoan',
      name: 'thong-tin-tai-khoan',
      component: () => import('../views/Profile.vue'),
      meta: { title: 'Thông tin tài khoản' }
    },
  ],
  scrollBehavior(to, from, savePosition){
    return {top: 0}
  }
})

//set title
router.afterEach((to) => {
  document.title = to.meta.title || 'YG Travel';

  //ghi log so luot truy cap
  if(!to.path.startsWith("/admin")){

    const userID = localStorage.getItem('userID') || null;
    apiService.post('/access-log', {
      userID: userID,
      pageURL: to.fullPath
    }).catch(err => {
      console.warn("Lỗi ghi log", err.message);
    })
  }
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
