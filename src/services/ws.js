let socket = null;

export const connectWS = () => {
  socket = new WebSocket("ws://localhost:8080/ws/location");

  socket.onopen = () => console.log("WS Connected");
  socket.onclose = () => console.log("WS Disconnected");
};

export const sendLocationWS = (alertId, lat, lng) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({ alertId, lat, lng }));
};

export const onLocationUpdate = (callback) => {
  if (!socket) return;

  socket.onmessage = (msg) => {
    callback(JSON.parse(msg.data));
  };
};
