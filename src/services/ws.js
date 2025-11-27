// src/services/ws.js

let socket = null;
let isConnected = false;

// Store listeners
let allAlertListeners = [];
let singleAlertListeners = {}; // { alertId: [callbacks...] }

// ----------------------
// CONNECT WEBSOCKET
// ----------------------
export function connectWS(onConnected = () => {}) {
  if (socket && isConnected) return;

  socket = new WebSocket("ws://localhost:8080/ws"); // Backend WS URL

  socket.onopen = () => {
    console.log("WebSocket Connected");
    isConnected = true;
    onConnected();
  };

  socket.onclose = () => {
    console.log("WebSocket Disconnected");
    isConnected = false;
  };

  socket.onerror = (err) => {
    console.error("WebSocket Error:", err);
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      // 1️⃣ Broadcast to ALL alert listeners
      allAlertListeners.forEach((cb) => cb(msg));

      // 2️⃣ Broadcast to specific alert listeners
      const alertId = msg.id;
      if (singleAlertListeners[alertId]) {
        singleAlertListeners[alertId].forEach((cb) => cb(msg));
      }

    } catch (e) {
      console.error("Invalid WS Message:", event.data);
    }
  };
}

// ----------------------
// SUBSCRIBE TO ALL ALERTS
// ----------------------
export function subscribeToAllAlerts(callback) {
  allAlertListeners.push(callback);
}

// ----------------------
// SUBSCRIBE TO ONE ALERT
// ----------------------
export function subscribeToSingleAlert(alertId, callback) {
  if (!singleAlertListeners[alertId]) {
    singleAlertListeners[alertId] = [];
  }
  singleAlertListeners[alertId].push(callback);
}

// ----------------------
// SEND LOCATION FROM CIVIL
// ----------------------
export function sendLocationWS(data) {
  if (socket && isConnected) {
    socket.send(JSON.stringify(data));
  }
}

// ----------------------
// DISCONNECT
// ----------------------
export function disconnectWS() {
  if (socket) {
    socket.close();
    socket = null;
    isConnected = false;
  }
}
