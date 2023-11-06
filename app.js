
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require('cors');
app.use(express.static(__dirname + '/public'))
app.use(cors());

const mensajes = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(socket.id);

  // Enviar el historial de mensajes al nuevo usuario que se conecta
  socket.emit('historial de mensajes', mensajes);

  socket.on('chat message', (msg) => {
    // Almacenar el mensaje en el arreglo
    mensajes.push(msg);

    // Emitir el mensaje a todos los usuarios
    io.emit('chat message', msg);
  });

  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});