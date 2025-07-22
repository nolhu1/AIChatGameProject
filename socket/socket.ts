import Constants from "expo-constants";
import { io } from "socket.io-client";

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL || "";
export const socket = io(SERVER_URL, {
      transports: ["websocket"],
});