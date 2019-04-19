import Homepage from '../pages/Homepage.vue';
import OneArticle from '../pages/OneArticle.vue';
import Login from '../pages/Login.vue';

const routes= [
  {path:'/homepage',component:Homepage},
  {path:'/read/:id',component:OneArticle},
  {path:'/login',component:Login},
  {path:'/',redirect:'/homepage'},
];

export default routes;