<template>
  <div class="zrender-wrap">
    <div id="zrender" ref="zrender" class="zrender"></div>
  </div>
</template>

<script>
import * as zrender from 'zrender'
export default {
  name: 'Zrender',
  data () {
    return {
      zr: null,
      group: null,
      pArr: []
    }
  },
  mounted () {
    this.zRenderInit()
  },
  methods: {
    zRenderInit () {
      let dom = this.$refs.zrender
      this.zr = zrender.init(dom)

      this.group = new zrender.Group()
      this.zr.add(this.group)
      this.drawTrochoid()
      this.drawCircle()
      for (let i = 0; i < 50; i++) {
        this.drawParkle()
      }
      this.loop()
    },
    loop () {
      for (let i = 0; i < this.pArr.length; i++) {
        let p = this.pArr[i]
        p.animate('shape', true).when(3000, {
          x: window.innerWidth * Math.random(),
          y: window.innerHeight * Math.random()
        }).delay(500).start()
      }
      // window.requestAnimationFrame(this.loop)
    },
    drawParkle () {
      let p = new zrender.Rect({
        shape: {
          x: window.innerWidth * Math.random(),
          y: window.innerHeight * Math.random(),
          width: 4,
          height: 4
        },
        style: {
          fill: '#0d81e8',
          opacity: 1
        }
      })
      this.group.add(p)
      this.pArr.push(p)
    },
    drawTrochoid () {
      let option = {
        shape: {
          cx: 200,
          cy: 200,
          r: 80,
          r0: 35,
          d: 50,
          n: 'out'
        },
        style: {
          fill: 'transparent', // 填充颜色，默认#000
          stroke: 'pink', // 描边颜色，默认null
          lineWidth: 2, // 线宽， 默认1
          text: '外旋轮曲线',
          fontSize: '25',
          textFill: 'red'
        },
        hoverable: true, // default true
        draggable: true
      }
      // 外旋轮线
      let TrochoidShape = new zrender.Trochoid(option)
      // 添加外旋轮线到group里
      this.group.add(TrochoidShape)
    },
    drawCircle () {
      // 创建一个圆circle
      let circle = new zrender.Circle({
        shape: {
          cx: 300, // 圆心x坐标
          cy: 300, // 圆心y坐标
          r: 50 // 圆的半径
        },
        style: {
          fill: 'transparent', // 填充颜色，默认#000
          stroke: '#000', // 描边颜色，默认null
          lineWidth: 2 // 线宽， 默认1
        },
        draggable: true
      })
      // 添加圆到group里
      this.group.add(circle)
      circle.animate('style', true)
        .when(3000, {stroke: 'red'})
        .start()
    }
  }
}
</script>

<style lang="scss" scope>
.zrender-wrap{
  height: calc(100vh - 58px);
  .zrender{
    height: 100%;
  }
}
</style>
