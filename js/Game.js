"use strict";

function Game() {
	this.grid = {};
}

Game.prototype = {
	addPoint: function addPoint(x,y) {
		this.grid[x+','+y] = 1;
		return this;
	},
	isAlive: function isAlive(x,y) {
		return this.grid[x+','+y] || false;
	},
	removePoint: function removePoint(x,y) {
		delete this.grid[x+','+y];
	},
	tick: function tick() {
		var newGrid = {};		
		this.getPoints().forEach(function _processPoint(xy) {			
			this._getNeighbors(xy[0],xy[1]).forEach(function _buildGrid(xy) {
				var x = xy[0], y = xy[1];
				var cnt = this._neighborShortcount(x, y);
				if (
					(this.grid[x+','+y] && cnt >= 2 && cnt <= 3)
					|| (!this.grid[x+','+y] && cnt == 3)
				) {
					newGrid[x+','+y] = 1;
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



