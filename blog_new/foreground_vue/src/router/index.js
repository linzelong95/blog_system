import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/homepage',
            component: () => import("../pages/Homepage/Homepage.vue"),
            meta: {
                title: '首页'
            }
        },
        {
            path: '/message',
            component: () => import("../pages/Message/Message.vue"),
            meta: {
                title: '留言板'
            }
        },
        {
            path: '/timeline',
            component: () => import("../pages/Timeline/Timeline.vue"),
            meta: {
                title: '时间线'
            }
        },
        {
            path: '/read/:articleId',
            component: () => import("../pages/OneArticle.vue"),
            meta: {
                title: '文章阅读'
            }
        },
        {
            path: '/article',
            component: () => import("../pages/Article/Article.vue"),
            meta: {
                title: '文章管理',
                auth: true,
                role: "admin"
            }
        },
        {
            path: '/msgManagement',
            component: () => import("../pages/Article/Article.vue"),
            meta: {
                title: '留言管理',
                auth: true,
                role: "admin"
            }
        },
        {
            path: '/tag',
            component: () => import("../pages/Tag/Tag.vue"),
            meta: {
                title: '标签管理',
                auth: true,
                role: "admin"
            }
        },
        {
            path: '/category',
            component: () => import("../pages/Category/Category.vue"),
            meta: {
                title: '分类管理',
                auth: true,
                role: "admin"
            }
        },
        {
            path: '/reply',
            component: () => import("../pages/Reply/Reply.vue"),
            meta: {
                title: '回复管理',
                auth: true,
                role: "admin"
            }
        },
        {
            path: '/login',
            component: () => import("../pages/Login.vue"),
            meta: {
                title: '登录'
            }
        },
        {
            path: '/register',
            component: () => import("../pages/Register.vue"),
            meta: {
                title: '注册'
            }
        },
        {
            path: '*',
            redirect: '/homepage'
        },
    ]
});

export default router;