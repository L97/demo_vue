<template>
  <div>
    <!-- 单点 -->
    <h-map-marker
      v-for="(item, key) in features"
      :key="`FEATURE_${item.resourceType}_${key}}`"
      :lonlat="[item.longitude, item.latitude]"
      :offset="[-10, -10]"
      @click="handleClick(item, 'FEATURE', `FEATURE_${item.resourceType}_${key}`)"
      :className="`hmap-resource-feature${activeKey === `FEATURE_${item.resourceType}_${key}` ? (' active ' + activeClass) : ''}`">
        <i class="hmap-icon-camera" v-if="item.resourceType === 'CAMERA'" :title="item.name"></i>
        <i class="hmap-icon-cross" v-if="item.resourceType === 'CROSS'" :title="item.name"></i>
    </h-map-marker>

    <!-- 一杆多点 -->
    <h-map-marker
      v-for="(item, key) in poles"
      :key="`POLE_${item.resourceType}_${key}`"
      :lonlat="[item.longitude, item.latitude]"
      :offset="[-10, -10]"
      @click="handleClick(item, 'POLE', `POLE_${item.resourceType}_${key}`)"
      :className="`hmap-resource-pole${activeKey === `POLE_${item.resourceType}_${key}` ? ' active' : ''}`">
        <div class="hmap-resource-feature" :title="item.poleTitle">
          <i class="hmap-icon-camera" v-if="item.resourceType === 'CAMERA'"></i>
          <i class="hmap-icon-cross" v-if="item.resourceType === 'CROSS'"></i>
        </div>
        <div class="info">{{item.groupLength}}</div>
    </h-map-marker>

    <!-- 聚合 -->
    <h-map-marker
      v-for="(item, key) in clusters"
      :key="`CLUSTER_${item.resourceType}_${key}`"
      :lonlat="[item.longitude, item.latitude]"
      :offset="[-15, -30]"
      @click="handleClick(item, 'CLUSTER', `CLUSTER_${item.resourceType}_${key}`)"
      :className="`hmap-resource-cluster${activeKey === `CLUSTER_${item.resourceType}_${key}` ? ' active' : ''}`">
      <span class="poleIcon">
        <i class="hmap-icon-camera-g" v-if="item.resourceType === 'CAMERA'"></i>
          <i class="hmap-icon-cross-g" v-if="item.resourceType === 'CROSS'"></i>
      </span>
      <span class="poleDivCount">{{item.info}}</span>
    </h-map-marker>
  </div>
</template>
<script>
import registerMixin from '../mixins/register-component'
import HMapMarker from './h-map-marker'
import http from '../utils/request-help'
export default {
  name: 'HMapResource',
  mixins: [registerMixin],
  components: { HMapMarker },
  props: [
    'resourceUrl',
    'requestHeader',
    'resourceType',
    'clusterLevel',
    'wkt',
    'hide',
    'activeClass'
  ],
  data () {
    return {
      // 撒点图层
      HMapMarkerLayer: null,
      // 请求参数
      params: {
        treeCode: '0',
        needDist: false,
        needList: true,
        isPage: false,
        authSearch: ''
      },
      // 返回监控资源(分别为聚合、一杆多点和点位)
      clusters: [],
      poles: [],
      features: [],
      // 被选中
      activeKey: ''
    }
  },
  methods: {
    _initComponent () {
      if (this.$hmap) {
        // 创建一个新的撒点图层
        this.HMapMarkerLayer = new this.HGIS.Layer.Markers('resource-markers')
        this.$hmapComponent = this.HMapMarkerLayer
        this.$hmap.addLayer(this.$hmapComponent)
        // 注册地图重绘事件
        this.$hmap.events.register('moveend', {}, this.viewChange.bind(this), null)
        // 初始撒点
        this.viewChange()
      }
    },
    viewChange () {
      if (!this.$hmap) {
        return
      }
      let isCluster = false
      let isPole = false
      let extent = this.getBounds()
      let maxExtent = this.getMaxExtent()
      let bounds = this.getBounds()
      let resourceType = this.resourceType || 'CAMERA,CROSS,DETECTOR'
      bounds.left = bounds.left < maxExtent.left ? maxExtent.left : bounds.left
      bounds.bottom = bounds.bottom < maxExtent.bottom ? maxExtent.bottom : bounds.bottom
      bounds.right = bounds.right > maxExtent.right ? maxExtent.right : bounds.right
      bounds.top = bounds.top > maxExtent.top ? maxExtent.top : bounds.top

      if (this.$hmap.getZoom() <= (this.clusterLevel || 14) * 1) {
        isCluster = true
      }

      this.params = {
        ...this.params,
        geometryType: 'Polygon', // 查询的空间条件类型
        bbox: extent.left + ',' + extent.bottom + ',' + extent.right + ',' + extent.top,
        // customOrder: 'name,1',// 名称按拼音首字母排序
        wkt: this.HGIS.Utils.geom2Wkt(bounds.toGeometry()),
        width: this.$hmap.size.w,
        height: this.$hmap.size.h,
        isPage: false,
        imgPath: true,
        clusterLevel: this.clusterLevel,
        // geoFilter: this.wkt || '',
        isCluster,
        isPole,
        resourceType
      }

      if (this.wkt) {
        this.params.wkt = this.wkt
      }

      http({
        type: 'post',
        url: this.resourceUrl,
        data: this.params,
        header: this.requestHeader
      }).then((res) => {
        if (res.code === '0') {
          // 清空重新渲染
          this.features = []
          this.poles = []
          this.clusters = []
          // 处理返回结果
          resourceType.split(',').forEach(type => {
            if (!res.data[type]) {
              return
            }
            if (isCluster) {
              this.addClusterFeatures(res.data[type], type)
            } else {
              this.addPoleFeatures(res.data[type], type)
              this.addFeatures(res.data[type], type)
            }
          })
        } else {
          console.log(res.msg)
        }
      })
    },
    addClusterFeatures (data, resourceType) {
      this.clusters = this.clusters.concat(
        data.clusters ? data.clusters.map(item => {
          return {
            ...item,
            longitude: item.lon,
            latitude: item.lat,
            resourceType
          }
        }) : []
      )
    },
    addPoleFeatures (data, resourceType) {
      this.poles = this.poles.concat(
        Object.keys(data.poleMap).map(key => {
          let groups = key.split('@')
          // 分组列名
          let groupField = groups[0]
          // 分组列值
          let groupValue = groups[1]
          // 分组内数据长度
          let groupLength = groups[2]
          // 经度
          let longitude = groups[3]
          // 纬度
          let latitude = groups[4]
          // title
          let poleTitle = ''

          // 取前5条数据作title提示
          for (var i = 0; i < data.poleMap[key].length; i++) {
            poleTitle += data.poleMap[key][i].name + ','
            if (i === 4) {
              poleTitle += '......'
              break
            }
          }

          return {
            groupField,
            groupValue,
            groupLength,
            longitude,
            latitude,
            poleTitle,
            resourceType,
            data: data.poleMap[key]
          }
        })
      )
    },
    addFeatures (data) {
      this.features = this.features.concat(data.items)
    },
    handleClick (item, type, key) {
      this.activeKey = key
      this.$emit('click', item, type, key)
    },
    $clearActive () {
      this.activeKey = ''
    },
    $setActive (key) {
      this.activeKey = key
    }
  },
  watch: {
    wkt () {
      this.viewChange()
    },
    hide (val) {
      this.$hmapComponent && this.$hmapComponent.setVisibility(!val)
    }
  }
}
</script>
