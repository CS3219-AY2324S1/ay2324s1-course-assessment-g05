import { Server, Socket } from "socket.io";
import { SocketEvent } from "../../lib/enums/SocketEvent";

export const SocketHandler = (socket: Socket) => {
  console.log("a user connected: ", socket.id); // Log the user that connected

  socket.on(SocketEvent.JOIN_ROOM, (roomID) => {
    console.log("user joined room: ", roomID, socket.id);
    socket.join(roomID);
  });

  socket.on(
    SocketEvent.CODE_CHANGE,
    (editorDict: { roomId: string; content: string }) => {
      socket
        .to(editorDict.roomId)
        .emit(SocketEvent.CODE_UPDATE, editorDict.content);
    }
  );

  socket.on(SocketEvent.DISCONNECT, () => {
    console.log("user disconnected", socket.id);
  });

  socket.on(
    SocketEvent.SEND_CHAT_MESSAGE,
    (messageDict: {
      roomId: string;
      message: { uuid: string; content: string; senderId: string };
    }) => {
      socket.to(messageDict.roomId).emit(SocketEvent.UPDATE_CHAT_MESSAGE, {
        uuid: messageDict.message.uuid,
        content: messageDict.message.content,
        senderId: messageDict.message.senderId,
      });
    }
  );
};
