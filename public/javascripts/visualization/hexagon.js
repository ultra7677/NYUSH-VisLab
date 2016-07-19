/**
 * Created by ultra on 7/19/16.
 */
hexagon = function(){
    var hexagon = {},
        size = [960, 800];

    hexagon.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return hexagon;
    };

    hexagon.init = function() {
        console.log('this is my log');

        return hexagon;
    }

    return hexagon;
}();