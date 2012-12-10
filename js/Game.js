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
		return !!this.grid[x+','+y];
	},
	removePoint: function removePoint(x,y) {
		delete this.grid[x+','+y];
	},
	tick: function tick() {
		var newGrid = {};		
		for (var point in this.grid) {
			this._getNeighbors(point).forEach(function _buildGrid(point) {
				var cnt = this._neighborShortcount(point);
				if (
					(this.grid[point] && cnt >= 2 && cnt <= 3)
					|| (!this.grid[point] && cnt == 3)
				) {
					newGrid[point] = 1;
				}
			}.bind(this));
		}
		this.grid = newGrid;
		return this;
	},
	getPoints: function getPoints() {
		var points = [];
		for (var point in this.grid) {
			points.push(point.split(','));
		}
		return points;
	},
	serialize: function serialize() {
		return JSON.stringify(this.grid);
	},
	_getNeighbors: function _getNeighbors(point) {
		var coords = point.split(',');
		coords[0] = parseInt(coords[0], 10);
		coords[1] = parseInt(coords[1], 10);
		var x, y;
		var neighbors = [];
		for (x = coords[0]-1; x <= coords[0]+1; x++) {
			for (y = coords[1]-1; y <= coords[1]+1; y++) {
				if (x == coords[0] && y == coords[1]) {
					continue;
				}
				neighbors.push(x+','+y);
			}
		}
		return neighbors;
	},
	_neighborShortcount: function _neighborShortcount(point) {
		var coords = point.split(',');
		coords[0] = parseInt(coords[0], 10);
		coords[1] = parseInt(coords[1], 10);		
		var x, y;
		var neighbors = 0;
		for (x = coords[0]-1; x <= coords[0]+1; x++) {
			for (y = coords[1]-1; y <= coords[1]+1; y++) {
				if (x == coords[0] && y == coords[1]) {
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



