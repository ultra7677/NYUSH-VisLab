/**
 * Created by ultra on 8/3/16.
 */
vg.Tools = {
    clamp: function(e, t, i) {
        return Math.max(t, Math.min(i, e))
    },
    sign: function(e) {
        return e && e / Math.abs(e)
    },
    random: function(e, t) {
        return 1 === arguments.length ? Math.random() * e - .5 * e : Math.random() * (t - e) + e
    },
    randomInt: function(e, t) {
        return 1 === arguments.length ? Math.random() * e - .5 * e | 0 : Math.random() * (t - e + 1) + e | 0
    },
    normalize: function(e, t, i) {
        return (e - t) / (i - t)
    },
    getShortRotation: function(e) {
        return e %= this.TAU,
            e > this.PI ? e -= this.TAU : e < -this.PI && (e += this.TAU),
            e
    },
    generateID: function() {
        return Math.random().toString(36).slice(2) + Date.now()
    },
    isPlainObject: function(e) {
        if ("object" != typeof e || e.nodeType || e === e.window)
            return !1;
        try {
            if (e.constructor && !Object.prototype.hasOwnProperty.call(e.constructor.prototype, "isPrototypeOf"))
                return !1
        } catch (t) {
            return !1
        }
        return !0
    },
    merge: function(e, t) {
        var i = this
            , s = Array.isArray(t)
            , n = s && [] || {};
        return s ? (e = e || [],
            n = n.concat(e),
            t.forEach(function(t, s) {
                "undefined" == typeof n[s] ? n[s] = t : i.isPlainObject(t) ? n[s] = i.merge(e[s], t) : -1 === e.indexOf(t) && n.push(t)
            }),
            n) : (e && i.isPlainObject(e) && Object.keys(e).forEach(function(t) {
            n[t] = e[t]
        }),
            Object.keys(t).forEach(function(s) {
                t[s] && i.isPlainObject(t[s]) && e[s] ? n[s] = i.merge(e[s], t[s]) : n[s] = t[s]
            }),
            n)
    },
    now: function() {
        return window.nwf ? window.nwf.system.Performance.elapsedTime : window.performance.now()
    },
    empty: function(e) {
        for (; e.lastChild; )
            e.removeChild(e.lastChild)
    },
    radixSort: function(e, t, i, s) {
        if (t = t || 0,
                i = i || e.length,
                s = s || 31,
                !(t >= i - 1 || 0 > s)) {
            for (var n = t, l = i, r = 1 << s; l > n; )
                if (e[n] & r) {
                    --l;
                    var h = e[n];
                    e[n] = e[l],
                        e[l] = h
                } else
                    ++n;
            this.radixSort(e, t, l, s - 1),
                this.radixSort(e, l, i, s - 1)
        }
    },
    randomizeRGB: function(e, t) {
        var i, s, n = e.split(","), l = "rgb(";
        for (t = this.randomInt(t),
                 i = 0; 3 > i; i++)
            s = parseInt(n[i]) + t,
                0 > s ? s = 0 : s > 255 && (s = 255),
                l += s + ",";
        return l = l.substring(0, l.length - 1),
            l += ")"
    },
    getJSON: function(e) {
        var t = new XMLHttpRequest
            , i = "undefined" == typeof e.cache ? !1 : e.cache
            , s = i ? e.url : e.url + "?t=" + Math.floor(1e4 * Math.random()) + Date.now();
        t.onreadystatechange = function() {
            if (200 === this.status) {
                var t = null ;
                try {
                    t = JSON.parse(this.responseText)
                } catch (i) {
                    return
                }
                return void e.callback.call(e.scope || null , t)
            }
            0 !== this.status && console.warn("[Tools.getJSON] Error: " + this.status + " (" + this.statusText + ") :: " + e.url)
        }
            ,
            t.open("GET", s, !0),
            t.setRequestHeader("Accept", "application/json"),
            t.setRequestHeader("Content-Type", "application/json"),
            t.send("")
    }
}