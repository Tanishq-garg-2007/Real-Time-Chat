import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Container } from "@mui/material";
import TranslateIcon from '@mui/icons-material/Translate';

const socket = io("http://localhost:3000");

const App = () => {
  const [socketId, setSocketId] = useState("");
  const [messages, setmessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedMap, setTranslatedMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const CLOUDINARY_UPLOAD_PRESET = "image Uploader";
  const CLOUDINARY_CLOUD_NAME = "dxhopl1cj";

  const submit = () => {
    const message = document.getElementById("message").value;
    const room = document.getElementById("room").value;
    socket.emit("message", { message, room, user_name: userName });
    document.getElementById("message").value = "";
  };

  const image_upload = async (e) => {
    console.log("i.1");
    const file = e.target.files[0];
    if (!file) return alert("Please choose an image first");
    console.log("i.2");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    formData.append("cloud_name", "dxhopl1cj");
    console.log("i.3");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxhopl1cj/image/upload",
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      document.getElementById("message").value = data.secure_url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    }
  };

  const video_upload = async (e) => {
    console.log("v.1");
    const file = e.target.files[0];
    if (!file) return alert("Please choose a video first");
    console.log("v.2");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    console.log("v.3");
    try {
      console.log("v.4");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxhopl1cj/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("v.5");
      if (!res.ok) throw new Error("Upload failed");
      console.log("v.6");
      const data = await res.json();
      console.log("v.7");
      document.getElementById("message").value = data.secure_url;
      console.log("v.8");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload video"); // not 'image'
    }
  };

  const document_upload = async (e) => {
    console.log("d.1");
    const file = e.target.files[0];
    if (!file) return alert("Please choose an image first");
    console.log("d.2");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image Uploader");
    formData.append("cloud_name", "dxhopl1cj");
    console.log("d.3");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxhopl1cj/auto/upload",
        { method: "POST", body: formData }
      );
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
    socket.emit("join-room", { room: roomname, user_name: userName });
    setmessages([]);
    document.getElementById("join_room").value = "";
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("file", audioBlob);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          document.getElementById("message").value = data.secure_url;
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const translateText = async (text, idx) => {
    if (!text.trim()) return;

    setLoadingMap((prev) => ({ ...prev, [idx]: true }));

    const url = "https://text-translator2.p.rapidapi.com/translate";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "d9879b04b6msh87afff125ef463cp11f59ejsn3db1d312d594",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      body: new URLSearchParams({
        source_language: "en",
        target_language: targetLang,
        text,
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTranslatedMap((prev) => ({
        ...prev,
        [idx]: result.data.translatedText,
      }));

      // Clear after 5 seconds
      // setTimeout(() => {
      //   setTranslatedMap(prev => {
      //     const copy = { ...prev };
      //     delete copy[idx];
      //     return copy;
      //   });
      // }, 5000);
    } catch (err) {
      console.error("Translation failed:", err);
      setTranslatedMap((prev) => ({ ...prev, [idx]: "Translation failed." }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [idx]: false }));
    }
  };

  useEffect(() => {
    socket.on("connect", () => setSocketId(socket.id));
    socket.on("receive-message", (data) =>
      setmessages((messages) => [...messages, data])
    );
    socket.on("user-joined", (data) =>
      setmessages((messages) => [...messages, data])
    );
    return () => socket.disconnect();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        paddingTop: "50px",
        color: "#f5f5f5",
      }}
    >
      <Container
        style={{
          maxWidth: "1000px",
          backgroundColor: "#1e1e1e",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.7)",
        }}
      >
        <h3 className="text-center mb-4" style={{ color: "#00adb5" }}>
          Real-time Chat
        </h3>

        {/* Responsive Flex Container */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
          }}
        >
          {/* Left Section */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div className="mb-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                className="form-control"
                id="User_name"
                placeholder="Type a Name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444",
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Join Room</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="join_room"
                  placeholder="Enter room name"
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #444",
                  }}
                />
                <button className="btn btn-outline-info" onClick={join_room}>
                  Join
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Your Current Room Is</label>
              <div
                style={{
                  backgroundColor: "#2c2c2c",
                  padding: "10px",
                  borderRadius: "6px",
                  wordBreak: "break-all",
                }}
              >
                {currentRoom || "Not in a room"}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ flex: "2", minWidth: "280px" }}>
            <h5 className="mb-3" style={{ color: "#00adb5" }}>
              Messages
            </h5>
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "1.5rem",
              }}
            >
              {messages.map((m, i) => {
                const isImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(
                  m.message
                );
                const isAudio = /\.(webm|mp3|wav|ogg)$/i.test(m.message);
                const isDocument = /\.(doc|pdf|docx|txt|ppt|xls)$/i.test(
                  m.message
                );
                const isvideo = /\.(mp4|mov|avi|webm|flv)$/i.test(m.message);

                return (
                  <div
                    key={i}
                    className="mb-2 p-2 rounded"
                    style={{ backgroundColor: "#393e46", color: "#f8f8f8" }}
                  >
                    <strong style={{ color: "#00adb5" }}>
                      {m.user_name === userName ? "You" : m.user_name}:
                    </strong>{" "}
                    {isImage ? (
                      <img
                        src={m.message}
                        alt="sent content"
                        style={{
                          maxWidth: "200px",
                          borderRadius: "8px",
                          display: "block",
                          marginTop: "5px",
                        }}
                      />
                    ) : isAudio ? (
                      <audio
                        controls
                        src={m.message}
                        style={{ display: "block", marginTop: "5px" }}
                      />
                    ) : isDocument ? (
                      <iframe
                        src={m.message}
                        width="100%"
                        height="600px"
                        style={{ border: "none" }}
                        title="PDF Preview"
                      />
                    ) : isvideo ? (
                      <video width="70%" height="auto" controls>
                        <source src={m.message} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <>
                        <div
                          style={{
                            backgroundColor: "#2a2a2a",
                            padding: "15px",
                            borderRadius: "10px",
                            marginBottom: "20px",
                            color: "#fff",
                            boxShadow: "0 0 10px rgba(0, 173, 181, 0.2)",
                          }}
                        >
                          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                            {m.message}
                          </p>

                          <div style={{ textAlign: "right" }}>
                            <button
                              style={{
                                backgroundColor: "#00adb5",
                                border: "none",
                                borderRadius: "50%",
                                color: "#fff",
                                fontSize: "18px",
                                width: "40px",
                                height: "40px",
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const utterance = new SpeechSynthesisUtterance(
                                  m.message
                                );
                                utterance.lang = "hi-IN";
                                utterance.volume = 1;
                                speechSynthesis.speak(utterance);
                              }}
                              title="Speak this message"
                            >
                              🎤
                            </button>

                            <select
                              value={targetLang}
                              onChange={(e) => setTargetLang(e.target.value)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                backgroundColor: "#1e1e1e",
                                color: "#fff",
                                border: "1px solid #00adb5",
                                marginRight: "10px",
                              }}
                            >
                              <option value="hi">Hindi</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="gu">Gujarati</option>
                            </select>

                            <button
                              onClick={() => translateText(m.message, i)}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#00adb5",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              {loadingMap[i] ? "Translating..." : "<TranslateIcon style={{ fontSize: 24, color: "#00adb5" }} />"}
                            </button>

                            {translatedMap[i] && (
                              <div
                                style={{
                                  marginTop: "15px",
                                  padding: "10px",
                                  backgroundColor: "#1e1e1e",
                                  borderRadius: "6px",
                                  border: "1px solid #00adb5",
                                }}
                              >
                                <p>{translatedMap[i]}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "1px solid #444",
                  }}
                />

                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    📎 Upload
                  </button>

                  <div
                    className="dropdown-menu m-2 p-2"
                    style={{ backgroundColor: "black" }}
                    aria-labelledby="dropdownMenuButton"
                  >
                    <label
                      className="dropdown-item mt-2 p-1"
                      htmlFor="image-upload"
                      style={{
                        backgroundColor: "#00adb5",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📷 Images{" "}
                    </label>
                    <input
                      className="dropdown-item mt-2 p-1"
                      type="file"
                      id="image-upload"
                      onChange={image_upload}
                      style={{ display: "none" }}
                    />

                    <label
                      className="dropdown-item mt-2 p-1"
                      htmlFor="video-upload"
                      style={{
                        backgroundColor: "#00adb5",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🎥 Video{" "}
                    </label>
                    <input
                      className="dropdown-item mt-2 p-1"
                      type="file"
                      id="video-upload"
                      onChange={video_upload}
                      style={{ display: "none" }}
                    />

                    <label
                      className="dropdown-item mt-2 p-1"
                      htmlFor="document-upload"
                      style={{
                        backgroundColor: "#00adb5",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      📄 Document
                    </label>
                    <input
                      className="dropdown-item mt-2 p-1"
                      type="file"
                      id="document-upload"
                      onChange={document_upload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                {!recording ? (
                  <button
                    onClick={startRecording}
                    style={{
                      backgroundColor: "#00adb5",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🎙️
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    🛑
                  </button>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Room</label>
              <input
                type="text"
                className="form-control"
                id="room"
                placeholder="Enter room name"
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  border: "1px solid #444",
                }}
              />
            </div>

            <div className="d-grid">
              <button className="btn btn-info" onClick={submit}>
                Send
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
