function Game() {
	this.grid = [[]];
}

Game.prototype = {
	addPoint: function(x,y) {
		this.goingToUsePoint(x,y);
		this.grid[x][y] = 1;
	},
	isAlive: function(x,y) {
		return this.grid[x] && !!this.grid[x][y];
	},
	killAt: function(x, y) {
		this.goingToUsePoint(x, y)
		this.grid[x][y] = 0;
	},
	goingToUsePoint: function(x, y) {
		if (!this.grid[x]) 
			this.grid[x] = [];
	}
};



