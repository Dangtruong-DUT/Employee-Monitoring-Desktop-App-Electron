const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const path = require('path');
const url = require('url');
const fetch = require('node-fetch');
const {ClientSocketWS, ClientSocketHTTP} = require('./clientSocket.js');
const socketURL = 'http://localhost:5000';
let win = null;
let socket ;
const createBrowserWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 750,
        minHeight: 750,
        minWidth: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preloads', 'Preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'views', 'index.html'),
        protocol: "file:",
        slashes: true
    }));
    win.removeMenu();
    socket = new ClientSocketHTTP(socketURL, win)
    win.on('close', () => {
        if (socket) {
            socket.close(); 
        }
    });
    // Tạo context menu
    const ctxMenu = new Menu();

    ctxMenu.append(new MenuItem({
        label: 'Open Dev Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
            win.webContents.openDevTools();
        },
    }));

    ctxMenu.append(new MenuItem({
        label: 'Restart',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
            win.reload();
        },
    }));

    // Sự kiện context-menu
    win.webContents.on('context-menu', (e, params) => {
        ctxMenu.popup({
            window: win,
            x: params.x,
            y: params.y,
        });
    });
    win.webContents.on('will-navigate', () => {
        if (socket) {
            socket.close();
            console.log("Socket closed due to reload.");
        }
    });
    win.webContents.on('did-finish-load', () => {
        if (socket) {
            socket.close();
            console.log("Socket closed after reload.");
        }
    });
    
    win.webContents.on('beforeunload', (event) => {
        if (socket) {
            socket.close();
            console.log("Socket closed before unload.");
        }
    });
};

app.whenReady().then(() => {
    createBrowserWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createBrowserWindow();
        }
    });
});

// nếu đóng với ứng dụng chạy trên macOS
app.on('window-all-closed', () => {
    if (socket) {
        socket.close();  // Đảm bảo đóng kết nối socket khi tất cả cửa sổ đóng
        console.log("Socket disconnected.");
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('login', async (event, user) => {
    try {
        const Options = {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            },
        }
        const url = 'http://localhost:3000/Infor'

        const response = await fetch(url, Options);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        if (data?.state) {
            try {
                socket.connect();
            } catch (e) {
                console.error(e);
            }
        }
        return { success: true, data };

    } catch (error) {
        return { success: false, message: "Kết nối máy chủ không thành công!", data: {} };
    }
});

ipcMain.handle('changeInfor-user', async (event, user) => {
    try {
        const Options = {
            method: "PUT",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        }
        const url = `http://localhost:3000/User/${user.id}`

        const response = await fetch(url, Options);
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            throw new Error(`response status: ${response.status}`);

        }
        const data = await response.json();
        return { success: true };

    } catch (error) {
        return { success: false, message: "" };
    }
});


ipcMain.handle('exit-department', async (event, data) => {
    try {
        const Options = {
            method: "DELETE",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            },
            // body: JSON.stringify(data),
        }
        const url = `http://localhost:3000/Departments/${data.id}`
        const response = await fetch(url, Options);
        if (!response.ok) {
            console.log(`Response status: ${response.status}`);
            throw new Error(`response status: ${response.status}`);
        }
        return { success: true, data: { state: true } };

    } catch (error) {
        return { success: false, data: { state: false } };
    }
});

ipcMain.handle('join-department', async (event, depart) => {
    try {
        const Options = {
            method: "POST",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(depart),
        }
        const url = `http://localhost:3000/Department/${depart.id}`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        return { success: false, message: "", data: {} };
    }
});
ipcMain.handle('CloseSocket', () => {
    console.log("Socket disconnected.");
    if (socket) {
        socket.close();  // Đảm bảo đóng kết nối socket khi tất cả cửa sổ đóng
        console.log("Socket disconnected.");
    }
});

