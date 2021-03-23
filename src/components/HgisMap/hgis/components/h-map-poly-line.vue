<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapPolyLine',
  mixins: [registerMixin],
  props: [
    'width',
    'geom',
    'featureId'
  ],
  data () {
    return {
      LayerStyle: {
        golFillColor: '#b2cae8',
        golStrokeColor: '#7092ff',
        golFillOpacity: 0.6,
        golStrokeWidth: 2,
        fillOpacity: 0.5
      }
    }
  },
  methods: {
    _initComponent () {
      if (!this.layer) {
        this.layer = this.$parent.layer
      }
      var geomOperate = new this.HGIS.Geometry.GeomRelation(true)

      geomOperate.buffer(this.geom, (this.width || 100), 5, -1, (vecotor) => {
        if (!vecotor) {
          this.$emit('error')
          return
        }
        var bufferGeo = vecotor.geometry
        var bufferWkt = this.HGIS.Utils.geom2Wkt(bufferGeo.clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326')))

        this.$hmapComponent = vecotor
        this.$hmapComponent.style = {
          strokeColor: this.LayerStyle.golStrokeColor,
          fillColor: this.LayerStyle.golFillColor,
          fillOpacity: this.LayerStyle.fillOpacity
        }
        if (this.featureId) {
          this.$hmapComponent.id = this.featureId
        }
        // 添加到默认矢量图层
        this.layer.addFeatures([this.$hmapComponent])

        this.$emit('drawend', bufferWkt)
      })
    },
    rebuild () {
      this.$hmapComponent && this.$hmapComponent.destroy()
      this._initComponent()
    }
  },
  render (h) { return null },
  watch: {
    width () { this.rebuild() },
    geom () { this.rebuild() }
  }
}
</script>
