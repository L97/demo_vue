<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapGrid',
  mixins: [registerMixin],
  props: [
    'wkt',
    'autoCenter'
  ],
  data () {
    return {
      HGIS: null,
      $hmap: null,
      layer: null,
      geometry: null
    }
  },
  methods: {
    _initComponent (options) {
      if (!options.wkt) {
        console.warn('param "wkt" can not be null')
        return
      }
      if (!this.layer) {
        this.layer = this.$parent.HMapGridLayer
      }
      this.geometry = this.HGIS.Utils.wkt2Geom(options.wkt)
      this.geometry.transform(new this.HGIS.Projection('EPSG:4326'), this.$hmap.getProjectionObject())
      this.$hmapComponent = new this.HGIS.Feature.Vector(this.geometry)
      this.layer.addFeatures(this.$hmapComponent)

      this.autoCenter && this.$setCenter()
    },
    reBuild () {
      if (this.$hmap) {
        this.$hmapComponent && this.$hmapComponent.destroy()
        this._initComponent(this.convertProps())
      }
    },
    $setCenter () {
      var center = this.geometry.getCentroid()
      var lonlat = new this.HGIS.LonLat(center.x, center.y)
      this.$hmap.setCenter(lonlat)
      this.$hmap.zoomToExtent(this.geometry.getBounds())
    }
  },
  render (h) { return null },
  watch: {
    wkt () {
      this.reBuild()
    }
  }
}
</script>
