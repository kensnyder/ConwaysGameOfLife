(function(exports) {
	"use strict";

	exports.Game = function(rule) {
		this.setRuleString(rule || 'B3/S23');
		this.grid = {};
		this.numPoints = 0;
		this.generation = 0;
	}

	exports.Game.prototype = {
		addPoint: function addPoint(x,y) {
			this.grid[x+','+y] = true;
			this.numPoints++;
			return this;
		},
		isAlive: function isAlive(x,y) {
			return !!this.grid[x+','+y];
		},
		removePoint: function removePoint(x,y) {
			this.numPoints--;
			delete this.grid[x+','+y];
		},
		tick: function tick() {
			var newGrid = {};
			var neighborCache = {};
			this.generation++;
			this.numPoints = 0;
			var xy, x, y, neighbors, n, nxy, nx, ny, cnt, isAlive;
			var survive = this.rule.survive;
			var birth = this.rule.birth;
			for (var point in this.grid) {
				xy = point.split(',');
				x = +xy[0];
				y = +xy[1];
				neighbors = this._getNeighbors(x,y);
				for (n = 0; n < 8; n++) {
					nx = neighbors[n][0];
					ny = neighbors[n][1];
					nxy = nx+','+ny;
					cnt = (typeof neighborCache[nxy] == 'number') ?
						neighborCache[nxy] :
						neighborCache[nxy] = this._neighborShortcount(nx, ny);
					isAlive = this.grid[nxy];
					if (
						(isAlive && survive[cnt])
						|| (!isAlive && birth[cnt])
					) {
						newGrid[nxy] = true;
						this.numPoints++;
					}					
				}
			}
			this.grid = newGrid;
			return this;
		},
		setRuleString: function(rulestring) {
			var birth, survive;
			this.rule = {};
			var match = (/^B(\d+)\/S(\d+)$/).exec(rulestring);
			if (match) {
				birth = match[1];
				survive = match[2];
			}
			else {
				match = rulestring.split('/');
				birth = match[1];
				survive = match[0];
			}
			this.rule.text = rulestring;
			this.rule.max = -1;
			this.rule.birth = {};
			this.rule.survive = {};
			birth.split('').forEach(function(digit) {
				if (digit > this.rule.max) {
					this.rule.max = parseInt(digit,10);
				}
				this.rule.birth[digit] = true;
			}.bind(this));
			survive.split('').forEach(function(digit) {
				if (digit > this.rule.max) {
					this.rule.max = parseInt(digit,10);
				}
				this.rule.survive[digit] = true;
			}.bind(this));
		},
		getPoints: function getPoints() {
			var points = [], xy;
			for (var point in this.grid) {
				xy = point.split(',');
				points.push([+xy[0], +xy[1]]);
			}
			return points;
		},
		serialize: function serialize() {
			return JSON.stringify(this.grid);
		},
		_getNeighbors: function _getNeighbors(coordX, coordY) {
			var x, y;
			var neighbors = [];
			for (x = coordX-1; x <= coordX+1; x++) {
				for (y = coordY-1; y <= coordY+1; y++) {
					if (x == coordX && y == coordY) {
						continue;
					}
					neighbors.push([x,y]);
				}
			}
			return neighbors;
		},
		_neighborShortcount: function _neighborShortcount(coordX, coordY) {
			var x, y;
			var neighbors = 0;
			for (x = coordX-1; x <= coordX+1; x++) {
				for (y = coordY-1; y <= coordY+1; y++) {
					if (x == coordX && y == coordY) {
						continue;
					}
					neighbors += this.grid[x+','+y] ? 1 : 0;
					if (neighbors > this.rule.max) {
						break;
					}
				}
			}
			return neighbors;
		}
	};
}(typeof exports === 'undefined' ? this : exports));