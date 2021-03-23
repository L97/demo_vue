let { HGIS } = window

let initParam = (config = {}) => {
  HGIS = window.HGIS
  let { vecUrl, maxLevel, minLevel, initLevel, srid, initCenter, baseUrl, mapUnit, mapType, imageFormat, resolutions, tileSize, extent, tileOrigin } = config
  let extentArr = ''
  // 前端配置
  HGIS.InitParam.isFrontConfig = true
  // 中心点
  HGIS.InitParam.center = !initCenter ? new HGIS.LonLat(13524583.641106, 3665395.5933421) : new HGIS.LonLat(initCenter.longitude, initCenter.latitude)
  // 范围
  if (extent) {
    extentArr = extent.split(',')
    HGIS.InitParam.extent = new HGIS.Bounds(extentArr[0], extentArr[1], extentArr[2], extentArr[3])
  } else {
    HGIS.InitParam.extent = new HGIS.Bounds('13136266.355324116', '3248562.3054136867', '13581462.790696658', '3763052.2318249727')
  }
  // 初始化地图级别设置
  HGIS.InitParam.maxLevel = maxLevel || 19
  HGIS.InitParam.minLevel = minLevel || 6
  HGIS.InitParam.initLevel = initLevel || 14
  // 地图加载类型
  HGIS.InitParam.mapType = mapType || 'GaodeMap'
  // 地图加载影响格式
  HGIS.InitParam.imageFormat = imageFormat || 'png'
  // 地图切片原点
  if (tileOrigin) {
    let tileOriginArr = tileOrigin.split(',')
    HGIS.InitParam.tileOrigin = new HGIS.LonLat(tileOriginArr[0], tileOriginArr[1]).transform()
  } else {
    HGIS.InitParam.tileOrigin = new HGIS.LonLat(-20037508.342789, 20037508.342789)
  }
  // 地图切片大小
  HGIS.InitParam.tileSize = tileSize || '256'
  // 地图坐标系
  HGIS.InitParam.srid = srid || '900913'
  // 地图根目录
  HGIS.InitParam.vecUrl = vecUrl || `${baseUrl}/hgis-services/tileCache/TileCacheServlet?mapType=GaodeMap&tileType=vec&level={z}&col={x}&row={y}^png`
  // 是否进行纠偏,默认为不纠偏
  HGIS.InitParam.factor = '1'
  // 地图单位
  HGIS.InitParam.mapUnit = mapUnit || 'm'
  // 初始化地图分辨率
  HGIS.InitParam.resolutions = resolutions || [156543.03392804062, 78271.51696402031, 39135.758482010155, 19567.879241005077, 9783.939620502539, 4891.969810251269,
    2445.9849051256347, 1222.9924525628173, 611.4962262814087, 305.74811314070433, 152.87405657035217, 76.43702828517608, 38.21851414258804,
    19.10925707129402, 9.55462853564701, 4.777314267823505, 2.3886571339117526, 1.1943285669558763, 0.5971642834779382
  ]

  if (srid === 900913) {
    initCenter && (HGIS.InitParam.center = new HGIS.LonLat(initCenter.longitude, initCenter.latitude).transform(new HGIS.Projection('EPSG:4326'), new HGIS.Projection('EPSG:900913')))
    extent && (HGIS.InitParam.extent = new HGIS.Bounds(extentArr[0], extentArr[1], extentArr[2], extentArr[3]).transform(new HGIS.Projection('EPSG:4326'), new HGIS.Projection('EPSG:900913')))
  }

  if (vecUrl && mapType && !mapType.includes('_on')) {
    HGIS.InitParam.vecUrl = baseUrl + vecUrl
  }
}

export {
  initParam
}
