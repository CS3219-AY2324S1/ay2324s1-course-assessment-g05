"use strict"
import { SocketEvent } from "@/types/enums";
import { Component, SetStateAction } from "react";
import { Socket, io } from "socket.io-client";

class SocketService {
    socket: Socket;
    roomId: string;

    constructor(roomId: string, endpoint: string, path: string) {
        this.roomId = roomId;
        this.socket = this.createSocket(endpoint, path);        
        this.connectToService();
        this.joinRoom();
    }

    createSocket = (endpoint: string, path: string) => {
        return io(endpoint, { path: path });
    }

    connectToService = () => {
        this.socket.on(SocketEvent.CONNECT, () => {
            console.log("Socket connected to collaboration service");
        });
    }

    getSocket() {
        return this.socket;
    }
    
    getConnectionStatus() {
        return this.socket.connected;
    }

    joinRoom = () => {
        this.socket.emit(SocketEvent.JOIN_ROOM, this.roomId);
    }

    leaveRoom = () => {
        this.socket.emit(SocketEvent.DISCONNECT, this.roomId);
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