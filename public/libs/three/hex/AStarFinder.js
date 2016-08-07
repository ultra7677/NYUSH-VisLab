/**
 * Created by ultra on 8/3/16.
 */
vg.AStarFinder = function(e) {
    e = e || {};
    var t = {
        allowDiagonal: !1,
        heuristicFilter: null
    };
    t = vg.Tools.merge(t, e),
        this.allowDiagonal = t.allowDiagonal,
        this.heuristicFilter = t.heuristicFilter,
        this.list = new vg.LinkedList
}
    ,
    vg.AStarFinder.prototype = {
        findPath: function(e, t, i, s) {
            var n, l, r, h, o, a;
            for (i = i || this.heuristicFilter,
                     s.clearPath(),
                     this.list.clear(),
                     this.list.add(e); this.list.length > 0; ) {
                if (this.list.sort(this.compare),
                        n = this.list.shift(),
                        n._visited = !0,
                    n === t)
                    return vg.PathUtil.backtrace(t);
                for (r = s.getNeighbors(n, this.allowDiagonal, i),
                         o = 0,
                         a = r.length; a > o; o++)
                    if (h = r[o],
                        h.walkable && (l = n._calcCost + s.distance(n, h),
                        !h._visited || l < h._calcCost)) {
                        if (h._visited = !0,
                                h._parent = n,
                                h._calcCost = l,
                                h._priority = l + s.distance(t, h),
                            h === t)
                            return vg.PathUtil.backtrace(t);
                        this.list.add(h)
                    }
            }
            return null
        },
        compare: function(e, t) {
            return e._priority - t._priority
        }
    },
    vg.AStarFinder.prototype.constructor = vg.AStarFinder;