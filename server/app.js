import express from 'express'
import { Server } from 'socket.io'
import {createServer} from 'http'
import cors from 'cors'

const app = express();
const mongoDb = require("./db");

mongoDb();

const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:"true"
    },
});

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello World");
})

io.on("connection",(socket)=>{
    console.log("User connected");
    console.log("Id",socket.id);

    socket.on("message",({message,room,user_name})=>{
        console.log(message);
        io.to(room).emit("receive-message",{message,user_name});
    });

    socket.on("join-room", ({ room, user_name }) => {
        socket.join(room);
        console.log(`${user_name} joined room ${room}`);
    
        socket.to(room).emit("user-joined", {
            message: `${user_name} has joined the room.`,
            user_name: "System"
        });
    });
    

    socket.on("disconnect",()=>{
        console.log("User Disconnected",socket.id)
    });
})

server.listen(3000,()=>{
    console.log("Server Is running on port 3000") 
})