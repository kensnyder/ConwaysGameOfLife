"use strict";

function GameRunner(div, options) {
	this.div = div;
	options = options || {};
	this.width = options.width || 100;
	this.height = options.height || 30;
	this.interval = options.interval || 50;
	this.reset();
}

GameRunner.prototype = {
	reset: function() {
		this.tick = 0;
		this.game = new Game();
		this.renderer = new GameRenderer(this);
	},
	setBoardSize: function(width, height) {
		this.width = width;
		this.height = height;
		return this;
	},
	setInterval: function(milliseconds) {
		this.interval = milliseconds;
		return this;
	},
	seed: function(ratio) {
		var numPoints = Math.floor(this.width * this.height * ratio);
		for (var i = 0; i < numPoints; i++) {
			this._addRandomPoint();
		}
		return this;
	},
	isStuck: function() {
		
	},
	_addRandomPoint: function() {
		var x = Math.floor(this.width * Math.random() * 0.8) + Math.floor(this.width * 0.1);
		var y = Math.floor(this.height * Math.random() * 0.8) + Math.floor(this.height * 0.1);
		this.game.addPoint(x, y);
	},
	addShape: function(name, x, y) {
		if (typeof x != 'number') {
			x = Math.floor(this.width / 2);
		}
		if (typeof y != 'number') {
			y = Math.floor(this.height / 2);
		}
		GameShapes[name].forEach(function(xy) {
			this.game.addPoint(x + xy[0], y + xy[1]);
		}.bind(this));
	},
	start: function() {
		this._startTime = +new Date;
		this._intervalId = setInterval(function() {
			this.tick++;
			this.game.tick();
			this.renderer.draw();
			this._killOffscreenPoints();
		}.bind(this), this.interval);
		return this;
	},
	stop: function() {
		clearInterval(this._intervalId);
		return this;
	},
	getFps: function() {
		return Math.floor(1000 / ((+new Date - this._startTime) / this.tick));
	},
	_killOffscreenPoints: function() {
		this.game.getPoints().forEach(function(xy) {
			if (xy[0] < -5 || xy[1] < -5 || xy[0] > this.width + 5 || xy[1] > this.height + 5) {
				this.game.removePoint(xy[0], xy[1]);
			}
		}.bind(this));
	}
};



