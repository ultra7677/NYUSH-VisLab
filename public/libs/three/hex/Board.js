/*
	Interface to the grid. Holds data about the visual representation of the cells (tiles).

	@author Corey Birnbaum https://github.com/vonWolfehaus/
 */
vg.Board = function(grid, finderConfig) {
	if (!grid) throw new Error('You must pass in a grid system for the board to use.');

	this.tiles = [];
	this.tileGroup = null; // only for tiles

	this.group = new THREE.Object3D(); // can hold all entities, also holds tileGroup, never trashed

	this.grid = null;
	this.overlay = null;
	this.finder = new vg.AStarFinder(finderConfig);
	// need to keep a resource cache around, so this Loader does that, use it instead of THREE.ImageUtils
	vg.Loader.init();

	this.setGrid(grid);
};

vg.Board.prototype = {
	setEntityOnTile: function(entity, tile) {
		// snap an entity's position to a tile; merely copies position
		var pos = this.grid.cellToPixel(tile.cell);
		entity.position.copy(pos);
		// adjust for any offset after the entity was set directly onto the tile
		entity.position.y += entity.heightOffset || 0;
		// remove entity from old tile
		if (entity.tile) {
			entity.tile.entity = null;
		}
		// set new situation
		entity.tile = tile;
		tile.entity = entity;
	},

	addTile: function(tile) {
		var i = this.tiles.indexOf(tile);
		if (i === -1) this.tiles.push(tile);
		else return;

		this.snapTileToGrid(tile);
		tile.position.y = 0;

		this.tileGroup.add(tile.mesh);
		this.grid.add(tile.cell);

		tile.cell.tile = tile;
	},

	removeTile: function(tile) {
		if (!tile) return; // was already removed somewhere
		var i = this.tiles.indexOf(tile);
		this.grid.remove(tile.cell);

		if (i !== -1) this.tiles.splice(i, 1);
		// this.tileGroup.remove(tile.mesh);

		tile.dispose();
	},

	removeAllTiles: function() {
		if (!this.tileGroup) return;
		var tiles = this.tileGroup.children;
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.remove(tiles[i]);
		}
	},

	getTileAtCell: function(cell) {
		var h = this.grid.cellToHash(cell);
		return cell.tile || (typeof this.grid.cells[h] !== 'undefined' ? this.grid.cells[h].tile : null);
	},

	snapToGrid: function(pos) {
		var cell = this.grid.pixelToCell(pos);
		pos.copy(this.grid.cellToPixel(cell));
	},

	snapTileToGrid: function(tile) {
		if (tile.cell) {
			tile.position.copy(this.grid.cellToPixel(tile.cell));
		}
		else {
			var cell = this.grid.pixelToCell(tile.position);
			tile.position.copy(this.grid.cellToPixel(cell));
		}
		return tile;
	},

	getRandomTile: function() {
		var i = vg.Tools.randomInt(0, this.tiles.length-1);
		return this.tiles[i];
	},

	findPath: function(startTile, endTile, heuristic) {
		return this.finder.findPath(startTile.cell, endTile.cell, heuristic, this.grid);
	},

	setGrid: function(newGrid) {
		this.group.remove(this.tileGroup);
		if (this.grid && newGrid !== this.grid) {
			this.removeAllTiles();
			this.tiles.forEach(function(t) {
				this.grid.remove(t.cell);
				t.dispose();
			});
			this.grid.dispose();
		}
		this.grid = newGrid;
		this.tiles = [];
		this.tileGroup = new THREE.Object3D();
		this.group.add(this.tileGroup);
		//console.log(newGrid);
	},

	generateOverlay: function(size) {
		var mat = new THREE.LineBasicMaterial({
			color: 0x000000,
			opacity: 0.3
		});

		if (this.overlay) {
			this.group.remove(this.overlay);
		}

		this.overlay = new THREE.Object3D();

		this.grid.generateOverlay(size, this.overlay, mat);

		this.group.add(this.overlay);
	},

	generateTilemap: function(config) {
		this.reset();

		var tiles = this.grid.generateTiles(config);
		this.tiles = tiles;

		this.tileGroup = new THREE.Object3D();
		for (var i = 0; i < tiles.length; i++) {
			this.tileGroup.add(tiles[i].mesh);
		}

		this.group.add(this.tileGroup);
	},

	reset: function() {
		// removes all tiles from the scene, but leaves the grid intact
		this.removeAllTiles();
		if (this.tileGroup) this.group.remove(this.tileGroup);
	}
};

vg.Board.prototype.constructor = vg.Board,

function() {
	var e = function() {
			this.obj = null ,
				this.next = null ,
				this.prev = null ,
				this.free = !0
		}
		, t = function() {
			this.first = null ,
				this.last = null ,
				this.length = 0,
				this.objToNodeMap = {},
				this.uniqueID = Date.now() + "" + Math.floor(1e3 * Math.random()),
				this.sortArray = []
		}
		;
	t.generateID = function() {
		return Math.random().toString(36).slice(2) + Date.now()
	}
		,
		t.prototype = {
			getNode: function(e) {
				return this.objToNodeMap[e.uniqueID]
			},
			addNode: function(i) {
				var s = new e;
				if (!i.uniqueID)
					try {
						i.uniqueID = t.generateID()
					} catch (n) {
						return console.error("[LinkedList.addNode] obj passed is immutable: cannot attach necessary identifier"),
							null
					}
				return s.obj = i,
					s.free = !1,
					this.objToNodeMap[i.uniqueID] = s,
					s
			},
			swapObjects: function(e, t) {
				this.objToNodeMap[e.obj.uniqueID] = null ,
					this.objToNodeMap[t.uniqueID] = e,
					e.obj = t
			},
			add: function(e) {
				var t = this.objToNodeMap[e.uniqueID];
				if (t) {
					if (t.free === !1)
						return;
					t.obj = e,
						t.free = !1,
						t.next = null ,
						t.prev = null
				} else
					t = this.addNode(e);
				if (this.first) {
					if (!this.last)
						throw new Error("[LinkedList.add] No last in the list -- that shouldn't happen here");
					this.last.next = t,
						t.prev = this.last,
						this.last = t,
						t.next = null
				} else
					this.first = t,
						this.last = t,
						t.next = null ,
						t.prev = null ;
				this.length++,
				this.showDebug && this.dump("after add")
			},
			has: function(e) {
				return !!this.objToNodeMap[e.uniqueID]
			},
			moveUp: function(e) {
				this.dump("before move up");
				var t = this.getNode(e);
				if (!t)
					throw "Oops, trying to move an object that isn't in the list";
				if (t.prev) {
					var i = t.prev
						, s = i.prev;
					t == this.last && (this.last = i);
					var n = t.next;
					s && (s.next = t),
						t.next = i,
						t.prev = i.prev,
						i.next = n,
						i.prev = t,
					this.first == i && (this.first = t)
				}
			},
			moveDown: function(e) {
				var t = this.getNode(e);
				if (!t)
					throw "Oops, trying to move an object that isn't in the list";
				if (t.next) {
					var i = t.next;
					this.moveUp(i.obj),
					this.last == i && (this.last = t)
				}
			},
			sort: function(e) {
				var t, i, s = this.sortArray, n = this.first;
				for (s.length = 0; n; )
					s.push(n.obj),
						n = n.next;
				for (this.clear(),
						 s.sort(e),
						 i = s.length,
						 t = 0; i > t; t++)
					this.add(s[t])
			},
			remove: function(e) {
				var t = this.getNode(e);
				return !t || t.free ? !1 : (t.prev && (t.prev.next = t.next),
				t.next && (t.next.prev = t.prev),
				t.prev || (this.first = t.next),
				t.next || (this.last = t.prev),
					t.free = !0,
					t.prev = null ,
					t.next = null ,
					this.length--,
					!0)
			},
			shift: function() {
				var e = this.first;
				return 0 === this.length ? null : (e.prev && (e.prev.next = e.next),
				e.next && (e.next.prev = e.prev),
					this.first = e.next,
				e.next || (this.last = null ),
					e.free = !0,
					e.prev = null ,
					e.next = null ,
					this.length--,
					e.obj)
			},
			pop: function() {
				var e = this.last;
				return 0 === this.length ? null : (e.prev && (e.prev.next = e.next),
				e.next && (e.next.prev = e.prev),
					this.last = e.prev,
				e.prev || (this.first = null ),
					e.free = !0,
					e.prev = null ,
					e.next = null ,
					this.length--,
					e.obj)
			},
			concat: function(e) {
				for (var t = e.first; t; )
					this.add(t.obj),
						t = t.next
			},
			clear: function() {
				for (var e = this.first; e; )
					e.free = !0,
						e = e.next;
				this.first = null ,
					this.length = 0
			},
			dispose: function() {
				for (var e = this.first; e; )
					e.obj = null ,
						e = e.next;
				this.first = null ,
					this.objToNodeMap = null
			},
			dump: function(e) {
				console.log("====================" + e + "=====================");
				for (var t = this.first; t; )
					console.log("{" + t.obj.toString() + "} previous=" + (t.prev ? t.prev.obj : "NULL")),
						t = t.next();
				console.log("==================================="),
					console.log("Last: {" + (this.last ? this.last.obj : "NULL") + "} First: {" + (this.first ? this.first.obj : "NULL") + "}")
			}
		},
		t.prototype.constructor = t,
		vg.LinkedList = t
}(),
	function() {
		var e = function(e, t, i, s, n) {
				this._listener = t,
					this.isOnce = i,
					this.context = s,
					this.signal = e,
					this._priority = n || 0
			}
			;
		e.prototype = {
			active: !0,
			params: null ,
			execute: function(e) {
				var t, i;
				return this.active && this._listener && (i = this.params ? this.params.concat(e) : e,
					t = this._listener.apply(this.context, i),
				this.isOnce && this.detach()),
					t
			},
			detach: function() {
				return this.isBound() ? this.signal.remove(this._listener, this.context) : null
			},
			isBound: function() {
				return !!this.signal && !!this._listener
			},
			_destroy: function() {
				delete this.signal,
					delete this._listener,
					delete this.context
			},
			toString: function() {
				return "[SignalBinding isOnce:" + this.isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]"
			}
		},
			e.prototype.constructor = e;
		var t = function() {
				this._bindings = [],
					this._prevParams = null ;
				var e = this;
				this.dispatch = function() {
					t.prototype.dispatch.apply(e, arguments)
				}
			}
			;
		t.prototype = {
			memorize: !1,
			_shouldPropagate: !0,
			active: !0,
			validateListener: function(e, t) {
				if ("function" != typeof e)
					throw new Error("Signal: listener is a required param of {fn}() and should be a Function.".replace("{fn}", t))
			},
			_registerListener: function(t, i, s, n) {
				var l, r = this._indexOfListener(t, s);
				if (-1 !== r) {
					if (l = this._bindings[r],
						l.isOnce !== i)
						throw new Error("You cannot add" + (i ? "" : "Once") + "() then add" + (i ? "Once" : "") + "() the same listener without removing the relationship first.")
				} else
					l = new e(this,t,i,s,n),
						this._addBinding(l);
				return this.memorize && this._prevParams && l.execute(this._prevParams),
					l
			},
			_addBinding: function(e) {
				var t = this._bindings.length;
				do
					t--;
				while (this._bindings[t] && e._priority <= this._bindings[t]._priority);this._bindings.splice(t + 1, 0, e)
			},
			_indexOfListener: function(e, t) {
				for (var i, s = this._bindings.length; s--; )
					if (i = this._bindings[s],
						i._listener === e && i.context === t)
						return s;
				return -1
			},
			has: function(e, t) {
				return -1 !== this._indexOfListener(e, t)
			},
			add: function(e, t, i) {
				return this.validateListener(e, "add"),
					this._registerListener(e, !1, t, i)
			},
			addOnce: function(e, t, i) {
				return this.validateListener(e, "addOnce"),
					this._registerListener(e, !0, t, i)
			},
			remove: function(e, t) {
				this.validateListener(e, "remove");
				var i = this._indexOfListener(e, t);
				return -1 !== i && (this._bindings[i]._destroy(),
					this._bindings.splice(i, 1)),
					e
			},
			removeAll: function(e) {
				"undefined" == typeof e && (e = null );
				for (var t = this._bindings.length; t--; )
					e ? this._bindings[t].context === e && (this._bindings[t]._destroy(),
						this._bindings.splice(t, 1)) : this._bindings[t]._destroy();
				e || (this._bindings.length = 0)
			},
			getNumListeners: function() {
				return this._bindings.length
			},
			halt: function() {
				this._shouldPropagate = !1
			},
			dispatch: function() {
				if (this.active) {
					var e, t = Array.prototype.slice.call(arguments), i = this._bindings.length;
					if (this.memorize && (this._prevParams = t),
							i) {
						e = this._bindings.slice(),
							this._shouldPropagate = !0;
						do
							i--;
						while (e[i] && this._shouldPropagate && e[i].execute(t) !== !1)
					}
				}
			},
			forget: function() {
				this._prevParams = null
			},
			dispose: function() {
				this.removeAll(),
					delete this._bindings,
					delete this._prevParams
			},
			toString: function() {
				return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]"
			}
		},
			t.prototype.constructor = t,
			vg.Signal = t
	}()
