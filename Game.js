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
		for (var x = -1; x <= 1; x++) {
			
		}
		return false;
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



