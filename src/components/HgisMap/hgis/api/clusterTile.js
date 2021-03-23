/* eslint-disable */
let HGIS = window.HGIS
HGIS.ClusterTile = HGIS.Class(HGIS.Tile, {
    imapPopup: null,
    /**
     * APIProperty: events
     * {<HGIS.Events>} 处理所有发生在瓦片上的一个事件对象
     *
     * 事件注册语法:
     * (code)
     *	 tile.events.register(type, obj, listener);
     * (end)
     *
     * 支持的事件类型 (除了<HGIS.Tile>的事件之外):
     * beforeload - 当图片url已知的情况下，在图片准备加载前调用. 监听器将在瓦片实例上调用<setImage>方法,以使图片将被应用且无新切片创建.
     */

    /** 
     * APIProperty: url
     * {String} 被请求图片的URL. 
     * 没有默认值.  用layer.getURL() 方法进行填充.  可通过loadstart监听器进行修改.
     */
    url: null,

    /** 
     * Property: imgDiv
     * {HTMLImageElement} The image for this tile.
     */
    imgDiv: null,

    /**
     * Property: frame
     * {DOMElement} The image element is appended to the frame.  Any gutter on
     * the image will be hidden behind the frame. If no gutter is set,
     * this will be null.
     */
    frame: null,

    /** 
     * Property: imageReloadAttempts
     * {Integer} Attempts to load the image.
     */
    imageReloadAttempts: null,

    /**
     * Property: layerAlphaHack
     * {Boolean} True if the png alpha hack needs to be applied on the layer's div.
     */
    layerAlphaHack: null,

    /**
     * Property: asyncRequestId
     * {Integer} ID of an request to see if request is still valid. This is a
     * number which increments by 1 for each asynchronous request.
     */
    asyncRequestId: null,

    /**
     * Property: canvasContext
     * {CanvasRenderingContext2D} A canvas context associated with
     * the tile image.
     */
    canvasContext: null,

    /**
     * APIProperty: crossOriginKeyword
     * 加载地图时crossorigin keyword的值.
     * 这仅仅与用<getCanvasContext>从远程获取瓦片有关，服务器设为“anonymous”或“use-credentials”以发送瓦片的Access-Control-Allow-Origin信息头
     */
    crossOriginKeyword: null,
    /**
     * Constructor: HGIS.TileExt
     * Constructor for a new <HGIS.TileExt> instance.
     *
     * Parameters:
     * layer - {<HGIS.Layer>} layer that the tile will go in.
     * position - {<HGIS.Pixel>}
     * bounds - {<HGIS.Bounds>}
     * url - {<String>} Deprecated. Remove me in 3.0.
     * size - {<HGIS.Size>}
     * options - {Object}
     */
    initialize: function initialize(layer, position, bounds, url, size, options) {
        this.url = url;
        HGIS.Tile.prototype.initialize.apply(this, arguments);
        this.layerAlphaHack = this.layer.alpha && HGIS.Util.alphaHack();

        if (this.layer.gutter || this.layerAlphaHack) {
            // only create frame if it's needed
            this.frame = document.createElement("div");
            this.frame.style.position = "absolute";
            this.frame.style.overflow = "hidden";
        }
    },

    /**
     * APIMethod: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function destroy() {
        if (this.imgDiv) {
            this.clear();
            //浏览器窗口大小变化时，会调用destroy方法，这里要把原来的div移除，tile后面会添加新的div
            var tile = this.getTile();
            if (tile.parentNode === this.layer.div) {
                this.layer.div.removeChild(tile);
            }
            this.imgDiv = null;
            this.frame = null;
        }
        // don't handle async requests any more
        this.asyncRequestId = null;
        HGIS.Tile.prototype.destroy.apply(this, arguments);
    },
    /**
     * Method: draw
     * Check that a tile should be drawn, and draw it.
     *
     * Returns:
     * {Boolean} Was a tile drawn? Or null if a beforedraw listener returned
     *     false.
     */
    draw: function draw() {
        //处理浏览器大小变化太频繁的bug
        try {
            HGIS.Tile.prototype.draw.apply(this, [true]);
        } catch (e) {
            return;
        }
        var shouldDraw = HGIS.Tile.prototype.draw.apply(this, [true]);
        if (shouldDraw) {
            // The layer's reproject option is deprecated.
            if (this.layer != this.layer.map.baseLayer && this.layer.reproject) {
                // getBoundsFromBaseLayer is defined in deprecated.js.
                this.bounds = this.getBoundsFromBaseLayer(this.position);
            }
            if (this.isLoading) {
                //if we're already loading, send 'reload' instead of 'loadstart'.
                this._loadEvent = "reload";
            } else {
                this.isLoading = true;
                this._loadEvent = "loadstart";
            }
            this.renderTile();
            //this.positionTile();
        } else if (shouldDraw === false) {
            this.unload();
        }
        return shouldDraw;
    },

    /**
     * Method: renderTile
     * Internal function to actually initialize the image tile,
     *     position it correctly, and set its url.
     */
    renderTile: function renderTile() {
        if (this.layer.async) {
            // Asynchronous image requests call the asynchronous getURL method
            // on the layer to fetch an image that covers 'this.bounds'.
            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
            this.layer.getURLasync(this.bounds, function (url) {
                if (id == this.asyncRequestId) {
                    this.url = url;
                    this.initImage();
                }
            }, this);
        } else {
            var id = this.asyncRequestId = (this.asyncRequestId || 0) + 1;
            if (id == this.asyncRequestId) {
                // synchronous image requests get the url immediately.
                this.url = this.layer.url;
                this.initImage();
            }
        }
    },
    /**
     * Method: positionTile
     * Using the properties currenty set on the layer, position the tile correctly.
     * This method is used both by the async and non-async versions of the Tile.Image
     * code.
     */
    positionTile: function positionTile() {
        var style = this.getTile().style,
            size = this.frame ? this.size : this.layer.getImageSize(this.bounds),
            ratio = 1;
        if (this.layer instanceof HGIS.Layer.Grid) {
            ratio = this.layer.getServerResolution() / this.layer.map.getResolution();
        }
        style.left = this.position.x + "px";
        style.top = this.position.y + "px";
    },

    /**
     * Method: clear
     * Remove the tile from the DOM, clear it of any image related data so that
     * it can be reused in a new location.
     */
    clear: function clear() {
        HGIS.Tile.prototype.clear.apply(this, arguments);
        //如果是缩放地图，则先清除覆盖物
        if (this.layer.currentZoom != this.layer.map.getZoom()) {
            this.clearFeatures();
            this.layer.currentZoom = this.layer.map.getZoom();
        }
    },

    /**
     * Method: getImage
     * Returns or creates and returns the tile image.
     */
    getImage: function getImage() {
        if (!this.imgDiv) {
            this.imgDiv = document.createElement('div');

            var style = this.imgDiv.style;
            if (this.frame) {
                var left = 0,
                    top = 0;
                if (this.layer.gutter) {
                    left = this.layer.gutter / this.layer.tileSize.w * 100;
                    top = this.layer.gutter / this.layer.tileSize.h * 100;
                }
                style.left = -left + "%";
                style.top = -top + "%";
                style.width = 2 * left + 100 + "%";
                style.height = 2 * top + 100 + "%";
            }
            if (this.layer.opacity < 1) {
                style.filter = 'alpha(opacity=' + this.layer.opacity * 100 + ')';
            }
            style.position = "absolute";
            if (this.layerAlphaHack) {
                // move the image out of sight
                style.paddingTop = style.height;
                style.height = "0";
                style.width = "100%";
            }
            if (this.frame) {
                this.frame.appendChild(this.imgDiv);
            }
        }
        return this.imgDiv;
    },
    /**
     * APIMethod: setImage
     * 为一个切片设置图像元素.此方法仅在beforeload监听器中调用.
     *
     * Parameters
     * img - {HTMLImageElement} 要为当前切片加载的切片
     */
    setImage: function setImage(img) {
        this.imgDiv = img;
    },
    /**
     * Method: initImage
     * Creates the content for the frame on the tile.
     */
    initImage: function initImage() {
        if (!this.url && !this.imgDiv) {
            // fast path out - if there is no tile url and no previous image
            this.isLoading = false;
            return;
        }
        this.events.triggerEvent('beforeload');
        var tile = this.getTile();
        if (!(tile.parentNode === this.layer.div)) {
            this.layer.div.appendChild(this.getTile());
        }
        this.events.triggerEvent(this._loadEvent);
        var img = this.getImage();
        var src = img.getAttribute('src') || '';
        if (this.url && HGIS.Util.isEquivalentUrl(src, this.url)) {
            this._loadTimeout = window.setTimeout(HGIS.Function.bind(this.onImageLoad, this), 0);
        } else {
            this.stopLoading();
            if (this.crossOriginKeyword) {
                img.removeAttribute("crossorigin");
            }
            HGIS.Event.observe(img, "load", HGIS.Function.bind(this.onImageLoad, this));
            HGIS.Event.observe(img, "error", HGIS.Function.bind(this.onImageError, this));
            this.imageReloadAttempts = 0;
            this.setImgSrc(this.url);
        }
    },

    /**
     * 清除图层上的图元
     */
    clearFeatures: function clearFeatures() {
        if (this.imgDiv) {
            this.imgDiv.innerHTML = '';
        }
    },

    /**
     * Method: setImgSrc
     * Sets the source for the tile image
     *
     * Parameters:
     * url - {String} or undefined to hide the image
     */
    setImgSrc: function setImgSrc(url) {
        this.stopLoading();
        this.layer.drawCallback && this.layer.drawCallback(this.imgDiv)
    },
    /**
     * 添加Pole要素图层
     */
    addPoleFeatures: function addPoleFeatures(type, res, scope) {
        var poleMap = res.data[type].poleMap;
        if (poleMap) {
            for (var k in poleMap) {
                var groups = k.split("@");
                var groupField = groups[0]; //分组列名
                var groupValue = groups[1]; //分组列值
                var groupLength = groups[2]; //分组内数据长度
                var longitude = groups[3]; //经度
                var latitude = groups[4]; //纬度
                var poleTitle = ""; //取前5条数据作title提示
                for (var i = 0; i < poleMap[k].length; i++) {
                    poleTitle += poleMap[k][i].name + "&#13;";
                    if (i == 4) {
                        poleTitle += "......";
                        break;
                    }
                }
                // var lonlat = new HGIS.LonLat(longitude, latitude).transform(scope.layer.map.displayProjection, scope.layer.map.getProjectionObject());
                // --test, 坐标系转化为900913（米）, 
                // longitude = '121.41439819335938'
                // latitude = '31.176650047302246'
                var lonlat = new HGIS.LonLat(longitude, latitude).transform(new HGIS.Projection("EPSG:4326"), scope.layer.map.getProjectionObject());
                // --test over
                var position = scope.layer.map.getViewPortPxFromLonLat(lonlat);
                var divImg = scope.layer.createPoleDiv(poleTitle, groupLength, type, position, scope);

                divImg.polo = poleMap[k];
                divImg.lonlat = lonlat;
                divImg.type = type;
                divImg.groupField = groupField;
                divImg.groupValue = groupValue;

                divImg.onclick = function (evt) {
                    if (scope.layer.map.div.style.cursor == 'pointer') //为绘制测距状态
                        return false;
                    var thisObj = this;
                    if (this.timeId) {
                        clearTimeout(this.timeId);
                        thisObj.timeId = null;
                    } else {
                        this.timeId = setTimeout(function () {
                            thisObj.timeId = null;
                            if (scope && scope.layer && scope.layer.poleClick) {
                                scope.layer.poleClick(thisObj.polo, thisObj.lonlat, thisObj.type, thisObj.groupField, thisObj.groupValue);
                            }
                        }, 200);
                    }
                    if (evt) {
                        evt.stopPropagation();
                    }
                    return false;
                };
                scope.imgDiv.appendChild(divImg);
            }
        }
    },
    /**
     * 添加单点要素图层
     */
    addFeatures: function addFeatures(type, res, scope) {
        //添加非聚合图标
        var items = res.data[type].items;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.geometry = HGIS.Utils.wkt2Geom('POINT(' + item.geometry[0] + ' ' + item.geometry[1] + ')'); //HGIS.Utils.wkt2Geom(item.geometry);
                var lonlat = new HGIS.LonLat(item.geometry.x, item.geometry.y).transform(new HGIS.Projection("EPSG:4326"), scope.layer.map.getProjectionObject());
                var position = scope.layer.map.getViewPortPxFromLonLat(lonlat);
                var divImg = scope.layer.createFeatureDiv(item, type, position, scope);
                divImg.onclick = function (evt) {
                    if (scope.layer.map.div.style.cursor == 'pointer') //为绘制测距状态
                        return false;
                    var item = this.item;
                    var thisObj = this;
                    if (this.timeId) {
                        clearTimeout(this.timeId);
                        thisObj.timeId = null;
                    } else {
                        this.timeId = setTimeout(function () {
                            thisObj.timeId = null;
                            if (scope && scope.layer && scope.layer.itemClick) {
                                scope.layer.itemClick(item);
                            }
                        }, 200);
                    }
                    if (evt) {
                        evt.stopPropagation();
                    }
                    return false;
                };
                divImg.ondblclick = function (evt) {
                    if (scope.layer.map.div.style.cursor == 'pointer') //为绘制测距状态
                        return false;

                    if (this.timeId) {
                        clearTimeout(this.timeId);
                        this.timeId = null;
                    }
                    if (this.item && this.item.resourceType == "CAMERA") {
                        //监控点类型
                        if (scope && scope.layer && scope.layer.itemDbClick) {
                            scope.layer.itemDbClick(this.item);
                        }
                    } else {
                        this.onclick();
                    }
                    if (evt) {
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                    } else {
                        //ie阻止事件冒泡
                        window.event.cancelBubble = true;
                    }
                    return false;
                };
                scope.imgDiv.appendChild(divImg);
            }
        }
    },
    /**
     * 添加聚合要素图层
     */
    addClusterFeatures: function addClusterFeatures(type, res, scope) {
        //添加聚合图标
        var items = res.data[type].clusters;
        if (items == null) {
            return;
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var lonlat = new HGIS.LonLat(item.lon, item.lat).transform(new HGIS.Projection("EPSG:4326"), scope.layer.map.getProjectionObject());
            var position = scope.layer.map.getViewPortPxFromLonLat(lonlat);
            var divImg = scope.layer.createClusterDiv(item, type, position);
            divImg.item = item;
            divImg.onmouseover = function () {
                this.style.zIndex = 1;
            };
            divImg.onmouseout = function () {
                this.style.zIndex = 0;
            };
            scope.imgDiv.appendChild(divImg);
        }
    },
    /**
     * Method: getTile
     * Get the tile's markup.
     *
     * Returns:
     * {DOMElement} The tile's markup
     */
    getTile: function getTile() {
        return this.frame ? this.frame : this.getImage();
    },

    /**
     * Method: createBackBuffer
     * Create a backbuffer for this tile. A backbuffer isn't exactly a clone
     * of the tile's markup, because we want to avoid the reloading of the
     * image. So we clone the frame, and steal the image from the tile.
     *
     * Returns:
     * {DOMElement} The markup, or undefined if the tile has no image
     * or if it's currently loading.
     */
    createBackBuffer: function createBackBuffer() {
        if (!this.imgDiv || this.isLoading) {
            return;
        }
        var backBuffer;
        if (this.frame) {
            backBuffer = this.frame.cloneNode(false);
            backBuffer.appendChild(this.imgDiv);
        } else {
            backBuffer = this.imgDiv;
        }
        this.imgDiv = null;
        return backBuffer;
    },

    /**
     * Method: onImageLoad
     * Handler for the image onload event
     */
    onImageLoad: function onImageLoad() {
        var img = this.imgDiv;
        this.stopLoading();
        img.style.visibility = 'inherit';
        img.style.opacity = this.layer.opacity;
        this.isLoading = false;
        this.canvasContext = null;
        this.events.triggerEvent("loadend");

        if (this.layerAlphaHack === true) {
            img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='scale')";
        }
    },

    /**
     * Method: onImageError
     * Handler for the image onerror event
     */
    onImageError: function onImageError() {
        var img = this.imgDiv;
        if (img.src != null) {
            this.imageReloadAttempts++;
            if (this.imageReloadAttempts <= HGIS.IMAGE_RELOAD_ATTEMPTS) {
                this.setImgSrc(this.layer.getURL(this.bounds));
            } else {
                HGIS.Element.addClass(img, "olImageLoadError");
                this.events.triggerEvent("loaderror");
                this.onImageLoad();
            }
        }
    },

    /**
     * Method: stopLoading
     * Stops a loading sequence so <onImageLoad> won't be executed.
     */
    stopLoading: function stopLoading() {
        HGIS.Event.stopObservingElement(this.imgDiv);
        window.clearTimeout(this._loadTimeout);
        delete this._loadTimeout;
    },

    /**
     * APIMethod: getCanvasContext
     * Returns a canvas context associated with the tile image (with
     * the image drawn on it).
     * Returns undefined if the browser does not support canvas, if
     * the tile has no image or if it's currently loading.
     *
     * The function returns a canvas context instance but the
     * underlying canvas is still available in the 'canvas' property:
     * (code)
     * var context = tile.getCanvasContext();
     * if (context) {
     *     var data = context.canvas.toDataURL('image/jpeg');
     * }
     * (end)
     *
     * Returns:
     * {Boolean}
     */
    getCanvasContext: function getCanvasContext() {
        if (HGIS.CANVAS_SUPPORTED && this.imgDiv && !this.isLoading) {
            if (!this.canvasContext) {
                var canvas = document.createElement("canvas");
                canvas.width = this.size.w;
                canvas.height = this.size.h;
                this.canvasContext = canvas.getContext("2d");
                this.canvasContext.drawImage(this.imgDiv, 0, 0);
            }
            return this.canvasContext;
        }
    },
    /**
     * 执行查询操作函数
     */
    spatialQuery: function spatialQuery(data, url, success, error) {
        const csrf = document.getElementsByTagName('meta')['_csrf'].getAttribute('content')
        axios({
            method: 'post',
            url,
            data,
            headers: { 'X-CSRF-TOKEN': csrf || null }
        }).then((response) => {
            if (typeof success === 'function') {
                success(response);
            }
        }).catch((errrorInfo) => {
            if (typeof error === 'function') {
                error(errrorInfo);
            }
        
        });
    },
    CLASS_NAME: "HGIS.ClusterTile"
})