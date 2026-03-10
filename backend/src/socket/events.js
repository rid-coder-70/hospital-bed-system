
function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('subscribeHospital', (hospitalId) => {
      socket.join(`hospital:${hospitalId}`);
      console.log(`Socket ${socket.id} subscribed to hospital:${hospitalId}`);
    });

    socket.on('unsubscribeHospital', (hospitalId) => {
      socket.leave(`hospital:${hospitalId}`);
    });
    socket.on('joinDispatcher', () => {
      socket.join('dispatchers');
      console.log(`Socket ${socket.id} joined dispatchers room`);
    });
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
    });
  });
}

module.exports = { registerSocketEvents };
