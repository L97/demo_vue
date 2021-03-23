<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapBizer',
  props: [
    'start',
    'end',
    'control',
    'lineStyle'
  ],
  mixins: [registerMixin],
  data () {
    return {
      width: 0,
      height: 0,
      content: null,
      svg: null,
      startPoint: [],
      endPoint: []
    }
  },
  created () {
  },
  methods: {
    _initComponent () {
      if (!this.start || this.start.length === 0) {
        return
      }
      if (!this.layer) {
        this.layer = this.$parent.HMapMarkerLayer
      }
      // 创建容器
      this.createContainer()
      // 设置大小
      this.setSize()
      // 创建svg
      this.createLine(this.width, this.height)
      // 创建点坐标
      this.$hmapComponent = new this.HGIS.ImapMarker(
        this.toLonLat(this.start),
        this.content,
        { x: 0, y: 0 },
        this.layer
      )
      // 插入图层
      this.layer.addMarker(this.$hmapComponent)
      // 注册时间
      this.$hmap.events.register('zoomend', {}, this.zoomendResize, null)
    },
    createContainer () {
      this.content = document.createElement('div')
    },
    setSize () {
      if (this.content) {
        let { start, end } = this
        // 计算容器大小
        let startPx = this.$hmap.getViewPortPxFromLonLat(this.toLonLat(start))
        let endPx = this.$hmap.getViewPortPxFromLonLat(this.toLonLat(end))
        this.width = Math.round(Math.abs(startPx.x - endPx.x))
        this.height = Math.round(Math.abs(startPx.y - endPx.y))
        // 转相对坐标
        this.startPoint = [
          0,
          startPx.x < endPx.x
            ? (startPx.y < endPx.y ? 0 : this.height)
            : (startPx.y < endPx.y ? this.height : 0)
        ]

        this.endPoint = [
          this.width,
          startPx.x < endPx.x
            ? (startPx.y < endPx.y ? this.height : 0)
            : (startPx.y < endPx.y ? 0 : this.height)
        ]

        this.ctrlPoint = [
          this.height * 2 / 3,
          0
        ]

        this.content.style.position = 'absolute'
        this.content.style.width = this.width + 'px'
        this.content.style.height = this.height + 'px'
      }
    },
    createSvg (tag, attr) {
      if (!document.createElementNS) return
      var svg = document.createElementNS('http://www.w3.org/2000/svg', tag)
      for (var i in attr) {
        if (i === 'xlink:href') {
          svg.setAttribute('http://www.w3.org/1999/xlink', this.toLowerCase(i), attr[i])
        }
        svg.setAttribute(this.toLowerCase(i), attr[i])
      }
      return svg
    },
    createLine () {
      if (!this.content) {
        return
      }
      let svg = this.createSvg('svg', {
        'version': '1.1',
        'width': '100%',
        'height': '100%'
      })
      let path = this.createSvg('path', {
        d: this.toPath({
          M: [this.startPoint],
          Q: [this.ctrlPoint, this.endPoint]
        }),
        stroke: '#1890ff',
        strokeWidth: '3',
        fill: 'none',
        strokeDasharray: '5,5',
        ...this.lineStyle
      })

      svg.appendChild(path)
      this.content.innerHTML = ''
      // 插入贝塞尔曲线
      this.content.appendChild(svg)
    },
    zoomendResize () {
      this.setSize()
      this.createLine()
    },
    toPath (e) {
      return Object.keys(e).map(key => key + e[key].map(item => item.join(',')).join(' ')).join(' ')
    }
  },
  render () { return null }
}
</script>
