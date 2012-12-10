"use strict";

function GameRenderer(runner) {
	this.runner = runner;
	this.div = runner.div;
	this.div.style.position = 'relative';
	this.reset();
}

GameRenderer.prototype = {
	draw: function draw() {
		this._drawBoard();
		return this.numAlive;
	},
	reset: function reset() {
		this.div.innerHTML = '';
		this.grid = this._makeCanvas();
		this._drawGrid();
		window.addEventListener('resize', this._drawGrid.bind(this), false);
		this.board = this._makeCanvas();
		return this;
	},
	_makeCanvas: function _makeCanvas() {
		var canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.ctx = canvas.getContext('2d');
		this.div.appendChild(canvas);
		var setSize = function() {
			canvas.height = this.div.offsetHeight;
			canvas.width = this.div.offsetWidth;
		}.bind(this);
		setSize();
		window.addEventListener('resize', setSize, false);
		return canvas;
	},
	_drawGrid: function _drawGrid() {
		this.spacing = {};
		this.grid.ctx.strokeStyle = '#eee';
		this._drawGridLines('width'); // vertical lines	
		this._drawGridLines('height'); // horizontal lines
	},
	_drawGridLines: function _drawGridLines(prop) {
		this.grid.ctx.beginPath();
		this.spacing[prop] = Math.floor(this.grid[prop] / this.runner[prop]);
		for (var i = 0; i <= this.grid[prop]; i += this.spacing[prop]) {
			if (prop == 'width') { // vertical lines	
				this.grid.ctx.moveTo(i, 0);
				this.grid.ctx.lineTo(i, this.grid.height);
			}
			else if (prop == 'height') { // horizontal lines
				this.grid.ctx.moveTo(0, i);
				this.grid.ctx.lineTo(this.grid.width, i);
			}		
		}
		this.grid.ctx.stroke();
	},
	_drawBoard: function _drawBoard() {
		this.board.ctx.fillStyle = '#000';
		this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
		var points = this.runner.game.getPoints();
		this.numAlive = points.length;
		points.forEach(function _drawPoint(xy) {
			this.board.ctx.fillRect(
				xy[0] * this.spacing.width + 1,
				xy[1] * this.spacing.height + 1,
				this.spacing.width - 1,
				this.spacing.height - 1
			);
		}.bind(this));
		this.board.ctx.fillStyle = 'rgb(0,200,100)';
		this.board.ctx.font = '10pt Arial';
		//this.board.ctx.fillText('Size: ' + this.runner.width + 'x' + this.runner.height, 6, 16);
		this.board.ctx.fillText('Size: ' + (this.runner.game.max[0] - this.runner.game.min[0]) + 'x' + (this.runner.game.max[1] - this.runner.game.min[1]) , 6, 16);
		this.board.ctx.fillText('Cells: ' + this.numAlive, 6, 28);
		this.board.ctx.fillText('Tick: ' + this.runner.tick, 6, 40);
		this.board.ctx.fillText('FPS: ' + this.runner.getFps(), 6, 52);
	}
};



