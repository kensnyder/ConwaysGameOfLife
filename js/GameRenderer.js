"use strict";

function GameRenderer(game, options) {
	this.game = game;
	this.div = options.div;
	this.blockSize = typeof options.blockSize == 'number' ? 
		{width:options.blockSize,height:options.blockSize} : 
		typeof options.blockSize == 'object' ? options.blockSize : {width:6,height:6};
	this.div.style.position = 'relative';
	this.drawGrid = ('drawGrid' in options) ? options.drawGrid : true;
	this._drawTimestamps = [];
	this.reset();
}

GameRenderer.prototype = {
	draw: function draw() {
		this.frameCount++;
		if (this.frameCount % 50 == 0) {
			this.killOffscreenPoints();
		}
		this._drawTimestamps.push(+new Date);
		if (this._drawTimestamps.length > 20) {
			this._drawTimestamps.shift();
		}
		this._drawBoard();
		return this;
	},
	getFps: function() {
		if (this._drawTimestamps.length == 0) {
			return 0;
		} 
		var ms = +new Date - this._drawTimestamps[0];
		var avgMs = ms / this._drawTimestamps.length;
		if (avgMs < 1) {
			return 0;
		}
		return Math.round(1000 / avgMs, 0);
	},
	reset: function reset() {
		this.frameCount = 0;
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
		this.boardSize = {
			x: Math.floor(this.grid.width/this.blockSize.width),
			y: Math.floor(this.grid.height/this.blockSize.height)
		};
		if (!this.drawGrid) {
			return;
		}
		this.grid.ctx.strokeStyle = '#eee';
		this._drawGridLines('width'); // vertical lines	
		this._drawGridLines('height'); // horizontal lines
	},
	_drawGridLines: function _drawGridLines(prop) {
		this.grid.ctx.beginPath();
		for (var i = 0; i <= this.grid[prop]; i += this.blockSize[prop]) {
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
		var gridWidth = this.drawGrid ? 1 : 0;		
		this.board.ctx.fillStyle = '#000';
		this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
		this.game.getPoints().forEach(function _drawPoint(xy) {			
			this.board.ctx.fillRect(
				xy[0] * this.blockSize.width + gridWidth,
				xy[1] * this.blockSize.height + gridWidth,
				this.blockSize.width - gridWidth,
				this.blockSize.height - gridWidth
			);
		}.bind(this));
		this.board.ctx.fillStyle = 'rgb(0,200,100)';
		this.board.ctx.font = '10pt Arial';
		this.board.ctx.fillText('Board: ' + this.boardSize.x + 'x' + this.boardSize.y, 6, 16);
		this.board.ctx.fillText('Size: ' + (this.game.max[0] - this.game.min[0]) + 'x' + (this.game.max[1] - this.game.min[1]) , 6, 28);
		this.board.ctx.fillText('Tick: ' + this.frameCount, 6, 40);
		this.board.ctx.fillText('Cells: ' + this.game.numPoints, 6, 52);
		this.board.ctx.fillText('FPS: ' + this.getFps(), 6, 64);
	},
	killOffscreenPoints: function killOffscreenPoints() {
		this.game.getPoints().forEach(function _killPointIfOffscreen(xy) {
			if (xy[0] < -15 || xy[1] < -15 || xy[0] > this.boardSize.x + 15 || xy[1] > this.boardSize.y + 15) {
				this.game.removePoint(xy[0], xy[1]);
			}
		}.bind(this));
	}
};



