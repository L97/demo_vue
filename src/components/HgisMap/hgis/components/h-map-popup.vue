<script>
import registerMixin from '../mixins/register-component'
import Vue from 'vue'
export default {
  name: 'HMapPopup',
  mixins: [registerMixin],
  props: [
    'popSize',
    'lonlat',
    'offset',
    'visible',
    'autoCenter'
  ],
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
      if (this.$slots.default && this.$slots.default.length) {
        options.content = this.tmpVM.$refs.node
      }

      if (this.visible) {
        this.popupClose()
        this.$hmapComponent = new this.HGIS.PopupEx(
          'popId',
          options.lonlat,
          options.popSize || new this.HGIS.Size(50, 50),
          options.offset || { x: 0, y: 0 },
          options.content,
          false
        )
        this.$hmap.addPopup(this.$hmapComponent, true)

        this.$hmapComponent.id = Math.random()
        // 弹框移动到视野内
        this.$hmapComponent.panIntoView()
        this.$hmapComponent.setBackgroundColor('#0000')

        this.autoCenter && this.$setCenter()
      }
    },
    popupClose () {
      if (this.$hmapComponent) {
        this.$hmap.removePopup(this.$hmapComponent)
        this.$hmapComponent = null
      }
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
    popSize (newVal, oldVal) {
      if ((newVal + '') !== (oldVal + '')) {
        this._initComponent(this.convertProps())
      }
    },
    lonlat (newVal, oldVal) {
      if ((newVal + '') !== (oldVal + '')) {
        this._initComponent(this.convertProps())
      }
    },
    offset (newVal, oldVal) {
      if ((newVal + '') !== (oldVal + '')) {
        this._initComponent(this.convertProps())
      }
    },
    visible (val) {
      !val ? this.popupClose() : this._initComponent(this.convertProps())
    }
  }
}
</script>
