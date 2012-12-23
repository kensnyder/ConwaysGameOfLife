(function(exports) {
	"use strict";

	exports.GameShapes = {
	
		find: function(name) {
			var idx = 0, shape;
			while ((shape = GameShapeLibrary[idx++])) {
				if (shape.id == name) {
					return shape;
				}
			}			
			return false;
		},
		add: function(controls, shape) {
			if (typeof shape == 'string') {
				shape = this.find(shape);			
			}
			if (!shape) {
				return false;
			}
			shape.pos = shape.pos || 'middle-center';
			shape.zoom = shape.zoom || 6;
			shape.speed = shape.speed === undefined ? 0 : shape.speed;
			shape.rule = shape.rule || '23/3';
			controls.setRule(shape.rule);
			controls.setSpeed(shape.speed);
			if (shape.zoom > 2) {
				controls.enableGridlines();
			}
			else {
				controls.disableGridlines();
			}
			if (shape.zoom) {
				controls.setBlockSize(shape.zoom);
			}			
			var points = this.getPoints(shape);
			var x = this.getStartX(controls, shape);
			var y = this.getStartY(controls, shape);
			points.forEach(function(xy) {
				controls.game.addPoint(x + xy[0], y + xy[1]);
			});
		},
		getStartX: function(controls, shape) {
			var padding = Math.floor(controls.renderer.boardSize.x * 0.075);
			switch (shape.pos.split('-')[1]) {
				case 'left':   return padding;
				default:
				case 'center': return Math.floor((controls.renderer.boardSize.x / 2) - (shape.size[0] / 2));
				case 'right':  return controls.renderer.boardSize.x - shape.size[0] - padding;
			}
		},
		getStartY: function(controls, shape, boardHeight) {
			var padding = Math.floor(controls.renderer.boardSize.y * 0.075);
			switch (shape.pos.split('-')[0]) {
				case 'top':    return padding;
				default:
				case 'middle': return Math.floor((controls.renderer.boardSize.y / 2) - (shape.size[1] / 2));
				case 'bottom': return controls.renderer.boardSize.y - shape.size[1] - padding;
			}
		},
		getPoints: function(shape) {
			if (shape.rle) {
				return this.parseRle(shape.rle);
			}
			return shape.points;
		},
		parseRle: function(rle) {
			// convert RLE format to points
			// http://www.conwaylife.com/wiki/Run_Length_Encoded
			// b = dead
			// o = alive
			// $ = newline
			var relX = 0, relY = 0;
			var points = [];
			//shape.rle.replace(/^.+x = \d+, y = \d+.*(\n|\r)(.+)!.*$/, '$2').split(/(\d+b|\d+o|b|o|\$)/).forEach(function(token) {
			rle.split(/(\d+\D|\D)/).forEach(function(token) {
				if (token.trim() == '') {
					return '';
				}
				token.replace(/^(\d+)o$/, function($0, $1) {
					var max = +$1;
					for (var i = 0; i < max; i++) {
						points.push([relX++,relY]);
					}
				});
				token.replace(/^(\d+)b$/, function($0, $1) {
					relX += parseInt($1,10);
				});
				token.replace(/^(\d+)\$$/, function($0, $1) {
					relX = 0;
					relY += +$1;
				});
				if (token == 'o') {
					points.push([relX++,relY]);
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
			return points;
		},
		
//		seed: function seed(game, ratio, width, height) {
//			var numPoints = Math.floor(ratio * width * height);
//			for (var i = 0; i < numPoints; i++) {
//				this._addRandomPoint(game, width, height);
//				game.addPoint(Math.floor(width * Math.random()), Math.floor(height * Math.random()));
//			}
//			return this;
//		},
		
		exportGrid: function() {
			
		}
		
	};
}(typeof exports === 'undefined' ? this : exports));