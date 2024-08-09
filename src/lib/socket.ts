import { io } from "socket.io-client";
import { WS_URL } from "./constants";

const URL = WS_URL;

export const socket = io(URL);