
/* eslint-disable */
/**
 * Class: HGIS.Popup
 * 地图可打开和关闭的一个小div.一般情况下，是通过单击一个marker对象触发的. 请参考<HGIS.Marker>.Popup不需要一个附着在地图的图层来承载，使用地图对象的addPopup方法添加到地图上。
 *
 */
let HGIS = window.HGIS
HGIS.PopupEx = HGIS.Class({

    /**
     * Property: events
     * {<HGIS.Events>} custom event manager
     */
    events: null,

    /** Property: id
     * {String} the unique identifier assigned to this popup.
     */
    id: "",

    /**
     * Property: lonlat
     * {<HGIS.LonLat>} the position of this popup on the map
     */
    lonlat: null,

    /**
     * Property: div
     * {DOMElement} the div that contains this popup.
     */
    div: null,

    /**
     * Property: contentSize
     * {<HGIS.Size>} the width and height of the content.
     */
    contentSize: null,

    /**
     * Property: size
     * {<HGIS.Size>} the width and height of the popup.
     */
    size: null,

    /**
     * Property: contentHTML
     * {String} An HTML string for this popup to display.
     */
    contentHTML: null,

    /**
     * Property: backgroundColor
     * {String} the background color used by the popup.
     */
    backgroundColor: "",

    /**
     * Property: opacity
     * {float} the opacity of this popup (between 0.0 and 1.0)
     */
    opacity: "",

    /**
     * Property: border
     * {String} the border size of the popup.  (eg 2px)
     */
    border: "",

    /**
     * Property: contentDiv
     * {DOMElement} a reference to the element that holds the content of
     *              the div.
     */
    contentDiv: null,

    /**
     * Property: groupDiv
     * {DOMElement} First and only child of 'div'. The group Div contains the
     *     'contentDiv' and the 'closeDiv'.
     */
    groupDiv: null,

    /**
     * Property: closeDiv
     * {DOMElement} the optional closer image
     */
    closeDiv: null,

    /**
     * APIProperty: autoSize
     * {Boolean} 根据弹窗内容自动调整弹窗大小，默认为false。
     */
    autoSize: false,

    /**
     * APIProperty: minSize
     * {<HGIS.Size>} 允许弹出内容的最小尺寸.
     */
    minSize: null,

    /**
     * APIProperty: maxSize
     * {<HGIS.Size>}  允许弹出内容的最大尺寸.
     */
    maxSize: null,

    /**
     * Property: displayClass
     * {String} The CSS class of the popup.
     */
    displayClass: "noneClass",

    /**
     * Property: contentDisplayClass
     * {String} The CSS class of the popup content div.
     */
    contentDisplayClass: "noneClass",

    /**
     * Property: padding
     * {int or <HGIS.Bounds>} An extra opportunity to specify internal
     *     padding of the content div inside the popup. This was originally
     *     confused with the css padding as specified in style.css's
     *     'olPopupContent' class. We would like to get rid of this altogether,
     *     except that it does come in handy for the framed and anchoredbubble
     *     popups, who need to maintain yet another barrier between their
     *     content and the outer border of the popup itself.
     *
     *     Note that in order to not break API, we must continue to support
     *     this property being set as an integer. Really, though, we'd like to
     *     have this specified as a Bounds object so that user can specify
     *     distinct left, top, right, bottom paddings. With the 3.0 release
     *     we can make this only a bounds.
     */
    padding: 0,

    /**
     * Property: disableFirefoxOverflowHack
     * {Boolean} The hack for overflow in Firefox causes all elements
     *     to be re-drawn, which causes Flash elements to be
     *     re-initialized, which is troublesome.
     *     With this property the hack can be disabled.
     */
    disableFirefoxOverflowHack: false,

    /**
     * Method: fixPadding
     * To be removed in 3.0, this function merely helps us to deal with the
     *     case where the user may have set an integer value for padding,
     *     instead of an <HGIS.Bounds> object.
     */
    fixPadding: function () {
        if (typeof this.padding == "number") {
            this.padding = new HGIS.Bounds(
                this.padding, this.padding, this.padding, this.padding
            );
        }
    },

    /**
     * APIProperty: panMapIfOutOfView
     * {Boolean} 移动地图时，是否在确保，弹框整个部分在当前视窗范围内可见，默认为false
     */
    panMapIfOutOfView: false,

    /**
     * APIProperty: keepInMap
     * {Boolean} 是否保留在地图视窗以内.
     *  当panMapIfOutOfView 属性为false，并且当前属性为true的时候， 弹窗调整自身大小以确保在当前地图窗口内。
     *  如果需要创建一个临近地图边缘并且 不发生平移的弹窗，或者是一个固定了相对位置的弹窗，必须设置该属性为false。
     */
    keepInMap: false,

    /**
     * Property: changeAnchorIfOutOfView
     * {Boolean} 超出视图范围后，是否对锚点进行调整,默认为true.针对于anchored、framedClound等基于popup的拓展类
     * 当changeAnchorIfOutOfView为true时，当需要显示的弹框位置超出了视图范围，弹框的锚点信息将做变更，以将弹框完整展示。
     */
    changeArchorIfOutOfView: true,

    /**
     * APIProperty: closeOnMove
     * {Boolean} 当地图平移时，关闭弹窗。 默认为false。
     */
    closeOnMove: false,

    /**
     * Property: map
     * {<HGIS.Map>} this gets set in Map.js when the popup is added to the map
     */
    map: null,

    /**
     * 偏移量
     */
    offset: new HGIS.Pixel(0, 0),

    /**
     * Constructor: HGIS.Popup
     * 创建弹窗。在地图上可以打开或关闭，通常情况下点击一个 icon 打开弹窗， 弹窗直接加载到map上，不需要创建图层，可用 HGIS.Map.addPopup 方法在地图上添加使用。 例如:
     *
     * Parameters:
     * id - {String} 弹窗的唯一标识，如设为null，则将会自动生成。.
     * lonlat - {<HGIS.LonLat>}  地图上弹窗显示的位置.
     * contentSize - {<HGIS.Size>}  弹窗内容的大小.
     * contentHTML - {String}           弹窗中显示的一个HTML要素的字符串.
     * closeBox - {Boolean}            在弹出窗口的里面是否显示关闭窗
     * closeBoxCallback - {Function}   关闭弹窗触发该回调函数.
     *
     * 示例:
     * (code)
     * popup = new HGIS.Popup("chicken",
     *                    new HGIS.LonLat(5,40),
     *                    new HGIS.Size(200,200),
     *                    "example popup",
     *                    true);
     *
     * map.addPopup(popup);
     * (end)
     */
    initialize: function (id, lonlat, contentSize, offset, contentHTML, closeBox, closeBoxCallback) {
        if (id == null) {
            id = HGIS.Util.createUniqueID(this.CLASS_NAME + "_");
        }

        this.id = id;
        this.lonlat = lonlat;
        this.offset = offset;

        this.contentSize = (contentSize != null) ? contentSize
            : new HGIS.Size(
                HGIS.Popup.WIDTH,
                HGIS.Popup.HEIGHT);
        if (contentHTML != null) {
            this.contentHTML = contentHTML;
        }
        this.backgroundColor = HGIS.Popup.COLOR;
        this.opacity = HGIS.Popup.OPACITY;
        this.border = HGIS.Popup.BORDER;

        this.div = HGIS.Util.createDiv(this.id, null, null,
            null, null, null, "visible");
        this.div.className = this.displayClass;

        var groupDivId = this.id + "_GroupDiv";
        this.groupDiv = HGIS.Util.createDiv(groupDivId, null, null,
            null, "relative", null,
            "visible");

        var id = this.div.id + "_contentDiv";
        this.contentDiv = HGIS.Util.createDiv(id, null, this.contentSize.clone(),
            null, "relative");
        this.contentDiv.className = this.contentDisplayClass;
        this.groupDiv.appendChild(this.contentDiv);
        this.div.appendChild(this.groupDiv);

        if (closeBox) {
            this.addCloseBox(closeBoxCallback);
        }

        this.registerEvents();
    },

    /**
     * Method: destroy
     * nullify references to prevent circular references and memory leaks
     */
    destroy: function () {

        this.id = null;
        this.lonlat = null;
        this.size = null;
        this.contentHTML = null;

        this.backgroundColor = null;
        this.opacity = null;
        this.border = null;

        if (this.closeOnMove && this.map) {
            this.map.events.unregister("movestart", this, this.hide);
        }

        this.events.destroy();
        this.events = null;

        if (this.closeDiv) {
            HGIS.Event.stopObservingElement(this.closeDiv);
            this.groupDiv.removeChild(this.closeDiv);
        }
        this.closeDiv = null;

        this.div.removeChild(this.groupDiv);
        this.groupDiv = null;

        if (this.map != null) {
            this.map.removePopup(this);
        }
        this.map = null;
        this.div = null;

        this.autoSize = null;
        this.minSize = null;
        this.maxSize = null;
        this.padding = null;
        this.panMapIfOutOfView = null;
    },

    /**
     * Method: draw
     * Constructs the elements that make up the popup.
     *
     * Parameters:
     * px - {<HGIS.Pixel>} the position the popup in pixels.
     *
     * Returns:
     * {DOMElement} Reference to a div that contains the drawn popup
     */
    draw: function (px) {
        if (px == null) {
            if ((this.lonlat != null) && (this.map != null)) {
                px = this.map.getLayerPxFromLonLat(this.lonlat);
            }
        }

        // this assumes that this.map already exists, which is okay because
        // this.draw is only called once the popup has been added to the map.
        if (this.closeOnMove) {
            this.map.events.register("movestart", this, this.hide);
        }

        //listen to movestart, moveend to disable overflow (FF bug)
        if (!this.disableFirefoxOverflowHack && HGIS.BROWSER_NAME == 'firefox') {
            this.map.events.register("movestart", this, function () {
                var style = document.defaultView.getComputedStyle(
                    this.contentDiv, null
                );
                var currentOverflow = style.getPropertyValue("overflow");
                if (currentOverflow != "hidden") {
                    this.contentDiv._oldOverflow = currentOverflow;
                    // this.contentDiv.style.overflow = "hidden";
                }
            });
            this.map.events.register("moveend", this, function () {
                var oldOverflow = this.contentDiv._oldOverflow;
                if (oldOverflow) {
                    this.contentDiv.style.overflow = oldOverflow;
                    this.contentDiv._oldOverflow = null;
                }
            });
        }

        this.moveTo(px);
        if (!this.autoSize && !this.size) {
            this.setSize(this.contentSize);
        }
        this.setBackgroundColor();
        this.setOpacity();
        this.setBorder();
        this.setContentHTML();
        // 超出视图范围的 锚点变更
        if (this.changeAnchorIfOutOfView) {
            this.changeAnchorSize();
        }
        if (this.panMapIfOutOfView) {
            this.panIntoView();
        }
        return this.div;
    },

    /**
     * Method: updatePosition
     * if the popup has a lonlat and its map members set,
     * then have it move itself to its proper position
     */
    updatePosition: function () {
        if ((this.lonlat) && (this.map)) {
            var px = this.map.getLayerPxFromLonLat(this.lonlat);
            if (px) {
                this.moveTo(px);
            }
        }
    },

    /**
     * Method: moveTo
     *
     * Parameters:
     * px - {<HGIS.Pixel>} the top and left position of the popup div.
     */
    moveTo: function (px) {
        px.x += this.offset.x;
        px.y += this.offset.y;
        if ((px != null) && (this.div != null)) {
            this.div.style.left = px.x + "px";
            this.div.style.top = px.y + "px";
        }
    },

    /**
     * Method: visible
     *
     * Returns:
     * {Boolean} Boolean indicating whether or not the popup is visible
     */
    visible: function () {
        return HGIS.Element.visible(this.div);
    },

    /**
     * Method: toggle
     * Toggles visibility of the popup.
     */
    toggle: function () {
        if (this.visible()) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * Method: show
     * Makes the popup visible.
     */
    show: function () {
        this.div.style.display = '';

        if (this.panMapIfOutOfView) {
            this.panIntoView();
        }
    },

    /**
     * Method: hide
     * Makes the popup invisible.
     */
    hide: function () {
        this.div.style.display = 'none';
    },

    /**
     * Method: setSize
     * Used to adjust the size of the popup.
     *
     * Parameters:
     * contentSize - {<HGIS.Size>} the new size for the popup's
     *     contents div (in pixels).
     */
    setSize: function (contentSize) {
        this.size = contentSize.clone();

        // if our contentDiv has a css 'padding' set on it by a stylesheet, we
        //  must add that to the desired "size".
        var contentDivPadding = this.getContentDivPadding();
        var wPadding = contentDivPadding.left + contentDivPadding.right;
        var hPadding = contentDivPadding.top + contentDivPadding.bottom;

        // take into account the popup's 'padding' property
        this.fixPadding();
        wPadding += this.padding.left + this.padding.right;
        hPadding += this.padding.top + this.padding.bottom;

        // make extra space for the close div
        if (this.closeDiv) {
            var closeDivWidth = parseInt(this.closeDiv.style.width);
            wPadding += closeDivWidth + contentDivPadding.right;
        }

        //increase size of the main popup div to take into account the
        // users's desired padding and close div.
        this.size.w += wPadding;
        this.size.h += hPadding;

        //now if our browser is IE, we need to actually make the contents
        // div itself bigger to take its own padding into effect. this makes
        // me want to shoot someone, but so it goes.
        if (HGIS.BROWSER_NAME == "msie") {
            this.contentSize.w +=
                contentDivPadding.left + contentDivPadding.right;
            this.contentSize.h +=
                contentDivPadding.bottom + contentDivPadding.top;
        }

        if (this.div != null) {
            this.div.style.width = this.size.w + "px";
            this.div.style.height = this.size.h + "px";
        }
        if (this.contentDiv != null) {
            this.contentDiv.style.width = contentSize.w + "px";
            this.contentDiv.style.height = contentSize.h + "px";
        }
    },

    /**
     * APIMethod: updateSize
     * 自动调整弹窗大小适应其弹出内容,弹窗大小受限制于当前地图空间大小
     */
    updateSize: function () {

        // determine actual render dimensions of the contents by putting its
        // contents into a fake contentDiv (for the CSS) and then measuring it
        var preparedHTML = "<div class='" + this.contentDisplayClass + "'>" +
            this.contentDiv.innerHTML +
            "</div>";

        var containerElement = (this.map) ? this.map.div : document.body;
        var realSize = HGIS.Util.getRenderedDimensions(
            preparedHTML, null, {
            displayClass: this.displayClass,
            containerElement: containerElement
        }
        );

        // is the "real" size of the div is safe to display in our map?
        var safeSize = this.getSafeContentSize(realSize);

        var newSize = null;
        if (safeSize.equals(realSize)) {
            //real size of content is small enough to fit on the map,
            // so we use real size.
            newSize = realSize;

        } else {

            // make a new 'size' object with the clipped dimensions
            // set or null if not clipped.
            var fixedSize = {
                w: (safeSize.w < realSize.w) ? safeSize.w : null,
                h: (safeSize.h < realSize.h) ? safeSize.h : null
            };

            if (fixedSize.w && fixedSize.h) {
                //content is too big in both directions, so we will use
                // max popup size (safeSize), knowing well that it will
                // overflow both ways.
                newSize = safeSize;
            } else {
                //content is clipped in only one direction, so we need to
                // run getRenderedDimensions() again with a fixed dimension
                var clippedSize = HGIS.Util.getRenderedDimensions(
                    preparedHTML, fixedSize, {
                    displayClass: this.contentDisplayClass,
                    containerElement: containerElement
                }
                );

                //if the clipped size is still the same as the safeSize,
                // that means that our content must be fixed in the
                // offending direction. If overflow is 'auto', this means
                // we are going to have a scrollbar for sure, so we must
                // adjust for that.
                //
                var currentOverflow = HGIS.Element.getStyle(
                    this.contentDiv, "overflow"
                );
                if ((currentOverflow != "hidden") &&
                    (clippedSize.equals(safeSize))) {
                    var scrollBar = HGIS.Util.getScrollbarWidth();
                    if (fixedSize.w) {
                        clippedSize.h += scrollBar;
                    } else {
                        clippedSize.w += scrollBar;
                    }
                }

                newSize = this.getSafeContentSize(clippedSize);
            }
        }
        this.setSize(newSize);
    },

    /**
     * APIMethod: setBackgroundColor
     * 设置弹出框的背景颜色.注意FramedCloud的背景是一张白色图片拼成，其底图颜色不能用此方法改变。
     *
     * Parameters:
     * color - {String} 背景颜色.eg "#FFBBBB"
     */
    setBackgroundColor: function (color) {
        if (color != undefined) {
            this.backgroundColor = color;
        }

        if (this.div != null) {
            this.div.style.backgroundColor = this.backgroundColor;
        }
    },

    /**
     * APIMethod: setOpacity
     * 设置弹出框的透明度
     *
     * Parameters:
     * opacity - {float} 该值在0.0（完全透明）到1.0（不透明）之间.
     */
    setOpacity: function (opacity) {
        if (opacity != undefined) {
            this.opacity = opacity;
        }

        if (this.div != null) {
            // for Mozilla and Safari
            this.div.style.opacity = this.opacity;

            // for IE
            this.div.style.filter = 'alpha(opacity=' + this.opacity * 100 + ')';
        }
    },

    /**
     * APIMethod: setBorder
     * 设置弹出窗体的边框样式.  对应页面元素style的border属性
     *
     * Parameters:
     * border - {String} 边框的样式值.  如 solid 代表实线
     */
    setBorder: function (border) {
        if (border != undefined) {
            this.border = border;
        }

        if (this.div != null) {
            this.div.style.border = this.border;
        }
    },

    /**
     * Method: setContentHTML
     * Allows the user to set the HTML content of the popup.
     *
     * Parameters:
     * contentHTML - {String} HTML for the div.
     */
    setContentHTML: function (contentHTML) {

        if (contentHTML != null) {
            this.contentHTML = contentHTML;
        }

        if ((this.contentDiv != null) &&
            (this.contentHTML != null)) {

            //   this.contentDiv.innerHTML = this.contentHTML;
            // console.log(this.contentHTML)
            this.contentDiv.appendChild(this.contentHTML)

            if (this.autoSize) {

                //if popup has images, listen for when they finish
                // loading and resize accordingly
                this.registerImageListeners();

                //auto size the popup to its current contents
                this.updateSize();
            }
        }

    },

    /**
     * Method: registerImageListeners
     * Called when an image contained by the popup loaded. this function
     *     updates the popup size, then unregisters the image load listener.
     */
    registerImageListeners: function () {

        // As the images load, this function will call updateSize() to
        // resize the popup to fit the content div (which presumably is now
        // bigger than when the image was not loaded).
        //
        // If the 'panMapIfOutOfView' property is set, we will pan the newly
        // resized popup back into view.
        //
        // Note that this function, when called, will have 'popup' and
        // 'img' properties in the context.
        //
        var onImgLoad = function () {
            if (this.popup.id === null) { // this.popup has been destroyed!
                return;
            }
            this.popup.updateSize();

            if (this.popup.visible() && this.popup.panMapIfOutOfView) {
                this.popup.panIntoView();
            }

            HGIS.Event.stopObserving(
                this.img, "load", this.img._onImgLoad
            );

        };

        //cycle through the images and if their size is 0x0, that means that
        // they haven't been loaded yet, so we attach the listener, which
        // will fire when the images finish loading and will resize the
        // popup accordingly to its new size.
        var images = this.contentDiv.getElementsByTagName("img");
        for (var i = 0, len = images.length; i < len; i++) {
            var img = images[i];
            if (img.width == 0 || img.height == 0) {

                var context = {
                    'popup': this,
                    'img': img
                };

                //expando this function to the image itself before registering
                // it. This way we can easily and properly unregister it.
                img._onImgLoad = HGIS.Function.bind(onImgLoad, context);

                HGIS.Event.observe(img, 'load', img._onImgLoad);
            }
        }
    },

    /**
     * APIMethod: getSafeContentSize
     * 弹窗大小
     *
     * Parameters:
     * size - {<HGIS.Size>} 弹窗大小.
     *
     * Returns:
     * {<HGIS.Size>} 弹窗的大小，既不能小于指定的最小尺寸，也不能大于最大的尺寸（计算相对于视图窗口的大小）。
     */
    getSafeContentSize: function (size) {

        var safeContentSize = size.clone();

        // if our contentDiv has a css 'padding' set on it by a stylesheet, we
        //  must add that to the desired "size".
        var contentDivPadding = this.getContentDivPadding();
        var wPadding = contentDivPadding.left + contentDivPadding.right;
        var hPadding = contentDivPadding.top + contentDivPadding.bottom;

        // take into account the popup's 'padding' property
        this.fixPadding();
        wPadding += this.padding.left + this.padding.right;
        hPadding += this.padding.top + this.padding.bottom;

        if (this.closeDiv) {
            var closeDivWidth = parseInt(this.closeDiv.style.width);
            wPadding += closeDivWidth + contentDivPadding.right;
        }

        // prevent the popup from being smaller than a specified minimal size
        if (this.minSize) {
            safeContentSize.w = Math.max(safeContentSize.w,
                (this.minSize.w - wPadding));
            safeContentSize.h = Math.max(safeContentSize.h,
                (this.minSize.h - hPadding));
        }

        // prevent the popup from being bigger than a specified maximum size
        if (this.maxSize) {
            safeContentSize.w = Math.min(safeContentSize.w,
                (this.maxSize.w - wPadding));
            safeContentSize.h = Math.min(safeContentSize.h,
                (this.maxSize.h - hPadding));
        }

        //make sure the desired size to set doesn't result in a popup that
        // is bigger than the map's viewport.
        //
        if (this.map && this.map.size) {

            var extraX = 0, extraY = 0;
            if (this.keepInMap && !this.panMapIfOutOfView) {
                var px = this.map.getPixelFromLonLat(this.lonlat);
                switch (this.relativePosition) {
                    case "tr":
                        extraX = px.x;
                        extraY = this.map.size.h - px.y;
                        break;
                    case "tl":
                        extraX = this.map.size.w - px.x;
                        extraY = this.map.size.h - px.y;
                        break;
                    case "bl":
                        extraX = this.map.size.w - px.x;
                        extraY = px.y;
                        break;
                    case "br":
                        extraX = px.x;
                        extraY = px.y;
                        break;
                    default:
                        extraX = px.x;
                        extraY = this.map.size.h - px.y;
                        break;
                }
            }

            var maxY = this.map.size.h -
                this.map.paddingForPopups.top -
                this.map.paddingForPopups.bottom -
                hPadding - extraY;

            var maxX = this.map.size.w -
                this.map.paddingForPopups.left -
                this.map.paddingForPopups.right -
                wPadding - extraX;

            safeContentSize.w = Math.min(safeContentSize.w, maxX);
            safeContentSize.h = Math.min(safeContentSize.h, maxY);
        }

        return safeContentSize;
    },

    /**
     * Method: getContentDivPadding
     * Glorious, oh glorious hack in order to determine the css 'padding' of
     *     the contentDiv. IE/Opera return null here unless we actually add the
     *     popup's main 'div' element (which contains contentDiv) to the DOM.
     *     So we make it invisible and then add it to the document temporarily.
     *
     *     Once we've taken the padding readings we need, we then remove it
     *     from the DOM (it will actually get added to the DOM in
     *     Map.js's addPopup)
     *
     * Returns:
     * {<HGIS.Bounds>}
     */
    getContentDivPadding: function () {

        //use cached value if we have it
        var contentDivPadding = this._contentDivPadding;
        if (!contentDivPadding) {

            if (this.div.parentNode == null) {
                //make the div invisible and add it to the page
                this.div.style.display = "none";
                document.body.appendChild(this.div);
            }

            //read the padding settings from css, put them in an OL.Bounds
            contentDivPadding = new HGIS.Bounds(
                HGIS.Element.getStyle(this.contentDiv, "padding-left"),
                HGIS.Element.getStyle(this.contentDiv, "padding-bottom"),
                HGIS.Element.getStyle(this.contentDiv, "padding-right"),
                HGIS.Element.getStyle(this.contentDiv, "padding-top")
            );

            //cache the value
            this._contentDivPadding = contentDivPadding;

            if (this.div.parentNode == document.body) {
                //remove the div from the page and make it visible again
                document.body.removeChild(this.div);
                this.div.style.display = "";
            }
        }
        return contentDivPadding;
    },

    /**
     * Method: addCloseBox
     *
     * Parameters:
     * callback - {Function} The callback to be called when the close button
     *     is clicked.
     */
    addCloseBox: function (callback) {

        this.closeDiv = HGIS.Util.createDiv(
            this.id + "_close", null, { w: 17, h: 17 }
        );
        this.closeDiv.className = "olPopupCloseBox";

        // use the content div's css padding to determine if we should
        //  padd the close div
        var contentDivPadding = this.getContentDivPadding();

        this.closeDiv.style.right = contentDivPadding.right + "px";
        this.closeDiv.style.top = contentDivPadding.top + "px";
        this.groupDiv.appendChild(this.closeDiv);

        var closePopup = function (e) {
            this.hide();
            HGIS.Event.stop(e);
        };

        if (callback) {
            var me = this;
            closePopup = function (e) {
                me.hide();
                HGIS.Event.stop(e);
                callback();
            };
        }
        HGIS.Event.observe(this.closeDiv, "touchend",
            HGIS.Function.bindAsEventListener(closePopup, this));
        HGIS.Event.observe(this.closeDiv, "click",
            HGIS.Function.bindAsEventListener(closePopup, this));
    },

    /**
     * Method: panIntoView
     * Pans the map such that the popup is totaly viewable (if necessary)
     */
    panIntoView: function () {
        var arr = this.calculateOffset();
        this.map.pan(arr[0], arr[1]);
    },
    /**
     * Method: calculateOffset
     *  参考以上的panIntoView 的方法，计算地图应该平移的值，取其值 进行计算
     */
    calculateOffset: function () {

        var mapSize = this.map.getSize();

        //start with the top left corner of the popup, in px,
        // relative to the viewport
        var origTL = this.map.getViewPortPxFromLayerPx(new HGIS.Pixel(
            parseInt(this.div.style.left),
            parseInt(this.div.style.top)
        ));
        var newTL = origTL.clone();

        //new left (compare to margins, using this.size to calculate right)
        if (origTL.x < this.map.paddingForPopups.left) {
            newTL.x = this.map.paddingForPopups.left;
        } else
            if ((origTL.x + this.size.w) > (mapSize.w - this.map.paddingForPopups.right)) {
                newTL.x = mapSize.w - this.map.paddingForPopups.right - this.size.w;
            }

        //new top (compare to margins, using this.size to calculate bottom)
        if (origTL.y < this.map.paddingForPopups.top) {
            newTL.y = this.map.paddingForPopups.top;
        } else
            if ((origTL.y + this.size.h) > (mapSize.h - this.map.paddingForPopups.bottom)) {
                newTL.y = mapSize.h - this.map.paddingForPopups.bottom - this.size.h;
            }

        var dx = origTL.x - newTL.x;
        var dy = origTL.y - newTL.y
        var arr = new Array(dx, dy)
        return arr;
    },

    /**
     * Method: registerEvents
     * Registers events on the popup.
     *
     * Do this in a separate function so that subclasses can
     *   choose to override it if they wish to deal differently
     *   with mouse events
     *
     *   Note in the following handler functions that some special
     *    care is needed to deal correctly with mousing and popups.
     *
     *   Because the user might select the zoom-rectangle option and
     *    then drag it over a popup, we need a safe way to allow the
     *    mousemove and mouseup events to pass through the popup when
     *    they are initiated from outside. The same procedure is needed for
     *    touchmove and touchend events.
     *
     *   Otherwise, we want to essentially kill the event propagation
     *    for all other events, though we have to do so carefully,
     *    without disabling basic html functionality, like clicking on
     *    hyperlinks or drag-selecting text.
     */
    registerEvents: function () {
        this.events = new HGIS.Events(this, this.div, null, true);

        function onTouchstart(evt) {
            HGIS.Event.stop(evt, true);
        }
        this.events.on({
            "mousedown": this.onmousedown,
            "mousemove": this.onmousemove,
            "mouseup": this.onmouseup,
            "click": this.onclick,
            "mouseout": this.onmouseout,
            "dblclick": this.ondblclick,
            "touchstart": onTouchstart,
            scope: this
        });

    },

    /**
     * Method: onmousedown
     * When mouse goes down within the popup, make a note of
     *   it locally, and then do not propagate the mousedown
     *   (but do so safely so that user can select text inside)
     *
     * Parameters:
     * evt - {Event}
     */
    onmousedown: function (evt) {
        this.mousedown = true;
        HGIS.Event.stop(evt, true);
    },

    /**
     * Method: onmousemove
     * If the drag was started within the popup, then
     *   do not propagate the mousemove (but do so safely
     *   so that user can select text inside)
     *
     * Parameters:
     * evt - {Event}
     */
    onmousemove: function (evt) {
        if (this.mousedown) {
            HGIS.Event.stop(evt, true);
        }
    },

    /**
     * Method: onmouseup
     * When mouse comes up within the popup, after going down
     *   in it, reset the flag, and then (once again) do not
     *   propagate the event, but do so safely so that user can
     *   select text inside
     *
     * Parameters:
     * evt - {Event}
     */
    onmouseup: function (evt) {
        if (this.mousedown) {
            this.mousedown = false;
            HGIS.Event.stop(evt, true);
        }
    },

    /**
     * Method: onclick
     * Ignore clicks, but allowing default browser handling
     *
     * Parameters:
     * evt - {Event}
     */
    onclick: function (evt) {
        HGIS.Event.stop(evt, true);
    },

    /**
     * Method: onmouseout
     * When mouse goes out of the popup set the flag to false so that
     *   if they let go and then drag back in, we won't be confused.
     *
     * Parameters:
     * evt - {Event}
     */
    onmouseout: function (evt) {
        this.mousedown = false;
    },

    /**
     * Method: ondblclick
     * Ignore double-clicks, but allowing default browser handling
     *
     * Parameters:
     * evt - {Event}
     */
    ondblclick: function (evt) {
        HGIS.Event.stop(evt, true);
    },

    CLASS_NAME: "HGIS.Popup"
});

HGIS.Popup.WIDTH = 200;
HGIS.Popup.HEIGHT = 200;
HGIS.Popup.COLOR = "white";
HGIS.Popup.OPACITY = 1;
HGIS.Popup.BORDER = "0px";