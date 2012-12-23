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
				select.options[i] = new Option(rule.rule + ' - ' + rule.name, rule.rule);
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
		_setupIntervalSelect: function() {
			var select = this.elements.intervalSelect;
			select.options[0] = new Option('Max', '0');
			select.options[1] = new Option('Very Fast (25fps)', '25');
			select.options[2] = new Option('Fast (10fps)', '10');
			select.options[3] = new Option('Medium Fast (5fps)', '5');
			select.options[4] = new Option('Medium (3fps)', '3');
			select.options[5] = new Option('Medium Slow (2fps)', '2');
			select.options[6] = new Option('Slow (1fps)', '1');
			select.options[7] = new Option('Very Slow (0.5fps)', '0.5');
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
			for (var hw = 1; hw <= 20; hw++) {
				select.options[idx++] = new Option(hw+'x'+hw, hw);
			}
			select.onchange = this._handleBlockSizeSelect.bind(this);
			this.setBlockSize(6);
		},
		_handleBlockSizeSelect: function() {
			var select = this.elements.blockSizeSelect;
			select.blur();
			this.setBlockSize(select.options[select.selectedIndex].value);
		},
		setBlockSize: function(size) {
//			var oldBlockSize = this.options.blockSize;
//			this.options.blockSize = +size;
//			this.options.width = Math.floor(this.elements.board.offsetWidth / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
//			this.options.height = Math.floor(this.elements.board.offsetHeight / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
//			this.renderer.blockSize = {
//				width: this.options.blockSize,
//				height: this.options.blockSize
//			};
//			if (oldBlockSize > this.options.blockSize) {
//				this.panRatio(this.options.blockSize / oldBlockSize * -0.5);
//			}
//			else {
//				this.panRatio(oldBlockSize / this.options.blockSize * 0.25);
//			}
			this.renderer.blockSize = {
				width: +size,
				height: +size
			};
			this.renderer.drawGrid();
			this.renderer.drawBoard();
			setSelectValue(this.elements.blockSizeSelect, size);
		},
		_setupGridlinesSelect: function() {
			var select = this.elements.gridlinesSelect;
			select.options[0] = new Option('On', '1');
			select.options[1] = new Option('Off', '0');
			this.enableGridlines();			
			select.onchange = this._handleGridlinesSelect.bind(this);
		},
		_handleGridlinesSelect: function() {
			var select = this.elements.gridlinesSelect;
			if (select.selectedIndex == 0) {
				this.enableGridlines();
			}
			else {
				this.disableGridlines();
			}
			select.blur();
		},
		enableGridlines: function() {
			if (this.options.useGridlines == 1) {
				return;
			}
			this.panRatio((this.options.blockSize + 1) / 1);
			this.renderer.useGridlines = 1;
			this.renderer.drawGrid();
			this.renderer.drawBoard();
			setSelectValue(this.elements.gridlinesSelect, '1');
		},
		disableGridlines: function() {
			if (this.options.useGridlines == 0) {
				return;
			}
			this.panRatio(-0.5 / (this.options.blockSize - 1));
			this.renderer.useGridlines = 0;
			this.renderer.drawGrid();
			this.renderer.drawBoard();			
			setSelectValue(this.elements.gridlinesSelect, '0');
		},
		_setupStartButton: function() {
			var button = this.elements.startButton;
			button.onclick = this._handleStartButton.bind(this);
			this.stop();
		},
		_handleStartButton: function() {
			var button = this.elements.startButton;
			button.blur();
			if (this.isRunning) {
				this.stop();
			}
			else if (this.game.numPoints == 0) {
				alert('Before starting, please choose a seed pattern or click squares to add cells.');
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
			button.value = 'Pause \u2590\u2590';
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
					(this.renderer.blockSize.width + (this.renderer.useGridlines ? 1 : 0))
				);
				var y = Math.floor(
					evt.pageY / 
					(this.renderer.blockSize.height + (this.renderer.useGridlines ? 1 : 0))
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
		save: function() {
			var points = this.game.getPoints();
			var minX = Infinity;
			var minY = Infinity;
			points.forEach(function(xy) {
				if (xy[0] < minX) minX = xy[0];
				else if (xy[1] < minY) minY = xy[1];
			});
			var newPoints = [];
			points.forEach(function(xy) {
				newPoints.push([xy[0]-minX,xy[1]-minY]);
			});
			console.log(JSON.stringify(newPoints));			
		},
		_setupResetButton: function() {
			this.elements.resetButton.onclick = this.reset.bind(this);
		},
		reset: function() {
			this.stop();
			this.game.reset();
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
			var newGrid = {};
			this.game.getPoints().forEach(function(xy) {
				newGrid[(xy[0]-byX)+','+(xy[1]-byY)] = 1;
			});
			this.game.grid = newGrid;
			if (!this.isRunning) {
				this.renderer.draw();
			}
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
	
}(typeof exports === 'undefined' ? this : exports));