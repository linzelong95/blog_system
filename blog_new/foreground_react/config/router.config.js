

export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: '/index' },
      {
        path: '/index',
        icon: 'idcard',
        name: 'HomePage',
        hideInMenu: true,
        component: './HomePage/HomePage',
      },
      {
        path: '/article/:id',
        icon: 'idcard',
        name: 'OneArticle',
        target:"_blank",
        hideInMenu: true,
        component: './OneArticle/OneArticle',
      },
      {
        path: '/articlemanagement',
        icon: 'idcard',
        name: 'ArticleManagement',
        authority: ['admin'],
        component: './ArticleManagement/ArticleManagement',
      },
      {
        path: '/replymanagement',
        icon: 'idcard',
        name: 'ReplyManagement',
        authority: ['admin'],
        component: './ReplyManagement/ReplyManagement',
      },
      {
        path: '/categorymanagement',
        icon: 'idcard',
        name: 'CategoryManagement',
        authority: ['admin'],
        component: './CategoryManagement/CategoryManagement',
      },
      {
        path: '/tagmanagement',
        icon: 'idcard',
        name: 'TagManagement',
        authority: ['admin'],
        component: './TagManagement/TagManagement',
      },
      {
        icon: 'idcard',
        path: '/center',
        name: 'Center',
        hideInMenu: true,
        component: './CenterPage/CenterPage',
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
