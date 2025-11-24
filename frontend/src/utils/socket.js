import { io } from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (socketInstance) return socketInstance;

  try {
    const raw = localStorage.getItem("users");
    const parsed = raw ? JSON.parse(raw) : null;
    const token = parsed?.token;

    socketInstance = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });
  } catch (_e) {
    socketInstance = io("http://localhost:5000");
  }

  return socketInstance;
};