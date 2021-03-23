/* eslint-disable */
let HGIS = window.HGIS
HGIS.ImapMarker = HGIS.Class({

    /**
     * Property: icon
     * {<HGIS.Icon>} The icon used by this marker.
     */
    icon: null,
    /**
     * 显示的DOM元素
     */
    iconDom: null,
    /**
     * 偏移量
     */
    offset: null,

    /**
     * Property: lonlat
     * {<HGIS.LonLat>} location of object
     */
    lonlat: null,

    /**
     * Property: events
     * {<HGIS.Events>} the event handler.
     */
    events: null,

    /**
     * Property: map
     * {<HGIS.Map>} the map this marker is attached to
     */
    map: null,
    /**
     * 当前像素位置
     */
    px: null,

    /**
     * Constructor: HGIS.Marker
     * 构造一个HGIS.Marker对象
     * 
     * Parameters:
     * lonlat - {<HGIS.LonLat>} 当前标记的位置
     * iconDom - {js  DOM元素}  当前标记的图标
     * offset - {x：offx,y:offy}   偏移值
     */
    initialize: function initialize(lonlat, iconDom, offset, layer) {
        this.layer = layer
        this.lonlat = lonlat;
        if (iconDom) {
            this.iconDom = iconDom;
            this.icon = this;
        } else {
            return false;
        }
        this.offset = offset || {
            x: -(this.iconDom.style.width.replace("px", "") / 2),
            y: -(this.iconDom.style.height.replace("px", "") / 2)
        };
        this.events = new HGIS.Events(this, this.iconDom);
    },
    /**
     * APIMethod: destroy
     *
     * 清除标记，需要首先移除图层上添加的标记，在标记内不能执行此操作，因为不知道标记属于哪个图层
     */
    destroy: function destroy() {
        // erase any drawn features
        // this.erase();
        this.map = null;

        this.events.destroy();
        this.events = null;

        this.iconDestory();
        // 清除marker
        this.layer.removeMarker(this)
    },
    /**
     * Method: draw
     * Calls draw on the icon, and returns that output.
     *
     * Parameters:
     * px - {<HGIS.Pixel>}
     *
     * Returns:
     * {DOMElement} A new DOM Image with this marker's icon set at the
     * location passed-in
     */
    draw: function draw(px) {
        if (px != null && this.iconDom != null) {
            this.px = px;
            this.iconMoveTo(px);
        }
        return this.iconDom;
    },
    /**
     * Method: erase
     * Erases any drawn elements for this marker.
     */
    erase: function erase() {
        if (this.iconDom != null) {
            this.iconErase();
        }
    },
    iconErase: function iconErase() {
        if (this.iconDom != null && this.iconDom.parentNode != null) {
            HGIS.Element.remove(this.iconDom);
        }
    },
    iconDestory: function iconDestory() {
        this.iconErase();
        if (this.iconDom != null) {
            this.iconDom.firstChild && HGIS.Event.stopObservingElement(this.iconDom.firstChild);
            this.iconDom.innerHTML = "";
            this.iconDom = null;
        }
    },
    iconMoveTo: function iconMoveTo(px) {
        if (this.iconDom != null) {
            if (px == null) {
                this.iconDom.style.display = display ? "" : "none";
            } else {
                HGIS.Util.modifyDOMElement(this.iconDom, this.iconDom.id, {
                    x: px.x + this.offset.x,
                    y: px.y + this.offset.y
                });
            }
        }
    },
    iconIsDrawn: function iconIsDrawn() {
        // nodeType 11 for ie, whose nodes *always* have a parentNode
        // (of type document fragment)
        var isDrawn = this.iconDom && this.iconDom.parentNode && this.iconDom.parentNode.nodeType != 11;
        return isDrawn;
    },
    iconSetOpacity: function iconSetOpacity(opacity) {
        HGIS.Util.modifyAlphaImageDiv(this.iconDom, null, null, null, null, null, null, null, opacity);
    },
    /**
     * Method: moveTo
     * Move the marker to the new location.
     *
     * Parameters:
     * px - {<HGIS.Pixel>|Object} the pixel position to move to.
     * An HGIS.Pixel or an object with a 'x' and 'y' properties.
     */
    moveTo: function moveTo(px) {
        if (px != null && this.iconDom != null) {
            this.iconMoveTo(px);
        }
    },
    /**
     * APIMethod: isDrawn
     * 获取标记是否绘制
     * 
     * Returns:
     * {Boolean} 标记是否被绘制.
     */
    isDrawn: function isDrawn() {
        var isDrawn = this.iconDom && this.iconIsDrawn();
        return isDrawn;
    },
    /**
     * Method: onScreen
     *
     * Returns:
     * {Boolean} Whether or not the marker is currently visible on screen.
     */
    onScreen: function onScreen() {
        var onScreen = false;
        if (this.map) {
            var screenBounds = this.map.getExtent();
            onScreen = screenBounds.containsLonLat(this.lonlat);
        }
        return onScreen;
    },
    /**
     * Method: inflate
     * Englarges the markers icon by the specified ratio.
     *
     * Parameters:
     * inflate - {float} the ratio to enlarge the marker by (passing 2
     *                   will double the size).
     */
    inflate: function inflate(_inflate) {
        if (this.iconDom) {
            // this.icon.setSize({
            // 	w : this.icon.size.w * inflate,
            // 	h : this.icon.size.h * inflate
            // });
            iconDom.style.width = iconDom.style.width * _inflate;
            iconDom.style.height = iconDom.style.height * _inflate;
        }
    },
    /**
     * Method: setOpacity
     * Change the opacity of the marker by changin the opacity of
     *   its icon
     *
     * Parameters:
     * opacity - {float}  Specified as fraction (0.4, etc)
     */
    setOpacity: function setOpacity(opacity) {
        this.iconSetOpacity(opacity);
    },
    /**
     * Method: setUrl
     * Change URL of the Icon Image.
     *
     * url - {String}
     */
    setUrl: function setUrl(url) {
        //TO DO
        //this.icon.setUrl(url);
    },
    /**
     * 修改marker的经纬度坐标
     * @author litianji
     */
    setLonLat: function (lonlat) {
        this.lonlat = new HGIS.LonLat(lonlat[0], lonlat[1]).transform(new HGIS.Projection('EPSG:4326'), this.layer.map.getProjectionObject());
        this.layer.drawMarker(this);
    },
    /**
     * 修改marker的dom元素，从而变化显示样式
     * @author litianji
     */
    setContent: function (iconDom) {
        this.iconDom = iconDom;
        this.layer.drawMarker(this);
    },
    /**
     * 修改marker的offset
     * @author litianji
     */
    setOffset: function (offset) {
        this.offset = { x: offset[0], y: offset[1] }
        this.layer.drawMarker(this);
    },
    /**
     * Method: display
     * Hide or show the icon
     *
     * display - {Boolean}
     */
    display: function (_display) {
        function display(_x) {
            return _display.apply(this, arguments);
        }

        display.toString = function () {
            return _display.toString();
        };

        return display;
    }(function (display) {
        this.iconDom.style.display = display ? "" : "none";
    }),
    setzIndex: function setzIndex(zIndex) {
        this.iconDom.style.zIndex = zIndex;
    },
    CLASS_NAME: "HGIS.Marker"
});