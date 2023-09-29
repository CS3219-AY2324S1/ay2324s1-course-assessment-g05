"use client";
import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Socket, io } from "socket.io-client";
import { Button, Code, Input } from "@nextui-org/react";
import CodeEditor from "@/components/collab/CodeEditor";

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
        socket.on("code update", (newContent: string) => {
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
        editorRef.current = editor;
    }

    return (
        <div>
        {/* <CodeEditor> */}
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
        </div>
    );
}

