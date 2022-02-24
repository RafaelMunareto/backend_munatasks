import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import user_routes from './routes/user.routes';
import etiqueta_routes from './routes/etiquetas.routes';
import perfil_routes from './routes/perfil.routes';
import settings_routes from './routes/settings.routes';
import tasks_routes from './routes/tasks.routes';

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
