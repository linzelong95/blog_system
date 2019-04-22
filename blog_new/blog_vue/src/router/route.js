import Homepage from '../pages/Homepage.vue';
import OneArticle from '../pages/OneArticle.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';

const routes= [
  {path:'/homepage',component:Homepage},
  {path:'/read/:id',component:OneArticle},
  {path:'/login',component:Login},
  {path:'/register',component:Register},
  {path:'/',redirect:'/homepage'},
];

export default routes;