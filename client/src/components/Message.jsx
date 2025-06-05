import React from 'react'

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
