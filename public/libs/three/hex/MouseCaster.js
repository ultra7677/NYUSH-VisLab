/**
 * Created by ultra on 8/3/16.
 */
vg.MouseCaster = function(e, t, i) {
    this.down = !1,
        this.rightDown = !1,
        this.pickedObject = null ,
        this.selectedObject = null ,
        this.allHits = null ,
        this.active = !0,
        this.shift = !1,
        this.ctrl = !1,
        this.wheel = 0,
        this.position = new THREE.Vector3,
        this.screenPosition = new THREE.Vector2,
        this.signal = new vg.Signal,
        this.group = e,
        this._camera = t,
        this._raycaster = new THREE.Raycaster,
        this._preventDefault = !1,
        i = i || document,
        i.addEventListener("mousemove", this._onDocumentMouseMove.bind(this), !1),
        i.addEventListener("mousedown", this._onDocumentMouseDown.bind(this), !1),
        i.addEventListener("mouseup", this._onDocumentMouseUp.bind(this), !1),
        i.addEventListener("mousewheel", this._onMouseWheel.bind(this), !1),
        i.addEventListener("DOMMouseScroll", this._onMouseWheel.bind(this), !1)
}
    ,
    vg.MouseCaster.OVER = "over",
    vg.MouseCaster.OUT = "out",
    vg.MouseCaster.DOWN = "down",
    vg.MouseCaster.UP = "up",
    vg.MouseCaster.CLICK = "click",
    vg.MouseCaster.WHEEL = "wheel",
    vg.MouseCaster.prototype = {
        update: function() {
            if (this.active) {
                this._raycaster.setFromCamera(this.screenPosition, this._camera);
                var e, t, i = this._raycaster.intersectObject(this.group, !0);
                i.length > 0 ? (e = i[0],
                    t = e.object.userData.structure,
                this.pickedObject != t && (this.pickedObject && this.signal.dispatch(vg.MouseCaster.OUT, this.pickedObject),
                    this.pickedObject = t,
                    this.selectedObject = null ,
                    this.signal.dispatch(vg.MouseCaster.OVER, this.pickedObject)),
                    this.position.copy(e.point),
                    this.screenPosition.z = e.distance) : (this.pickedObject && this.signal.dispatch(vg.MouseCaster.OUT, this.pickedObject),
                    this.pickedObject = null ,
                    this.selectedObject = null ),
                    this.allHits = i
            }
        },
        preventDefault: function() {
            this._preventDefault = !0
        },
        _onDocumentMouseDown: function(e) {
            return e = e || window.event,
                e.preventDefault(),
                this._preventDefault ? (this._preventDefault = !1,
                    !1) : (this.pickedObject && (this.selectedObject = this.pickedObject),
                    this.shift = e.shiftKey,
                    this.ctrl = e.ctrlKey,
                    this.down = 1 === e.which,
                    this.rightDown = 3 === e.which,
                    void this.signal.dispatch(vg.MouseCaster.DOWN, this.pickedObject))
        },
        _onDocumentMouseUp: function(e) {
            return e.preventDefault(),
                this._preventDefault ? (this._preventDefault = !1,
                    !1) : (this.shift = e.shiftKey,
                    this.ctrl = e.ctrlKey,
                    this.signal.dispatch(vg.MouseCaster.UP, this.pickedObject),
                this.selectedObject && this.pickedObject && this.selectedObject.uniqueID === this.pickedObject.uniqueID && this.signal.dispatch(vg.MouseCaster.CLICK, this.pickedObject),
                    this.down = 1 === e.which ? !1 : this.down,
                    void (this.rightDown = 3 === e.which ? !1 : this.rightDown))
        },
        _onDocumentMouseMove: function(e) {
            e.preventDefault(),
             //  console.log(this.group.offsetX);
                this.screenPosition.x = ((e.clientX + this.group.offsetX) / this.group.width )* 2 - 1,
                this.screenPosition.y = -( (e.clientY + this.group.offsetY) / this.group.height) * 2 + 1
        },
        _onMouseWheel: function(e) {
            if (this.active) {
                e.preventDefault(),
                    e.stopPropagation();
                var t = 0;
                void 0 !== e.wheelDelta ? t = e.wheelDelta : void 0 !== e.detail && (t = -e.detail),
                    t > 0 ? this.wheel++ : this.wheel--,
                    this.signal.dispatch(vg.MouseCaster.WHEEL, this.wheel)
            }
        }
    },
    vg.MouseCaster.prototype.constructor = vg.MouseCaster;