"use strict";

var GameShapes = {
	
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
		size: [7,3],
		points: [
				[1,0],
							[4,1],
		  [0,2],[1,2],      [4,2],[5,2],[6,2]
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
	
}



