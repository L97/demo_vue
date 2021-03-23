
// 组件导入
import HMap from './components/h-map'
import HMapMarker from './components/h-map-marker'
import HMapPopup from './components/h-map-popup'
import HMapGrid from './components/h-map-grid'
import HMapResource from './components/h-map-resource'
import HMapResources from './components/h-map-resources'
import HMapSpaceSearch from './components/h-map-space-search'
import HMapMovedCircle from './components/h-map-moved-circle'
import HMapPolyLine from './components/h-map-poly-line'
import HMapRec from './components/h-map-rec'
import HMapTrace from './components/h-map-trace'
import HMapHeatMap from './components/h-map-heat-map'
import HMapBizer from './components/h-map-bizer'
import HMapManager from './manager/h-map-manager-instance'
import './style/start.less'

let components = [
  HMap,
  HMapMarker,
  HMapPopup,
  HMapGrid,
  HMapResource,
  HMapResources,
  HMapSpaceSearch,
  HMapMovedCircle,
  HMapPolyLine,
  HMapRec,
  HMapTrace,
  HMapHeatMap,
  HMapBizer
]

let VueHMap = {
  HMapManager
}

VueHMap.install = (Vue) => {
  if (VueHMap.installed) return
  components.map(_component => {
    Vue.component(_component.name, _component)
    VueHMap[_component.name] = _component
  })
}

export default VueHMap
