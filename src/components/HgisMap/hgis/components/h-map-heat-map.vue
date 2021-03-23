<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapHeatMap',
  props: [
    'data',
    'max'
  ],
  mixins: [registerMixin],
  methods: {
    _initComponent () {
      if (!this.HGIS.Utils.isSupportCanvas()) {
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        return
      }
      if (!this.data) {
        return
      }
      this.$hmapComponent = new this.HGIS.Layer.Heatmap('Heatmap Layer', this.$hmap,
        this.$hmap.baseLayer, {
          // 热力图是否可见
          visible: true,
          // [0,+∞) 设置光圈的半径大小，值>=0,=0取得是默认值
          radius: 20,
          // 光圈颜色梯度
          gradient: {
            '0.45': 'rgb(0,0,255)',
            '0.55': 'rgb(0,255,255)',
            '0.65': 'rgb(0,255,0)',
            '0.95': 'yellow',
            '1.0': 'rgb(255,0,0)'
          }
          // max: true  //最大值
        }
      )

      this.$hmap.addLayers([this.$hmapComponent])
      this.$hmapComponent.setDataSet({
        max: this.max || 20,
        data: this.handleData(this.data)
      })
    },
    handleData (data) {
      return data.map(item => {
        return {
          count: item.count,
          lonlat: this.toLonLat([item.longitude, item.latitude])
        }
      })
    }
  },
  render () { return null },
  watch: {
    data: {
      handler () {
        this.$hmapComponent && this.$hmapComponent.setDataSet({
          max: this.max || 20,
          data: this.handleData(this.data)
        })
      },
      deep: true
    },
    max () {
      this.$hmapComponent && this.$hmapComponent.setDataSet({
        max: this.max || 20,
        data: this.handleData(this.data)
      })
    }
  }
}
</script>
