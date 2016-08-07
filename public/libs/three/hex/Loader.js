/**
 * Created by ultra on 8/3/16.
 */
vg.Loader = {
    manager: null ,
    imageLoader: null ,
    crossOrigin: !1,
    init: function(e) {
        this.crossOrigin = e || !1,
            this.manager = new THREE.LoadingManager(function() {}
                ,function() {}
                ,function() {
                    console.warn("Error loading images")
                }
            ),
            this.imageLoader = new THREE.ImageLoader(this.manager),
            this.imageLoader.crossOrigin = e
    },
    loadTexture: function(e, t, i, s) {
        var n = new THREE.Texture(null ,t);
        return this.imageLoader.load(e, function(e) {
            n.image = e,
                n.needsUpdate = !0,
            i && i(n)
        }, null , function(e) {
            s && s(e)
        }),
            n.sourceFile = e,
            n
    }
};