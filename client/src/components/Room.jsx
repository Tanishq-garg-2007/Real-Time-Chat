import React from 'react'
import { io } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react';

const socket = io("http://localhost:3000");


const Room = () => {

    const [currentRoom, setCurrentRoom] = useState(""); 
    
    const join_room = () => {
    const roomname = document.getElementById("join_room").value;
    setCurrentRoom(roomname);
    socket.emit('join-room', { room: roomname, user_name: userName });
    setmessages([]);
    document.getElementById("join_room").value = "";
    }
  
    useEffect(() => {
      socket.on("connect", () => setSocketId(socket.id));
      socket.on("receive-message", (data) => setmessages((messages) => [...messages, data]));
      socket.on("user-joined", (data) => setmessages((messages) => [...messages, data]));
      return () => socket.disconnect();
    }, []);

  return (
    <>
        <div className="mb-3">
          <label className="form-label">Your Current Room Is</label>
          <div style={{ backgroundColor: "#2c2c2c", padding: "10px", borderRadius: "6px", wordBreak: "break-all" }}>{currentRoom || "Not in a room"}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Join Room</label>
          <div className="input-group">
            <input type="text" className="form-control" id="join_room" placeholder="Enter room name" style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
            <button className="btn btn-outline-info" onClick={join_room}>Join</button>
          </div>
        </div>
    </>
  )
}

export default Room
