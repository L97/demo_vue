/* eslint-disable */
import SpaceSearch from './SpaceSearch'
import axios from 'axios'

var map = null
var HGIS = window.HGIS
var spaceSearchLayer = null
var sourceUrl = ''
var LayerStyle = {
  golFillColor: '#b2cae8',
  golStrokeColor: '#7092ff',
  golFillOpacity: 0.6,
  golStrokeWidth: 2,
  fillOpacity: 0.5
}

function initSpaceSearchLayer(_map, _sourceUrl) {
  map = _map
  sourceUrl = _sourceUrl
  // 空间查询用的图层
  spaceSearchLayer = new HGIS.Layer.Vector('spaceSearchLayer')
  map.addLayer(spaceSearchLayer)
}

function clearSearchLayer() {
  spaceSearchLayer.removeAllFeatures()
}

function draw(type, callback, data) {
  clearDraw()
  switch (type) {
    case 'point':
      drawRround(type, callback)
      break
    case 'polyline':
      drawPolyline(type, callback, data)
      break
    default:
      drawRec(type, callback)
      break
  }
}

function drawRround(type, callback) {
  map.draw(type, null, 'geometry', '鼠标按下开始，双击结束', {
    keepOn: false,
    ifClear: true,
    errMsg: true
  }, function (geom) {
    surroundQuery(geom, 500, callback, type)
  }, () => {
    console.log('cancel')
  })
}

function surroundQuery(geom, radius, callback, type) {
  var x = geom.x
  var y = geom.y
  var param = {}
  var movedCircle = new HGIS.Plot.MovedCircle(spaceSearchLayer, {
    center: {
      x: x,
      y: y
    },
    isDragCenter: true,
    map: map,
    radius: radius * 1,
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
      externalGraphic: 'https://10.194.199.121/imap-web/resources/static/images/gis/mark/dragbar.png',
      graphicHeight: 16,
      graphicWidth: 25,
      fillColor: '#1D75DE',
      strokeColor: '#1D75DE'
    },
    callback: function (data) {
      param['wkt'] = HGIS.Utils.geom2Wkt(data.circle.clone().transform(map.getProjectionObject(), new HGIS.Projection("EPSG:4326")))
      drawCallback(param, type, callback)
      // if (_callback) {
      //   _callback(param)
      // }
    }
  })
  // 绘制完成后立即查询一次
  param['wkt'] = HGIS.Utils.geom2Wkt(movedCircle.circle.clone().transform(map.getProjectionObject(), new HGIS.Projection("EPSG:4326"))) // 空间条件的wkt
  // 查询
  drawCallback(param, type, callback)
}

function drawPolyline(type, callback, data) {
  map.draw(type, null, 'geometry', '鼠标按下开始，双击结束', {
    keepOn: false,
    ifClear: true,
    errMsg: true
  }, function (geom) {
    var bufferVal = data;
    // console.log(bufferVal);
    // if (!bufferVal || Number(bufferVal) < 1 || Number(bufferVal) > 10000) {
    //   Message.info(_i18nUtil2["default"].get('xmap-ui.web.hgis.draw.lineBufferWarning'));
    //   _this3.addRecLayer("polyline", drawCallback, distance, LayerStyle, drawCancelback, needSurround);
    //   return;
    // }
    // if (typeof geom === 'string' && geom.indexOf('error') > -1) {
    //   Message.info(geom.split(':')[1]);
    //   if (typeof drawCancelback === 'function') drawCancelback();
    //   return;
    // }
    //全局缓冲变量赋予
    // drawBufferUpdate = {};
    // drawBufferUpdate.drawLineLayer = spaceSearchLayer;
    // drawBufferUpdate.drawLineGeo = geom;
    // drawBufferUpdate.drawLineFunction = commonLineDrawCallBack;
    // drawBufferUpdate.drawLineCallBack = callback;
    // drawBufferUpdate.drawStyle = LayerStyle;
    // drawBufferUpdate.mergeCallback = mergeCallback;
    commonLineDrawCallBack(geom, callback, spaceSearchLayer, bufferVal, LayerStyle);
  }, () => {
    console.log('cancel')
  });
}

function commonLineDrawCallBack(geom, callback, targetLayer, lineDistance, LayerStyle, featureId) {
  //查询参数
  var param = {
    'resourceType': 'CAMERA_INFO', //图层名称
    'geometryType': 'Polygon', //查询的空间条件类型
    'wkt': '', //空间条件的wkt
    'customOrder': 'name,1', // 名称按拼音首字母排序
    'authSearch': 'CAMERA_INFO'
  };
  var geomOperate = new HGIS.Geometry.GeomRelation(true);
  var bufferDistance = lineDistance;
  geomOperate.buffer(geom, bufferDistance, 5, -1, function (vecotor) {
    // if (!vecotor) {
    //     _emitterUtil2["default"].emit("lineQueryError", _i18nUtil2["default"].get('xmap-ui.web.utils.mapUtil.HGISFail'));
    //     return;
    // }
    var bufferGeo = vecotor.geometry; //ie8下会报错
    var bufferWkt = HGIS.Utils.geom2Wkt(bufferGeo.clone().transform(map.getProjectionObject(),new HGIS.Projection("EPSG:4326")));
    var ft = vecotor;
    ft.style = {
      strokeColor: LayerStyle.golStrokeColor,
      fillColor: LayerStyle.golFillColor,
      fillOpacity: LayerStyle.fillOpacity
    };
    if (featureId) {
      ft.id = featureId;
    }
    // 添加到默认矢量图层
    if (targetLayer) {
      targetLayer.addFeatures([ft]);
    }
    param['geometryType'] = 'Polygon'; //查询的空间条件类型
    param['wkt'] = bufferWkt; //空间条件的wkt
    //缩放到合适的级别
    // _this.setParam(param);
    // map.zoomToExtent(bufferGeo.getBounds());
    drawCallback(param, "polyline", callback);
  });
}

function drawRec(type, callback) {
  map.draw(type, null, 'geometry', '鼠标按下开始，释放结束，esc退出', {
    keepOn: false,
    ifClear: true,
    errMsg: true
  }, (geom) => {
    // console.log(geom)
    var style = {
      fillColor: '#b2cae8',
      fillOpacity: 0.6,
      strokeColor: '#7092ff ',
      strokeWidth: 2
    }
    var ft = new HGIS.Feature.Vector(geom.clone(), null, style)
    // 添加到默认矢量图层
    if (spaceSearchLayer) {
      spaceSearchLayer.removeAllFeatures()
      spaceSearchLayer.addFeatures([ft])
    }

    var param = {
      'wkt': HGIS.Utils.geom2Wkt(geom.clone().transform(map.getProjectionObject(), new HGIS.Projection("EPSG:4326"))),
      'geometryType': 'Polygon'
    }

    // 查询
    drawCallback(param, type, callback)
  }, () => {
    console.log('cancel')
  })
}

function drawCallback(param, type, callback) {
  // reourceLayer点位过滤
  map.stopdraw()
  if (map.getLayersByName('resourceLayer')[0]) {
    var filterParams = {
      geoFilter: param['wkt']
      // resourceType: this.props.resourceChecked,
      // authSearch: this.props.resourceChecked,
      // extraParamStr: this.props.extraParam ? this.props.extraParam : '' // 为集中布控，加可视域的参数条件
    }
    map.getLayersByName('resourceLayer')[0].mergeNewParams(filterParams)
  }
  let p = {
    treeCode: 0,
    wkt: param['wkt'],
    geometryType: 'Polygon',
    extraParamStr: '',
    resourceType: 'CAMERA,CROSS',
    authSearch: 'CAMERA,CROSS',
    isPage: true,
    start: 0,
    limit: 20000
  }
  // 返回翻页的点位数据
  const csrf = document.getElementsByTagName('meta')['_csrf'].getAttribute('content')
  axios({
    method:'post',
    url: sourceUrl,
    data: { ...p },
    headers: { 'X-CSRF-TOKEN': csrf || null },
  }).then((res) => {
    // this.$emit('selected', res.data)
    callback && callback(res.data)
  })
}

function clearDraw() {
  // 清除空间搜索要素
  if (spaceSearchLayer) {
    spaceSearchLayer.removeAllFeatures()
  }

  // 更新点位资源图层
  var filterParams = {
    geoFilter: ''
  }
  map.getLayersByName('resourceLayer')[0].mergeNewParams(filterParams)
}

export default SpaceSearch

export {
  initSpaceSearchLayer,
  clearSearchLayer,
  draw,
  clearDraw
}