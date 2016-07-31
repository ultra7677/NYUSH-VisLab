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

        // hexagon
        var center_x = 350, center_z = 350;
        var center = {x:center_x,y:0,z: center_z = 300};
        var length = 50;

        for (var i = 0; i < 10; i++){
            // draw hexagons of even columns
            if (i % 2 == 0){
                for (var j = 0; j < 7; j++) {
                    center.x = center_x - i * 1.5 * length;
                    center.z = center_z - j * (Math.sqrt(3) * length);
                    var line = draw_hexagon(center, length);
                    scene.add(line);
                }
            }
            // draw hexagons of odd columns
            else{
                for (var j = 0; j < 7; j++) {
                    center.x = center_x - i * 1.5 * length;
                    center.z = center_z - Math.sqrt(3) * (j + 0.5) * length;
                    var line = draw_hexagon(center, length);
                    scene.add(line);
                }
            }
        }


        // mouse
        var vector = new THREE.Vector3();

        vector.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );

        vector.unproject( camera );

        var dir = vector.sub( camera.position ).normalize();

        var distance = - camera.position.y / dir.y;

        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

        console.log(pos);

        $("canvas").mousemove(function(e) {
            console.log(e.pageX);
            console.log(e.pageY);
        });

        return hexagon;
    }

    hexagon.render = function(){
        renderer.clear();
        renderer.render(scene, camera);
    }

    ///////////////////////////////////////////////////
    // Private Functions

    function hex_corner(center,size,i){
        var angle_deg = 60 * i;
        var angle_rad = Math.PI / 180 * angle_deg;
        var point = {};
        point.x = center.x + size * Math.cos(angle_rad);
        point.z = center.z + size * Math.sin(angle_rad)
        return point;
    }

    function draw_hexagon(center,size){
        var geometry = new THREE.Geometry();
        var vertices = [];
        for(var i = 0; i<= 6; i++){
            var point = hex_corner(center,size,i);
            console.log(point);
            var vertice = new THREE.Vector3(point.x,0,point.z);
            vertices.push(vertice);
        }
        geometry.vertices = vertices;
        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1} ) );
        return line;
    }

    return hexagon;
})();