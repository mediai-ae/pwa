import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/dashboard/layouts/MainLayout.vue'),
            meta: {
                middleware: 'auth',
            },
            children: [
                {
                    path: '/dashboard',
                    redirect: '/dashboard/texts',
                },
                {
                    path: '/dashboard/texts',
                    name: 'texts',
                    component: () => import('@/dashboard/views/Texts.vue'),
                },
                {
                    path: '/dashboard/images',
                    name: 'images',
                    component: () => import('@/dashboard/views/Images.vue'),
                },
                {
                    path: '/dashboard/audios',
                    name: 'audios',
                    component: () => import('@/dashboard/views/Images.vue'),
                },
                {
                    path: '/dashboard/videos',
                    name: 'videos',
                    component: () => import('@/dashboard/views/Texts.vue'),
                },
            ],
        },
        {
            path: '/dashboard/login',
            name: 'login',
            component: () => import('@/dashboard/views/Login.vue'),
        },
    ],
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.middleware === 'auth'
    const isLoggedIn = !!localStorage.getItem('user')

    if (requiresAuth && !isLoggedIn) {
        next({ name: 'login' })
        // next()
    } else {
        next()
    }
})

export default router
