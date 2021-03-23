<template>
  <div>
    <h-map-srcnode
      v-for="(item, key) in features"
      :key="`FEATURE_${item.resourceType}_${key}}`"
      :lonlat="[item.longitude, item.latitude]"
      :offset="[-10, -10]"
      :zoom="currentZoom">
      <div class="hmap-resource-feature">
        <i class="hmap-icon-camera" v-if="item.resourceType === 'CAMERA'"></i>
        <i class="hmap-icon-cross" v-if="item.resourceType === 'CROSS'"></i>
      </div>
    </h-map-srcnode>

    <h-map-srcnode
      v-for="(item, key) in poles"
      :key="`POLE_${item.resourceType}_${key}`"
      :lonlat="[item.longitude, item.latitude]"
      :offset="[-10, -10]"
      :zoom="currentZoom">
      <div class="hmap-resource-pole">
        <div class="hmap-resource-feature">
          <i class="hmap-icon-camera" v-if="item.resourceType === 'CAMERA'"></i>
          <i class="hmap-icon-cross" v-if="item.resourceType === 'CROSS'"></i>
        </div>
        <div class="info">{{item.groupLength}}</div>
      </div>
    </h-map-srcnode>
  </div>
</template>

<script>
import registerMixin from '../mixins/register-component'
import http from '../utils/request-help'
import HMapSrcnode from './h-map-srcnode'
export default {
  name: 'HMapResources',
  mixins: [registerMixin],
  components: {
    HMapSrcnode
  },
  props: [
    'resourceUrl',
    'requestHeader',
    'resourceType',
    'clusterLevel'
  ],
  data () {
    return {
      params: {
        treeCode: '0',
        needDist: false,
        needList: true,
        isPage: false
      },
      // 返回监控资源(分别为聚合、一杆多点和点位)
      clusters: [],
      poles: [],
      features: [],
      // 容器
      container: null,
      currentZoom: null
    }
  },
  methods: {
    _initComponent () {
      if (this.$hmap) {
        this.$hmapComponent = new this.HGIS.ClusterWMSLayer('resourceLayer', '1', { }, {
          singleTile: true,
          ratio: 1,
          isBaseLayer: false,
          currentZoom: this.$hmap.getZoom(),
          drawCallback: this.drawCallback.bind(this)
        })

        this.$hmap.addLayer(this.$hmapComponent)
      }
    },

    drawCallback (container) {
      if (!this.container) {
        this.container = container
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

      if (this.$hmap.getZoom() <= (this.clusterLevel || 12) * 1) {
        isCluster = true
      }
      setTimeout(() => {
        this.currentZoom = this.$hmap.getZoom()
      }, 0)
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
        isCluster,
        isPole,
        resourceType
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
            poleTitle += data.poleMap[key][i].name + '&#13;'
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
            resourceType
          }
        })
      )

      // for (let test = 0; test < 10; test++) {
      //   this.poles = this.poles.concat(
      //     Object.keys(data.poleMap).map(key => {
      //       let groups = key.split('@')
      //       // 分组列名
      //       let groupField = groups[0]
      //       // 分组列值
      //       let groupValue = groups[1]
      //       // 分组内数据长度
      //       let groupLength = groups[2]
      //       // 经度
      //       let longitude = Number(groups[3]) + 0.02 * (5 - test)
      //       // 纬度
      //       let latitude = Number(groups[4]) + 0.02 * (5 - test)
      //       // title
      //       let poleTitle = ''

      //       // 取前5条数据作title提示
      //       for (var i = 0; i < data.poleMap[key].length; i++) {
      //         poleTitle += data.poleMap[key][i].name + '&#13;'
      //         if (i === 4) {
      //           poleTitle += '......'
      //           break
      //         }
      //       }

      //       return {
      //         groupField,
      //         groupValue,
      //         groupLength,
      //         longitude,
      //         latitude,
      //         poleTitle,
      //         resourceType
      //       }
      //     })
      //   )
      // }

      // for (let test = 0; test < 10; test++) {
      //   this.poles = this.poles.concat(
      //     Object.keys(data.poleMap).map(key => {
      //       let groups = key.split('@')
      //       // 分组列名
      //       let groupField = groups[0]
      //       // 分组列值
      //       let groupValue = groups[1]
      //       // 分组内数据长度
      //       let groupLength = groups[2]
      //       // 经度
      //       let longitude = Number(groups[3]) - 0.02 * (5 - test)
      //       // 纬度
      //       let latitude = Number(groups[4]) + 0.02 * (5 - test)
      //       // title
      //       let poleTitle = ''

      //       // 取前5条数据作title提示
      //       for (var i = 0; i < data.poleMap[key].length; i++) {
      //         poleTitle += data.poleMap[key][i].name + '&#13;'
      //         if (i === 4) {
      //           poleTitle += '......'
      //           break
      //         }
      //       }

      //       return {
      //         groupField,
      //         groupValue,
      //         groupLength,
      //         longitude,
      //         latitude,
      //         poleTitle,
      //         resourceType
      //       }
      //     })
      //   )
      // }
    },
    addFeatures (data) {
      this.features = this.features.concat(data.items)
    }
  }
}
</script>
