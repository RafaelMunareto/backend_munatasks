import { Router } from 'express';
import EtiquetasController from '../controllers/EtiquetasController';
import SessionController from '../controllers/SessionController';


const routes = new Router();
 
  //midlewares global
  routes.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);
  
    return next();
  });

  //session
  routes.post('/sessions', SessionController.store);



  //etiquetas
  //midlewares das etiquetas  
  function checkEtiqueta(req, res, next) {
    if (!req.body) {
      return res.status(400).json({ error: "Etiqueta é obrigatorio." });
    }
    return next();
  }
  
  function checkIndexEtiqueta(req, res, next) {
    const {id} = etiquetas[req.params.checkIndexEtiqueta];
    if (!id) {
      return res.status(400).json({ error: "Etiqueta não existe." });
    }
    req.id = id;
    return next();
  }

  //routes
  routes.get("/etiquetas", EtiquetasController.index);
  routes.get("/etiquetas/:id", checkIndexEtiqueta, EtiquetasController.show);
  routes.post("/etiquetas",  EtiquetasController.store)
  routes.put("/etiquetas/:index", checkIndexEtiqueta, checkEtiqueta, EtiquetasController.update);
  routes.delete("/etiquetas/:index", checkIndexEtiqueta, EtiquetasController.delete);
  

export default routes;