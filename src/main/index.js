import { app, BrowserWindow } from 'electron'

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
    height: 600,
    useContentSize: true,
    width: 1000
  })
  // mainWindow.maximize()

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
let me;
let connections = [];
const dgram = require('dgram'),
    server = dgram.createSocket("udp4"),
    multicastAddr = '224.100.100.100';

server.on("error",err=>{
    console.log('socket已关闭');
})

server.on('error',(err)=>{
    console.log(err);
});

server.on("listening",()=>{
    console.log("socket正在监听中.....");
    server.addMembership(multicastAddr);
    server.setMulticastTTL(128);
})

server.on('message',(msg,rinfo)=>{
    // console.log(`msg: ${msg}`)
    if(JSON.parse(msg).status == 'access'){
      if(connections.indexOf(rinfo.address + ':' + rinfo.port) == -1){
        connections.push(rinfo.address + ':' + rinfo.port)
      }
      me.send('notice-vice', {
        status: '1',//返回列表
        msg: '返回列表',
        connections: connections
      })
    // }else if(JSON.parse(msg).status == 'get'){
    }else if(JSON.parse(msg).status === 'get' && rinfo.address !== server.address){
      server.send(JSON.stringify({
        status: 'access'
      }),'8066',multicastAddr);
    }else if(JSON.parse(msg).status == 'start'){
      // console.log('start')
      
      me.send('notice-vice', {
        status: 'start',
        msg: 'start',
        e: JSON.parse(msg).e
      })
    }else if(JSON.parse(msg).status == 'stop'){
      // console.log('stop')
      
      me.send('notice-vice', {
        status: 'stop',
        msg: 'stop'
      })
    }else if(JSON.parse(msg).status == 'putPoint'){
      // console.log('putPoint')
      
      me.send('notice-vice', {
        status: 'putPoint',
        msg: 'putPoint',
        e: JSON.parse(msg).e
      })
    }
})

server.bind('8066')

ipc.on('notice-main',(event, arg)=>{
  if(arg.status == '01'){
    server.send(JSON.stringify({
      status: 'get'
    }),'8066',multicastAddr)
    me = event.sender
    me.send('notice-vice', {
      status: '0',//正在获取列表...
      msg: '正在获取列表...'
    })
  }else if(arg.status == 'start'){
    server.send(JSON.stringify({
      status: 'start',
      msg: 'start',
      e: arg.e
    }),'8066',arg.otherAddress);
  }else if(arg.status == 'stop'){
    server.send(JSON.stringify({
      status: 'stop',
      msg: 'stop'
    }),'8066',arg.otherAddress);
  }else if(arg.status == 'putPoint'){
    server.send(JSON.stringify({
      status: 'putPoint',
      msg: 'putPoint',
      e: arg.e
    }),'8066',arg.otherAddress);
  }
})





