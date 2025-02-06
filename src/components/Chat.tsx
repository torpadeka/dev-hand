// import React, { useEffect, useRef, useState } from "react";
// import { io,Socket } from "socket.io-client";

// const Chat: React.FC = () => {

//     const ws = useRef<Socket | null>(null); 
//     const [message,setMessages] = useState<string[]>([]);
//     const [peerID] = useState<string>(Math.random().toString(36).substring(2,15))
        

//     useEffect(() => {

//         ws.current = io('http://localhost/3000');

//         ws.current.on('connect',() => {
//             console.log("socket open")
//         })

//         ws.current.on('disconnect',() => {
//             console.log("socket close")
//         })

//         ws.current.on('message',(msg:string) => {
//             setMessages((prevMessage) => [...prevMessage,msg])
//         })

//         return () => {
//             ws.current?.off('connect');
//             ws.current?.off('disconnect');
//             ws.current?.off('close');

//             ws.current?.disconnect()
//         }   

//     },[])

//     const sendMessage = (msg : string) => {
//         if(ws.current){
//             ws.current.emit('message',msg);
//         }
//     }
    
//     return <>

//     </>
// }

// export default Chat