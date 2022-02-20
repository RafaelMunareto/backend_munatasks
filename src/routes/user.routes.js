import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import UserController from '../controllers/UserController';
import User from '../models/User';

const routes = new Router();
const upload = multer(uploadConfig);

  function checkUser(req, res, next) {
    if (!req.body) {
      return res.status(400).json({ error: "Usuário é obrigatorio." });
    }
    return next();
  }
  function checkIdUSer(req, res, next) {
    const {id} = req.params;

    if(!id){
      return res.status(400).json({ error: "Id do usuário é obrigatorio." });
    }
    req.id = id; 
    return next();
  }


  routes.get('/usuarios', UserController.index);
  routes.get('/usuarios/:id', checkIdUSer, UserController.show);
  routes.post('/usuarios', checkUser, upload.single('urlImage'), UserController.store);
  routes.put('/usuarios/:id', checkIdUSer, upload.single('urlImage'), UserController.update);
  routes.delete('/usuarios/:id', checkIdUSer, UserController.destroy);


export default routes;