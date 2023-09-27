"use client";
import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Socket, io } from "socket.io-client";
import { Button, Input } from "@nextui-org/react";

const socket = io("http://localhost:5300");
socket.on("connect", () => {
    console.log("connected");
});

export default function EditorPage() {

    const editorRef = useRef(null);

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [messageList, setMessageList] = useState([]);

    const [editorContent, setEditorContent] = useState("// Start your code here");

    useEffect(() => {
        socket.on("code update", (newContent) => {
            setEditorContent(newContent);
        })
    })

    const handleEditorChange = (currentContent: string | undefined) => {
        if (currentContent === undefined) return;
        setEditorContent(currentContent);
        socket.emit("code change", { roomId: room, content: currentContent });
    };

    const joinRoom = () => {
        if (username === "" || room === "") {
            alert("Please enter username and room");
            return;
        }
        socket.emit("join room", room);
    }

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        // here is the editor instance
        // you can store it in `useRef` for further usage
        console.log("hhh", editor, monaco);
        editorRef.current = editor;
    }

    return (
        <div>
        <Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// Start your code here"
            onMount={handleEditorDidMount}
            value={editorContent}
            onChange={handleEditorChange}
        />
        <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
        />   
        <Input
            type="text"
            placeholder="Room ID"
            onChange={(e) => setRoom(e.target.value)}
        />   
        <Button onClick={joinRoom}>Join Room</Button>
        <Chat socket={socket} username={username} roomId={room}></Chat>
        </div>
    );
}

const Chat: React.FC<{ socket: Socket; username: string; roomId: string }> = ({
    socket,
    username,
    roomId,
}) => {
    const [currentMessage, setCurrentMessage] = useState("");

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                roomId: roomId,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }
            socket.emit(currentMessage, roomId);
            await socket.emit("send message", messageData);

        }

    }
    
    return (
        <>
            <div className="chat">
                <div className="messages"></div>
                <div className="inputMessage">
                    <input
                        type="text"
                        placeholder="Message"
                        onChange={(e) => {
                            setCurrentMessage(e.target.value);
                        }}
                    />
                    <button onClick={() => {sendMessage()}}>send</button>
                </div>
            </div>
        </>
    );
};
