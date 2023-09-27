import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Socket } from "socket.io";

dotenv.config();

const app: Express = express();
const http = require('http');
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { 
        origin: '*', // For development purposes only
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket: Socket) => {
    console.log("a user connected: ", socket.id); // Log the user that connected

    socket.on("join room", (roomID: string) => {
        console.log("user joined room: ", roomID, socket.id)
        socket.join(roomID);
    })

    // socket.on("send message", (msg: { roomId: string, author: string, message: string, time: string}) => {
    //     console.log("message:");
    //     console.log(msg)
    //     socket.to(msg.roomId).emit("receive message", msg);
    // })
    socket.on("code change", (editorDict: { roomId: string, content: string}) => {
        socket.to(editorDict.roomId).emit("code update", editorDict.content);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    })
})


server.listen(process.env.SERVICE_PORT, () => {
  console.log(`Server running on port ${process.env.SERVICE_PORT}`);
});


