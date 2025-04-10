# Employee Monitoring Application

## DEMO  
You can watch the project demo on [Google Drive](https://drive.google.com/file/d/1LFHevCN3izQ0KkZy2pdX2aWAAtcgY-qT/view?usp=drive_link) and  [Google Drive](https://drive.google.com/file/d/1bhWYnTLJQojC7CbPvZ9gOhMSZ06kVYQN/view?usp=drive_link).

---

## Overview  
This is an **employee monitoring application** that enables administrators to **remotely view and control employee computers**. This repository contains the **client-side (employee) application**, and does not include the server or admin application.

---

## Core Technologies Used

- **Electron**: Framework for building cross-platform desktop applications.
- **WebRTC**: Enables real-time screen sharing and P2P connections.
- **WebSocket**: For real-time communication between client and server.
- **fetchAPI + REST API**: Used for HTTP requests.
- **JWT (JSON Web Token)**: For authentication between the client and server.
- **RobotJS**: Used to remotely control the employee's keyboard and mouse.
- **Plain JavaScript (Vanilla JS)**: The core application logic is built using plain JavaScript.
- **Custom Redux-like Architecture**: Core state management and logic flow is structured using a custom lightweight Redux-style architecture.

---

## Architecture Overview

### 🎯 Project Focus

The core of the app is structured to **mimic Redux**, with:
- A central store-like object.
- Action-based dispatching and reducers-like flow.
- Event-driven updates to components and logic.

This allows **separation of logic and UI**, making it easier to maintain and extend.

### 🔌 How it works

1. **Login Process**:
   - Employee logs in via REST API with credentials.
   - Receives a JWT token for authenticated requests.
   - Establishes a WebSocket connection to the server using the token.

2. **Computer Info Reporting**:
   - Upon successful login, the client gathers machine information (RAM, OS, CPU, etc.) and sends it to the server.
   - Periodically, it sends data on active application windows and browser URLs.

3. **WebSocket Communication**:
   - Listens for server-side events:
     - General company announcements.
     - Violation reports (e.g., opening unauthorized apps or websites).
     - Screen share requests from admin.

4. **Remote Monitoring & Control**:
   - Admin sends a `start-share-screen` event with department ID.
   - The server multicasts the message to online employees in that department.
   - A WebRTC handshake is established (via WebSocket signaling).
   - Once connected, screen is shared and admin can **interact using RobotJS**.

---

## Key Features

- 🔍 **Live screen monitoring** via WebRTC.
- 🎮 **Remote control** of employee's computer using RobotJS.
- 📡 **Real-time communication** with WebSocket.
- 🚫 **Violation detection** for disallowed websites/apps.
- 🧑‍💼 **Department and employee management**.
- 🔐 **JWT Authentication** with REST API.

---

## Project Structure

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
