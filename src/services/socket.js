// src/services/socket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export function connect(onConnected, onMessage) {
  // create STOMP client using SockJS
  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    debug: (str) => {
      // console.log(str);
    },
    reconnectDelay: 5000,
  });

  stompClient.onConnect = (frame) => {
    onConnected && onConnected(frame);
  };

  stompClient.onStompError = (frame) => {
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("The message: " + frame.body);
  };

  stompClient.activate();
  return stompClient;
}

export function subscribeToAlerts(onAlert) {
  if (!stompClient) return;
  // subscribe to general alerts topic
  return stompClient.subscribe("/topic/alerts", (message) => {
    const body = JSON.parse(message.body);
    onAlert && onAlert(body);
  });
}

export function subscribeToAlert(alertId, onUpdate) {
  if (!stompClient) return;
  return stompClient.subscribe(`/topic/alert/${alertId}`, (message) => {
    const body = JSON.parse(message.body);
    onUpdate && onUpdate(body);
  });
}

export function disconnect() {
  if (stompClient) stompClient.deactivate();
}
