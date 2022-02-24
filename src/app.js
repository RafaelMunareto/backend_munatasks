const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const user_routes = require('./routes/user.routes');
const etiqueta_routes = require('./routes/etiquetas.routes');
const perfil_routes = require('./routes/perfil.routes');
const settings_routes = require('./routes/settings.routes');
const tasks_routes = require('./routes/tasks.routes');

class App {
  constructor() {
    this.server = express();

    mongoose.connect(
      'mongodb+srv://munatasks:102030@munatasks.kmbgs.mongodb.net/munatasks?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
    this.server.use(express.json());
  }

  routes() {
    this.server.use(user_routes);
    this.server.use(etiqueta_routes);
    this.server.use(perfil_routes);
    this.server.use(settings_routes);
    this.server.use(tasks_routes);
  }
}

export default new App().server;
