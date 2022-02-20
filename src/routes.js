import { Router } from 'express';
const routes = new Router();
 
  routes.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);
  
    return next();
  });

export default routes;