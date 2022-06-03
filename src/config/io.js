
const ServerIo = require('socket.io');
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
httpServer.listen(3030);
var io = this.io = ServerIo(httpServer, {
    allowEIO3: true, 
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    
});
  io.on('connection', (socket) => {
    socket.on('newTaskFront', () => {
      io.emit('new_task', {newTarefa: true});
    });
    socket.on('updateList', () => {
      io.emit('updateList', {updated: true});
    });
  });


module.exports = io;
