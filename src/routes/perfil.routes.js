const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth');
const uploadConfig = require('../config/upload');
const PerfilController = require('../controllers/PerfilController');

const routes = express.Router();

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
routes.get('/perfil/:id', checkId, PerfilController.show);
routes.get('/perfil', PerfilController.index);
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

module.exports = routes;
