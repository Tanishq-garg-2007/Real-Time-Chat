import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Container } from '@mui/material';

const socket = io("http://localhost:3000");

const App = () => {
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = 'image Uploader';
  const CLOUDINARY_CLOUD_NAME = 'dxhopl1cj';

  const submit = () => {
    const message = document.getElementById("message").value;
    const room = document.getElementById("room").value;
    socket.emit("message", { message, room, user_name: userName });
    document.getElementById("message").value = "";
  };

  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return alert("Please choose a file first");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    let endpoint = "image/upload";
    if (type === "video") endpoint = "video/upload";
    else if (type === "auto") endpoint = "auto/upload";

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${endpoint}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      document.getElementById("message").value = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file");
    }
  };

  const joinRoom = () => {
    const roomname = document.getElementById("join_room").value;
    setCurrentRoom(roomname);
    socket.emit('join-room', { room: roomname, user_name: userName });
    setMessages([]);
    document.getElementById("join_room").value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
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

  const translateText = async () => {
    if (!textToTranslate.trim()) return;
    setLoading(true);

    const url = 'https://text-translator2.p.rapidapi.com/translate';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'd9879b04b6msh87afff125ef463cp11f59ejsn3db1d312d594',
        'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
      },
      body: new URLSearchParams({
        source_language: 'en',
        target_language: targetLang,
        text: textToTranslate
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTranslatedText(result.data.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation failed.");
    }

    setLoading(false);
  };

  useEffect(() => {
    socket.on("connect", () => setSocketId(socket.id));
    socket.on("receive-message", (data) => setMessages((prev) => [...prev, data]));
    socket.on("user-joined", (data) => setMessages((prev) => [...prev, data]));
    return () => socket.disconnect();
  }, []);

  return (
    <Container>
      <h3>Real-time Chat</h3>
      <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
      <input type="text" placeholder="Room" id="join_room" />
      <button onClick={joinRoom}>Join Room</button>
      <div>Current Room: {currentRoom}</div>
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.user_name === userName ? 'You' : m.user_name}:</b> {m.message}
          </div>
        ))}
      </div>
      <input type="text" id="message" placeholder="Message" />
      <input type="text" placeholder="Text to Translate" value={textToTranslate} onChange={(e) => setTextToTranslate(e.target.value)} />
      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="gu">Gujarati</option>
      </select>
      <button onClick={translateText}>{loading ? "Translating..." : "Translate"}</button>
      <div>{translatedText}</div>
      <button onClick={submit}>Send</button>
      <input type="file" onChange={(e) => uploadFile(e, 'image')} />
      <input type="file" onChange={(e) => uploadFile(e, 'video')} />
      <input type="file" onChange={(e) => uploadFile(e, 'auto')} />
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </Container>
  );
};

export default App;
