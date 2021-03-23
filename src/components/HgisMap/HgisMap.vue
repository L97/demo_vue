<template>
  <div class="map-demo">
    <h-map :baseUrl="'https://10.194.199.121'" :initLevel='16' ref="hmap">
      <h-map-marker
        :key="Math.random()"
        :lonlat="[121.40344874,31.17345167]"
        :offset="[-14, -10]"
        :autoCenter="true"
        className="markers">
        <div class="marker__content">{{ 'hhhhhhhhhhhh' }}</div>
      </h-map-marker>
    </h-map>
    <div class="map-tools">
      <el-dropdown @command="drawCommand" size="small">
        <el-button>
          要素绘制<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">点</el-dropdown-item>
          <el-dropdown-item :command="2">折线</el-dropdown-item>
          <el-dropdown-item :command="3">流线</el-dropdown-item>
          <el-dropdown-item :command="4">矩形</el-dropdown-item>
          <el-dropdown-item :command="5">圆</el-dropdown-item>
          <el-dropdown-item :command="6">椭圆</el-dropdown-item>
          <el-dropdown-item :command="7">任意多边形</el-dropdown-item>
          <el-dropdown-item :command="8">清空</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="measureCommand" size="small">
        <el-button>
          测量<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="1">测距</el-dropdown-item>
          <el-dropdown-item :command="2">测面积</el-dropdown-item>
          <el-dropdown-item :command="3">清空</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HgisMap',
  created () {
  },
  methods: {
    drawCommand (data) {
      switch (data) {
        case 1:
          this.$refs.hmap.$hmap.draw('point', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制点', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 2:
          this.$refs.hmap.$hmap.draw('polyline', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制折线', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 3:
          this.$refs.hmap.$hmap.draw('freeline', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制流线', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 4:
          this.$refs.hmap.$hmap.draw('rectangle', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制矩形', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 5:
          this.$refs.hmap.$hmap.draw('circle', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制圆', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 6:
          this.$refs.hmap.$hmap.draw('ellipse', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制椭圆', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 7:
          this.$refs.hmap.$hmap.draw('polygon', this.$refs.hmap.HMapGridLayer, 'geometry', '绘制任意多边形', {'keepOn': false, 'ifClear': false}, null, null)
          break
        case 8:
          this.$refs.hmap.HMapGridLayer.removeAllFeatures()
      }
    },
    measureCommand (data) {
      switch (data) {
        case 1:
          this.$refs.hmap.HMapOpt.measureDistance()
          break
        case 2:
          this.$refs.hmap.HMapOpt.measureArea()
          break
        case 3:
          this.$refs.hmap.HMapOpt.clear()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-demo{
  height: 100vh;
  .markers{
    .marker__content{
      border: 1px solid green;
      background: #fff;
      color: green;
      &::before{
        content: '';
        border: 6px solid;
        border-color: green transparent transparent transparent;
        position: absolute;
        bottom: -12px;
        left: calc(50% - 3px);
      }
    }
  }
  .map-tools{
    position: absolute;
    top: 10px;
    left: 20px;
    z-index: 9999;
  }
}
</style>
