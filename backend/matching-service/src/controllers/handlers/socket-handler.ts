import {Server, Socket} from 'socket.io';

export const SocketHandler = (socket: Socket) => {
    console.log("Socket connected: " + socket.id);

    socket.on("matching", (data:any) => {
        console.log("handle matching");
    });
}

export default SocketHandler;