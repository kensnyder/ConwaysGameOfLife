(function(exports) {
	"use strict";

	/**
	 * An engine to run Conway's game of life
	 * @class Game
	 * @constructor
	 * @params {String} rule  The game rule in the form "B3/S23" or "23/2"
	 */
	exports.Game = function(rule) {
		this.setRuleString(rule || 'B3/S23');
		this.clear();
	}

	/**
	 * The grid of points in the form {"a,b":true,"x,y":true}
	 * @property {Object} grid
	 */
	/**
	 * The number of points on the grid
	 * @property {Number} numPoints
	 */
	/**
	 * The generation number since starting the game
	 * @property {Number}  generation;
	 */
	/**
	 * Information about the rule
	 * @property {Object} rule
	 * @property {String} rule.numeric  Rule in the form "23/2"
	 * @property {String} rule.bs  Rule in the form "B3/S23"
	 * @property {Object} rule.birth  A lookup with the number of neighbors that cause birth. e.g. {3:true}
	 * @property {Object} rule.survive  A lookup with the number of neighbors that cause survival. e.g. {2:true,3:true}
	 * @property {Object} rule.max  The max numer of neighbors that must be counted. e.g. for "B3/S23" max is 3
	 */
	exports.Game.prototype = {
		/**
		 * Initialize an empty grid
		 * @method clear
		 * @returns {Game}
		 * @chainable
		 */
		clear: function clear() {
			this.grid = {};
			this.numPoints = 0;
			this.generation = 0;
			return this;
		},
		/**
		 * Initialize the grid to the given grid obect
		 * @method setGrid
		 * @params {Object} grid  A grid in the same form as is stored internally
		 * @returns {Game}
		 * @chainable
		 */
		setGrid: function setGrid(grid) {
			this.grid = grid;
			this.numPoints = Object.keys(grid).length;
			this.generation = 0;
			return this;
		},
		/**
		 * Add a single point to the grid
		 * @method addPoint
		 * @params {Number} x  The X coordinate
		 * @params {Number} y  The Y coordiante
		 * @returns {Game}
		 * @chainable
		 */
		addPoint: function addPoint(x,y) {
			// see http://jsperf.com/typeof-vs-in for why we use `!== undefined`
			if (this.grid[x+','+y] === undefined) {				
				this.grid[x+','+y] = true;
				this.numPoints++;
			}
			return this;
		},
		/**
		 * Add an array of points to the grid
		 * @method addPoints
		 * @params {Array} points  Coordinates in the form [[0,0],[1,1],[2,2]]
		 * @returns {Game}
		 * @chainable
		 */
		addPoints: function addPoints(points) {
			points.forEach(function(point) {
				this.addPoint(point[0], point[1]);
			}.bind(this));
			return this;
		},
		/**
		 * Manually remove a point from the grid
		 * @method removePoint
		 * @params {Number} x  The X coordinate
		 * @params {Number} y  The Y coordiante
		 * @returns {Game}
		 * @chainable
		 */
		removePoint: function removePoint(x,y) {
			if (this.grid[x+','+y] === undefined) {
				return this;
			}
			delete this.grid[x+','+y];
			this.numPoints--;
			return this;
		},
		/**
		 * Tell if a particular point on the grid is alive
		 * @method isAlive
		 * @params {Number} x  The X coordinate
		 * @params {Number} y  The Y coordiante
		 * @returns {Boolean}  True if the point is alive
		 */
		isAlive: function isAlive(x,y) {
			// see http://jsperf.com/typeof-vs-in for why we use `!== undefined`
			return this.grid[x+','+y] !== undefined;
		},
		/**
		 * Run the game for one generation
		 * @method tick
		 * @return {Number}  The current generation number
		 */
		tick: function tick() {
			var newGrid = {};
			var neighborCache = {};
			this.generation++;
			this.numPoints = 0;
			var xy, x, y, neighbors, n, nxy, nx, ny, cnt, isAlive;
			var survive = this.rule.survive;
			var birth = this.rule.birth;
			for (var point in this.grid) {
				if (point === undefined) {
					continue;
				}
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
		/**
		 * Set the game's rule
		 * @params {String} rulestring  The game rule in the form "B3/S23" or "23/2"
		 * @returns {Game}
		 * @chainable
		 */
		setRuleString: function setRuleString(rulestring) {
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
		/**
		 * Convert the grid into an array of points
		 * @method getPoints
		 * @return {Array}  Coordinates in the form [[0,0],[1,1],[2,2]]
		 */
		getPoints: function getPoints() {
			var points = [], xy;
			for (var point in this.grid) {
				xy = point.split(',');
				points.push([+xy[0], +xy[1]]);
			}
			return points;
		},
		/**
		 * Convert the grid into a JSON string
		 * @method serialize
		 * @return {String}
		 */
		serialize: function serialize() {
			return JSON.stringify(this.grid);
		},
		/**
		 * Set the grid from a JSON string
		 * @method unserialize
		 * @return {Game}
		 * @chainable
		 */
		unserialize: function unserialize(gridString) {
			this.setGrid(JSON.parse(gridString));
			return this;
		},
		/**
		 * Count the number of neighbors of a given point.
		 * Return early if the count is equal to this.rule.max
		 * @return {Number} The number of neighbors
		 */
		_neighborShortcount: function _neighborShortcount(x, y) {
			var neighbors = 0;
			// see http://jsperf.com/typeof-vs-in for why we use `!== undefined`
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