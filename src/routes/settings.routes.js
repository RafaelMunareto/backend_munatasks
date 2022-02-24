const express = require('express');
const SettingsController = require('../controllers/SettingsController');
const authMiddleware = require('../middlewares/auth');

const routes = express.Router();

function checkBody(req, res, next) {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: 'Dados para salvamento obrigatórios.' });
  }
  return next();
}

function checkId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id é obrigatorio.' });
  }
  req.id = id;
  return next();
}

routes.use(authMiddleware);
routes.get('/settings', SettingsController.index);
routes.get('/settings/:id', checkId, SettingsController.show);
routes.post('/settings', SettingsController.store);
routes.put('/settings/:id', checkBody, checkId, SettingsController.update);
routes.delete('/settings/:id', checkId, SettingsController.destroy);

export default routes;
