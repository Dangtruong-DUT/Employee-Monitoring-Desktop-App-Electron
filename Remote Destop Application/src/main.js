const { app, BrowserWindow, ipcMain, Menu, MenuItem, clipboard } = require('electron');
const activeWin = require('active-win');
const robot1 = require('robotjs');
require('dotenv').config();
const path = require('path');
const url = require('url');
const {
    login,
    fetchUserInfo,
    updateUserInfo,
    exitDepartment,
    joinDepartment,
} = require('./utils/fetchAPI.js'); 

let win = null;
const  RobotHandler = require('./utils/robotUtil.js');
const robot = new RobotHandler();

const createBrowserWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 750,
        minHeight: 750,
        minWidth: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: false, // Tùy chọn thêm nếu cần
        },
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, '../public', 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    win.removeMenu();

    const ctxMenu = new Menu();

    ctxMenu.append(
        new MenuItem({
            label: 'Open Dev Tools',
            accelerator: 'CmdOrCtrl+Shift+I',
            click: () => win.webContents.openDevTools(),
        })
    );

    ctxMenu.append(
        new MenuItem({
            label: 'Restart',
            accelerator: 'CmdOrCtrl+R',
            click: () => win.reload(),
        })
    );

    win.webContents.on('context-menu', (e, params) => {
        ctxMenu.popup({
            window: win,
            x: params.x,
            y: params.y,
        });
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Định nghĩa các handler IPC
ipcMain.handle('login', async (event, user) => {
    try {
        const loginData = await login(user);
        const userInfo = await fetchUserInfo(loginData.data.token, loginData.data.id);
        const { departmentDTOs: Departments, ...PersonInfor } = userInfo.data;
        PersonInfor.token = loginData.data.token;
        win.webContents.send('login-success');
        return { 
            success: true, 
            data: { 
            Departments, PersonInfor, 
            state: loginData.state, 
            message: loginData.message 
            } 
        };
    } catch (error) {
        return { 
            success: false,
            message: error.message, 
            data: {} 
            };
    }
});
ipcMain.handle('changeInfor-user', async (event, { token, id, user }) => {
    try {
        await updateUserInfo(token, id, user);
        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            message: error.message 
        };
    }
});

ipcMain.handle('exit-department', async (event, { token, idnv, mapb }) => {
    try {
        await exitDepartment(token, idnv, mapb);
        return { success: true, data: { state: true } };
    } catch (error) {
        return { 
            success: false, 
            data: { 
                state: false 
            }, 
            message: error.message 
        };
    }
});

ipcMain.handle('join-department', async (event, { token, idnv, mapb }) => {
    try {
        const responseData = await joinDepartment(token, idnv, mapb);
        return { success: true, data: responseData.data };
    } catch (error) {
        return { 
            success: false, 
            message: error.message, 
            data: {} 
        };
    }
});


ipcMain.on('socket-status', (event, data) => {
    win.webContents.send('socket-status',data);
});

ipcMain.on('server-info', (event, data) => {
    win.webContents.send('server-info',data);
});

ipcMain.on('socket-notifySession', (event, data) => {
    win.webContents.send('socket-notifySession',data);
});

ipcMain.on('socket-notify', (event, data) => {
    win.webContents.send('socket-notify',data);
});


ipcMain.on("robot-event", (event, { type, data }) => {
    switch (type) {
        case "mousemove":
            robot.handleMouseMove(data);
            break;

        case "dblclick":
        case "mouse-left-click":
        case "mouse-middle-click":
        case "mouse-right-click":
            robot.handleMouseClick(data);
            break;

        case "drag-start":
            robot.handleDragStart();
            break;

        case "mouse-drag":
            robot.handleMouseDrag(data);
            break;

        case "drag-end":
            robot.handleDragEnd();
            break;

        case "wheel":
            robot.handleWheel(data);
            break;

        case "keyup":
            robot.handleKeyUp(data);
            break;

        case "keydown":
            robot.handleKeyDown(data);
            break;

        default:
            console.warn("Loại event không xác định:", type);
            break;
    }
});

async function getActiveAppDetails() {
    const window = await activeWin(); 
    if (!window) {
        return null;
    }
    // active app
    const app = window.owner.name;
    let domain="";

    if (app.toLowerCase().includes('chrome') 
        || app.toLowerCase().includes('firefox') 
        || app.toLowerCase().includes('edge')) {
        
        robot1.keyTap('l', 'control');
        robot1.keyTap('c', 'control'); 
        domain = clipboard.readText(); 
    }
    win.webContents.send('active-app',{app,domain});
}

setInterval(() => {
    getActiveAppDetails();
}, 10000);


