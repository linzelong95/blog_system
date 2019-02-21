

export default [


  // user
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
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [

      { path: '/', redirect: '/center/management' },
      // 基础数据管理
      // {
      //   path: '/BasicDataManagement',
      //   icon: 'shopping-cart',
      //   name: 'BasicDataManagement',
      //   routes: [
      //     {
      //       path: '/BasicDataManagement/BasicCategory',
      //       name: 'BasicCategory',
      //       component: './BasicDataManagement/BasicCategory',
      //     },
      //     {
      //       path: '/BasicDataManagement/Unit',
      //       name: 'Unit',
      //       component: './BasicDataManagement/Unit',
      //     },
      //     {
      //       path: '/BasicDataManagement/UnitConvert',
      //       name: 'UnitConvert',
      //       component: './BasicDataManagement/UnitConvert',
      //     },
      //   ],
      // },
      // // 商品管理
      // {
      //   path: '/commoditymanagement',
      //   icon: 'form',
      //   name: 'commoditymanagement',
      //   routes: [
      //     {
      //       path: '/commoditymanagement/insellinggoods',
      //       name: 'insellinggoods',
      //       component: './CommodityManagement/InSellingGoods',
      //     },
      //     {
      //       path: '/commoditymanagement/brandmanagement',
      //       name: 'brandmanagement',
      //       component: './CommodityManagement/BrandManagement',
      //     },
      //     {
      //       path: '/commoditymanagement/commodityseries',
      //       name: 'commodityseries',
      //       component: './CommodityManagement/CommoditySeries',
      //     },
      //     {
      //       path: '/commoditymanagement/categoryattribute',
      //       name: 'categoryattribute',
      //       component: './CommodityManagement/CategoryAttribute',
      //     },
      //     {
      //       path: '/commoditymanagement/attributemanagement',
      //       name: 'attributemanagement',
      //       component: './CommodityManagement/AttributeManagement',
      //     },
      //     {
      //       path: '/commoditymanagement/attributevaluemanagement',
      //       name: 'attributevaluemanagement',
      //       component: './CommodityManagement/AttributeValueManagement',
      //     },
      //   ],
      // },
      // // 订单管理
      // {
      //   path: '/ordermanagement',
      //   icon: 'shopping-cart',
      //   name: 'ordermanagement',
      //   routes: [
      //     {
      //       path: '/ordermanagement/orderlist',
      //       name: 'orderlist',
      //       component: './OrderManagement/OrderList',
      //     },
      //     {
      //       path: '/ordermanagement/afterservice',
      //       name: 'afterservice',
      //       component: './OrderManagement/AfterService',
      //     },
      //   ],
      // },
      // // 营销管理
      // {
      //   path: '/marketingmanagement',
      //   icon: 'shop',
      //   name: 'marketingmanagement',
      //   routes: [
      //     {
      //       path: '/marketingmanagement/coupon',
      //       name: 'coupon',
      //       component: './MarketingManagement/Coupon',
      //     },
      //     {
      //       path: '/marketingmanagement/timelimitpurchase',
      //       name: 'timelimitpurchase',
      //       component: './MarketingManagement/TimeLimitPurchase',
      //     },
      //     {
      //       path: '/marketingmanagement/grouppurchase',
      //       name: 'grouppurchase',
      //       component: './MarketingManagement/GroupPurchase',
      //     },
      //     {
      //       path: '/marketingmanagement/promotionpurchase',
      //       name: 'promotionpurchase',
      //       component: './MarketingManagement/promotionpurchase',
      //     },
      //     {
      //       path: '/marketingmanagement/specialprice',
      //       name: 'specialprice',
      //       component: './MarketingManagement/SpecialPrice',
      //     },
      //     {
      //       path: '/marketingmanagement/commoditycombination',
      //       name: 'commoditycombination',
      //       component: './MarketingManagement/CommodityCombination',
      //     },
      //   ],
      // },
      // // 消息管理
      // {
      //   path: '/messagemanagement',
      //   icon: 'message',
      //   name: 'messagemanagement',
      //   routes: [
      //     {
      //       path: '/messagemanagement/letter',
      //       name: 'letter',
      //       component: './MessageManagement/Letter',
      //     },
      //     {
      //       path: '/messagemanagement/commodityevaluation',
      //       name: 'commodityevaluation',
      //       component: './MessageManagement/CommodityEvaluation',
      //     },
      //   ],
      // },
      // // 物流管理
      // {
      //   path: '/distributionmanagement',
      //   icon: 'car',
      //   name: 'distributionmanagement',
      //   routes: [
      //     {
      //       path: '/distributionmanagement/warehouse',
      //       name: 'warehouse',
      //       component: './DistributionManagement/Warehouse',
      //     },
      //     {
      //       path: '/distributionmanagement/express',
      //       name: 'express',
      //       component: './DistributionManagement/Express',
      //     },
      //     {
      //       path: '/distributionmanagement/distributiontemplate',
      //       name: 'distributiontemplate',
      //       component: './DistributionManagement/DistributionTemplate',
      //     },
      //     {
      //       path: '/distributionmanagement/distributionmode',
      //       name: 'distributionmode',
      //       component: './DistributionManagement/DistributionMode',
      //     },
      //   ],
      // },
      // // 权限管理
      // {
      //   path: '/permissionmanagement',
      //   icon: 'idcard',
      //   name: 'permissionmanagement',
      //   routes: [
      //     {
      //       path: '/permissionmanagement/role',
      //       name: 'role',
      //       component: './PermissionManagement/Role',
      //     },
      //     {
      //       path: '/permissionmanagement/authorize',
      //       name: 'authorize',
      //       component: './PermissionManagement/Authorize',
      //     },
      //     {
      //       path: '/permissionmanagement/managerlog',
      //       name: 'managerlog',
      //       component: './PermissionManagement/ManagerLog',
      //     },
      //   ],
      // },
      // {
      //   path: '/shopmanagement',
      //   icon: 'idcard',
      //   name: 'ShopManagement',
      //   routes: [
      //     {
      //       path: '/shopmanagement/shownav',
      //       name: 'ShowNav',
      //       component: './ShopManagement/ShowNav',
      //     },
      //     {
      //       path: '/shopmanagement/module',
      //       name: 'Module',
      //       component: './ShopManagement/Module',
      //     },
      //   ],
      // },

      {
        path: '/index',
        icon: 'idcard',
        name: 'Index',
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
        path: '/categorymanagement',
        icon: 'idcard',
        name: 'CategoryManagement',
        authority: ['admin'],
        component: './CategoryManagement/CategoryManagement',
      },
      // 个人中心
      {
        // path: '/center',
        icon: 'idcard',
        // name: 'center',

        path: '/center/management',
        name: 'management',
        component: './Center/Management',

        // routes: [
        //   {
        //     path: '/center/management',
        //     name: 'management',
        //     component: './Center/Management',
        //   },
        // ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
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
          // exception
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
