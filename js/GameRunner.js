(function(exports) {
	"use strict";

	exports.GameRunner = function(options) {
		this.options = options || {};
		this.interval = ('interval' in options) ? options.interval : 50;
		this._tickAndDraw = this._tickAndDraw.bind(this);
		this.reset();
	}

	exports.GameRunner.prototype = {
		reset: function reset() {
			this.tick = 0;
			this.game = new Game();
			this.renderer = new GameRenderer(this.game, this.options);
			this.renderer.draw();
		},
		setInterval: function setInterval(milliseconds) {
			this.interval = milliseconds;
			return this;
		},
		seed: function seed(ratio) {
			var x, y, numPoints = Math.floor(this.renderer.boardSize.x * this.renderer.boardSize.y * ratio * 0.60 * 0.60);
			for (var i = 0; i < numPoints; i++) {
				x = Math.floor(this.renderer.boardSize.x * Math.random() * 0.60) + Math.floor(this.renderer.boardSize.x * 0.125);
				y = Math.floor(this.renderer.boardSize.y * Math.random() * 0.60) + Math.floor(this.renderer.boardSize.y * 0.125);
				if (this.game.isAlive(x,y)) {
					i--;
				}
				else {
					this.game.addPoint(x, y);
				}
			}
			return this;
		},
		_addRandomPoint: function _addRandomPoint() {
			
		},
		addShape: function addShape(name, x, y) {
			var shape = GameShapes.get(name);
			if (typeof x != 'number') {
				x = Math.floor(this.renderer.boardSize.x * 0.5 / 2 - shape.size[0] / 2);
			}
			if (typeof y != 'number') {
				y = Math.floor(tthis.renderer.boardSize.y * 0.5 / 2 - shape.size[1] / 2);
			}		
			GameShapes.add(this.game, shape, x, y);
		},
		start: function start() {
			this.isRunning = true;
			this._startTime = +new Date;
			this._intervalId = setInterval(this._tickAndDraw, this.interval);
			return this;
		},
		_tickAndDraw: function() {
			this.tick++;
			this.game.tick();
			this.renderer.draw();
			if (this.game.numPoints == 0) {
				this.stop();
			}
			if (this.tick % 100 == 0) {
				this.renderer.killOffscreenPoints();
			}
		},
		stop: function stop() {
			this.isRunning = false;
			clearInterval(this._intervalId);
			return this;
		}
	};
}(typeof exports === 'undefined' ? this : exports));