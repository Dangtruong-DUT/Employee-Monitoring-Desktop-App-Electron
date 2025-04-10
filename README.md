# Employee Monitoring Desktop App (Electron)

## 🎬 DEMO  
You can watch the project demo here:  
- [Google Drive - Demo 1](https://drive.google.com/file/d/1LFHevCN3izQ0KkZy2pdX2aWAAtcgY-qT/view?usp=drive_link)  
- [Google Drive - Demo 2](https://drive.google.com/file/d/1bhWYnTLJQojC7CbPvZ9gOhMSZ06kVYQN/view?usp=drive_link)

---

## 🧭 Overview

This is the **Electron-based desktop application for employees** in a corporate employee monitoring system. It enables administrators to **remotely monitor and control employee computers** in real time.

> ⚠️ **Note:** This repository contains **only the Electron desktop app for employees**.  
> The backend server and the admin (controller) interface are **not included here**.

---

## 🔗 Backend Repository

You can find the backend server source code at:  
👉 https://github.com/GiaBaoNguyen7112004/RemoteDesktopControl-Backend

---

## ⚙️ Core Technologies Used

- **Electron** – For building cross-platform desktop applications.
- **WebRTC** – Enables real-time screen sharing and P2P connections.
- **WebSocket** – Used for real-time communication with the server.
- **fetchAPI + REST API** – For authentication and data exchange.
- **JWT (JSON Web Token)** – Handles secure authentication between client and server.
- **RobotJS** – Allows the server to remotely control the employee's mouse and keyboard.
- **Vanilla JavaScript** – The app’s core logic is written in plain JavaScript.
- **Custom Redux-like Architecture** – State management is handled via a custom lightweight Redux-style pattern.

---

## 🧱 Architecture Overview

### 🎯 Project Focus

The app uses a custom state management system inspired by Redux:
- A central store-like object.
- Action-based dispatching and reducer-style logic.
- Event-driven component updates.

This ensures a clean separation between logic and UI, making the app easy to maintain and extend.

### 🔌 How it Works

1. **Login Process**:
   - Employees log in via REST API using their credentials.
   - A JWT token is returned and stored for authenticated communication.
   - A WebSocket connection is established using the token.

2. **System Info Reporting**:
   - After login, the client collects system data (RAM, OS, CPU, etc.) and sends it to the server.
   - Periodic updates are sent with info on active windows and browser URLs.

3. **WebSocket Events**:
   - Listens for:
     - Company-wide announcements.
     - Violation alerts (e.g., restricted apps or websites).
     - Screen sharing requests from admin.

4. **Remote Control via WebRTC**:
   - Admin sends a `start-share-screen` event.
   - Server relays it to all online employees in the relevant department.
   - A WebRTC connection is established for screen sharing.
   - Admin can remotely control the employee's machine using RobotJS.

---

## 🚀 Key Features

- 🔍 **Live screen monitoring** via WebRTC.
- 🖱️ **Remote keyboard and mouse control** using RobotJS.
- 📡 **Real-time WebSocket communication**.
- 🚫 **Violation detection** for blocked apps or websites.
- 🧑‍💼 **Employee and department management**.
- 🔐 **Secure authentication** using JWT and REST API.

---

## 📁 Project Structure

```
📁 src/
├── assets/         # Static assets (images, fonts, etc.)
├── js/             # Common JavaScript files or core logic
├── preloads/       # Electron preload scripts (for secure main <-> renderer communication)
├── redux/          # Redux state management (actions, reducers, store)
├── renderers/      # Electron renderer process code (User Interface - UI)
├── utils/          # Utility functions and helper modules
└── main.js         # Electron main process entry point (app lifecycle, windows)

📁 Public
   └── index.html         # Main UI container
.env                      # Configuration (server URL, ports, etc.)
```

---

## Installation Guide

1. **Clone the project**:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Create and modify your `.env` file to include necessary configurations (API URLs, WebSocket address, ports, etc.)

4. **Run the application**:
   ```bash
   npm start
   ```
---
##📁 Project Structure
```
src/
├── components/     # Shared UI components
├── pages/          # Application pages
├── hooks/          # Custom React hooks
├── context/        # React Context for global state
├── services/       # API interaction logic
├── locales/        # i18n translation files
├── routes/         # Route definitions
└── utils/          # Utility functions
```
---
##🤝 Contributing
Feel free to open Issues or submit a Pull Request if you find bugs or have feature suggestions.

##📄 License
MIT License — see the LICENSE file for details.
