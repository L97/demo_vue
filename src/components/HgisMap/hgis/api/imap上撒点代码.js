function createFeatureDiv(item, type, position, scope) {
  var active = "";
  if (item.indexCode == _mapUtil2["default"].getActivedFeatureId()) {
      active = " active";
  }
  var divImg = document.createElement('div');
  divImg.item = item;
  divImg.setAttribute('indexCode', item.indexCode);
  divImg.setAttribute('id', "ctf_" + item.indexCode);
  divImg.style.position = "absolute";
  divImg.style.cursor = "pointer";
  divImg.title = item.name;
  if (scope.layer.isShowAI && (item.intelligentSet && item.intelligentSet !== "" || item.capabilitySet && (item.capabilitySet.indexOf('@event_face@') > -1 || item.capabilitySet.indexOf('@face_match@') > -1 || item.capabilitySet.indexOf('@event_face_match@') > -1 || item.capabilitySet.indexOf('@event_body@') > -1 || item.capabilitySet.indexOf('@event_veh@') > -1))) {
      var cls = "";
      cls = "poleIcon anticon anticon-hikext-camera_gun_offline"; //${ProxyUtil.getNgxProxyUrl(item.imgInfo.imgPath)}
      divImg.className = "poleDiv" + active;
      // divImg.innerHTML = '<div class="poleIcon '+cls+'" title="' + item.name + '"></div><div class="poleDivCount">智能解析相机</div>';     //让点位图标变成绿色
      divImg.innerHTML = '<div class=" ' + cls + '" title="' + item.name + '"></div><div class="poleDivCount">' + _i18nUtil2["default"].get('xmap-ui.web.components.map.AICam') + '</div>';
      divImg.style.left = parseInt(position.x) - 10 + 'px';
      divImg.style.top = parseInt(position.y) - 10 + 'px';
  } else {
      if (item.imgInfo !== 'undefined') {
          if (item.imgInfo.iconType == 0) {
              divImg.className = "marker" + active;
              divImg.style.backgroundImage = 'url(' + _proxyUtil2["default"].getNgxProxyUrl(item.imgInfo.imgPath) + ')';
          } else {
              if (item.imgInfo.imgPath == undefined) {
                  divImg.className = "marker anticon-hikext anticon-hikext-camera_f_offline";
              } else {
                  divImg.className = "marker anticon-hikext anticon-hikext-" + item.imgInfo.imgPath + active;
              }
          }
      } else {
          divImg.style.backgroundImage = 'url(' + this.getImagePath(item, false) + ')';
      }
      divImg.style.backgroundSize = '24px 24px';
      divImg.style.width = '24px';
      divImg.style.height = '24px';
      divImg.style.left = parseInt(position.x) - 12 + 'px';
      divImg.style.top = parseInt(position.y) - 12 + 'px';
  }
  if (scope.layer.isShowTitle) {
      var nameDiv = document.createElement("div");
      nameDiv.innerHTML = item.name;
      nameDiv.title = item.name;
      nameDiv.className = "resourceName" + active;
      divImg.appendChild(nameDiv);
      var nameimgDiv = document.createElement("div");
      nameimgDiv.className = "resourceImg";
      divImg.appendChild(nameimgDiv);
  }
  return divImg;
}

function createPoleDiv(poleTitle, groupLength, type, position, scope, groupValue) {
  var cls = '';
  var active = '';
  var val = "" + type + groupValue;
  if (val == _mapUtil2["default"].getPoleDataActive()) {
      active = 'active';
  }
  if (type == 'CAMERA') {
      cls = "anticon anticon-hikext-camera_gun_offline " + active; //anticon-lidaicon-map-ytqj-circle-md
  } else if (type == 'CROSS') {
      cls = "anticon anticon-hikext-cross " + active; //anticon-lidaicon-mp-kk-circle-md"
  } else if (type == 'IO') {
      cls = "anticon anticon-hikext-io " + active; //anticon-lidaicon-device-bjsr-circle-md"
  } else if (type == 'DETECTOR') {
      cls = "anticon anticon-hikext-detector_spe_online_uncamera " + active; //anticon-lidaicon-map-wifi-circle-md"
  } else if (type == 'ALARM_DEVICE') {
      cls = "anticon anticon-hikext-alarm " + active;
  } else {
      cls = "anticon anticon-hikext-camera_f_online " + active; //anticon-lidaicon-map-wifi-circle-md"
  }
  var divImg = document.createElement('div');
  divImg.className = "poleDiv";
  divImg.innerHTML = '<div class="poleIcon ' + cls + '" title="' + poleTitle + '"></div><div class="poleDivCount">' + groupLength + '</div>';
  divImg.style.left = parseInt(position.x) - 10 + 'px';
  divImg.style.top = parseInt(position.y) - 10 + 'px';
  return divImg;
}

function createClusterDiv(item, type, position, scope) {
  var divImg = document.createElement('div');
  divImg.style.position = "absolute";
  divImg.className = "jh_icon";
  var innerHtml = '';
  var num = item.info.toString();
  var typeName = _i18nUtil2["default"].get('xmap-ui.web.common.camara');
  if (type == 'CAMERA') {
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-device-qiangji-f"></i></span><span class="jh_num">' + num + '</span>';
  } else if (type == 'CROSS') {
      typeName = _i18nUtil2["default"].get('xmap-ui.web.common.bayonet');
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-map-kk-f"></i></span><span class="jh_num">' + num + '</span>';
  } else if (type == 'IO') {
      typeName = _i18nUtil2["default"].get('xmap-ui.web.common.ioInfo');
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-device-bjsr-f"></i></span><span class="jh_num">' + num + '</span>';
  } else if (type == 'DETECTOR') {
      typeName = _i18nUtil2["default"].get('xmap-ui.web.common.detectorInfo');
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-device-wifi-f"></i></span><span class="jh_num">' + num + '</span>';
  } else if (type == 'ALARM_DEVICE') {
      typeName = _i18nUtil2["default"].get('xmap-ui.web.common.alarmDevice');
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-alarm-f"></i></span><span class="jh_num">' + num + '</span>';
  } else {
      typeName = _i18nUtil2["default"].get('xmap-ui.web.components.map.res');
      innerHtml = '<span class="jh_style"><i class="anticon anticon-lidaicon-device-camera-f"></i></span><span class="jh_num">' + num + '</span>';
  }
  divImg.innerHTML = innerHtml;
  divImg.setAttribute('title', typeName);

  //22为图片宽高的一般
  divImg.style.left = position.x - 15 + 'px';
  divImg.style.top = position.y - 25 + 'px';
  if (poleLayer) {
      poleLayer.markerLayer.removeMarker(poleTarget);
  }
  return divImg;
}

function getImagePath(item, isHover) {
  var parentPath = appContext + "/resources/static/images/gis/mark/";
  var imageObj = {
      school_hover: 'school_hover',
      socialCamera: 'socialCamera',
      socialCamera_hover: 'socialCamera_hover',
      bar: 'bar',
      bar_hover: 'bar_hover',
      camera_ball: 'camera_ball',
      camera_gun: 'camera_gun',
      camera_halfball: 'camera_halfball',
      camera_ptz: 'camera_ptz',
      crossing: 'crossing',
      crossing_hover: 'crossing_hover',
      cz: 'cz',
      cz_hover: 'cz_hover',
      db: 'db',
      db_hover: 'db_hover',
      dragbar: 'dragbar',
      hospital: 'hospital',
      hospital_hover: 'hospital_hover',
      hotel: 'hotel',
      hotel_hover: 'hotel_hover',
      ioinfo_in: 'ioinfo_in',
      ioinfo_in_hover: 'ioinfo_in_hover',
      ioinfo_out: 'ioinfo_out',
      ioinfo_out_hover: 'ioinfo_out_hover',
      school: 'school',
      faceCamera: 'face_camera_online',
      detector_normal_online_nocamera: 'detector_normal_online_nocamera',
      detector_normal_online_camera: 'detector_normal_online_camera',
      detector_normal_offline_nocamera: 'detector_normal_offline_nocamera',
      detector_normal_offline_camera: 'detector_normal_offline_camera',
      detector_integrated_online_nocamera: 'detector_integrated_online_nocamera',
      detector_integrated_online_camera: 'detector_integrated_online_camera',
      detector_integrated_offline_nocamera: 'detector_integrated_offline_nocamera',
      detector_integrated_offline_camera: 'detector_integrated_offline_camera',
      rfid_collection_camera_online: 'rfid_collection_camera_online',
      rfid_collection_camera_offline: 'rfid_collection_camera_offline',
      rfid_collection_online: 'rfid_collection_online',
      rfid_collection_offline: 'rfid_collection_offline',
      alarm_device: 'alarm_device'
  };
  var imgName = '';
  switch (item.resourceType) {
      case 'CAMERA':
          imgName = imageObj['camera_gun'];
          imgName += "_online";
          break;
      case 'CROSS':
          imgName = imageObj['crossing'];
          break;
      case 'IO':
          imgName = imageObj['ioinfo_in'];
          break;
      case 'DETECTOR':
          imgName = imageObj['detector_normal_online_camera'];
          break;
      case 'WITNESS_DEVICE':
          imgName = imageObj['ioinfo_in'];
          break;
      case 'ALARM_DEVICE':
          imgName = imageObj['alarm_device'];
          break;
  }
  if (isHover) {
      parentPath += imgName + '_hover.png';
  } else {
      parentPath += imgName + '.png';
  }
  return parentPath;
}