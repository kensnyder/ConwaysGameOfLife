(function(exports) {
	"use strict";

	exports.Game = function(rule) {
		this.setRuleString(rule || 'B3/S23');
		this.reset();
	}

	exports.Game.prototype = {
		reset: function reset() {
			this.grid = {};
			this.numPoints = 0;
			this.generation = 0;
			return this;
		},
		addPoint: function addPoint(x,y) {
			if (this.grid[x+','+y] === undefined) {				
				this.grid[x+','+y] = true;
				this.numPoints++;
			}
			return this;
		},
		removePoint: function removePoint(x,y) {
			delete this.grid[x+','+y];
			this.numPoints--;
			return this;
		},
		isAlive: function isAlive(x,y) {
			return !!this.grid[x+','+y];
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
				// get xy
				xy = point.split(',');
				x = +xy[0];
				y = +xy[1];
				// check self
				cnt = (neighborCache[point] !== undefined) ?
					neighborCache[point] :
					neighborCache[point] = this._neighborShortcount(x, y);					
				isAlive = this.grid[point] !== undefined;
				if (
					(isAlive && survive[cnt] !== undefined)
					|| (!isAlive && birth[cnt] !== undefined)
				) {
					newGrid[point] = true;
					this.numPoints++;
				}					
				// check neighbors
				neighbors = [
					[x-1,y-1],[x  ,y-1],[x+1,y-1],
					[x,  y  ],          [x+1,y  ],
					[x-1,y+1],[x  ,y+1],[x+1,y+1],
				];
				for (n = 0; n < 8; n++) {
					nx = neighbors[n][0];
					ny = neighbors[n][1];
					nxy = nx+','+ny;
					if (newGrid[nxy] !== undefined) {
						continue;
					}
					// see http://jsperf.com/typeof-vs-in for why we use `!== undefined`
					cnt = (neighborCache[nxy] !== undefined) ?
						neighborCache[nxy] :
						neighborCache[nxy] = this._neighborShortcount(nx, ny);					
					isAlive = this.grid[nxy] !== undefined;
					if (
						(isAlive && survive[cnt] !== undefined)
						|| (!isAlive && birth[cnt] !== undefined)
					) {
						newGrid[nxy] = true;
						this.numPoints++;
					}					
				}
			}
			this.grid = newGrid;
			return this.generation;
		},
		setRuleString: function(rulestring) {
			var birth, survive;
			this.rule = {};
			var match = (/^B(\d+)\/S(\d+)$/i).exec(rulestring);
			if (match) {
				birth = match[1];
				survive = match[2];
			}
			else {
				match = rulestring.split('/');
				birth = match[1];
				survive = match[0];
			}
			this.rule.numeric = survive + '/' + birth;
			this.rule.bs = 'B' + birth + '/S' + survive;
			this.rule.max = -1;
			this.rule.birth = {};
			this.rule.survive = {};
			birth.split('').forEach(function(digit) {
				if (digit > this.rule.max) {
					this.rule.max = +digit;
				}
				this.rule.birth[digit] = true;
			}.bind(this));
			survive.split('').forEach(function(digit) {
				if (digit > this.rule.max) {
					this.rule.max = +digit;
				}
				this.rule.survive[digit] = true;
			}.bind(this));
			return this;
		},
		// TODO: move out
		getPoints: function getPoints() {
			var points = [], xy;
			for (var point in this.grid) {
				xy = point.split(',');
				points.push([+xy[0], +xy[1]]);
			}
			return points;
		},
		// TODO: move out
		serialize: function serialize() {
			return JSON.stringify(this.grid);
		},
		_neighborShortcount: function _neighborShortcount(x, y) {
			var neighbors = 0;
			if (this.grid[(x-1)+','+(y-1)] !== undefined) neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x)+','+(y-1)] !== undefined)   neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x+1)+','+(y-1)] !== undefined) neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x-1)+','+(y)] !== undefined)   neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x+1)+','+(y)] !== undefined)   neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x-1)+','+(y+1)] !== undefined) neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x)+','+(y+1)] !== undefined)   neighbors++;
			if (neighbors > this.rule.max) return neighbors;
			
			if (this.grid[(x+1)+','+(y+1)] !== undefined) neighbors++;
			return neighbors;
		}
	};
}(typeof exports === 'undefined' ? this : exports));