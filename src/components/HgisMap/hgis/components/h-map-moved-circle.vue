<script>
import registerMixin from '../mixins/register-component'
import dragbar from '../style/images/dragbar.png'
export default {
  name: 'HMapMovedCircle',
  mixins: [registerMixin],
  props: [
    'x',
    'y',
    'radius',
    'noTransform'
  ],
  methods: {
    _initComponent () {
      this.layer = this.$parent.HMapGridLayer
      if (!this.layer) {
        this.layer = this.$parent.layer
      }

      let { lon, lat } = !this.noTransform
        ? this.toLonLat([this.x, this.y]) : {
          lon: this.x,
          lat: this.y
        }

      this.$hmapComponent = new this.HGIS.Plot.MovedCircle(this.layer, {
        center: {
          x: lon,
          y: lat
        },
        isDragCenter: true,
        map: this.$hmap,
        radius: this.radius * 1,
        centerStyle: {
          graphicName: 'circle',
          pointRadius: 1,
          strokeColor: '#1D75DE',
          fillColor: '#1D75DE'
        },
        circleStyle: {
          cursor: 'inherit',
          strokeColor: '#1E76DE',
          fillColor: '#b2cae8',
          fillOpacity: 0.5
        },
        dragPointStyle: {
          externalGraphic: dragbar,
          graphicHeight: 16,
          graphicWidth: 25,
          fillColor: '#1D75DE',
          strokeColor: '#1D75DE'
        },
        callback: (data) => {
          this.$emit('drawend', this.HGIS.Utils.geom2Wkt(data.circle.clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))))
        }
      })
      this.$emit('drawend', this.HGIS.Utils.geom2Wkt(this.$hmapComponent.circle.clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))))
    },
    reBuild () {
      this.$hmapComponent && this.$hmapComponent.destroy()
      this._initComponent()
    }
  },
  render (h) { return null },
  watch: {
    x () { this.reBuild() },
    y () { this.reBuild() },
    radius () { this.reBuild() }
  }
}
</script>
