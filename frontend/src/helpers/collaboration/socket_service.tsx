"use strict"
import { SocketEvent } from "@/types/enums";
import { Component, SetStateAction } from "react";
import { Socket, io } from "socket.io-client";

class SocketService {
    socket: Socket;
    roomId: string;

    constructor(roomId: string) {
        this.roomId = roomId;
        this.socket = this.createSocket();
        
        console.log("Socket created");
        
        this.connectToService();
        this.joinRoom(roomId);
    }



    createSocket = () => {


        const host = `http://localhost:5300`;

        return io(host);

        // Not sure why it can't detect this...

        // const host =
        //     process.env.NODE_ENV == "production"
        //     ? process.env.ENDPOINT_PROD
        //     : process.env.ENDPOINT_DEV;
    
        // const servicePort = process.env.ENDPOINT_COLLABORATION_PORT
    
        // return io(`http://${host}:${servicePort}`);
    }

    connectToService = () => {
        this.socket.on(SocketEvent.CONNECT, () => {
            console.log("Socket connected to collaboration service");
        });
    }

    getSocket() {
        return this.socket;
    }

    joinRoom = (roomId: string) => {
        this.socket.emit(SocketEvent.JOIN_ROOM, roomId);
    }

    leaveRoom = (roomId: string) => {
        this.socket.emit(SocketEvent.DISCONNECT, roomId);
    }

    sendCodeChange = (content: string) => {
        console.log("Code change: " , content);
        this.socket.emit(SocketEvent.CODE_CHANGE, { roomId: this.roomId, content: content });
    }

    receiveCodeUpdate = (setCurrentCode: React.Dispatch<React.SetStateAction<string>>) => {
        console.log("Code updating..");
        this.socket.on(SocketEvent.CODE_UPDATE, (content: string) => {
            setCurrentCode(content);
        });
    }

}

export default SocketService;