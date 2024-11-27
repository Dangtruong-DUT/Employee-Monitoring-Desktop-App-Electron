const WebSocket = require('ws');
const si = require('systeminformation'); // Thư viện để lấy thông tin hệ thống
const activeWindow = require('active-win'); // Thư viện để lấy thông tin cửa sổ đang bật
const { exec } = require('child_process'); // Dùng để kiểm tra tiến trình
const io = require('socket.io-client');
const screenshot = require('screenshot-desktop');
const robot = require("robotjs");
const puppeteer = require('puppeteer'); // Thêm puppeteer để lấy URL trình duyệt chính xác
const CDP = require('chrome-remote-interface'); // Thư viện để giao tiếp với Chrome DevT

class ClientSocketWebSocket {
    constructor(socketURL, win) {
        this.socketURL = socketURL;
        this.win = win;
        this.socket = null;
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

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                return;
            }

            this.socket = new WebSocket(this.socketURL);

            this.socket.onopen = this.onConnect.bind(this);
            this.socket.onmessage = this.onMessage.bind(this);
            this.socket.onclose = this.onDisconnect.bind(this);
            this.socket.onerror = this.onError.bind(this);

            if (!this.browser) {
                this.browser = await puppeteer.launch({ headless: false });
                console.log("Browser launched");
            }
        } catch (error) {
            console.error("Error in connect():", error);
        }
    }

    onConnect() {
        console.log("Connected to server (WebSocket)");
        this.reconnectAttempts = 0;
        this.reconnectDelay = this.initialReconnectDelay;
        this.win.webContents.send('socket-status', { status: 'connected' });
        this.joinRoom();
        clearInterval(this.reconnectInterval);
        this.sendComputerInfo();
        this.monitorActiveApps();
    }

    onMessage(event) {
        try {
            const { type, data } = JSON.parse(event.data);

            switch (type) {
                case 'serverInfor':
                    this.onServerInfo(data);
                    break;
                case 'stop-share':
                    this.onStopShareScreen();
                    break;
                case 'mouse-move':
                    this.onMouseMove(data);
                    break;
                case 'mouse-click':
                    this.onMouseClick();
                    break;
                case 'type':
                    this.onType(data);
                    break;
                case 'notifySession':
                    this.onReceiverNotifySession(data);
                    break;
                case 'notify':
                    this.onReceiverNotify(data);
                    break;
                default:
                    console.warn("Unknown message type:", type);
            }
        } catch (error) {
            console.error("Error parsing message:", event.data);
        }
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

    async monitorActiveApps() {
        if (this.isClosed) return;
        this.infoInterval = setInterval(async () => {
            try {
                const activeWin = await activeWindow();

                if (!activeWin || !activeWin.owner) {
                    console.log("Không thể lấy thông tin cửa sổ đang hoạt động.");
                    return;
                }

                const appName = activeWin.owner.name.toLowerCase();
                const browsers = ['chrome', 'firefox', 'edge', 'safari'];
                
                exec('tasklist', (err, stdout) => {
                    const runningBrowsers = browsers.filter(browser => stdout.toLowerCase().includes(browser));

                    if (runningBrowsers.length > 0) {
                        this.getBrowserURL(appName).then(url => {
                            this.sendMessage('active-apps', {
                                activeApp: appName,
                                browsersOpen: runningBrowsers,
                                currentURL: url
                            });
                        }).catch(err => {
                            console.error("Error getting browser URL:", err);
                        });
                    } else {
                        this.sendMessage('active-apps', {
                            activeApp: appName,
                            browsersOpen: runningBrowsers
                        });
                    }
                });
            } catch (error) {
                console.error("Error fetching active app info:", error);
            }
        }, 10000);
    }

    sendMessage(type, data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, data }));
        }
    }

    onServerInfo(data) {
        try {
            const serverInfo = JSON.parse(data);
            this.win.webContents.send('server-info', serverInfo);
        } catch (error) {
            console.error("Error parsing server info:", data);
        }
    }

    onReceiverNotifySession(data) {
        this.win.webContents.send('socket-notifySession', JSON.parse(data));
    }

    onReceiverNotify(data) {
        this.win.webContents.send('socket-notify', JSON.parse(data));
    }

    onStopShareScreen() {
        clearInterval(this.screenInterval);
    }

    onMouseMove(data) {
        if (this.isClosed) return;
        try {
            const { x, y } = JSON.parse(data);
            robot.moveMouse(x, y);
        } catch (error) {
            console.error("Error parsing mouse move data:", data);
        }
    }

    onMouseClick() {
        if (this.isClosed) return;
        robot.mouseClick();
    }

    onType(data) {
        if (this.isClosed) return;
        try {
            const { key } = JSON.parse(data);
            if (typeof key === 'string' && key.trim()) {
                robot.keyTap(key);
            } else {
                console.warn("Invalid key received:", key);
            }
        } catch (error) {
            console.error("Error in onType:", error);
        }
    }

    onDisconnect() {
        console.log("Disconnected from server (WebSocket)");
        this.win.webContents.send('socket-status', { status: 'disconnected' });

        if (this.isClosed) return;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectInterval = setTimeout(() => {
                console.log(`Attempting reconnect: ${this.reconnectAttempts}`);
                this.reconnectDelay *= 2;
                this.connect();
            }, this.reconnectDelay);
        } else {
            console.error("Unable to reconnect after multiple attempts.");
            this.win.webContents.send('socket-status', { status: 'error', message: "Unable to reconnect. Please try again later." });
        }
    }

    onError(error) {
        console.error("WebSocket error:", error);
        this.win.webContents.send('socket-status', { status: 'error', error });
    }

    joinRoom(roomId = "123") {
        this.sendMessage('join-message', roomId);
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
            this.win.webContents.send('socket-status', { status: 'disconnected' });
        } else {
            console.log("WebSocket is not connected.");
        }
    }
}



// Lớp cho WebSocket kết nối
class ClientSocketHTTP {
    constructor(socketURL, win) {
        this.socketURL = socketURL;
        this.win = win;
        this.socket = null;
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
            if (this.socket && this.socket.connected) {
                return;
            }

            this.socket = io(this.socketURL);

            this.socket.on('connect', this.onConnect.bind(this));
            this.socket.on('serverInfor', this.onServerInfo.bind(this));
            this.socket.on('stop-share', this.onStopShareScreen.bind(this));
            this.socket.on('mouse-move', this.onMouseMove.bind(this));
            this.socket.on('mouse-click', this.onMouseClick.bind(this));
            this.socket.on('type', this.onType.bind(this));
            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on('error', this.onError.bind(this));
            this.socket.on('notifySession', this.onReceiverNotifySession.bind(this));
            this.socket.on('notify', this.onReceiverNotify.bind(this));

            if (!this.browser) {
                this.browser = await puppeteer.launch({ headless: false });
                console.log("Browser launched");
            }
        } catch (error) {
            console.error("Error in connect():", error);
        }
    }

    async onConnect() {
        console.log("Connected to server (Socket.io)");
        this.reconnectAttempts = 0;
        this.reconnectDelay = this.initialReconnectDelay;
        this.win.webContents.send('socket-status', { status: 'connected' });
        this.joinRoom();
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

            this.socket.emit('computer-info', computerInfo);
        } catch (error) {
            console.error("Error fetching computer info:", error);
        }
    }

    async monitorActiveApps() {
        if (this.isClosed) return;
        this.infoInterval = setInterval(async () => {
            try {
                const activeWin = await activeWindow();

                if (!activeWin || !activeWin.owner) {
                    console.log("Không thể lấy thông tin cửa sổ đang hoạt động.");
                    return;
                }

                const appName = activeWin.owner.name.toLowerCase();
                const browsers = ['chrome', 'firefox', 'edge', 'safari'];
                
                exec('tasklist', (err, stdout) => {
                    const runningBrowsers = browsers.filter(browser => stdout.toLowerCase().includes(browser));

                    if (runningBrowsers.length > 0) {
                        this.getBrowserURL(appName).then(url => {
                            this.socket.emit('active-apps', {
                                activeApp: appName,
                                browsersOpen: runningBrowsers,
                                currentURL: url
                            });
                        }).catch(err => {
                            console.error("Error getting browser URL:", err);
                        });
                    } else {
                        this.socket.emit('active-apps', {
                            activeApp: appName,
                            browsersOpen: runningBrowsers
                        });
                    }
                });
            } catch (error) {
                console.error("Error fetching active app info:", error);
            }
        }, 10000);
    }

    async getBrowserURL() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.browser && this.browser.isConnected()) {
                    const pages = await this.browser.pages();
                    const urls = pages.map(page => page.url());
                    resolve(urls);
                } else {
                    reject("trinh duyet khong hoat dong.");
                }
            } catch (error) {
                reject(`loi khi lay cac tab: ${error}`);
            }
        });
    }

    onServerInfo(data) {
        try {
            const serverInfo = JSON.parse(data);
            this.win.webContents.send('server-info', serverInfo);
        } catch (error) {
            console.error("Error parsing server info:", data);
        }
    }

    onReceiverNotifySession(data) {
        this.win.webContents.send('socket-notifySession', JSON.parse(data));
    }

    onReceiverNotify(data) {
        this.win.webContents.send('socket-notify', JSON.parse(data));
    }

    onStopShareScreen() {
        clearInterval(this.screenInterval);
    }

    onMouseMove(data) {
        if (this.isClosed) return;
        try {
            const { x, y } = JSON.parse(data);
            robot.moveMouse(x, y);
        } catch (error) {
            console.error("Error parsing mouse move data:", data);
        }
    }

    onMouseClick() {
        if (this.isClosed) return;
        robot.mouseClick();
    }

    onType(data) {
        if (this.isClosed) return;
        try {
            const { key } = JSON.parse(data);
            if (typeof key === 'string' && key.trim()) {
                robot.keyTap(key);
            } else {
                console.warn("Invalid key received:", key);
            }
        } catch (error) {
            console.error("Error in onType:", error);
        }
    }

    onDisconnect(reason) {
        console.log("Disconnected from server (Socket.io):", reason);
        this.win.webContents.send('socket-status', { status: 'disconnected' });

        if (this.isClosed) return;

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectInterval = setTimeout(() => {
                console.log(`Attempting reconnect: ${this.reconnectAttempts}`);
                this.reconnectDelay *= 2;
                this.connect();
            }, this.reconnectDelay);
        } else {
            console.error("Unable to reconnect after multiple attempts.");
            this.win.webContents.send('socket-status', { status: 'error', message: "Unable to reconnect. Please try again later." });
        }
    }

    onError(error) {
        console.error("Socket.io error:", error);
        this.win.webContents.send('socket-status', { status: 'error', error });
    }

    joinRoom(roomId = "123") {
        if (this.socket && this.socket.connected && !this.isClosed) {
            this.socket.emit('join-message', roomId);
        }
    }

    close() {
        this.isClosed = true;
        clearInterval(this.infoInterval);
        if (this.browser) {
            this.browser.close();
            this.browser = null;
            console.log("Puppeteer browser instance closed.");
        }
        if (this.socket && this.socket.connected) {
            this.socket.disconnect();
            console.log("Socket.io connection closed.");
            this.win.webContents.send('socket-status', { status: 'disconnected' });
        } else {
            console.log("Socket is not connected.");
        }
    }
}



module.exports = { ClientSocketWS, ClientSocketHTTP };
