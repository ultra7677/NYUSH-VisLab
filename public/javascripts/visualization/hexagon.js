/**
 * Created by ultra on 7/19/16.
 */
var hexagon = (function(){

    ///////////////////////////////////////////////////
    // Public Variables

    var hexagon = {},
        size = [,];

    ///////////////////////////////////////////////////
    // Private Variables

    var camera,scene,renderer,light,cube;

    ///////////////////////////////////////////////////
    // Public Functions

    hexagon.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return hexagon;
    };

    hexagon.init = function(canvasContainer) {

        //console.log(canvasContainer);

        // init three
        width = size[0];
        height = size[1];

       // console.log(width);
       // console.log(height);

        renderer = new THREE.WebGLRenderer({
            antialias : true
        });

        renderer.setSize(width, height);
        document.getElementById(canvasContainer).appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);

        // init camera
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });

        // init scene
        scene = new THREE.Scene();

        // init light
        light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);

        // init object
        var geometry = new THREE.Geometry();
        geometry.vertices.push( new THREE.Vector3( - 500, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 500, 0, 0 ) );

        for ( var i = 0; i <= 20; i ++ ) {

            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.z = ( i * 50 ) - 500;
            scene.add( line );

            var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
            line.position.x = ( i * 50 ) - 500;
            line.rotation.y = 90 * Math.PI / 180;
            scene.add( line );

        }
        return hexagon;
    }

    hexagon.render = function(){
        renderer.clear();
        renderer.render(scene, camera);
    }

    ///////////////////////////////////////////////////
    // Private Functions

    return hexagon;
})();