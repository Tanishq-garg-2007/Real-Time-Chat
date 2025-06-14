# 🔌 Socket Learn

A hands‑on demo project to explore the core concepts of **Socket.IO** for real‑time web communication. In this mini‑app you’ll learn how to:

* Establish bi‑directional WebSocket connections
* Broadcast and emit custom events
* Join and manage “rooms” (namespaces)
* Handle user connections and disconnections

---

## 🛠️ Tech Stack

* **Node.js** (>14.x)
* **Express.js** (>4.x)
* **Socket.IO** (>4.x)

---

## 🚀 Features

1. **Basic Connection**
   Clients connect to the server over WebSockets and receive a welcome message.

2. **Event Emission & Broadcasting**

   * `message` events: exchange chat‑style text
   * `typing` events: notify when another user is typing
   * Custom events: show how to emit arbitrary data payloads

3. **Rooms & Namespaces**

   * Create and join rooms
   * Broadcast events to all members of a room

4. **Connection Lifecycle**

   * `connect` / `disconnect` handlers
   * Logging and cleanup on disconnect

---

## 📂 Project Structure

```
Socket_Learn/
├── server/
│   ├── index.js             # Express + Socket.IO server
│   ├── package.json
│   └── README.md            # (this file)
└── client/
    ├── index.html           # Simple HTML/JS front‑end
    ├── main.js              # Socket.IO client logic
    └── package.json         # if you npm‑install client deps
```

---

## 💻 Installation & Usage

1. **Clone the repo**

   ```bash
   git clone https://github.com/Tanishq-garg-2007/Real-Time-Chat.git
   cd Real-Time-Chat/Socket_Learn
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **(Optional) Install client dependencies**
   If you’re using any bundler or NPM‑based client:

   ```bash
   cd ../client
   npm install
   ```

4. **Start the server**

   ```bash
   cd ../server
   npm start
   ```

   By default it listens on **[http://localhost:3000](http://localhost:3000)**.

5. **Open the client**

   * Open `Socket_Learn/client/index.html` in your browser
   * Or, if you’re running a dev server, point it at port `3000`

---

## 📈 How It Works

1. **Server (`index.js`)**

   * Initializes an Express HTTP server
   * Upgrades to WebSocket via Socket.IO
   * Listens for connection events
   * Defines handlers for custom events like `message`, `typing`, and room joins

2. **Client (`main.js`)**

   * Connects to `io('http://localhost:3000')`
   * Emits and listens for events, updating the DOM in real time

> 🔍 See inline comments in `server/index.js` and `client/main.js` for step‑by‑step explanations.

---

## 🛠️ Customization

* **Change port**: set `process.env.PORT` or edit the constant in `server/index.js`.
* **Add new events**: define handlers on both client and server.
* **Persist messages**: integrate a database (e.g. MongoDB) for chat history.
* **Authentication**: add middleware to verify users before allowing socket connections.

---

## 👤 Author

**Tanishq Garg**

* GitHub: [@Tanishq-garg-2007](https://github.com/Tanishq-garg-2007)
* Email: [tanishakgarg@gmail.com](mailto:tanishakgarg@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License**.
See [LICENSE](../LICENSE) for details.
