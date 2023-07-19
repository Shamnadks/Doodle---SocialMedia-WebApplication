import {createContext} from "react";
import { io } from "socket.io-client";
export const socket = io('http://localhost:3001') //'ws://localhost:4000'
export const SocketContext = createContext(); 