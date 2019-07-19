<template>
  <div class="whole">
    <div class="draw" :style="{display:drawShow}">
      <canvas id="canvas" @mousedown="start($event)" @mouseup="stop" @mousemove="putPoint($event)"></canvas>
    </div>

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
    </main>
  </div>
</template>

<script>
// import { constants } from 'fs';
const ipc = require('electron').ipcRenderer

let cxt;
// var canvas=document.getElementById("canvas");
// console.log(canvas)
// var cxt=canvas.getContext("2d");
// var radius=5;
// var falge=false;
// cxt.lineWidth=10;



export default {
  data() {
    return {
      connections: [],
      flage: false,
      drawShow: ''
    }
  },
  methods: {
    getConnections(){
      ipc.send('notice-main', '01')
    },
    connectTo(address){
      address = address.slice(0,-5)
      let canvas = document.getElementById('canvas')
      canvas.width=window.innerWidth;
      canvas.height=window.innerHeight;
      cxt = document.getElementById('canvas').getContext("2d")
      cxt.lineWidth=10
      this.drawShow = 'block'
      // console.log(address)
    },
    putPoint(e){
      if(this.falge){
        console.log(e)
        cxt.lineTo(e.clientX, e.clientY);
        cxt.stroke();
        cxt.beginPath();
        cxt.arc(e.clientX, e.clientY, 5, 0, 360, false);
        cxt.fill();
        cxt.beginPath();
        cxt.moveTo(e.clientX, e.clientY);
      }
    },
    start(e){
      this.falge=true;
      this.putPoint(e);
    },
    stop(){
      this.falge=false;
      cxt.beginPath();
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
    .draw{
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 2;
      display: none;
      background: wheat;
    }
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
    }
  }
</style>
