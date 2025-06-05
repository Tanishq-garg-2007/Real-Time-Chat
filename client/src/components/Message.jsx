import React from 'react'
import { io } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react';


const socket = io("http://localhost:3000");

const Message = () => {

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
    <>
        <div className="mb-3">
        <label className="form-label">Message</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="text" className="form-control" id="message" placeholder="Type a message..." style={{ flex: 1, backgroundColor: "#333", color: "#fff", border: "1px solid #444" }} />
    
            <label htmlFor="image-upload" style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}>📎 Upload</label>
            <input type="file" id="image-upload" accept="image/*" onChange={image_upload} style={{ display: 'none' }} />

            {!recording ? (
            <button onClick={startRecording} style={{ backgroundColor: "#00adb5", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>🎙️</button>
            ) : (
            <button onClick={stopRecording} style={{ backgroundColor: "#ff4d4d", color: "#fff", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>🛑</button>
            )}
        </div>
        </div>
    </>
  )
}

export default Message
