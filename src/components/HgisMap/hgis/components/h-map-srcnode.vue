<script>
import registerMixin from '../mixins/register-component'
import Vue from 'vue'
export default {
  name: 'HMapRrcnode',
  mixins: [registerMixin],
  props: [
    'lonlat',
    'offset',
    'zoom'
  ],
  data () {
    return {
      container: null
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
      this.container = this.container || this.$parent.container
      if (!this.container) {
        return
      }
      if (this.$slots.default && this.$slots.default.length) {
        this.$hmapComponent = this.tmpVM.$refs.node
        this.setPosition(options.lonlat)
        this.container.appendChild && this.container.appendChild(this.$hmapComponent)
      }
    },
    setPosition (lonlat) {
      this.position = this.$hmap.getViewPortPxFromLonLat(lonlat)
      if (this.$hmapComponent) {
        this.$hmapComponent.style.position = 'absolute'
        this.$hmapComponent.style.left = parseInt(this.position.x) + this.offset[0] + 'px'
        this.$hmapComponent.style.top = parseInt(this.position.y) + this.offset[1] + 'px'
        this.$hmapComponent.style.transition = 'all .2s'
      }
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
    if (this.container && this.$hmapComponent) {
      this.container.removeChild && this.container.removeChild(this.$hmapComponent)
    }
    this.tmpVM.$destroy()
  },
  watch: {
    lonlat (newVal, oldVal) {
      newVal.toString() !== oldVal.toString() && this.setPosition(this.toLonLat(this.lonlat))
    },
    offset (newVal, oldVal) {
      newVal.toString() !== oldVal.toString() && this.setPosition(this.toLonLat(this.lonlat))
    },
    zoom () {
      setTimeout(() => {
        this.setPosition(this.toLonLat(this.lonlat))
      }, 1)
    }
  }

}
</script>
