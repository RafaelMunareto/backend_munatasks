const express = require('express');
const multer = require('multer');
const SessionController = require('./controllers/SessionController');
const SettingsController = require('./controllers/SettingsController');
const TasksController = require('./controllers/TasksController');
const UserController = require('./controllers/UserController');
const authMiddleware = require('./middlewares/auth');
const uploadConfig = require('./config/upload');
const EtiquetasController = require('./controllers/EtiquetasController');
const PerfilController = require('./controllers/PerfilController');
const RedirectDeepLinkController = require('./controllers/RedirectDeepLinkController');

const routes = express.Router();
const upload = multer(uploadConfig);

function checkBody(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ error: 'Sem dados para salvar.' });
  }
  return next();
}

function checkId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Id obrigatorio.' });
  }
  req.id = id;
  return next();
}

routes.post('/sessions', SessionController.store);
routes.post('/usuarios', UserController.store);
routes.get('/perfil/:id', checkId, PerfilController.show);
routes.get('/usuarios/email/:id', checkId, UserController.showEmail);
routes.get('/usuarios/:id', checkId, UserController.show);
routes.get('/redirect_veacos', RedirectDeepLinkController.redirectVeacos);
routes.get('/perfil', PerfilController.index);
routes.get(
  '/usuarios/mail/change_password/:email',
  UserController.sendChangePasswordmail
);
routes.put('/usuarios/change_password/:id', UserController.updatePassword);
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


routes.use(authMiddleware);
routes.get('/perfil/user/:id', checkId, PerfilController.showUser);
routes.get('/usuarios', UserController.index);
routes.put('/usuarios/:id', checkId, UserController.update);
routes.put('/usuarios/user/:id', checkId, UserController.updateUserName);
routes.delete('/usuarios/:id', checkId, UserController.destroy);

routes.get('/etiquetas', EtiquetasController.index);
routes.get('/etiquetas/:id', checkId, EtiquetasController.show);
routes.post('/etiquetas', EtiquetasController.store);
routes.put('/etiquetas/:id', checkBody, checkId, EtiquetasController.update);
routes.delete('/etiquetas/:id', checkId, EtiquetasController.destroy);

routes.get('/settings', SettingsController.index);
routes.get('/settings/:id', checkId, SettingsController.show);
routes.post('/settings', SettingsController.store);
routes.put('/settings/:id', checkBody, checkId, SettingsController.update);
routes.delete('/settings/:id', checkId, SettingsController.destroy);

routes.get('/tasks/individual/:id', checkId, TasksController.index);
routes.get('/tasks/total/:id', checkId, TasksController.total);
routes.get('/tasks/fase/:id/:fase', checkId, TasksController.fase);
routes.get('/tasks/:id', checkId, TasksController.show);
routes.get('/tasks', TasksController.indexTotal);
routes.post('/tasks', TasksController.store);
routes.put('/tasks/:id', checkBody, checkId, TasksController.update);
routes.get('/tasks/filter_user/:id', checkId, TasksController.tasksFilterUser);
routes.delete('/tasks/:id', checkId, TasksController.destroy);
routes.get('/tasks/new_email/:id/:tipo', checkId, TasksController.sendNewTarefa);

routes.get('/tasks/notifications/:id', checkId, TasksController.notifications);
routes.delete(
  '/tasks/notifications/:id',
  checkId,
  TasksController.notificationsDelete
);


routes.get('/perfil/settingsUser/:id', checkId, PerfilController.settingsUser);
routes.put('/perfil/settingsUser/:id', checkBody, checkId, PerfilController.settingsUserUpdate);
routes.post('/perfil/settingsUser', checkBody, PerfilController.settingsUserStore);

routes.delete('/perfil/:id', checkId, PerfilController.destroy);

module.exports = routes;
