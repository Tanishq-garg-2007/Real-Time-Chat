import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client'
import { Container } from '@mui/material'

const socket = io("http://localhost:3000");

const App = () => {

  const [socketId, setSocketId] = useState("");
  const [messages, setmessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(""); 
  const [userName, setUserName] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const CLOUDINARY_UPLOAD_PRESET = 'image Uploader';
  const CLOUDINARY_CLOUD_NAME = 'dxhopl1cj'; 

  const submit = () => {
    const message = document.getElementById("message").value;
    const room = document.getElementById("room").value;
    socket.emit("message", { message, room, user_name: userName });
    document.getElementById("message").value = "";
  }

  const image_upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please choose an image first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    formData.append("cloud_name", "dxhopl1cj");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dxhopl1cj/image/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      document.getElementById("message").value = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  };

  const video_upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please choose an image first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    formData.append("cloud_name", "dxhopl1cj");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dxhopl1cj/video/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      document.getElementById("message").value = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  };

  const document_upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Please choose an image first");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    formData.append("cloud_name", "dxhopl1cj");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dxhopl1cj/raw/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      document.getElementById("message").value = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  };

  const join_room = () => {
    const roomname = document.getElementById("join_room").value;
    setCurrentRoom(roomname);
    socket.emit('join-room', { room: roomname, user_name: userName });
    setmessages([]);
    document.getElementById("join_room").value = "";
  }

const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );
          const data = await response.json();
          document.getElementById("message").value = data.secure_url;
        } catch (error) {
          console.error('Error uploading to Cloudinary:', error);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
    }
  };


  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  
  useEffect(() => {
    socket.on("connect", () => setSocketId(socket.id));
    socket.on("receive-message", (data) => setmessages((messages) => [...messages, data]));
    socket.on("user-joined", (data) => setmessages((messages) => [...messages, data]));
    return () => socket.disconnect();
  }, []);

return (
  <div style={{ backgroundColor: '#121212', minHeight: "100vh", paddingTop: "50px", color: "#f5f5f5" }}>
    <Container style={{ maxWidth: "1000px", backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "2rem", boxShadow: "0 0 10px rgba(0,0,0,0.7)" }}>
      <h3 className="text-center mb-4" style={{ color: "#00adb5" }}>Real-time Chat</h3>

      {/* Responsive Flex Container */}
      <div style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        flexDirection: window.innerWidth < 768 ? "column" : "row"
      }}>
        {/* Left Section */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          <div className="mb-3">
            <label className="form-label">User Name</label>
            <input type="text" className="form-control" id="User_name" placeholder="Type a Name..." value={userName} onChange={(e) => setUserName(e.target.value)} style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
          </div>

          <div className="mb-3">
            <label className="form-label">Join Room</label>
            <div className="input-group">
              <input type="text" className="form-control" id="join_room" placeholder="Enter room name" style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
              <button className="btn btn-outline-info" onClick={join_room}>Join</button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Current Room Is</label>
            <div style={{ backgroundColor: "#2c2c2c", padding: "10px", borderRadius: "6px", wordBreak: "break-all" }}>{currentRoom || "Not in a room"}</div>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ flex: "2", minWidth: "280px" }}>
          <h5 className="mb-3" style={{ color: "#00adb5" }}>Messages</h5>
          <div style={{ maxHeight: "250px", overflowY: "auto", backgroundColor: "#2a2a2a", borderRadius: "8px", padding: "10px", marginBottom: "1.5rem" }}>
            {
              messages.map((m, i) => {
                const isImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(m.message);
                const isAudio = /\.(webm|mp3|wav|ogg)$/i.test(m.message);
                const isDocument = /\.(doc|pdf|docx|txt|ppt|xls)$/i.test(m.message);
                return (
                  <div key={i} className="mb-2 p-2 rounded" style={{ backgroundColor: "#393e46", color: "#f8f8f8" }}>
                    <strong style={{ color: "#00adb5" }}>{m.user_name === userName ? "You" : m.user_name}:</strong>{" "}
                    {isImage ? (
                      <img src={m.message} alt="sent content" style={{ maxWidth: "200px", borderRadius: "8px", display: "block", marginTop: "5px" }} />
                    ) : isAudio ? (
                      <audio controls src={m.message} style={{ display: "block", marginTop: "5px" }} />
                    ) : (
                      m.message
                    )}
                  </div>
                );
              })
            }
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <input type="text" className="form-control" id="message" placeholder="Type a message..." style={{ flex: 1, minWidth: '200px', backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />

                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        📎 Upload
                    </button>

                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <label htmlFor="image-upload" style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}> Images </label>
                        <input type="file" id="image-upload" onChange={image_upload} style={{ display: 'none' }} />
                        <label htmlFor="video-upload" style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}> Video </label>
                        <input type="file" id="video-upload" onChange={video_upload} style={{ display: 'none' }} />
                        <label htmlFor="document-upload" style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}> Document</label>
                        <input type="file" id="document-upload" onChange={document_upload} style={{ display: 'none' }} />
                        {!recording ? (
                            <button onClick={startRecording} style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>🎙️</button>
                        ) : (
                            <button onClick={stopRecording} style={{ backgroundColor: "#ff4d4d", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>🛑</button>
                        )}
                    </div>
                </div>

            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Room</label>
            <input type="text" className="form-control" id="room" placeholder="Enter room name" style={{ backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
          </div>

          <div className="d-grid">
            <button className="btn btn-info" onClick={submit}>Send</button>
          </div>
        </div>
      </div>
    </Container>
  </div>
);


}

export default App