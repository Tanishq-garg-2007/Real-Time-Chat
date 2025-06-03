import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Container } from '@mui/material'
const socket = io("https://real-time-chat-backend-hvvt.onrender.com");

const App = () => {
  const [socketId, setSocketId] = useState("");
  const [messages, setmessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(""); 
  const [userName, setUserName] = useState("");

  const submit = () => {
    const message = document.getElementById("message").value;
    const room = document.getElementById("room").value;

    socket.emit("message", { message, room, user_name: userName});
    document.getElementById("message").value = "";
  }

  const join_room = () => {
    const roomname = document.getElementById("join_room").value;
    setCurrentRoom(roomname);
    socket.emit('join-room', roomname);
    setmessages([]);
    document.getElementById("join_room").value = "";
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setmessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#121212', minHeight: "100vh", paddingTop: "50px", color: "#f5f5f5" }}>

      <Container style={{ maxWidth: "600px", backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "2rem", boxShadow: "0 0 10px rgba(0,0,0,0.7)" }}>
        <h3 className="text-center mb-4" style={{ color: "#00adb5" }}>Real-time Chat</h3>

        <div className="mb-3">
          <label className="form-label">User Name</label>
          <input type="text" className="form-control" id="User_name" placeholder="Type a Name..." value={userName} onChange={(e) => setUserName(e.target.value)} style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
        </div>

        <div className="mb-3">
          <label className="form-label">Your Current Room Is</label>
          <div style={{ backgroundColor: "#2c2c2c", padding: "10px", borderRadius: "6px", wordBreak: "break-all" }}>
            {currentRoom || "Not in a room"}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Join Room</label>
          <div className="input-group">
            <input type="text" className="form-control" id="join_room" placeholder="Enter room name" style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
            <button className="btn btn-outline-info" onClick={join_room}>Join</button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Message</label>
          <input type="text" className="form-control" id="message" placeholder="Type a message..." style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
        </div>

        <div className="mb-3">
          <label className="form-label">Room</label>
          <input type="text" className="form-control" id="room" placeholder="Enter room name" style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
        </div>

        <div className="d-grid mb-4">
          <button className="btn btn-info" onClick={submit}>Send</button>
        </div>

        <h5 className="mb-3" style={{ color: "#00adb5" }}>Messages</h5>
        <div style={{ maxHeight: "250px", overflowY: "auto", backgroundColor: "#2a2a2a", borderRadius: "8px", padding: "10px" }}>
          {
            messages.map((m, i) => (
              <div key={i} className="mb-2 p-2 rounded" style={{ backgroundColor: "#393e46", color: "#f8f8f8" }}>
                <strong style={{ color: "#00adb5" }}>{m.user_name === userName ? "You" : m.user_name}:</strong> {m.message}
              </div>
            ))
          }
        </div>
      </Container>
    </div>
  )
}

export default App
