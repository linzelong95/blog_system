

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
        component: './HomePage/HomePage',
      },
      // {
      //   path: '/frontend',
      //   icon: 'idcard',
      //   name: 'FrontEnd',
      //   component: './Center/Management',
      // },
      // {
      //   path: '/backend',
      //   icon: 'idcard',
      //   name: 'BackEnd',
      //   component: './Center/Management',
      // },
      {
        path: '/articlemanagement',
        icon: 'idcard',
        name: 'ArticleManagement',
        authority: ['admin'],
        component: './ArticleManagement/ArticleManagement',
      },
      {
        path: '/commentmanagement',
        icon: 'idcard',
        name: 'CommentManagement',
        authority: ['admin'],
        component: './CommentManagement/CommentManagement',
      },
      {
        path: '/categorymanagement',
        icon: 'idcard',
        name: 'CategoryManagement',
        authority: ['admin'],
        component: './CategoryManagement/CategoryManagement',
      },
      {
        icon: 'idcard',
        path: '/center',
        name: 'Center',
        component: './CenterPage/CenterPage',
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
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
