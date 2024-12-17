const { ipcRenderer } = require('electron');

// Expose các API vào window để sử dụng dưới dạng API.hàm
window.API = {
    login: (email, password) => ipcRenderer.invoke('login', { email, password }),
    changeInfor: (user) => ipcRenderer.invoke('changeInfor-user', user),
    exitDePart: (data) => ipcRenderer.invoke('exit-department', data),
    joinDePart: (data) => ipcRenderer.invoke('join-department', data),
    closeSocket: () => ipcRenderer.send('CloseSocket'),
    sendMessage: (channel, data) => ipcRenderer.send(channel, data),
    receiveMessage: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
};