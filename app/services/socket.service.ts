import io from "socket.io-client";

export default function getSocket({ idCallback = (id: string) => {}, fenCallback = (fen: string) => {} }) {
  const socket = io("http://localhost:8080"); //io("https://ajj-test.azurewebsites.net");

  // Callbacks
  socket.on("id", (payload) => {
    idCallback && idCallback(payload);
  });

  socket.on("fen", (payload) => {
    fenCallback && fenCallback(payload);
  });

  return socket;
}
