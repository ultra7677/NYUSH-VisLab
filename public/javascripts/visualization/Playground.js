/**
 * Created by ultra on 8/1/16.
 */

var playground = (function(){

      ///////////////////////////////////////////////////
    // Public Variables

    var playground = {},
        size = [,];


    ///////////////////////////////////////////////////
    // Private Variables
    var container, stats;
    var camera, scene, renderer;
    var width,height;
    var raycaster;
    var particleMaterial;
    var mouse;
    var offsetX,offsetY;
    var cellShape,cellGeo,cellShapeGeo,cells,length;
    var objects = [];

    ///////////////////////////////////////////////////
    // Public Functions

    playground.size = function(_){
        if (!arguments.length) return size;
        size = _;
        return playground;
    }

    playground.init = function(canvasContainer){
        // init container
        width = size[0];
        height = size[1];
        container = document.createElement( 'div' );

        document.getElementById(canvasContainer).appendChild(container);
        var p = document.getElementById(canvasContainer);
        var style = p.currentStyle || window.getComputedStyle(p);
        offsetX = 15 - parseInt(style.marginLeft,10);
        offsetY = - 32;

        console.log(width);
        console.log(height);

        // init camera
        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
        camera.position.set( 0, 150, 0);
        camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });

        // init scene
        scene = new THREE.Scene();

        // hexagon
        var center_x = 0, center_z = 0;
        var center = {x:center_x,y:0,z: center_z};

        length = 5;

        // init geometry
        //var object = draw_hexagon(center,length);
        //scene.add(object);
        //objects.push(object);

        var i,verts = [];

        for( i = 0; i < 6; i++){
            verts.push(createVertex(length,i));
        }

        console.log(verts);

        cellShape = new THREE.Shape();
        cellShape.moveTo(verts[1].x,verts[1].y);

        for( i = 2; i< 6; i++){
            cellShape.lineTo(verts[i].x,verts[i].y);
        }

        cellShape.lineTo(verts[0].x,verts[0].y);

        cellShape.autoClose = true;

        cellGeo = new THREE.Geometry();
        cellGeo.vertices = verts;
        cellGeo.verticesNeedUpdate = true;

        cellShapeGeo = cellShape.makeGeometry();
      //  var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      //  var mesh = new THREE.Mesh(cellShapeGeo, material);
      //  scene.add(mesh);

        cells = {};
        var numCells = 0;

        // cells
        var x, y, z, c;
        for (x = -1; x <1+1; x++) {
            for (y = -1; y < 1+1; y++) {
                z = -x-y;
                if (Math.abs(x) <= 1 && Math.abs(y) <= 1 && Math.abs(z) <= 1) {
                    c = new vg.Cell(x, y, z);
                    var h = c.q+'.'+c.r+'.'+c.s;
                    if (cells[h]) {
                        // console.warn('A cell already exists there');
                        return;
                    }
                    cells[h] = c;
                    numCells++;
                }
            }
        }
        console.log(cells);
        // tiles
        var i,t,c;
        var tiles = [];

        for (i in cells){
            c = cells[i];
            t = generateTile(c,0.95,null);
            t.position.copy(cellToPixel(c));
            t.position.y = 0;
            tiles.push(t);
        }

        console.log(tiles);

        var group = new THREE.Object3D();
        var tileGroup = new THREE.Object3D();
        for (var i = 0; i < tiles.length; i++){
            tileGroup.add(tiles[i].mesh);
        }
        group.add(tileGroup);

        scene.add(group);


        /*
        var geometry = new THREE.Geometry();
        geometry.vertices = verts;
        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1} ) );
        scene.add(line);
        */

        // init others
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        var PI2 = Math.PI * 2;
        particleMaterial = new THREE.SpriteCanvasMaterial( {

            color: 0x000000,
            program: function ( context ) {

                context.beginPath();
                context.arc( 0, 0, 0.5, 0, PI2, true );
                context.fill();

            }

        } );
        // init render

        renderer = new THREE.CanvasRenderer();
        renderer.setClearColor( 0xf0f0f0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(width, height);
        container.appendChild( renderer.domElement );

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );

        //
        window.addEventListener( 'resize', onWindowResize, false );
        return playground;
    }

    playground.animate = function(){
        requestAnimationFrame( playground.animate );
        render();
    }

    ///////////////////////////////////////////////////
    // Private Functions

    function cellToPixel(cell){
        var vec3 = new THREE.Vector3();
        vec3.x = cell.q * (length * 2) * 0.75;
        vec3.y = cell.h;
        vec3.z = -((cell.s - cell.r) * ( (vg.SQRT3 * 0.5) * (length * 2)) * 0.5);
        return vec3;
    }

    function generateTile(cell,scale,material){
        var height = Math.abs(cell.h);
        if (height < 1) height = 1;

        var geo;
        var extrudeSettings = {
                    amount: 1,
                    bevelEnabled: true,
                    bevelSegments: 1,
                    steps: 1,
                    bevelSize: 0.5,
                    bevelThickness: 0.5
        };

        extrudeSettings.amount = height;
        geo = new THREE.ExtrudeGeometry(cellShape, extrudeSettings);

        var tile = new vg.Tile({
            size: length,
            scale: scale,
            cell: cell,
            geometry: geo,
            material: material
        });

        cell.tile = tile;

        return tile;

    }

    // create a flat, hexagon-shaped grid
    function generate(size){
        var x,y,z,c;

        for(x = -size; x < size + 1; x++){
            for (y = -size; y < size + 1; y ++){
                z = -x-y;
                if (Math.abs(x) <= this.size && Math.abs(y) <= this.size && Math.abs(z) <= this.size) {
                    c = new vg.Cell(x, y, z);
                    this.add(c);
                }
            }
        }
    }

    // create the six vertices of a single hexagon
    function createVertex(size,i){
        var angle = (vg.TAU / 6) * i;
        return new THREE.Vector3((size * Math.cos(angle)), (size * Math.sin(angle)), 0);
    }

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
            //console.log(point);
            var vertice = new THREE.Vector3(point.x,0,point.z);
            vertices.push(vertice);
        }
        geometry.vertices = vertices;
        //geometry.faces.push(new THREE.Face3(0,1,2));
        // var object = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1} ) );
        return line;
    }


    function onWindowResize() {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );

    }

    function onDocumentTouchStart( event ) {

        event.preventDefault();
        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        console.log(event);
        onDocumentMouseDown( event );

    }

    function onDocumentMouseDown( event ) {
        //console.log(event);
        event.preventDefault();
        mouse.x = ( (event.clientX + offsetX) /  renderer.domElement.clientWidth  ) * 2 - 1;
        mouse.y = - ( (event.clientY + offsetY) /  renderer.domElement.clientHeight  ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {
            console.log(intersects[0]);

            intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

            var particle = new THREE.Sprite( particleMaterial );
            particle.position.copy( intersects[ 0 ].point );
            particle.scale.x = particle.scale.y = 16;
            scene.add( particle );
        }
    }

    var radius = 600;
    var theta = 0;
    function render() {

        theta += 0.1;
        camera.lookAt( scene.position );
        renderer.render( scene, camera );

    }

    return playground;
})();