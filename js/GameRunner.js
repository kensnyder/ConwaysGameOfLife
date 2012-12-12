"use strict";

function GameRunner(options) {
	this.options = options || {};
	this.width = options.width || 100;
	this.height = options.height || 30;
	this.interval = options.interval || 50;
	this.reset();
}

GameRunner.prototype = {
	reset: function reset() {
		this.tick = 0;
		this.game = new Game();
		this.renderer = new GameRenderer(this.game, this.options);
	},
	setBoardSize: function setBoardSize(width, height) {
		this.width = width;
		this.height = height;
		return this;
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
	// detects if all items are period 2 or 3
	isStable: function isStable() {
		if (this.game.numPoints == 0) {
			return true;
		}
		if (this.stateStack.length >= 6) {
			return (
				(
					this.stateStack[0] == this.stateStack[2] && 
					this.stateStack[1] == this.stateStack[3] &&
					this.stateStack[3] == this.stateStack[5]
				) ||
				(
					this.stateStack[0] == this.stateStack[3] && 
					this.stateStack[1] == this.stateStack[4] &&
					this.stateStack[2] == this.stateStack[5]
				)		
			);
		}
		return false;
	},
	_addRandomPoint: function _addRandomPoint() {
		var x = Math.floor(this.width * Math.random() * 0.8) + Math.floor(this.width * 0.1);
		var y = Math.floor(this.height * Math.random() * 0.8) + Math.floor(this.height * 0.1);
		this.game.addPoint(x, y);
	},
	addShape: function addShape(name, x, y) {
		var shape = GameShapes[name];
		if (typeof x != 'number') {
			x = Math.floor(this.width / 2 - shape.size[0] / 2);
		}
		if (typeof y != 'number') {
			y = Math.floor(this.height / 2 - shape.size[1] / 2);
		}		
		GameShapes.add(this.game, name, x, y);
	},
	start: function start() {
		this.isRunning = true;
		this._startTime = +new Date;
		this.stateStack = [];
		this._intervalId = setInterval(function _tickAndDraw() {
			this.tick++;
			this.game.tick();
			this.renderer.draw();
			if (this.tick % 100 == 0) {
				this.renderer.killOffscreenPoints();
			}
			this.stateStack.push(this.game.serialize());
			if (this.tick > 6) {
				this.stateStack.shift();
			}
		}.bind(this), this.interval);
		return this;
	},
	stop: function stop() {
		this.isRunning = false;
		clearInterval(this._intervalId);
		return this;
	},
	getFps: function getFps() {
		return Math.floor(1000 / ((+new Date - this._startTime) / this.tick));
	}
};



