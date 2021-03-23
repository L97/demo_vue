<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapTrace',
  mixins: [registerMixin],
  props: [
    'data',
    'strokeWidth',
    'strokeColor'
  ],
  methods: {
    _initComponent () {
      if (!this.layer) {
        this.layer = this.$parent.HMapVector
      }

      if (!this.data || this.data.length <= 1) {
        console.warn('hmap: trace data can not be null!')
        return
      }

      // 度转米
      this.traceData = this.data.map((item, index) => {
        var { longitude, latitude } = item
        var lonlat = this.toLonLat([longitude, latitude])
        var newItem = { ...item }
        newItem.longitude = lonlat.lon
        newItem.latitude = lonlat.lat

        return newItem
      })

      this.$hmapComponent && this.$hmapComponent.destory()
      this.$hmapComponent = new this.HGIS.Biz.BayonetTrace(this.$hmap, this.layer, () => {})
      // 样式
      this.$hmapComponent._style['CompleteLine'].strokeWidth = 1
      this.$hmapComponent._style['Line'].strokeWidth = 8
      this.$hmapComponent._style['Line'].strokeColor = '#1bac2d'
      this.$hmapComponent._style['PointDraw'].fillOpacity = 0
      this.$hmapComponent._style['PointDraw'].strokeOpacity = 0
      // 设置数据
      this.$hmapComponent.setPath(this.traceData)
    }
  },
  render () { return null },
  watch: {
    data: {
      handler () {
        this._initComponent()
      },
      deep: true
    }
  }
}
</script>
