<script>
import registerMixin from '../mixins/register-component'
export default {
  name: 'HMapRec',
  mixins: [registerMixin],
  props: [
    'geom'
  ],
  data () {
    return {
      style: {
        fillColor: '#b2cae8',
        fillOpacity: 0.6,
        strokeColor: '#7092ff ',
        strokeWidth: 2
      }
    }
  },
  methods: {
    _initComponent () {
      if (!this.layer) {
        this.layer = this.$parent.layer
      }
      this.$hmapComponent = new this.HGIS.Feature.Vector(this.geom.clone(), null, this.style)
      this.layer.addFeatures([this.$hmapComponent])
      this.$emit('drawend', this.HGIS.Utils.geom2Wkt(this.geom.clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))))
    },
    rebuild () {
      this.$hmapComponent && this.$hmapComponent.destroy()
      this._initComponent()
    }
  },
  render (h) { return null },
  watch: {
    geom () {
      this.rebuild()
    }
  }
}
</script>
