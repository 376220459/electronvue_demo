<template>
  <div>
    <div class="title"><span>Hello CVTE</span></div>
    <hr>
    <button @click="send">请求主进程</button>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  ipc.on('notice-vice', function (event, arg) {
    const message = `来自主进程: ${arg}`
    console.log(message)
  })
export default {
  methods: {
    send(){
      ipc.send('notice-main', '01')
    }
  },
}
</script>

<style lang="scss" scoped>
  .title{
    text-align: center;
    span{
      color: skyblue;
      font-size: 80px;
    }
  }
</style>
