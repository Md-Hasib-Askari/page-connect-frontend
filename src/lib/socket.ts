import { io } from "socket.io-client";

const URL = 'ws://localhost:80';

export const socket = io(URL);