import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/app/layouts/MainLayout.vue'),
      meta: {
        middleware: 'auth',
      },
      children: [
        {
          path: '/app',
          redirect: '/app/texts',
        },
        {
          path: '/app/texts',
          name: 'texts',
          component: () => import('@/app/views/Texts.vue'),
        },
        {
          path: '/app/images',
          name: 'images',
          component: () => import('@/app/views/Images.vue'),
        },
        {
          path: '/app/audios',
          name: 'audios',
          component: () => import('@/app/views/Images.vue'),
        },
        {
          path: '/app/videos',
          name: 'videos',
          component: () => import('@/app/views/Texts.vue'),
        },
      ],
    },
    {
      path: '/app/sign-in',
      name: 'sign-in',
      component: () => import('@/app/views/Login.vue'),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.meta.middleware === 'auth';
  const isLoggedIn = !!localStorage.getItem('user');

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'sign-in' });
    // next()
  } else {
    next();
  }
});

export default router;
