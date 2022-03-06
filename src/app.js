const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const route = require('./route.routes');

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
    this.server.use(route);
  }
}

module.exports = new App().server;
