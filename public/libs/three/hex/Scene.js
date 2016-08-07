/**
 * Created by ultra on 8/3/16.
 */
vg.Scene = function(e, t) {
    var i = {
        element: document.body,
        alpha: !0,
        antialias: !0,
        clearColor: "#fff",
        sortObjects: !1,
        fog: null ,
        light: new THREE.DirectionalLight(16777215),
        lightPosition: null ,
        cameraType: "PerspectiveCamera",
        cameraPosition: null ,
        orthoZoom: 4
    }
        , s = {
        minDistance: 100,
        maxDistance: 1e3,
        zoomSpeed: 2,
        noZoom: !1
    };

    if (i = vg.Tools.merge(i, e),
        "boolean" != typeof t && (s = vg.Tools.merge(s, t)),
            this.renderer = new THREE.WebGLRenderer({
                alpha: i.alpha,
                antialias: i.antialias
            }),
            this.renderer.setClearColor(i.clearColor, 0),
            this.renderer.sortObjects = i.sortObjects,
            // the width and height of the canvas
            this.width = e.width,
            this.height = e.height,
            this.orthoZoom = i.orthoZoom,
            this.container = new THREE.Scene,
            this.container.fog = i.fog,
            this.container.add(new THREE.AmbientLight(14540253)),
        i.lightPosition || i.light.position.set(-1, 1, -1).normalize(),
            this.container.add(i.light),
        "OrthographicCamera" === i.cameraType) {
        var n = window.innerWidth / this.orthoZoom
            , l = window.innerHeight / this.orthoZoom;
        this.camera = new THREE.OrthographicCamera(n / -2,n / 2,l / 2,l / -2,1,5e3)
    } else
        this.camera = new THREE.PerspectiveCamera(50,this.width / this.height,1,5e3);
    this.contolled = !!t,
    this.contolled && (this.controls = new THREE.OrbitControls(this.camera,this.renderer.domElement),
        this.controls.minDistance = s.minDistance,
        this.controls.maxDistance = s.maxDistance,
        this.controls.zoomSpeed = s.zoomSpeed,
        this.controls.noZoom = s.noZoom),
    i.cameraPosition && this.camera.position.copy(i.cameraPosition),
        window.addEventListener("resize", function() {
            if (this.width = window.innerWidth,
                    this.height = window.innerHeight,
                "OrthographicCamera" === this.camera.type) {
                var e = this.width / this.orthoZoom
                    , t = this.height / this.orthoZoom;
                this.camera.left = e / -2,
                    this.camera.right = e / 2,
                    this.camera.top = t / 2,
                    this.camera.bottom = t / -2
            } else
                this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix(),
                this.renderer.setSize(this.width, this.height)
        }
            .bind(this), !1),
        this.attachTo(i.element)
}
    ,
    vg.Scene.prototype = {
        attachTo: function(e) {
            e.style.width = this.width + "px",
                e.style.height = this.height + "px",
                this.renderer.setPixelRatio(window.devicePixelRatio),
                this.renderer.setSize(this.width, this.height),
                e.appendChild(this.renderer.domElement)
        },
        add: function(e) {
            this.container.add(e)
        },
        remove: function(e) {
            this.container.remove(e)
        },
        render: function() {
            this.contolled && this.controls.update(),
                this.renderer.render(this.container, this.camera)
        },
        updateOrthoZoom: function() {
            if (this.orthoZoom <= 0)
                return void (this.orthoZoom = 0);
            var e = this.width / this.orthoZoom
                , t = this.height / this.orthoZoom;
            this.camera.left = e / -2,
                this.camera.right = e / 2,
                this.camera.top = t / 2,
                this.camera.bottom = t / -2,
                this.camera.updateProjectionMatrix()
        },
        focusOn: function(e) {
            this.camera.lookAt(e.position)
        }
    },
    vg.Scene.prototype.constructor = vg.Scene,
    vg.SelectionManager = function(e) {
        this.mouse = e,
            this.onSelect = new vg.Signal,
            this.onDeselect = new vg.Signal,
            this.selected = null ,
            this.toggleSelection = !1,
            this.mouse.signal.add(this.onMouse, this)
    }
    ,
    vg.SelectionManager.prototype = {
        select: function(e, t) {
            e && (t = t || !0,
            this.selected !== e && this.clearSelection(t),
                e.selected ? this.toggleSelection && (t && this.onDeselect.dispatch(e),
                    e.deselect()) : e.select(),
                this.selected = e,
            t && this.onSelect.dispatch(e))
        },
        clearSelection: function(e) {
            e = e || !0,
            this.selected && (e && this.onDeselect.dispatch(this.selected),
                this.selected.deselect()),
                this.selected = null
        },
        onMouse: function(e, t) {
            switch (e) {
                case vg.MouseCaster.DOWN:
                    t || this.clearSelection();
                    break;
                case vg.MouseCaster.CLICK:
                    this.select(t)
            }
        }
    },
    vg.SelectionManager.prototype.constructor = vg.SelectionManager;