const {app,BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const url = require('url')

const createBrowserWindow =  () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 750,
        minHeight: 750,
        minWidth: 1200,
        webPreferences: {
            preload: path.join(__dirname, 'preloads', 'Preload.js'),
            nodeIntegration: false,  // Tắt Node.js trong renderer
            contextIsolation: true   // Bật cách ly ngữ cảnh
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname,'views' ,'index.html'),
        protocol: "file:",
        slashes: true
    }))
}

app.whenReady().then(()=>{
    createBrowserWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createBrowserWindow()
        }
    })

})

// neu dong voi ung dung chạy trên macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

   // Xử lý yêu cầu đăng nhập từ renderer
ipcMain.handle('login', async (event, { email, password }) => {
    try {
      // Gửi yêu cầu đến mock server
      const response = await fetch('http://localhost:3000/LOGIN',{
        method: 'GET', // Hoặc 'POST', tùy vào yêu cầu của bạn
        headers: {
            'Cache-Control': 'no-cache', // Tắt cache
        }
    });
  
      // Nhận phản hồi từ mock server
      const result = await response.json();
  
      // Trả kết quả về renderer process
      return result;
    } catch (error) {
      console.error('Error:', error);
      // Trả phản hồi lỗi về renderer process nếu có lỗi
      return { success: false, message: 'An error occurred during login!' };
    }
  });
  