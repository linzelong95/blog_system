import Homepage from '../pages/Homepage.vue';
import OneArticle from '../pages/OneArticle.vue'

const routes= [
  {path:'/homepage',component:Homepage},
  {path:'/article/:id',component:OneArticle},
  {path:'/',redirect:'/homepage'},
];

export default routes;