(function(exports) {
	"use strict";

	exports.GameRunner = function(options) {
		this.options = options || {};
		this.width = options.width || 100;
		this.height = options.height || 30;
		this.interval = ('interval' in options) ? options.interval : 50;
		this._tickAndDraw = this._tickAndDraw.bind(this);
		this.reset();
	}

	exports.GameRunner.prototype = {
		reset: function reset() {
			this.tick = 0;
			this.game = new Game();
			this.renderer = new GameRenderer(this.game, this.options);
		},
		setInterval: function setInterval(milliseconds) {
			this.interval = milliseconds;
			return this;
		},
		seed: function seed(ratio) {
			var numPoints = Math.floor(this.width * this.height * ratio);
			for (var i = 0; i < numPoints; i++) {
				this._addRandomPoint();
			}
			return this;
		},
		_addRandomPoint: function _addRandomPoint() {
			var x = Math.floor(this.width * Math.random() * 0.62) + Math.floor(this.width * 0.125);
			var y = Math.floor(this.height * Math.random() * 0.62) + Math.floor(this.height * 0.075);
			this.game.addPoint(x, y);
		},
		addShape: function addShape(name, x, y) {
			var shape = GameShapes.get(name);
			if (typeof x != 'number') {
				x = Math.floor(this.width * 0.5 / 2 - shape.size[0] / 2);
			}
			if (typeof y != 'number') {
				y = Math.floor(this.height * 0.5 / 2 - shape.size[1] / 2);
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
			if (this.game.numPoints == 0) {
				this.stop();
				alert('All dead');
			}
			this.renderer.draw();
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