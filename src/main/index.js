import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const ipc = require('electron').ipcMain

ipc.on('notice-main', function (event, arg) {
  if(arg === '01'){
    const message = `来自渲染进程: 发来了 01 信号`
    console.log(message)
  }
  event.sender.send('notice-vice', '主进程完成任务')
})


const dgram = require('dgram')

const server = dgram.createSocket('udp4')

server.on('error',err=>{
    console.log(err)
    server.close()
})

server.on('message',(msg,rinfo)=>{
    console.log(`message: ${msg}`)
    console.log(`rinfo: ${rinfo}`)
})

server.on('listening',()=>{
    const address = server.address()
    console.log(`address: ${address.address}:${address.port}`)
})

server.on('close',()=>{
    console.log('closed')
})

server.bind('8888','127.0.0.1')
