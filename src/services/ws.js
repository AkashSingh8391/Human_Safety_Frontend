// ws.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export function connectWS(onConnect = ()=>{}) {
  if (stompClient && stompClient.connected) return;
  stompClient = new Client({
    webSocketFactory: ()=> new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,
    onConnect: frame => { onConnect(frame); },
    onStompError: frame => console.error("STOMP error", frame)
  });
  stompClient.activate();
  return stompClient;
}

export function subscribeToAlerts(cb) {
  if (!stompClient) return;
  return stompClient.subscribe("/topic/alerts", msg => cb(JSON.parse(msg.body)));
}

export function subscribeToAlert(alertId, cb) {
  if (!stompClient) return;
  return stompClient.subscribe(`/topic/alert/${alertId}`, msg => cb(JSON.parse(msg.body)));
}
