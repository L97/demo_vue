<script>
import registerMixin from '../mixins/register-component'
import Vue from 'vue'
export default {
  name: 'HMapMarker',
  mixins: [registerMixin],
  props: [
    'offset',
    'lonlat',
    'autoCenter',
    'className'
  ],
  data () {
    return {
      HGIS: null,
      layer: null,
      timer: null
    }
  },
  created () {
    this.tmpVM = new Vue({
      data () {
        return { node: '' }
      },
      render (h) {
        const { node } = this
        return h('div', { ref: 'node' }, Array.isArray(node) ? node : [node])
      }
    }).$mount()
  },
  methods: {
    _initComponent (options) {
      if (!options.lonlat) {
        return
      }
      if ((this.$slots.default && this.$slots.default.length) || this.className) {
        let node = this.tmpVM.$refs.node
        node.style.position = 'absolute'
        this.className && (node.className = this.className)
        node.addEventListener('click', (e) => { this.$emit('click', e) })
        options.content = node
      }
      this.$hmapComponent = new this.HGIS.ImapMarker(
        options.lonlat,
        options.content,
        options.offset || { x: 0, y: 0 },
        this.layer
      )
      this.layer.addMarker(this.$hmapComponent)

      this.autoCenter && this.$setCenter()
    },
    $setCenter () {
      this.$hmap.setCenter(this.toLonLat(this.lonlat))
    }
  },
  render (h) {
    const slots = this.$slots.default || []
    if (slots.length) {
      this.tmpVM.node = slots
    }
    return null
  },
  destroyed () {
    this.tmpVM.$destroy()
  },
  watch: {
    lonlat (newVal, oldVal) {
      if (this.$hmap) {
        this.autoCenter && this.$setCenter()
        if (newVal.toString() !== oldVal.toString()) {
          this.$hmapComponent.setLonLat(this.lonlat)
        }
      }
    },
    offset (newVal, oldVal) {
      if (this.$hmap) {
        if (newVal.toString() !== oldVal.toString()) {
          this.$hmapComponent.setOffset(this.offset)
        }
      }
    },
    className () {
      this.tmpVM.$refs.node.className = this.className
    }
  }
}
</script>
