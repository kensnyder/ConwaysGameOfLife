(function(exports) {
	"use strict";

	exports.GameRenderer = function(game, options) {
		this.game = game;
		this.container = options.board;
		this.container.style.position = 'relative';
		this.useGridlines = ('useGridlines' in options) ? options.useGridlines : true;
		this.gridlinesColor = options.gridlinesColor || '#d0d0d0';
		this.drawVisited = ('drawVisited' in options) ? options.drawVisited : false;
		this.visitedColor = options.visitedColor || '#ceffde'; // green
		this.setup();
		this.setBlockSize(options.blockSize || 6);
		this.perf = {};
	}

	GameRenderer.prototype = {
		draw: function draw() {
			this.drawBoard();
			this.drawStats();
			return this;
		},
		getFps: function getFps() {
			var elapsed, now;
			if (this.game.numPoints === 0) {
				return 0;
			}
			if (this.game.generation === 0) {
				this.perf.lastDrawTime = null;
				this.perf.fps = 0;
				this.perf.lastGeneration = 0;
			}
			else if (this.perf.lastDrawTime) {
				now = +new Date;
				elapsed = now - this.perf.lastDrawTime;
				if (elapsed > 1000) {
					this.perf.fps = Math.round(1000 / elapsed * (this.game.generation - this.perf.lastGeneration), 0);
					this.perf.lastGeneration = this.game.generation;
					this.perf.lastDrawTime = now;
				}
			}
			else {
				this.perf.lastDrawTime = +new Date;
			}
			return this.perf.fps;
		},
		setup: function setup() {
			this.container.innerHTML = '';
			// grid canvas
			this.grid = this._makeCanvas();
			this.drawGrid();
			window.addEventListener('resize', this.drawGrid.bind(this), false);
			// visited canvas
			this.visitedBoard = this._makeCanvas();
			this.visitedPoints = {};
			window.addEventListener('resize', this.drawVisitedBoard.bind(this), false);
			// board canvas
			this.board = this._makeCanvas();
			window.addEventListener('resize', this.drawBoard.bind(this), false);
			return this;
		},
		clear: function clear() {
			this.visitedPoints = {};
			this.drawAll();
		},
		drawAll: function() {
			this.drawGrid();
			this.drawVisitedBoard();
			this.drawBoard();			
		},
		_makeCanvas: function _makeCanvas() {
			var canvas = document.createElement('canvas');
			canvas.style.position = 'absolute';
			canvas.ctx = canvas.getContext('2d');
			this.container.appendChild(canvas);
			var setSize = function() {
				canvas.height = this.container.offsetHeight;
				canvas.width = this.container.offsetWidth;
			}.bind(this);
			window.addEventListener('resize', setSize, false);
			setSize();
			return canvas;
		},
		setBlockSize: function setBlockSize(pixels) {
			this.blockSize = pixels;
			this.boardSize = {
				x: Math.floor(this.grid.width / (this.blockSize + (this.useGridlines ? 1 : 0))),
				y: Math.floor(this.grid.height / (this.blockSize + (this.useGridlines ? 1 : 0)))
			};
		},
		drawGrid: function drawGrid() {
			this.grid.ctx.clearRect(0, 0, this.grid.width, this.grid.height);
			if (!this.useGridlines) {
				return;
			}
			this.grid.ctx.strokeStyle = this.gridlinesColor;
			this._drawGridLines('width'); // vertical lines	
			this._drawGridLines('height'); // horizontal lines
		},
		_drawGridLines: function _drawGridLines(prop) {
			this.grid.ctx.beginPath();
			for (var i = 0; i <= this.grid[prop]; i += this.blockSize+1) {
				if (prop == 'width') { // vertical lines	
					this.grid.ctx.moveTo(i+0.5, 0);
					this.grid.ctx.lineTo(i+0.5, this.grid.height);
				}
				else if (prop == 'height') { // horizontal lines
					this.grid.ctx.moveTo(0, i+0.5);
					this.grid.ctx.lineTo(this.grid.width, i+0.5);
				}		
			}
			this.grid.ctx.stroke();
		},
		drawVisitedBoard: function drawVisitedBoard() {
			this.visitedBoard.ctx.clearRect(0, 0, this.visitedBoard.width, this.visitedBoard.height);
			if (!this.drawVisited) {
				return;
			}
			this.visitedBoard.ctx.fillStyle = this.visitedColor;
			var w = this.blockSize + (this.useGridlines ? 1 : 0);
			var h = this.blockSize + (this.useGridlines ? 1 : 0);
			var xy;
			for (var point in this.visitedPoints) {
				xy = point.split(',');
				this.visitedBoard.ctx.fillRect(
					xy[0] * w + 1,
					xy[1] * h + 1,
					this.blockSize,
					this.blockSize
				);
			}				
		},
		drawBoard: function drawBoard() {	
			this.board.ctx.fillStyle = '#000';
			this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
			var xy;
			var w = this.blockSize + (this.useGridlines ? 1 : 0);
			var h = this.blockSize + (this.useGridlines ? 1 : 0);
			for (var point in this.game.grid) {
				xy = point.split(',');
				this.board.ctx.fillRect(
					xy[0] * w + 1,
					xy[1] * h + 1,
					this.blockSize,
					this.blockSize
				);
			}
			if (this.drawVisited) {
				this.visitedBoard.ctx.fillStyle = this.visitedColor;
				for (point in this.game.grid) {
					if (this.visitedPoints[point] === undefined) {
						xy = point.split(',');
						this.visitedPoints[point] = true; 
						this.visitedBoard.ctx.fillRect(
							xy[0] * w + 1,
							xy[1] * h + 1,
							this.blockSize,
							this.blockSize
						);
					}	
				}
			}
		},
		getStats: function getStats() {
			return {
				Board: this.boardSize.x + 'x' + this.boardSize.y,
				Tick: this.game.generation,
				Cells: this.game.numPoints,
				FPS: this.getFps() || '-'
			};
		},
		drawStats: function drawStats() {
			this.board.ctx.fillStyle = 'rgba(255,255,255,0.75)';
			this.board.ctx.fillRect(0,22,115,64);
			this.board.ctx.fillStyle = 'rgba(30,62,246,0.80)';
			this.board.ctx.font = '10pt Arial';
			var stats = this.getStats();
			this.board.ctx.fillText('Board: ' + stats.Board, 6, 43);
			this.board.ctx.fillText('Tick: ' + stats.Tick, 6, 55);
			this.board.ctx.fillText('Cells: ' + stats.Cells, 6, 67);
			this.board.ctx.fillText('FPS: ' + stats.FPS, 6, 79);
		},
		killOffscreenPoints: function killOffscreenPoints() {
			this.game.getPoints().forEach(function _killPointIfOffscreen(xy) {
				if (xy[0] < -15 || xy[1] < -15 || xy[0] > this.boardSize.x + 15 || xy[1] > this.boardSize.y + 15) {
					this.game.removePoint(xy[0], xy[1]);
				}
			}.bind(this));
		}
	};
}(typeof exports === 'undefined' ? this : exports));