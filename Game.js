function Game() {
	this.grid = [];
}

Game.prototype = {
	addPoint: function(x,y) {
		this.goingToUsePoint(x,y);
		this.grid[x][y] = 1;
	},
	isAlive: function(x,y) {
		return !!(this.grid[x] && this.grid[x][y]);
	},
	killAt: function(x, y) {
		this.goingToUsePoint(x, y)
		this.grid[x][y] = 0;
	},
	goingToUsePoint: function(x, y) {
		if (!this.grid[x]) 
			this.grid[x] = [];
	},
	shouldLive: function(cellx, celly) {
		var lives = false;
		for (var x = -1; x <= 1; x++) {
			for (var y = -1; y <= 1; y++) {
				//lives = t
			}
		}
		return lives;
	},
	countNeighbors: function(cellx, celly) {
		var num = 0;
		for (var x = cellx-1; x <= 1; x++) {
			for (var y = -1; y <= 1; y++) {
				//lives = t
			}
		}
		return num;
	},
	tick: function() {
		var x, y;
		for (x = 0; x < 10; x++) {
			for (y = 0; y < 10; y++) {
				
			}
			
		}
		this.grid = [];
	}
};



