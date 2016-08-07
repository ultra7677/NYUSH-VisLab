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
            cameraPosition: {x:0, y:150, z:150}
        }, true);

        // this constructs the cells in grid coordinate space
        grid = new vg.HexGrid({
            cellSize: 15 // size of individual cells
        });

        grid.generate({
            size: 2 // size of the board
        });

        scene.container.offsetX = offsetX;
        scene.container.offsetY = offsetY;
        scene.container.width = width;
        scene.container.height = height;

        mouse = new vg.MouseCaster(scene.container, scene.camera);
        board = new vg.Board(grid);


        // insert data into tile
        var binList = binList_data["bin_list"];

        // this will generate extruded hexagonal tiles
        board.generateTilemap({
            tileScale: 0.98, // you might have to scale the tile so the extruded geometry fits the cell size perfectly
            binList: binList
        });

/*
        for (var i = 0; i < binList.length; i ++ ) {
            board.tiles[i].userData = binList[i];
            board.tiles[i].modifyColor();
        }
  */
        //console.log(binList_data);
        console.log(board.tiles);

        scene.add(board.group);
        scene.focusOn(board.group);

        var vec = new THREE.Vector3();

        mouse.signal.add(function(evt, tile) {
            if (evt === vg.MouseCaster.CLICK) {
                // tile.toggle();
                // or we can use the mouse's raw coordinates to access the cell directly, just for fun:
                var cell = board.grid.pixelToCell(mouse.position);
                var t = board.getTileAtCell(cell);
                if (t) t.toggle();
            }
        }, this);

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

    return simpleHex;
})();