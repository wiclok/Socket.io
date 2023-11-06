const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors');

app.use(express.static(__dirname + '/public'));
app.use(cors());

const mensajes = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id);

  // Emitir el historial de mensajes al nuevo cliente
  socket.emit('historial de mensajes', mensajes);

  socket.on('message', (data) => {
    var name = data.name;
    var message = data.message;
    if (name && message) {
      mensajes.push({ name: name, message: message });
      io.emit('message', { name: name, message: message });

      // Almacenar el mensaje en el array
    }
  });

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', { typing: data.typing, name: data.name });
  });

  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
