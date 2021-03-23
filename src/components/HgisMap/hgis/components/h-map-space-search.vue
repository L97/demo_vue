<template>
  <div>
    <h-map-moved-circle
      v-if="type === 'point'"
      :x="x"
      :y="y"
      :radius="radius"
      @drawend="drawend"
      :noTransform="true">
    </h-map-moved-circle>

    <h-map-poly-line
      v-if="type === 'polyline'"
      :geom="geom"
      :width="width"
      @drawend="drawend">
    </h-map-poly-line>

    <h-map-rec
      v-if="type && type !== 'polyline' && type !== 'point'"
      :geom="geom"
      @drawend="drawend">
    </h-map-rec>
  </div>
</template>
<script>
import registerMixin from '../mixins/register-component'
import HMapMovedCircle from '../components/h-map-moved-circle'
import HMapPolyLine from '../components/h-map-poly-line'
import HMapRec from '../components/h-map-rec'
export default {
  name: 'HMapSpaceSearch',
  mixins: [registerMixin],
  components: { HMapMovedCircle, HMapPolyLine, HMapRec },
  props: [
    'wkt',
    'defaultRadius'
  ],
  data () {
    return {
      type: '',
      // 点圆圈
      x: '',
      y: '',
      radius: '',
      // polyline
      geom: '',
      width: 100,
      promiss: null,
      tips: {
        circle: '鼠标按下开始，释放结束，esc退出',
        rectangle: '鼠标按下开始，释放结束，esc退出',
        polygon: '鼠标按下开始，双击结束，esc退出',
        polyline: '鼠标按下开始，双击结束，esc退出',
        point: '鼠标按下开始，释放结束，esc退出'
      }
    }
  },
  methods: {
    _initComponent () {
      this.layer = this.$parent.HMapGridLayer
    },
    drawend (wkt) {
      this.resolve && this.resolve(wkt)
      this.$emit('wkt', wkt)
    },

    $draw (type, width) {
      // 框选前清空
      this.type = null
      this.$emit('wkt', null)
      this.promiss = new Promise(resolve => { this.resolve = resolve })
      // 开始绘制
      this.$hmap.draw(type, null, 'geometry', this.tips[type], {
        keepOn: false,
        ifClear: true,
        errMsg: true
      }, (geom) => {
        this.type = type
        this.x = geom.x
        this.y = geom.y
        this.radius = this.defaultRadius || 500
        this.geom = geom
        this.width = width
      }, () => {
        console.log('cancel')
      })
      return this.promiss
    },
    $clear () {
      this.type = ''
      this.$emit('wkt', null)
    }
  }
}
</script>
