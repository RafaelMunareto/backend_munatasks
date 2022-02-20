import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import user_routes from './routes/user.routes';
import etiqueta_routes from './routes/etiquetas.routes';
import path from 'path';

class App{

  constructor(){
    this.server = express();

    mongoose.connect('mongodb+srv://munatasks:102030@munatasks.kmbgs.mongodb.net/munatasks?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.middlewares();
    this.routes();
  }

  middlewares(){
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
    this.server.use(express.json());
  }

  routes(){
    this.server.use(routes);
    this.server.use(user_routes);
    this.server.use(etiqueta_routes);
  }

}

export default new App().server;
