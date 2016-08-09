/**
 * Created by ultra on 8/2/16.
 */
var simpleHex = (function(){
    ///////////////////////////////////////////////////
    // Public Variables

    var simpleHex = {},
        size = [,],
        binList_data = {};

    ///////////////////////////////////////////////////
    // Private Variables
    var width,height,offsetX,offsetY;
    var scene,grid;
    var mouse,board;
    ///////////////////////////////////////////////////
    // Public Functions

    simpleHex.size = function(_){
        if (!arguments.length) return size;
        size = _;
        return simpleHex;
    }

    simpleHex.binList_data = function(_){
        if (!arguments.length) return binList_data;
        binList_data = _;
        return simpleHex;
    }

    simpleHex.init = function(canvasContainer){
        width = size[0];
        height = size[1];

        var p = document.getElementById(canvasContainer);
        var style = p.currentStyle || window.getComputedStyle(p);
        offsetX = - parseInt(style.marginLeft,10);
       // offsetY = - 32;
        offsetY = - 32;
       // offsetX = 0;

       // console.log(document.getElementById(canvasContainer));
        scene = new vg.Scene({
            width : width,
            height : height,
            element: document.getElementById(canvasContainer),
            cameraPosition: {x:0, y:200, z:150}
        }, true);

        // this constructs the cells in grid coordinate space
        grid = new vg.HexGrid({
            cellSize: 15 // size of individual cells
        });

        grid.generate({
            size: 5 // size of the board
        });

        scene.container.offsetX = offsetX;
        scene.container.offsetY = offsetY;
        scene.container.width = width;
        scene.container.height = height;

        mouse = new vg.MouseCaster(scene.container, scene.camera);
        board = new vg.Board(grid);


        // insert data into tiles
        var binList = binList_data["bin_list"];

        // this will generate extruded hexagonal tiles
        board.generateTilemap({
            tileScale: 0.98, // you might have to scale the tile so the extruded geometry fits the cell size perfectly
            binList: binList
        });

        drawTiles(board.tiles,binList);

        //console.log(board.tiles);

        scene.add(board.group);
        scene.focusOn(board.group);


       // var vec = new THREE.Vector3();
        mouse.signal.add(function(evt, tile) {
           // console.log(evt,tile);
            if (evt === vg.MouseCaster.CLICK) {
                // tile.toggle();
                // or we can use the mouse's raw coordinates to access the cell directly, just for fun:
               // console.log(mouse.position);
                var cell = board.grid.pixelToCell(mouse.position);
                console.log(cell);
                var t = board.getTileAtCell(cell);
                if (t) t.toggle();
            }
        }, this);

       // console.log(mouse);

        update();

        function update() {
            mouse.update();
            scene.render();
            requestAnimationFrame(update);
        }

        return simpleHex;
    }

    ///////////////////////////////////////////////////
    // Private Functions

    function drawTiles(tiles,data){
        var tile = tiles[(tiles.length -1) / 2];
        var orderedTiles = [];
        var colors = [];

        tile.material.color.setHex('0x191940');
        var cells = grid.cells;

        // get the distance
        for (var i = 0; i < tiles.length; i++) {
            tiles[i].cell.userData.distanceToCenter = grid.distance(tiles[i].cell,tile.cell);
        }

        // allocate colors to grid
        colors[1] = '0xB8860B';
        colors[2] = '0xDAA520';
        colors[3] = '0xBDB76B';
        colors[4] = '0xD2B48C';
        colors[0] = '0xD2691E';

        for (var i = 0; i<=5 ; i++){
            for (var j = 0; j< tiles.length; j++){
                if ( tiles[j].cell.userData.distanceToCenter == i){
                    orderedTiles.push(tiles[j]);
                }
            }
        }


        // sort by anomaly probability

        for (var i = 0; i < data.length - 1; i++)
            for (var j = i + 1; j < data.length; j ++){
                if (data[i].p_risk < data[j].p_risk){
                    var s = data[i];
                    data[i] = data[j];
                    data[j] = s;
                }
            }

        // console.log(data);

        for (var i = 0; i < data.length; i ++){
            var single_tile = orderedTiles[i];
            var index = single_tile.cell.userData.distanceToCenter
            single_tile.material.color.setHex(colors[index]);
            single_tile.userData.info = data[i];
        }
        //console.log(grid.distance(cells[0]))
        //console.log(board.grid.getNeighbors(tile.cell,false,null));

    }

    return simpleHex;
})();