const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer();
const io = socketIO(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', socket => {
  socket.on('joinRoom', ({displayName, roomId}) => {
    socket.join(roomId);

    socket.emit('updateChat', {
      displayName: 'BOT',
      message: `${displayName}, Welcome to the chat`
    });

    io.to(roomId).emit('updateChat', {
      displayName: 'BOT',
      message: `${displayName} has joined the chat`
    });
  });

  socket.on('chatMessage', (data) => {
    io.to(data.roomId).emit('updateChat', data);
  })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
