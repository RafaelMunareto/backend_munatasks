const express = require('express');
const authMiddleware = require('../middlewares/auth');
const TasksController = require('../controllers/TasksController');

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
routes.get('/tasks', TasksController.index);
routes.get('/tasks/total', TasksController.total);
routes.get('/tasks/fase/:fase', TasksController.fase);
routes.get('/tasks/:id', checkId, TasksController.show);
routes.post('/tasks', TasksController.store);
routes.put('/tasks/:id', checkBody, checkId, TasksController.update);
routes.delete('/tasks/:id', checkId, TasksController.destroy);

export default routes;
