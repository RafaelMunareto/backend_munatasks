import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

// import authMiddleware from '../middlewares/auth';
import SessionController from '../controllers/SessionController';
import UserController from '../controllers/UserController';

const routes = new Router();
const upload = multer(uploadConfig);

function checkIdUSer(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Id do usuário é obrigatorio.' });
  }
  req.id = id;
  return next();
}

routes.post('/sessions', SessionController.store);
routes.post('/usuarios', UserController.store);

// routes.use(authMiddleware);
routes.get('/usuarios', UserController.index);
routes.get('/usuarios/:id', checkIdUSer, UserController.show);
routes.put(
  '/usuarios/:id',
  checkIdUSer,
  upload.single('urlImage'),
  UserController.update
);
routes.delete('/usuarios/:id', checkIdUSer, UserController.destroy);

export default routes;
