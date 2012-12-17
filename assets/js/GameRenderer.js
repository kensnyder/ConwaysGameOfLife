(function(exports) {
	"use strict";

	exports.GameRenderer = function(game, options) {
		this.game = game;
		this.div = options.div;
		this.blockSize = typeof options.blockSize == 'number' ? 
			{width:options.blockSize,height:options.blockSize} : 
			typeof options.blockSize == 'object' ? options.blockSize : {width:6,height:6};
		this.div.style.position = 'relative';
		this.useGridlines = ('useGridlines' in options) ? options.useGridlines : true;
		this._drawTimestamps = [];
		this._fps = 0;
		this.reset();
	}

	GameRenderer.prototype = {
		draw: function draw() {
			this._drawTimestamps.push(+new Date);
			if (this._drawTimestamps.length > 50) {
				this._drawTimestamps.shift();
			}
			this.drawBoard();
			return this;
		},
		getFps: function() {
			if (!this._fps || (this.game.generation % 50) == 0) {
				if (this._drawTimestamps.length < 50) {
					return 0;
				} 
				var ms = +new Date - this._drawTimestamps[0];
				var avgMs = ms / this._drawTimestamps.length;
				if (avgMs < 1) {
					return 1000;
				}
				this._fps = Math.round(1000 / avgMs, 1);
			}
			return this._fps || 0;
		},
		reset: function reset() {
			this.div.innerHTML = '';
			this.grid = this._makeCanvas();
			this.drawGrid();
			window.addEventListener('resize', this.drawGrid.bind(this), false);
			this.board = this._makeCanvas();
			window.addEventListener('resize', this.drawBoard.bind(this), false);
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
		drawGrid: function drawGrid() {
			this.boardSize = {
				x: Math.floor(this.grid.width/this.blockSize.width),
				y: Math.floor(this.grid.height/this.blockSize.height)
			};
			this.grid.ctx.clearRect(0, 0, this.grid.width, this.grid.height);
			if (!this.useGridlines) {
				return;
			}
			this.grid.ctx.strokeStyle = '#ddd';
			this._drawGridLines('width'); // vertical lines	
			this._drawGridLines('height'); // horizontal lines
		},
		_drawGridLines: function _drawGridLines(prop) {
			this.grid.ctx.beginPath();
			for (var i = 0; i <= this.grid[prop]; i += this.blockSize[prop]+1) {
				if (prop == 'width') { // vertical lines	
					this.grid.ctx.moveTo(i-0.5, 0);
					this.grid.ctx.lineTo(i-0.5, this.grid.height);
				}
				else if (prop == 'height') { // horizontal lines
					this.grid.ctx.moveTo(0, i-0.5);
					this.grid.ctx.lineTo(this.grid.width, i-0.5);
				}		
			}
			this.grid.ctx.stroke();
		},
		drawBoard: function drawBoard() {	
			var gridWidth = this.useGridlines ? 1 : 0;		
			this.board.ctx.fillStyle = '#000';
			this.board.ctx.clearRect(0, 0, this.board.width, this.board.height);
			this.game.getPoints().forEach(function _drawPoint(xy) {			
				this.board.ctx.fillRect(
					xy[0] * (this.blockSize.width + gridWidth),
					xy[1] * (this.blockSize.height + gridWidth),
					this.blockSize.width,
					this.blockSize.height
				);
			}.bind(this));
			this.board.ctx.fillStyle = 'rgb(0,200,60)';
			this.board.ctx.font = '10pt Arial';
			this.board.ctx.fillText('Board: ' + this.boardSize.x + 'x' + this.boardSize.y, 6, 46);
			this.board.ctx.fillText('Tick: ' + this.game.generation, 6, 58);
			this.board.ctx.fillText('Cells: ' + this.game.numPoints, 6, 70);
			this.board.ctx.fillText('FPS: ' + this.getFps() || '-', 6, 82);
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