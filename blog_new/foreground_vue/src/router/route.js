import Homepage from '../pages/Homepage/Homepage.vue';
import OneArticle from '../pages/OneArticle.vue';
import Article from '../pages/Article/Article.vue';
import Tag from '../pages/Tag/Tag.vue';
import Category from '../pages/Category/Category.vue';
import Reply from '../pages/Reply/Reply.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

const routes = [
  {
    path: '/homepage',
    component: Homepage,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/read/:articleId',
    component: OneArticle,
    meta: {
      title: '文章阅读'
    }
  },
  {
    path: '/article',
    component: Article,
    meta: {
      title: '文章管理',
      auth: true,
      role: "admin"
    }
  },
  {
    path: '/tag',
    component: Tag,
    meta: {
      title: '标签管理',
      auth: true,
      role: "admin"
    }
  },
  {
    path: '/category',
    component: Category,
    meta: {
      title: '分类管理',
      auth: true,
      role: "admin"
    }
  },
  {
    path: '/reply',
    component: Reply,
    meta: {
      title: '回复管理',
      auth: true,
      role: "admin"
    }
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: Register,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/',
    redirect: '/homepage'
  },
];

export default routes;