const express = require('express');
const EtiquetasController = require('../controllers/EtiquetasController');
const authMiddleware = require('../middlewares/auth');

const routes = express.Router();

function checkEtiqueta(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ error: 'Etiqueta é obrigatorio.' });
  }
  return next();
}

function checkIdEtiqueta(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id da etiqueta é obrigatorio.' });
  }
  req.id = id;
  return next();
}

routes.use(authMiddleware);
routes.get('/etiquetas', EtiquetasController.index);
routes.get('/etiquetas/:id', checkIdEtiqueta, EtiquetasController.show);
routes.post('/etiquetas', EtiquetasController.store);
routes.put(
  '/etiquetas/:id',
  checkIdEtiqueta,
  checkEtiqueta,
  EtiquetasController.update
);
routes.delete('/etiquetas/:id', checkIdEtiqueta, EtiquetasController.destroy);

module.exports = routes;
