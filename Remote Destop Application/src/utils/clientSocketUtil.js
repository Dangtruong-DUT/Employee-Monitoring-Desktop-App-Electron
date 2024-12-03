const WebSocket = require('ws');
const si = require('systeminformation');

import { WebRTCUtil } from './WebRTCUtil.js';
const socketURL = process.env.SOCKETURL;


class ClientSocketWS {
    constructor() {
        this.socketURL = socketURL;
        this.socket = null;
        this.webrtcHandler = null; // Quản lý WebRTC
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.maxReconnectAttempts = 5;
        this.initialReconnectDelay = 1000;
        this.reconnectInterval = null;
        this.screenInterval = null;
        this.infoInterval = null;
        this.browser = null;
        this.isClosed = false;
    }

    async connect() {
        try {
            this.isClosed = false;

            if (this.socket) {
                console.log("WebSocket is already initialized.");
                return;
            }

            this.socket = new WebSocket(this.socketURL);

            this.socket.on('open', this.onConnect.bind(this));
            this.socket.on('message', this.onMessage.bind(this));
            this.socket.on('close', this.onDisconnect.bind(this));
            this.socket.on('error', this.onError.bind(this));
        } catch (error) {
            console.error("Error in connect():", error);
        }
    }

    async onConnect() {
        const token = window.token;
        this.sendMessage("authentication",{token})
        console.log("Connected to server (WebSocket)");
        this.reconnectAttempts = 0;
        this.reconnectDelay = this.initialReconnectDelay;

        API.sendMessage('socket-status', { status: 'connected' });
        clearInterval(this.reconnectInterval);

        this.sendComputerInfo();
        this.monitorActiveApps();
    }

    async sendComputerInfo() {
        try {
            const system = await si.system();
            const osInfo = await si.osInfo();
            const cpu = await si.cpu();
            const memory = await si.mem();

            const computerInfo = {
                manufacturer: system.manufacturer,
                model: system.model,
                os: osInfo.distro,
                cpu: cpu.manufacturer + ' ' + cpu.brand,
                totalMemory: memory.total
            };

            this.sendMessage('computer-info', computerInfo);
        } catch (error) {
            console.error("Error fetching computer info:", error);
        }
    }

    monitorActiveApps() {
        window.API.receiveMessage("active-app", (activeApp)=> {
            this.sendMessage('active-app', activeApp);
        });
    }
    async onMessage(message) {
        try {
            const { type, data } = JSON.parse(message);
            console.log(JSON.parse(message));
            switch (type) {
                case 'serverInfor':
                    this.onServerInfo(data);
                    break;
                case 'start-share-screen':
                    this.onStartShareScreen();
                    break;
                case 'stop-share-screen':
                    this.onStopShareScreen();
                    break;
                case 'notifySession':
                    this.onReceiverNotifySession(data);
                    break;
                case 'notify':
                    this.onReceiverNotify(data);
                    break;
                case 'answer':
                    await this.webrtcHandler?.handleAnswer(data.answer);
                    break;
                case 'ice-candidate':
                    await this.webrtcHandler?.handleIceCandidate(data['ice-candidate']);
                    break;
                default:
                    console.log("Unknown event:", type);
            }
        } catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    }

    async onStartShareScreen() {
        console.log("onStartShareScreen");
        if (!this.webrtcHandler) {
            this.webrtcHandler = new WebRTCUtil(this);
        }

        try {
            await this.webrtcHandler.initializeStream();
            this.webrtcHandler.createPeerConnection();
            await this.webrtcHandler.startStreaming();

            console.log("WebRTC streaming started.");
        } catch (error) {
            console.error("Error starting WebRTC stream:", error);
        }
    }

    async onStopShareScreen() {
        if (this.webrtcHandler) {
            this.webrtcHandler.stopStreaming();
            this.webrtcHandler = null;
            console.log("WebRTC streaming stopped.");
        }
        clearInterval(this.screenInterval);
    }

    sendMessage(event, data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = new Message(event, data); 
            this.socket.send(message.toJSON());
        }
    }

    joinRoom(roomId = "123") {
        this.sendMessage('join-message', {roomId: roomId});
    }

    onServerInfo(data) {
        try {
            const serverInfo = JSON.parse(data);
            API.sendMessage('server-info', serverInfo);
        } catch (error) {
            console.error("Error parsing server info:", data);
        }
    }

    onReceiverNotifySession(data) {
        data.type = 'socket-notifySession';
        API.sendMessage('socket-notifySession', data);
    }

    onReceiverNotify(data) {
        data.type = 'socket-notify';
        API.sendMessage('socket-notify', data);
    }

    onDisconnect(reason) {
        console.log("Disconnected from server (WebSocket):", reason);
        API.sendMessage('socket-status', { status: 'disconnected' });
        this.socket.close();
        this.socket = null;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectInterval = setTimeout(() => {
                console.log(`Attempting reconnect: ${this.reconnectAttempts}`);
                this.reconnectDelay *= 2;
                this.connect();
            }, this.reconnectDelay);
        } else {
            console.error("Unable to reconnect after multiple attempts.");
            API.sendMessage('socket-status', { status: 'error', message: "Unable to reconnect. Please try again later." });
        }
    }

    onError(error) {
        console.error("WebSocket error:", error);
        API.sendMessage('socket-status', { status: 'error', error });
    }

    close() {
        this.isClosed = true;
        clearInterval(this.infoInterval);
        if (this.browser) {
            this.browser.close();
            this.browser = null;
            console.log("Puppeteer browser instance closed.");
        }
        if (this.socket) {
            this.socket.close();
            console.log("WebSocket connection closed.");
            API.sendMessage('socket-status', { status: 'disconnected' });
        }
    }
}


function Message(type = "", data = {}) {
    this.type = type;
    this.data = data;

    this.toJSON = function () {
        return JSON.stringify({ type: this.type, data: this.data });
    };
}

export  { ClientSocketWS,Message };
