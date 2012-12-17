(function(exports) {
	"use strict";

	exports.GameShapes = {
	
		get: function(name) {
			var idx = 0, shape;
			while ((shape = GameShapeLibrary[idx++])) {
				if (shape.code == name) {
					return shape;
				}
			}
		},
		
		add: function(game, name, x, y) {
			if (!x) x = 0;
			if (!y) y = 0;
			var shape;
			if (name.points || name.rle) {
				shape = name;
			}
			else {
				shape = this.get(name);			
			}
			if (shape && shape.rle) {
				// convert RLE format to points
				// http://www.conwaylife.com/wiki/Run_Length_Encoded
				// b = dead
				// o = alive
				// $ = newline
				var relX = 0, relY = 0;
				shape.points = [];
				//shape.rle.replace(/^.+x = \d+, y = \d+.*(\n|\r)(.+)!.*$/, '$2').split(/(\d+b|\d+o|b|o|\$)/).forEach(function(token) {
				shape.rle.split(/(\d+\D|\D)/).forEach(function(token) {
					if (token.trim() == '') {
						return '';
					}
					token.replace(/^(\d+)o$/, function($0, $1) {
						var max = parseInt($1, 10);
						for (var i = 0; i < max; i++) {
							shape.points.push([relX++,relY]);
						}
					});
					token.replace(/^(\d+)b$/, function($0, $1) {
						relX += parseInt($1,10);
					});
					token.replace(/^(\d+)\$$/, function($0, $1) {
						relX = 0;
						relY += parseInt($1,10);
					});
					if (token == 'o') {
						shape.points.push([relX++,relY]);
					}
					else if (token == 'b') {
						relX++;
					}
					else if (token == '$') {
						relX = 0;
						relY++;
					}
					return '';
				});
			}
			if (shape && shape.points) {
				shape.points.forEach(function(xy) {
					game.addPoint(x + xy[0], y + xy[1]);
				});
			}
			if (shape.rule) {
				game.setRuleString(shape.rule);
			}
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
		
		exportGrid: function() {
			
		}
		
	};
}(typeof exports === 'undefined' ? this : exports));