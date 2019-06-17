module.exports = {
  // navTheme: 'dark', // theme for nav menu
  // primaryColor: '#1890FF', // primary color of ant design
  // layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  // contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  // fixedHeader: false, // sticky header
  // autoHideHeader: false, // auto hide header
  // fixSiderbar: false, // sticky siderbar

  navTheme: 'light',
  primaryColor: '#1890FF',
  layout: 'topmenu',
  contentWidth: 'Fixed',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  collapse: true,

  adminType: 'blog',
  adminName: { zh_CN: '向上的博客', en_US: 'blog', code: 1 },
  imgPrefix: process.env.NODE_ENV === "production" ? 'http://120.78.139.146:7001' : 'http://127.0.0.1:7001',
  uploadPrefix: process.env.NODE_ENV === "production" ? 'http://120.78.139.146:7001' : "http://127.0.0.1:7001",
  mobileUrl: 'http://120.78.139.146:8089'
};
