const { contextBridge, ipcRenderer } = require('electron');

// Expose safe API to renderer process
contextBridge.exposeInMainWorld('authAPI', {
    login: (email, password) => ipcRenderer.invoke('login', { email, password })
});
