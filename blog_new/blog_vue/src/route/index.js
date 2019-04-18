import Homepage from '../components/Homepage.vue';
import OneArticle from '../components/OneArticle.vue'

const routes= [
  {path:'/homepage',component:Homepage},
  {path:'/article/:id',component:OneArticle},
  {path:'/',redirect:'/homepage'},
];

export default routes;