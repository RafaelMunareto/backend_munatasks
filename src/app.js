const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const route = require('./route.routes');

class App {
  constructor() {
    this.server = express();

    mongoose.connect(
      //'mongodb+srv://munatasks:102030@munatasks.kmbgs.mongodb.net/munatasks?retryWrites=true&w=majority',
       'mongodb://localhost:27017/web-app',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.middlewares();
    this.routes();
  }

  middlewares() {
    var corsSettings = {
      origin: '*',
      optionsSuccessStatus: 200,
    };
    this.server.use(cors(corsSettings));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
    this.server.use(express.json());
  }

  routes() {
    this.server.use(route);
  }
}
const app = new App();

module.exports = app.server;

// module.exports = new App().server;
