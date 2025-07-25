import Constants from "expo-constants";
import { io } from "socket.io-client";

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL || "";
try{
 const socket = io(SERVER_URL, {
      transports: ["websocket"],
});
}catch (error) {
  console.error("Socket connection failed:", error);
}
export  const socket = io(SERVER_URL, {
      transports: ["websocket"],
});