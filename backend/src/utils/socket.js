const { Server } = require("socket.io");

let io;

/**
 * Initialize Socket.IO server
 * @param {Object} server - HTTP server instance
 */
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✔️ Socket connected: ${socket.id}`);

    // Join user to their personal room
    socket.on("join-room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get Socket.IO instance
 * @returns {Object} Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};
