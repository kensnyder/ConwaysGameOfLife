(function(exports) {
	"use strict";

	exports.GameControls = function(controls, board) {
		this.options = {
			board: board
		};
		this.elements = {
			controls: controls,
			board: board
		};
		Array.prototype.slice.call(controls.getElementsByTagName('*')).forEach(function(element) {
			if (!element.id) {
				return;
			}
			this.elements[element.id] = element;
		}.bind(this));
		this.resetGame();
		this.setup();
	};

	exports.GameControls.prototype = {
		setup: function() {
			this._setupSeedSelect();
			this._setupIntervalSelect();
			this._setupBlockSizeSelect();
			this._setupGridlinesSelect();
			this._setupRuleSelect();
			this._setupVisitedSelect();
			this._setupOptionsButton();
			this._setupStartButton();
			this._setupBoardClick();
			this._setupSaveButton();
			this._setupResetButton();
			this._setupPan();
		},
		resetGame: function() {
			this.tick = 0;
			this.game = new Game();
			this.renderer = new GameRenderer(this.game, this.options);
			this.renderer.draw();
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
		_setupPan: function() {
			document.addEventListener('keyup', this._handleArrowKeys.bind(this));
		},
		_handleArrowKeys: function(evt) {
			var incX = Math.round(this.renderer.boardSize.x * 0.1);
			var incY = Math.round(this.renderer.boardSize.y * 0.1);
				 if (evt.which == 37) this.pan(-incX,0); // left
			else if (evt.which == 38) this.pan(0,-incY); // up
			else if (evt.which == 39) this.pan(incX,0);  // right
			else if (evt.which == 40) this.pan(0,incY);  // down			
		},
		_setupSeedSelect: function() {
			var select = this.elements.seedSelect;
			var idx = 0;
			select.options[idx++] = new Option('','');
			for (var pct = 10; pct < 100; pct += 10) {
				select.options[idx++] = new Option('Random board - '+pct+'% full', 'seed-0.'+pct);
			}
			GameShapeLibrary.forEach(function(shape) {
				select.options[idx++] = new Option('Shape - ' + shape.name, 'addShape-'+shape.id);
			});
			// add some from local storage
			select.selectedIndex = 0;
			select.onchange = this._handleSeedSelect.bind(this);
		},
		seed: function(ratio) {
			var x, y, numPoints = Math.floor(this.renderer.boardSize.x * this.renderer.boardSize.y * ratio * 0.60 * 0.60);
			for (var i = 0; i < numPoints; i++) {
				x = Math.floor(this.renderer.boardSize.x * Math.random() * 0.60) + Math.floor(this.renderer.boardSize.x * 0.20);
				y = Math.floor(this.renderer.boardSize.y * Math.random() * 0.60) + Math.floor(this.renderer.boardSize.y * 0.20);
				if (this.game.isAlive(x,y)) {
					i--;
				}
				else {
					this.game.addPoint(x, y);
				}
			}
			return this;
		},
		_handleSeedSelect: function() {
			var select = this.elements.seedSelect;
			select.blur();
			this.stop();
			this.reset();
			var value = select.options[select.selectedIndex].value;
			if (value) {
				var parts = value.split('-');
				this[parts[0]](parts[1]);
			}
			this.renderer.draw();
			select.selectedIndex = 0;
		},		
		addShape: function(name) {	
			GameShapes.add(this, name, this.renderer.boardSize.x, this.renderer.boardSize.y);
			return this;
		},	
		_setupRuleSelect: function() {
			var select = this.elements.ruleSelect;
			GameRules.forEach(function(rule, i) {
				select.options[i] = new Option(padRule(rule.rule) + ' ' + rule.name, rule.rule);
			});
			select.selectedIndex = 0;
			select.onchange = this._handleRuleSelect.bind(this);
		},
		_handleRuleSelect: function() {
			var select = this.elements.ruleSelect;
			select.blur();
			this.setRule(select.options[select.selectedIndex].value);			
		},
		setRule: function(value) {			
			this.game.setRuleString(value);			
			setSelectValue(this.elements.ruleSelect, value);
		},
		_setupVisitedSelect: function() {
			var select = this.elements.visitedSelect;
			var idx = 0;
			select[idx] = new Option('(none)','');
			select[idx++].style.backgroundColor = '#fffff';
			select[idx] = new Option('blue','#cff1ff');
			select[idx++].style.backgroundColor = '#cff1ff';
			select[idx] = new Option('gray','#f0f0f0');
			select[idx++].style.backgroundColor = '#f0f0f0';
			select[idx] = new Option('yellow','#fffed9');
			select[idx++].style.backgroundColor = '#fffed9';
			select[idx] = new Option('green','#ceffde');
			select[idx++].style.backgroundColor = '#ceffde';
			select[idx] = new Option('orange','#fff0cf');
			select[idx++].style.backgroundColor = '#fff0cf';
			select.selectedIndex = 0;
			select.onchange = function() {
				var hex = select.options[select.selectedIndex].value;
				if (hex === '') {
					this.renderer.drawVisited = false;
				}
				else {
					this.renderer.drawVisited = true;
					this.renderer.visitedColor = hex;
				}
			}.bind(this);
		},
		_setupOptionsButton: function() {
			var button = this.elements.optionsButton;
			var div = this.elements.options;
			button.addEventListener('click', function(evt) {
				evt.preventDefault();
				div.style.display = div.style.display == 'none' ? '' : 'none';
			}, false);
			this.elements.board.addEventListener('click', function() {
				div.style.display = 'none';
			}, false);
			this.elements.optionsClose.addEventListener('click', function(evt) {
				evt.preventDefault();
				div.style.display = 'none';
			}, false);
		},
		_setupIntervalSelect: function() {
			var select = this.elements.intervalSelect;
			select.options[0] = new Option('Max',    '0');
			select.options[1] = new Option('~40fps', '40');
			select.options[1] = new Option('~25fps', '25');
			select.options[2] = new Option('~10fps', '10');
			select.options[3] = new Option('~5fps',  '5');
			select.options[4] = new Option('~3fps',  '3');
			select.options[5] = new Option('~2fps',  '2');
			select.options[6] = new Option('~1fps',  '1');
			select.options[7] = new Option('~0.5fps','0.5');
			select.onchange = this._handleIntervalSelect.bind(this);
			this.setSpeed(0);
		},
		_handleIntervalSelect: function() {
			var select = this.elements.intervalSelect;
			select.blur();
			this.setSpeed(select.options[select.selectedIndex].value);
		},
		setSpeed: function(fps) {
			fps = +fps;
			this.options.interval = fps < 1 ? 0 : (1000 / fps) - 4;
			if (this.isRunning) {
				this.stop();
				this.start();
			}
			setSelectValue(this.elements.intervalSelect, fps)
		},
		_setupBlockSizeSelect: function() {
			var select = this.elements.blockSizeSelect;
			var idx = 0;
			select.options[idx++] = new Option('1/4','0.25');
			select.options[idx++] = new Option('1/3','0.333333333333');
			select.options[idx++] = new Option('1/2','0.5');
			for (var hw = 1; hw <= 20; hw++) {
				select.options[idx++] = new Option(hw, hw);
			}
			select.onchange = this._handleBlockSizeSelect.bind(this);
			this.setBlockSize(6);
		},
		_handleBlockSizeSelect: function() {
			var select = this.elements.blockSizeSelect;
			select.blur();
			var newSize = select.options[select.selectedIndex].value;
			if (newSize < 3) {
				this.disableGridlines();
			}
			this.setBlockSize(newSize);
		},
		setBlockSize: function(size) {
			size = +size;
			var oldBoardSize = this.renderer.boardSize;
			this.renderer.setBlockSize(size);
			var newBoardSize = this.renderer.boardSize;
			this.panForResize(oldBoardSize, newBoardSize);
			this.renderer.drawAll();
			setSelectValue(this.elements.blockSizeSelect, size);
		},
		panForResize: function(oldBoardSize, newBoardSize) {
			this.pan(Math.floor(oldBoardSize.x - newBoardSize.x), Math.floor(oldBoardSize.y - newBoardSize.y));
		},
		_setupGridlinesSelect: function() {
			var select = this.elements.gridlinesSelect;
			select.options[0] = new Option('On', '1');
			select.options[1] = new Option('Off', '0');
			select.options[2] = new Option('White', 'white');
			this.enableGridlines();
			select.onchange = this._handleGridlinesSelect.bind(this);
		},
		_handleGridlinesSelect: function() {
			var select = this.elements.gridlinesSelect;
			this.renderer.gridlinesColor = '#d0d0d0';
			if (select.selectedIndex === 0) {
				this.renderer.useGridlines = 0; // force enable to re-render
				this.enableGridlines();
			}
			else if (select.selectedIndex === 1) {
				this.disableGridlines();
			}
			else {
				this.renderer.gridlinesColor = '#ffffff';
				this.renderer.useGridlines = 0; // force enable to re-render
				this.enableGridlines();
				select.selectedIndex = 2; // reset value
			}
			select.blur();
		},
		enableGridlines: function() {
			if (this.renderer.useGridlines == 1) {
				return;
			}
			var oldBoardSize = this.renderer.boardSize;
			this.renderer.useGridlines = 1;
			this.renderer.drawAll();
			var newBoardSize = this.renderer.boardSize;
			this.panForResize(oldBoardSize, newBoardSize);
			setSelectValue(this.elements.gridlinesSelect, '1');
		},
		disableGridlines: function() {
			if (this.renderer.useGridlines == 0) {
				return;
			}
			var oldBoardSize = this.renderer.boardSize;
			this.renderer.useGridlines = 0;
			this.renderer.drawAll();
			var newBoardSize = this.renderer.boardSize;		
			this.panForResize(oldBoardSize, newBoardSize);
			setSelectValue(this.elements.gridlinesSelect, '0');
		},
		_setupStartButton: function() {
			var button = this.elements.startButton;
			var handle = this._handleStartButton.bind(this);
			button.onclick = handle;
			window.addEventListener('keyup', function(evt) {
				if (evt.which != 13) {
					return;
				}
				handle();
			}, false);
			this.stop();
		},
		_handleStartButton: function() {
			var button = this.elements.startButton;
			button.blur();
			if (this.isRunning) {
				this.stop();
			}
			else if (this.game.numPoints == 0) {
				alert('Before starting, please choose a shape or click squares to add cells.');
			}
			else {
				this.start();
			}			
		},
		stop: function stop() {
			var button = this.elements.startButton;
			button.value = 'Start \u25B6';
			this.isRunning = false;
			clearInterval(this._intervalId);
			return this;
		},		
		start: function() {
			var button = this.elements.startButton;
			button.value = 'Pause \u220E\u220E';
			this.isRunning = true;
			this._startTime = +new Date;
			this._intervalId = setInterval(this._tickAndDraw.bind(this), this.options.interval);
			return this;
		},		
		_setupBoardClick: function() {
			var board = this.elements.board;
			this.inMousedown = false;
			var drawAtCursor = function(evt) {
				var x = Math.floor(
					evt.pageX / 
					(this.renderer.blockSize + (this.renderer.useGridlines ? 1 : 0))
				);
				var y = Math.floor(
					evt.pageY / 
					(this.renderer.blockSize + (this.renderer.useGridlines ? 1 : 0))
				);
				if (evt.type == 'click' && this.game.isAlive(x,y) && !this.inMousedown) {
					this.game.removePoint(x,y);
				}
				else {
					this.game.addPoint(x,y);
				}
				this.renderer.draw();
			}.bind(this);
			board.onclick = drawAtCursor;
			board.onmousedown = function() {
				setTimeout(function(){this.inMousedown = true}.bind(this),500);
				board.onmousemove = drawAtCursor;
			}.bind(this);
			board.onmouseup = function() {
				setTimeout(function(){this.inMousedown = false}.bind(this),500);
				board.onmousemove = null;
			}.bind(this);
		},
		_setupSaveButton: function() {
			this.elements.saveButton.onclick = this.save.bind(this);
		},
		boardToShape: function() {
			var points = this.game.getPoints();
			var min = [Infinity,Infinity];
			var max = [-Infinity,-Infinity];
			// first find min and max
			points.forEach(function(xy) {
				if (xy[0] < min[0]) min[0] = xy[0];
				else if (xy[1] < min[1]) min[1] = xy[1];
				if (xy[0] > max[0]) max[0] = xy[0];
				else if (xy[1] > max[1]) max[1] = xy[1];
			});
			// then gather all the points relative to 0,0
			var newPoints = [];
			points.forEach(function(xy) {
				newPoints.push([xy[0]-min[0],xy[1]-min[1]]);
			});
			return {
				size: [max[0]-min[0], max[1]-min[1]],
				points: newPoints
			};
		},
		save: function() {
			var shape = this.boardToShape();
			console.log(JSON.stringify(shape.points));			
		},
		toPng: function() {
			var shape = this.boardToShape();
			var renderer = {};
			// build up an object comaptible with GameRenderer
			renderer.useGridlines = true;
			renderer.gridlinesColor = '#d0d0d0';
			renderer.drawVisited = false;
			renderer.grid = document.createElement('canvas');
			renderer.grid.ctx = renderer.grid.getContext('2d');
			renderer.grid.width = (shape.size[0]+3) * 7 - 1;
			renderer.grid.height = (shape.size[1]+3) * 7 - 1;
			renderer.board = renderer.grid;
			renderer.blockSize = 6;
			renderer.game = {grid:{}};
			shape.points.forEach(function(xy) {
				renderer.game.grid[(xy[0]+1)+','+(xy[1]+1)] = 1;
			});
			
			GameRenderer.prototype.drawBoard.call(renderer);
			renderer.grid.ctx.strokeStyle = renderer.gridlinesColor;
			GameRenderer.prototype._drawGridLines.call(renderer, 'width'); // vertical lines	
			GameRenderer.prototype._drawGridLines.call(renderer, 'height'); // horizontal lines
			window.location.href = renderer.grid.toDataURL('image/png');
		},
		_setupResetButton: function() {
			this.elements.resetButton.onclick = this.reset.bind(this);
		},
		reset: function() {
			this.stop();
			this.game.reset();
			this.renderer.visitedPoints = {};
			this.renderer.drawVisitedBoard();
			this.renderer.draw();
		},
		autoSize: function() {
			
		},
		panRatio: function(byRatio) {
			var byX = Math.round(this.renderer.boardSize.x * byRatio,0);
			var byY = Math.round(this.renderer.boardSize.y * byRatio,0);
			this.pan(byX, byY);
		},
		pan: function(byX, byY) {
			var newGrid = {}, xy;
			for (var point in this.game.grid) {
				xy = point.split(',');
				newGrid[(xy[0]-byX)+','+(xy[1]-byY)] = 1;
			}
			this.game.grid = newGrid;
			var newVisited = {};
			for (point in this.renderer.visitedPoints) {
				xy = point.split(',');
				newVisited[(xy[0]-byX)+','+(xy[1]-byY)] = true;
			}
			this.renderer.visitedPoints = newVisited;
			this.renderer.drawVisitedBoard();
			this.renderer.draw();
		}
	};
	
	function setSelectValue(select, toValue) {
		for (var i = 0, len = select.length; i < len; i++) {
			if (select.options[i].value == toValue) {
				select.selectedIndex = i;
				return i;
			}
		}
		select.selectedIndex = 0;
		return 0;
	}
	
	function padRule(rule) {
		var full = '           ';
		return rule + full.slice(rule.length).replace(/ /g, '\xA0');
	}
	
}(typeof exports === 'undefined' ? this : exports));