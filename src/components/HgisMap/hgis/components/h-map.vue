<template>
  <div class="h-map-container">
    <div class="h-map" id="map"></div>
    <slot></slot>
  </div>
</template>

<script>
import { lazyLoaderInstance, initLazyLoader } from '../services/lazy-loader-instance'
import HMapManager from '../manager/h-map-manager-instance'
export default {
  name: 'HMap',
  props: [
    'baseUrl',
    'hgis',
    'theme',
    'vecUrl',
    'initCenter',
    'initLevel',
    'name'
  ],
  data () {
    return {
      config: {},
      HGIS: null,
      HMapMarkerLayer: null,
      HMapGridLayer: null
    }
  },
  created () {
    let { hgis, theme, baseUrl = '', vecUrl, initCenter, initLevel } = this

    if (hgis) { this.config.hgis = hgis }
    if (theme) { this.config.theme = theme }
    if (baseUrl) { this.config.baseUrl = baseUrl }
    if (vecUrl) { this.config.vecUrl = vecUrl }
    if (initLevel) { this.config.initLevel = initLevel }
    // 默认中心点
    this.config.initCenter = initCenter || {
      longitude: 121.53218,
      latitude: 31.22152
    }

    initLazyLoader(this.config)
    this.mapLoadPromise = lazyLoaderInstance
  },
  mounted () {
    this.createMap()
  },
  methods: {
    createMap () {
      this.mapLoadPromise.then((HGIS) => {
        this.$hmap = new HGIS.MapEx('map', {
          controls: [
            // 鼠标位置
            new HGIS.Control.MousePosition(),
            // 默认鹰眼控件
            new HGIS.Control.OverviewMapEx(),
            // 缩放、拖拽、双击控件
            new HGIS.Control.Navigation(),
            // 比例尺
            new HGIS.Control.ScaleLineEx()
          ],
          mapLoaded: () => this.mapLoaded(HGIS)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    mapLoaded (HGIS) {
      this.HGIS = HGIS
      HMapManager.setMap(this.$hmap)
      // 初始化地图事件
      this.initMapEvent()
      // 初始化图层
      this.initLayer(HGIS)
      // 地图加载回调
      this.$emit('mapLoaded', this.$hmap)
      this.$children.forEach(component => {
        component.$emit('mapLoaded', this.$hmap)
      })
    },
    initLayer (HGIS) {
      // 初始化marker图层
      this.HMapMarkerLayer = new HGIS.Layer.Markers('Markers')
      // 初始化grid图层
      this.HMapGridLayer = new HGIS.Layer.Vector('GridLayer')
      // 默认矢量图层
      this.HMapVector = this.$hmap.getDefaultLayer()
      // 创建MapOperate实例，并绑定到map之上
      this.HMapOpt = new HGIS.Plot.MapOperate(this.$hmap)

      this.$hmap.addLayer(this.HMapMarkerLayer)
      this.$hmap.addLayer(this.HMapGridLayer)

      // console.log(this.$hmap)
    },
    initMapEvent () {
      Object.keys(this.$hmap.events.listeners).forEach(key => {
        this.$hmap.events.register(key, {}, (e) => { this.$emit(key, e) }, null)
      })
    },

    $toLonLat ({ longitude, latitude }) {
      return new this.HGIS.LonLat(longitude, latitude).transform(new this.HGIS.Projection('EPSG:4326'), this.$hmap.getProjectionObject())
    },

    $panTo (lonlat) {
      if (!lonlat) { return }
      let { longitude, latitude } = lonlat
      if (longitude && latitude) {
        this.$hmap.panTo(this.$toLonLat(lonlat))
      }
    },

    $setCenter (lonlat) {
      if (!lonlat) { return }
      let { longitude, latitude } = lonlat
      if (longitude && latitude) {
        this.$hmap.setCenter(this.$toLonLat(lonlat))
      }
    },

    $moveTo (lonlat, zoom, options) {
      if (!lonlat) { return }
      let { longitude, latitude } = lonlat
      if (longitude && latitude) {
        this.$hmap.moveTo(this.$toLonLat(lonlat), zoom, options)
      }
    },

    $getCenter () {
      return this.$hmap.center.transform(this.$hmap.getProjectionObject(), new this.HGIS.Projection('EPSG:4326'))
    }
  }
}
</script>

<style lang="less" scoped>
.h-map-container {
  position: relative;
  width: 100%;
  height: 100%;

  .h-map {
    width: 100%;
    height: 100%;
  }
}
</style>
