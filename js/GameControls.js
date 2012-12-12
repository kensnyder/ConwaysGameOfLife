"use strict";

function GameControls(controls, board) {
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

GameControls.prototype = {
	setup: function() {
		this.setupSeedSelect(this.options.seedSelect);
		this.setupIntervalSelect(this.options.intervalSelect);
		this.setupBlockSizeSelect(this.options.blockSizeSelect);
		this.setupGridlinesSelect(this.options.gridlinesSelect);
		this.setupStartButton(this.options.startButton);
		this.setupGridClick(this.options.div);
		this.setupPan();
		this.options.width = Math.floor(this.options.div.offsetWidth / this.options.blockSize);
		this.options.height = Math.floor(this.options.div.offsetHeight / this.options.blockSize);
		this.createGameRunner();
	},
	createGameRunner: function() {
		this.runner = new GameRunner(this.options);
	},
	setupPan: function() {
		window.addEventListener('keyup', function(evt) {
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
		select.options[idx++] = new Option('Empty','');
		for (var pct = 10; pct < 100; pct += 10) {
			select.options[idx++] = new Option('Random board - '+pct+'% full', 'seed-0.'+pct);
		}
		for (var shape in GameShapes) {
			if (shape.match(/^[A-Z0-9_]/) && typeof GameShapes[shape] == 'object') {
				select.options[idx++] = new Option('Shape - ' + GameShapes[shape].name, 'addShape-'+shape);
			}
		}
		// add some from local storage
		select.selectedIndex = 0;
		select.onchange = function() {
			this.runner.stop();
			this.runner.reset();
			this.options.startButton.value = 'Start';
			var value = select.options[select.selectedIndex].value;
			if (value) {
				var parts = value.split('-');
				this.runner[parts[0]](parts[1]);
			}
			this.runner.renderer.draw();
		}.bind(this);
	},
	setupIntervalSelect: function(select) {
		select.options[0] = new Option('Max', '0');
		select.options[1] = new Option('~10fps', '95');
		select.options[2] = new Option('~5fps', '192');
		select.options[3] = new Option('~4fps', '245');
		select.options[4] = new Option('~3fps', '328');
		select.options[5] = new Option('~2fps', '495');
		select.options[6] = new Option('~1fps', '990');
		select.options[7] = new Option('~1/2fps', '1990');
		select.selectedIndex = 0;
		this.options.interval = 0;
		select.onchange = function() {
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
		select.selectedIndex = 9;
		this.options.blockSize = 10;
		select.onchange = function() {
			this.options.seedSelect.selectedIndex = 0;
			this.options.startButton.value = 'Start';
			this.options.blockSize = parseInt(select.options[select.selectedIndex].value, 10);
			this.options.width = Math.floor(this.options.div.offsetWidth / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
			this.options.height = Math.floor(this.options.div.offsetHeight / (this.options.blockSize + (this.options.gridlines ? 1 : 0)));
			this.runner.width = this.options.width;
			this.runner.height = this.options.height;
			this.runner.renderer.blockSize = {width:this.options.blockSize,height:this.options.blockSize};
			this.runner.renderer.drawGrid();
			this.runner.renderer.drawBoard();
			//this.createGameRunner();
		}.bind(this);
	},
	setupGridlinesSelect: function(select) {
		select.options[0] = new Option('On', '1');
		select.options[1] = new Option('Off', '0');
		select.onchange = function() {
			this.options.useGridlines = !select.selectedIndex;
			this.runner.renderer.useGridlines = this.options.useGridlines;
			this.runner.renderer.drawGrid();
			this.runner.renderer.drawBoard();
		}.bind(this);
	},
	setupStartButton: function(button) {
		button.value = 'Start';
		button.onclick = function() {
			if (this.runner.isRunning) {
				this.runner.stop();
				button.value = 'Start';
			}
			else if (this.runner.game.numPoints == 0) {
				alert('Before starting, please choose a seed pattern or click squares to add cells.');
			}
			else {
				button.value = 'Pause';
				this.runner.start();
			}
		}.bind(this);
	},
	setupGridClick: function(div) {
		div.onclick = function(evt) {
			var x = Math.floor(
				evt.pageX / 
				(this.options.blockSize + (this.options.gridlines ? 1 : 0))
			);
			var y = Math.floor(
				(evt.pageY - this.options.controls.offsetHeight) / 
				(this.options.blockSize + (this.options.gridlines ? 1 : 0))
			);
			if (this.runner.game.isAlive(x,y)) {
				this.runner.game.removePoint(x,y);
			}
			else {
				this.runner.game.addPoint(x,y);
			}
			this.runner.renderer.draw();
		}.bind(this);
	},
	pan: function(byX, byY) {
		var newGrid = {};
		this.runner.game.getPoints().forEach(function(xy) {
			newGrid[(xy[0]-byX)+','+(xy[1]-byY)] = 1;
		});
		this.runner.game.grid = newGrid;
	}
};



