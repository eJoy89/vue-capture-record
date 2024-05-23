import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/test', name: 'TestPage', component: () => import('@/pages/testPage1.vue') }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
