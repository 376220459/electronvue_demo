<template>
  <div class="whole">
    <div class="title">HELLO CVTE</div>
    <hr>
    <main>
      <div class="list">
        <button class="get-button" @click="getConnections">获取当前用户</button>
        <ul>
          <li v-for="(item, index) in connections" :key="index">
            <span>{{ item }}</span>
            <button @click="connectTo(item)">和他协作</button>
          </li>
        </ul>
      </div>
      <div class="draw"></div>
    </main>
  </div>
</template>

<script>
import { constants } from 'fs';
  const ipc = require('electron').ipcRenderer
export default {
  data() {
    return {
      connections: []
    }
  },
  methods: {
    getConnections(){
      ipc.send('notice-main', '01')
    },
    connectTo(address){
      address = address.slice(0,-5)
      console.log(address)
    }
  },
  mounted() {
      ipc.on('notice-vice', (event, arg)=>{
        if(arg.status == '0'){
          console.log(arg.msg)
        }else if(arg.status == '1'){
          console.log(arg.msg)
          this.connections = arg.connections;
          // this.$set(this.connections,0,...arg.connections)
        }
      })
  },
}
</script>

<style lang="scss" scoped>
  .whole{
    height: 100%;
    display: flex;
    flex-direction: column;
    .title{
      text-align: center;
      color: skyblue;
      font-size: 80px;
    }
    main{
      display: flex;
      flex-grow: 1;
      .list{
        box-sizing: border-box;
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        .get-button{
          margin-bottom: 20px;
        }
        li{
          list-style-type: square;
        }
      }
      .draw{
        box-sizing: border-box;
        width: 80%;
      }
    }
  }
</style>
