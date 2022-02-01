import { protocol, host, port } from "../config.json";

const socket = io(`${protocol}://${host}:${port}`);

socket.on('connect', function () {
  socket.emit("joinRoom");
});
