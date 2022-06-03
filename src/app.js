const express = require('express');
var http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const route = require('./route.routes');
const io = require('./config/io');

class App {
  constructor() {
    this.server = express();
    this.serverHttp = http.createServer(this.server);

    mongoose.connect(
      //areto@'mongodb+srv://munatasks:102030@munatasks.kmbgs.mongodb.net/munatasks?retryWrites=true&w=majority',
      'mongodb://localhost:27017/web-app',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.middlewares();
    this.routes();

    // io.on('connection', (socket) => {
    //   io.emit('new_task', {teste: 'teste'});
    // });
  }

  middlewares() {
    var corsSettings = {
      origin: '*',
      optionsSuccessStatus: 200,
    };
    this.server.use(express.json());
    this.server.use(cors(corsSettings));
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.server.use(route);
  }
}
const app = new App();

module.exports = { server: app.serverHttp, io: app.io };

