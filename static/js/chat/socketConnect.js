import { config } from "../config/config.js";

const socket = io(`${config.protocol}://${config.host}:${config.port}`);

socket.on('connect', function () {
  socket.emit("joinRoom");
});

export { socket };
