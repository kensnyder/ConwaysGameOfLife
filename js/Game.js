"use strict";

function Game() {
	this.grid = {};
	this.min = [0,0];
	this.max = [0,0];
	this.numPoints = 0;
}

Game.prototype = {
	addPoint: function addPoint(x,y) {
		     if (x < this.min[0]) this.min[0] = x;
		else if (x > this.max[0]) this.max[0] = x;
		else if (y < this.min[1]) this.min[1] = y;
		else if (y > this.max[1]) this.max[1] = y;
		this.grid[x+','+y] = 1;
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
		this.numPoints = 0;
		this.min = [0,0];
		this.max = [0,0];		
		this.getPoints().forEach(function _processPoint(xy) {			
			this._getNeighbors(xy[0],xy[1]).forEach(function _buildGrid(xy) {
				var x = xy[0], y = xy[1];
				var cnt = (typeof neighborCache[x+','+y] == 'number') ?
					neighborCache[x+','+y] :
					neighborCache[x+','+y] = this._neighborShortcount(x, y);
				if (
					(this.grid[x+','+y] && cnt >= 2 && cnt <= 3)
					|| (!this.grid[x+','+y] && cnt == 3)
				) {
					     if (x < this.min[0]) this.min[0] = x;
					else if (x > this.max[0]) this.max[0] = x;
					else if (y < this.min[1]) this.min[1] = y;
					else if (y > this.max[1]) this.max[1] = y;						
					newGrid[x+','+y] = 1;
					this.numPoints++;
				}
			}.bind(this));
		}.bind(this));
		this.grid = newGrid;
		return this;
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
				neighbors += this.grid[x+','+y] || 0;
				if (neighbors > 3) {
					return 4;
				}
			}
		}
		return neighbors;
	}
};



