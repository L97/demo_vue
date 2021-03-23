
export default {
  methods: {
    // 转化参数
    convertProps () {
      let { $options: { propsData = {} } } = this
      propsData.content = document.createElement('div')
      propsData.lonlat && (propsData.lonlat = this.toLonLat(propsData.lonlat))
      propsData.offset && (propsData.offset = this.toOffset(propsData.offset))
      propsData.pixel && (propsData.pixel = this.toPixel(propsData.offset))
      propsData.popSize && (propsData.popSize = this.toPopSize(propsData.popSize))
      return propsData
    },
    register () {
      this.HGIS = this.HGIS || this.$parent.HGIS || window.HGIS
      this.layer = this.layer || this.$parent[`${this.$options.name}Layer`]

      this._initComponent && this._initComponent(this.convertProps())

      this.$children.forEach(component => {
        component.$emit('mapLoaded', this.$hmap)
      })
    },
    toLonLat (lonlat) {
      return lonlat[0] && lonlat[1] && new this.HGIS.LonLat(lonlat[0], lonlat[1]).transform(new this.HGIS.Projection('EPSG:4326'), this.$hmap.getProjectionObject())
    },
    toOffset (offset) {
      return offset[0] && offset[1] && { x: offset[0], y: offset[1] }
    },
    toPixel (offset) {
      return offset[0] && offset[1] && new this.HGIS.Pixel(offset[0], offset[1])
    },
    toPopSize (popSize) {
      return popSize[0] && popSize[1] && new this.HGIS.Size(popSize[0], popSize[1])
    },
    toLowerCase (str) {
      return str.replace(/[A-Z]/g, (e, index) => index === 0 ? e.toLowerCase() : ('-' + e.toLowerCase()))
    },
    getBounds () {
      return this.$hmap.getExtent().clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))
    },
    getMaxExtent () {
      return this.$hmap.maxExtent.clone().transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))
    }
  },
  mounted () {
    this.$hmap = this.$hmap || this.$parent.$hmap
    if (this.$hmap) {
      this.register()
    } else {
      this.$on('mapLoaded', (map) => {
        this.$hmap = map
        this.register()
      })
    }
  },
  destroyed () {
    if (!this.$hmapComponent) return
    this.$hmapComponent.destroy && this.$hmapComponent.destroy()
    // this.timer && clearTimeout(this.timer)
  }
}
