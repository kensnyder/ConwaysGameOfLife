var Game = require('./Game.js').Game;
var game = new Game();
var pent = [[0,0],[1,0],[2,0],[3,0],[4,0],[6,0],[5,0],[7,0],[8,0],[9,0]];
var puffTrain = [[1,3],[0,2],[2,3],[3,0],[3,3],[4,2],[4,3],[4,1],[0,7],[1,8],[2,8],[2,9],[2,10],[1,11],[3,14],[4,15],[4,16],[4,17],[3,17],[1,17],[2,17],[0,16]];
var shape = puffTrain;
shape.forEach(function(xy) {
	game.addPoint(xy[0], xy[1]);
});
var start = +new Date;
var i = 500;
while (--i) {
	game.tick();
}
console.log(+new Date - start);