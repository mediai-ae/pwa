import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/app',
      name: 'home',
      redirect: { name: 'texts'},
      component: () => import('@/app/layouts/MainLayout.vue'),
      meta: {
        middleware: 'auth',
      },
      children: [
        {
          path: 'tokens',
          name: 'tokens',
          component: () => import('@/app/views/Tokens.vue'),
        },
        {
          path: "media",
          name: "media-layout",
          component: () => import("@/app/layouts/MediaLayout.vue"),
          children: [
            {
              path: 'texts',
              name: 'texts',
              component: () => import('@/app/views/Media.vue'),
            },
            {
              path: 'images',
              name: 'images',
              component: () => import('@/app/views/Media.vue'),
            },
            {
              path: 'audios',
              name: 'audios',
              component: () => import('@/app/views/Media.vue'),
            },
            {
              path: 'videos',
              name: 'videos',
              component: () => import('@/app/views/Media.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/sign-in',
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
  } else {
    next();
  }
});

export default router;
