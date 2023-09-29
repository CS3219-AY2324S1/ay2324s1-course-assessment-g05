import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Socket } from "socket.io";
import cors, { corsOptions } from "./middleware/cors";
import { SocketEvent } from "./lib/enums/SocketEvent";

dotenv.config();

const app: Express = express();
const http = require('http');
const { Server } = require("socket.io");

app.use(cors);

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions,
})

io.on(SocketEvent.CONNECTION, (socket: Socket) => {
    console.log("a user connected: ", socket.id); // Log the user that connected

    socket.on(SocketEvent.JOIN_ROOM, (roomID)=> {
        console.log("user joined room: ", roomID, socket.id)
        socket.join(roomID);
    })

    socket.on(SocketEvent.CODE_CHANGE, (editorDict: { roomId: string, content: string}) => {
        socket.to(editorDict.roomId).emit(SocketEvent.CODE_UPDATE, editorDict.content);
    })

    socket.on(SocketEvent.DISCONNECT, () => {
        console.log("user disconnected", socket.id);
    })
})

server.listen(process.env.SERVICE_PORT, () => {
  console.log(`Server running on port ${process.env.SERVICE_PORT}`);
});




