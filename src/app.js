const express = require('express');
var http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const route = require('./route.routes');
const ServerIo = require('socket.io');

class App {
  constructor() {
    this.server = express();
    this.serverHttp = http.createServer(this.server);

    mongoose.connect(
      'mongodb+srv://munatasks:102030@munatasks.kmbgs.mongodb.net/munatasks?retryWrites=true&w=majority',
      //'mongodb://localhost:27017/web-app',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    this.middlewares();
    this.routes();

    this.io = ServerIo(this.serverHttp, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log(socket.id);
    });
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

module.exports = { server: app.serverHttp, io: app.io };

// module.exports = new App().server;
