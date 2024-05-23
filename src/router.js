import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/test', name: '', component: () => import('@/pages/testPage1.vue') },
    { path: '/test2', name: '', component: () => import('@/pages/testPage2.vue') }

];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
