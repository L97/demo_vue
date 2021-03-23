/* eslint-disable */
let HGIS = window.HGIS
HGIS.ClusterWMSLayer = HGIS.Class(HGIS.Layer.Grid, {
  tileClass: HGIS.ClusterTile,
  /**
   * 创建聚合样式div
   */
  createClusterDiv: null,
  /**
   * 创建单点样式
   */
  createFeatureDiv: null,
  /**
   * 创建一杆多点样式div
   */
  createPoleDiv: null,

  poleClick: null,
  /**
   * 
   */
  initialize: function initialize(name, url, params, options) {
    this.createClusterDiv = options.createClusterDiv;
    this.poleClick = options.poleClick;
    this.createFeatureDiv = options.createFeatureDiv;
    this.createPoleDiv = options.createPoleDiv;
    this.drawCallback = options.drawCallback
    HGIS.Layer.Grid.prototype.initialize.apply(this, arguments);
  },
  CLASS_NAME: "HGIS.ClusterWMSLayer"
})