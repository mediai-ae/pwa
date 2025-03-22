import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: "/dashboard",
        redirect: "/dashboard/texts",
    },
    {
        path: '/dashboard/texts',
        component: () => import("./views/Texts.vue"),
        name: "texts",
    },
    {
        path: '/dashboard/images',
        component: () => import("./views/Images.vue"),
        name: "images",
    },
    {
        path: '/dashboard/audios',
        component: () => import("./views/Images.vue"),
        name: "audios",
    },
    {
        path: '/dashboard/videos',
        component: () => import("./views/Images.vue"),
        name: "videos",
    },
    // Add more routes here
];
export default createRouter({
    history: createWebHistory(),
    routes,
});
