<template>
  <div class="whole">
    <div id="draw" class="draw" :style="{display:drawShow}">
      <canvas id="canvas" @mousedown="start($event);start2($event)" @mouseup="stop();stop2()" @mousemove="putPoint($event);putPoint2($event)"></canvas>
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
const ipc = require('electron').ipcRenderer

let cxt,cxt2

window.addEventListener('resize',function(){
  let canvas = document.getElementById('canvas');
  let draw = document.getElementById('draw')
  // canvas.width = draw.offsetWidth;
  // canvas.height = draw.offsetHeight;
},false)

export default {
  data() {
    return {
      connections: [],
      flage: false,
      flage2: false,
      drawShow: '',
      otherAddress: ''
    }
  },
  methods: {
    getConnections(){
      ipc.send('notice-main', {
        status: '01'
      })
    },
    connectTo(address){
      address = address.slice(0,-5)
      this.otherAddress = address
      let canvas = document.getElementById('canvas')
      canvas.width = 600
      canvas.height = 600
      // canvas.width=window.innerWidth
      // canvas.height=window.innerHeight
      cxt = document.getElementById('canvas').getContext("2d")
      cxt2 = document.getElementById('canvas').getContext("2d")
      // cxt.lineWidth=10
      this.drawShow = 'block'
    },
    putPoint(e){
      if(this.falge){
        console.log(e)
        cxt.lineTo(e.clientX, e.clientY);
        cxt.stroke();
        cxt.beginPath();
        // cxt.arc(e.clientX, e.clientY, 5, 0, 360, false);
        cxt.fill();
        cxt.beginPath();
        cxt.moveTo(e.clientX, e.clientY);
      }
    },
    putPoint_2(e){
      if(this.falge2){
        cxt2.lineTo(e.clientX, e.clientY);
        cxt2.stroke();
        cxt2.beginPath();
        // cxt.arc(e.clientX, e.clientY, 5, 0, 360, false);
        cxt2.fill();
        cxt2.beginPath();
        cxt2.moveTo(e.clientX, e.clientY);
      }
    },
    putPoint2(e){
      if(this.falge){
        ipc.send('notice-main', {
          status: 'putPoint',
          otherAddress: this.otherAddress,
          e: {
            clientX: e.clientX,
            clientY: e.clientY
          }
        })
      }
    },
    start(e){
      this.stop()
      this.stop_2()
      
      this.falge=true;
      this.putPoint(e);
    },
    start_2(e){
      this.stop()
      this.stop_2()
      
      this.falge2=true;
      this.putPoint_2(e);
    },
    start2(e){
      ipc.send('notice-main', {
        status: 'start',
        otherAddress: this.otherAddress,
        e: {
          clientX: e.clientX,
          clientY: e.clientY
        }
      })
    },
    stop(){
      this.falge=false;
      cxt.beginPath();
    },
    stop_2(){
      this.falge2=false;
      cxt2.beginPath();
    },
    stop2(){
      ipc.send('notice-main', {
        status: 'stop',
        otherAddress: this.otherAddress,
      })
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
        }else if(arg.status == 'start'){
          this.start_2(arg.e)
        }else if(arg.status == 'stop'){
          this.stop_2()
        }else if(arg.status == 'putPoint'){
          this.putPoint_2(arg.e)
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
    position: relative;
    .draw{
      box-sizing: border-box;
      height: 600px;
      width: 600px;
      position: absolute;
      // left: 50%;
      // margin-left: -300px;
      // top: 50%;
      // margin-top: -300px;
      z-index: 2;
      display: none;
      canvas{
        background: wheat;
      }
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
