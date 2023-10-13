import http from "http";
import { AddressInfo } from "net";
import { type Socket as ClientSocket, io as io_client } from "socket.io-client";
import { type Socket as ServerSocket, Server } from "socket.io";
import { SocketEvent } from "../lib/enums/SocketEvent";
import { clearSessionDetails, handleChatMessage, handleCodeChange, handleEndSession, handleGetSessionTimer, handleJoinRoom } from "../controllers";

let userId1: string = "SAMPLE_USER_ID_1";
let userId2: string = "SAMPLE_USER_ID_2";
let roomId: string = "SAMPLE_ROOM_ID";
let content: string = "SAMPLE_ROOM_CONTENT";
let sessionEndTime: string = "SAMPLE_SESSION_END_TIME";

describe("Handlers Test", () => {

    let ioServer: Server;
    let serverSocket1: ServerSocket;
    let serverSocket2: ServerSocket;
    let clientSocketUser1: ClientSocket;
    let clientSocketUser2: ClientSocket;

    beforeAll((done) => {
        const httpServer = http.createServer();
        ioServer = new Server(httpServer);
        httpServer.listen(() => {
            const address = (httpServer.address() as AddressInfo).address;
            const port = (httpServer.address() as AddressInfo).port;
            clientSocketUser1 = io_client(`http://localhost:${port}`);
            clientSocketUser2 = io_client(`http://localhost:${port}`);

            let joinDict1 = {
                userId: userId1,
                roomId: roomId,
                sessionEndTime: sessionEndTime
            }

            let joinDict2 = {
                userId: userId2,
                roomId: roomId,
                sessionEndTime: sessionEndTime
            }

            ioServer.on("connection", async (socket) => {

                if (serverSocket1 == null) {
                    serverSocket1 = socket;
                    // User 1 joins first
                    await handleJoinRoom(serverSocket1, joinDict1); 
                } else {
                    serverSocket2 = socket;
                    // User 2 joins
                    await handleJoinRoom(serverSocket2, joinDict2); 
                }
            });

            

            clientSocketUser1.connect();

            clientSocketUser2.on("connect", () => {
                done();
            });
        });
    });

    afterAll(() => {
        clearSessionDetails(roomId);
        ioServer.close();
        clientSocketUser1.disconnect();
    });

    test("Handle chat message test", async () => {

        let messageDict = {
            roomId: roomId,
            message: { uuid: "123", content: "Hello", senderId: "abc" }
        }

        const receivedMessagePromise = new Promise<void>((resolve) => {
            // Listen for the event on clientSocketUser2
            clientSocketUser1.on(SocketEvent.UPDATE_CHAT_MESSAGE, (incomingMessage) => {
                expect(incomingMessage).toEqual(messageDict.message);
                // Resolve the Promise when the expected event is received
                resolve();
            });
        });

        serverSocket2.on(SocketEvent.SEND_CHAT_MESSAGE, (incomingMessage) => {
            expect(incomingMessage).toStrictEqual(messageDict);
            handleChatMessage(serverSocket2, messageDict)
        });

    
        clientSocketUser2.emit(SocketEvent.SEND_CHAT_MESSAGE, messageDict);
    
        await receivedMessagePromise;
    });

    test("Handle code change test", async () =>{

        let editorDict = { roomId: roomId, content: content }

        const receviedCodePromise = new Promise<void>((resolve) => {
            clientSocketUser1.on(SocketEvent.CODE_UPDATE, (incomingCode) => {
                expect(incomingCode).toEqual(editorDict.content);
                resolve();
            })
        })

        serverSocket2.on(SocketEvent.CODE_CHANGE, (incomingEditorDict) => {
            expect(incomingEditorDict).toEqual(editorDict);
            handleCodeChange(serverSocket2, incomingEditorDict);
        })

        clientSocketUser2.emit(SocketEvent.CODE_CHANGE, editorDict);

        await receviedCodePromise;
    })


    test("Handle end session test", async () => {

        // Expect to receive the content of the editor to himself
        const receivedEndSessionPromise = new Promise<void>((resolve) => {
            clientSocketUser2.on(SocketEvent.END_SESSION, (incomingEditorContent) => {
                expect(incomingEditorContent).toEqual(content);
                resolve();
            })
        })

        serverSocket2.on(SocketEvent.END_SESSION, (incomingRoomID) => {
            handleEndSession(serverSocket2, incomingRoomID);
        })

        clientSocketUser2.emit(SocketEvent.END_SESSION, roomId);

        await receivedEndSessionPromise;

    });

    test("Handle get session timer test", async () => {
        const receivedSessionTimerPromise = new Promise<void>((resolve) => {
            clientSocketUser2.on(SocketEvent.SESSION_TIMER, (incomingSessionEndTime) => {
                expect(incomingSessionEndTime).toEqual(sessionEndTime);
                resolve();
            })
        });

        serverSocket2.on(SocketEvent.GET_SESSION_TIMER, (roomId) => {
            handleGetSessionTimer(serverSocket2, roomId);
        });

        clientSocketUser2.emit(SocketEvent.GET_SESSION_TIMER, roomId);

        await receivedSessionTimerPromise;
    });

})

