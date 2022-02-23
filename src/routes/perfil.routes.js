import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import PerfilController from '../controllers/PerfilController';
import authMiddleware from '../middlewares/auth';

const routes = new Router();
const upload = multer(uploadConfig);

function checkBody(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ error: 'Usuário é obrigatorio.' });
  }
  return next();
}
function checkId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Id do usuário é obrigatorio.' });
  }
  req.id = id;
  return next();
}
routes.use(authMiddleware);
routes.get('/perfil', PerfilController.index);
routes.get('/perfil/:id', checkId, PerfilController.show);
routes.post(
  '/perfil',
  checkBody,
  upload.single('urlImage'),
  PerfilController.store
);
routes.put(
  '/perfil/:id',
  checkId,
  upload.single('urlImage'),
  PerfilController.update
);
routes.delete('/perfil/:id', checkId, PerfilController.destroy);

export default routes;
