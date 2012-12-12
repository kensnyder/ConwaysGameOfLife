"use strict";

var GameShapes = {
	
	add: function(game, name, x, y) {
		if (!x) x = 0;
		if (!y) y = 0;
		this[name].points.forEach(function(xy) {
			game.addPoint(x + xy[0], y + xy[1]);
		});
		return this;
	},
	seed: function seed(game, ratio, width, height) {
		var numPoints = Math.floor(ratio * width * height);
		for (var i = 0; i < numPoints; i++) {
			this._addRandomPoint(game, width, height);
			game.addPoint(Math.floor(width * Math.random()), Math.floor(height * Math.random()));
		}
		return this;
	},
	
	GLIDER: {
		name: 'Glider',
		size: [3,3],
		points: []
	},
	
	SHIP: {
		name: 'Lightweight Spaceship (LWSS)',
		size: [5,4],
		points: []
	},
	
	PULSAR: {
		name: 'Pulsar',
		size: [13,13],
		points: []
	},
	
	RPENT: {
		name: 'R-pentotmino',
		size: [3,3],
		points: [
				[1,0],[2,0],
		  [0,1],[1,1],
				[1,2]
		]
	},
	
	DIEHARD: {
		name: 'Diehard',
		size: [8,3],
		points: [
										[6,0],
		  [0,1],[1,1],
				[1,2],            [5,2],[6,2],[7,2]

		]
	},
	
	ACORN: {
		name: 'Acorn',
		size: [8,3],
		points: [
				[1,0],
							[4,1],
		  [0,2],[1,2],            [5,2],[6,2],[7,2]
		]
	},
	
	SQUARE: {
		name: '5x5 Square',
		size: [5,5],
		points: [
			[0,0],[1,0],[2,0],      [4,0],
			[0,1],
							  [3,2],[4,2],
				  [1,3],[2,3],      [4,3],
			[0,4],      [2,4],      [4,4]
		]
	},
	
	FLAT: {
		name: 'Double Block Laying Switch Engine',
		size: [39,1],
		points: [
			[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],   [9,0],[10,0],[11,0],[12,0],[13,0],       [17,0],[18,0],[19,0],     [26,0],[27,0],[28,0],[29,0],[30,0],[31,0],[32,0],   [34,0],[35,0],[36,0],[37,0],[38,0]
		]
	},
	
	GLIDERGUN: {
		name: 'Gosper Glider Gun',
		size: [36,9],
		points: [
											[24,0],
									 [22,1],[24,1],
			[12,2],[13,2],    [20,2],[21,2]             [34,2],[35,2],
			[11,3],   [15,3], [20,3],[21,3]
			
		]
	}
	
};




