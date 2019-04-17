import Homepage from '../components/Homepage.vue';

const routes= [
  {path:'/homepage',component:Homepage},
  {path:'/',redirect:'/homepage'},
];

export default routes;