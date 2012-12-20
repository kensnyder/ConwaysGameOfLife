(function(exports) {
	"use strict";

	exports.GameControls = function(controls, board) {
		this.options = {
			controls: controls,
			div: board
		};
		Array.prototype.slice.call(controls.getElementsByTagName('*')).forEach(function(element) {
			if (!element.id) {
				return;
			}
			this.options[element.id] = element;
		}.bind(this));
		this.setup();
	}

	exports.GameControls.prototype = {
		setup: function() {
			this.setupSeedSelect(this.options.seedSelect);
			this.setupIntervalSelect(this.options.intervalSelect);
			this.setupBlockSizeSelect(this.options.blockSizeSelect);
			this.setupGridlinesSelect(this.options.gridlinesSelect);
			this.setupRuleSelect(this.options.ruleSelect);
			this.setupStartButton(this.options.startButton);
			this.setupGridClick(this.options.div);
			this.setupSaveButton(this.options.saveButton);
			this.setupResetButton(this.options.resetButton);
			this.setupPan();
			this.options.width = Math.floor(this.options.div.offsetWidth / this.options.blockSize);
			this.options.height = Math.floor(this.options.div.offsetHeight / this.options.blockSize);
			this.createGameRunner();
		},
		createGameRunner: function() {
			this.runner = new GameRunner(this.options);
		},
		setupPan: function() {
			document.addEventListener('keyup', function(evt) {
				var incX = Math.round(this.options.width * 0.05);
				var incY = Math.round(this.options.height * 0.05);
					 if (evt.which == 37) this.pan(-incX,0); // left
				else if (evt.which == 38) this.pan(0,-incY); // up
				else if (evt.which == 39) this.pan(incX,0);  // right
				else if (evt.which == 40) this.pan(0,incY);  // down
			}.bind(this));
		},
		setupSeedSelect: function(select) {
			var idx = 0;
			select.options[idx++] = new Option('','');
			for (var pct = 10; pct < 100; pct += 10) {
				select.options[idx++] = new Option('Random board - '+pct+'% full', 'seed-0.'+pct);
			}
			GameShapeLibrary.forEach(function(shape) {
				select.options[idx++] = new Option('Shape - ' + shape.name, 'addShape-'+shape.code);
			});
			// add some from local storage
			select.selectedIndex = 0;
			select.onchange = function() {
				select.blur();
				this.runner.stop();
				this.runner.reset();
				this.options.startButton.value = 'Start \u25B6';
				var value = select.options[select.selectedIndex].value;
				if (value) {
					var parts = value.split('-');
					this.runner[parts[0]](parts[1]);
				}
				for (var i = 0; i < this.options.ruleSelect.options.length; i++) {
					if (this.options.ruleSelect.options[i].value == this.runner.game.rule.numeric) {
						this.options.ruleSelect.selectedIndex = i;
						break;
					}
				}
				this.runner.renderer.draw();
				select.selectedIndex = 0;
			}.bind(this);
		},
		setupRuleSelect: function(select) {
			GameRules.forEach(function(rule, i) {
				select.options[i] = new Option(rule.rule + ' - ' + rule.name, rule.rule);
			});
			select.selectedIndex = 0;
			select.onchange = function() {
				select.blur();
				this.runner.game.setRuleString(select.options[select.selectedIndex].value);
			}.bind(this);
		},
		setupIntervalSelect: function(select) {
			select.options[0] = new Option('Max', '0');
			select.options[1] = new Option('Very Fast', '39');
			select.options[2] = new Option('Fast', '99');
			select.options[3] = new Option('Medium Fast', '199');
			select.options[4] = new Option('Medium', '332');
			select.options[5] = new Option('Medium Slow', '449');
			select.options[6] = new Option('Slow', '999');
			select.options[7] = new Option('Very Slow', '1999');
			select.selectedIndex = 0;
			this.options.interval = 0;
			select.onchange = function() {
				select.blur();
				var wasRunning = this.runner.isRunning;
				this.runner.stop();
				this.runner.interval = this.options.interval = parseInt(select.options[select.selectedIndex].value, 10);
				if (wasRunning) {
					this.runner.start();
				}
			}.bind(this);
		},
		setupBlockSizeSelect: function(select) {
			var idx = 0;
			for (var hw = 1; hw <= 20; hw++) {
				select.options[idx++] = new Option(hw+'x'+hw, hw);
			}
			select.selectedIndex = 5;
			this.options.blockSize = 6;
			select.onchange = function() {
				select.blur();
				var oldBlockSize = this.options.blockSize;
				this.options.blockSize = parseInt(select.options[select.selectedIndex].value, 10);
				this.options.width = Math.floor(this.options.div.offsetWidth / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
				this.options.height = Math.floor(this.options.div.offsetHeight / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
				this.runner.width = this.options.width;
				this.runner.height = this.options.height;
				this.runner.renderer.blockSize = {width:this.options.blockSize,height:this.options.blockSize};
				if (oldBlockSize > this.options.blockSize) {
					this.panRatio(this.options.blockSize / oldBlockSize * -0.5);
				}
				else {
					this.panRatio(oldBlockSize / this.options.blockSize * 0.25);
				}
				this.runner.renderer.drawGrid();
				this.runner.renderer.drawBoard();
			}.bind(this);
		},
		setupGridlinesSelect: function(select) {
			select.options[0] = new Option('On', '1');
			select.options[1] = new Option('Off', '0');
			this.options.useGridlines = 1;
			select.onchange = function() {
				var oldValue = this.options.useGridlines;
				this.options.useGridlines = !select.selectedIndex;
				this.runner.renderer.useGridlines = this.options.useGridlines;
//				if (this.options.useGridlines && !oldValue) {
//					this.panRatio((this.options.blockSize + 1) / 1);
//				}
//				else {
//					this.panRatio(-0.5 / (this.options.blockSize - 1));
//				}
				this.runner.renderer.drawGrid();
				this.runner.renderer.drawBoard();
				select.blur();
			}.bind(this);
		},
		setupStartButton: function(button) {
			button.value = 'Start \u25B6';
			button.onclick = function() {
				button.blur();
				if (this.runner.isRunning) {
					this.runner.stop();
					button.value = 'Start \u25B6';
				}
				else if (this.runner.game.numPoints == 0) {
					alert('Before starting, please choose a seed pattern or click squares to add cells.');
				}
				else {
					button.value = 'Pause \u2590\u2590';
					this.runner.start();
				}
			}.bind(this);
		},
		setupGridClick: function(div) {
			this.inMousedown = false;
			var drawAtCursor = function(evt) {
				var x = Math.floor(
					evt.pageX / 
					(this.options.blockSize + (this.options.gridlines ? 2 : 1))
				);
				var y = Math.floor(
					evt.pageY / 
					(this.options.blockSize + (this.options.gridlines ? 2 : 1))
				);
				if (evt.type == 'click' && this.runner.game.isAlive(x,y) && !this.inMousedown) {
					this.runner.game.removePoint(x,y);
				}
				else {
					this.runner.game.addPoint(x,y);
				}
				this.runner.renderer.draw();
			}.bind(this);
			div.onclick = drawAtCursor;
			div.onmousedown = function() {
				setTimeout(function(){this.inMousedown = true}.bind(this),500);
				div.onmousemove = drawAtCursor;
			}.bind(this);
			div.onmouseup = function() {
				setTimeout(function(){this.inMousedown = false}.bind(this),500);
				div.onmousemove = null;
			}.bind(this);
		},
		setupSaveButton: function(button) {
			button.onclick = function() {
				var points = this.runner.game.getPoints();
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
			}.bind(this);
		},
		setupResetButton: function(button) {
			button.onclick = function() {
				this.runner.stop();
				this.runner.game.reset();
				this.runner.renderer.draw();
			}.bind(this);
		},
		autoSize: function() {
			
		},
		panRatio: function(byRatio) {
			var byX = Math.round(this.runner.renderer.boardSize.x * byRatio,0);
			var byY = Math.round(this.runner.renderer.boardSize.y * byRatio,0);
			this.pan(byX, byY);
		},
		pan: function(byX, byY) {
			var newGrid = {};
			this.runner.game.getPoints().forEach(function(xy) {
				newGrid[(xy[0]-byX)+','+(xy[1]-byY)] = 1;
			});
			this.runner.game.grid = newGrid;
			if (!this.runner.isRunning) {
				this.runner.renderer.draw();
			}
		}
	};
}(typeof exports === 'undefined' ? this : exports));