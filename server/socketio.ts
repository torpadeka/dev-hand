import {Server} from "socket.io"
import http from "http"

const PORT = 3000;

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin : "*",
    },
});

io.on('connection',(socket) => {
    console.log("user connected : ",socket.id)

    socket.on('message',(msg : string) => { 
        io.emit('message',msg);  
    })

    socket.on('disconnect', () => {
        console.log('User disconnected : ',socket.id);
    })
})

server.listen(PORT,() => {
    console.log("server is running");
})


