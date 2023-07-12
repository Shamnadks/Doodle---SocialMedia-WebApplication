import {createContext} from "react";
import { io } from "socket.io-client";
export const socket = io('ws://localhost:4000') //'ws://localhost:4000'
export const SocketContext = createContext(); 