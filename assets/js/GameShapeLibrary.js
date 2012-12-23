(function(exports) {
	"use strict";

	exports.GameShapeLibrary = [
		{
			id: 'CONWAYJS',
			name: 'conwayjs',
			desc: '',
			size: [58,9],
			rule: '1234/3',
			pos: 'middle-center',
			points: [[1,2],[3,2],[2,2],[0,3],[4,2],[5,2],[5,3],[6,3],[0,4],[0,5],[1,3],[1,4],[1,5],[1,6],[2,6],[3,6],[4,6],[5,6],[5,5],[6,5],[8,3],[8,4],[8,5],[9,6],[9,5],[9,4],[9,3],[9,2],[10,2],[11,2],[12,2],[10,6],[11,6],[13,6],[12,6],[13,2],[13,3],[13,4],[14,3],[14,4],[13,5],[14,5],[16,2],[16,3],[16,4],[16,5],[16,6],[17,2],[17,3],[17,4],[17,5],[17,6],[18,2],[19,2],[20,2],[20,3],[20,4],[20,5],[20,6],[21,6],[21,5],[21,4],[21,3],[23,2],[23,3],[23,4],[23,5],[24,2],[24,3],[24,4],[24,5],[24,6],[25,6],[26,5],[27,6],[28,6],[28,5],[28,4],[28,3],[28,2],[29,2],[29,3],[29,4],[29,5],[31,5],[32,4],[32,5],[32,6],[33,6],[34,6],[35,6],[37,6],[37,5],[37,4],[37,3],[36,2],[36,3],[36,4],[36,5],[36,6],[32,2],[33,2],[34,2],[35,2],[35,4],[34,4],[33,4],[39,2],[39,3],[39,4],[39,5],[40,2],[40,3],[40,4],[40,5],[40,6],[41,6],[42,6],[43,6],[44,6],[45,6],[45,2],[45,3],[45,4],[45,5],[45,7],[44,2],[44,3],[44,4],[40,8],[41,8],[43,8],[44,8],[42,8],[44,7],[44,5],[48,8],[47,8],[49,8],[49,7],[49,6],[49,5],[49,4],[49,3],[49,2],[48,2],[50,2],[50,3],[50,4],[50,5],[50,6],[50,7],[50,0],[49,0],[52,3],[53,3],[53,2],[54,2],[55,2],[56,2],[57,2],[53,4],[54,4],[55,4],[56,4],[57,4],[57,5],[58,5],[53,6],[54,6],[55,6],[56,6],[57,6]]
		},
		{
			id: 'C3SHIPS',
			name: 'C3 Ships',
			desc: '',
			size: [58,65],
			rule: 'B3678/S34678',
			rle: 'bo$bobo$bbo$bboboo$4boo$oob3o$4boo$bo$4boo$3bobo$3bobo$bboboo$bboobo$\
			bb3o$3b4o$bb4obo$bob3obo$b6o$3bobo$bboo$4bobo$bb6o$bb6o4$22boo$23bo$\
			19bo3bo3boo$18boob8o9boo$17b11obo3boob6o13boo$16b13obb11o7bo4b3o$15b\
			26o10b5obo$16b13obb11o7bo4b3o$17b11obo3boob6o13boo$18boob8o9boo$19bo3b\
			o3boo$23bo$22boo4$bb6o$bb6o$4bobo$bboo$3bobo$b6o$bob3obo$bb4obo$3b4o$\
			bb3o$bboobo$bboboo$3bobo$3bobo$4boo$bo$4boo$oob3o$4boo$bboboo$bbo$bobo\
			$bo'
		},
		{
			id: 'GLIDER',
			name: 'Glider',
			desc: '5-cell pattern that flies diagonally indefinitely',
			size: [3,3],
			rule: '23/3',
			pos: 'top-left',
			speed: 10,
			zoom: 5,
			points: [[0,1],[2,1],[2,2],[1,2],[2,0]]
		},
		{
			id: 'Bunnies',
			name: 'Bunnies',
			desc: 'Stabalizes at 17k generations',
			size: [8,4],
			rle: 'o5bob$2bo3bob$2bo2bobo$bobo'
		},
		{
			id: '18METH',
			name: '18-cell 40514-generation methuselah',
			desc: 'based on Richard Wobus\' 15-cell marvel',
			size: [78,54],
			rle: '77bo$77bo$77bo21$3o20$3bo$3bo$3bo5$20b3o$9b3o10bo$22bo$21bo'
		},
		{
			id: 'MOVE_GLIDER',
			name: 'Move Glider',
			desc: 'Glider for Move Rulestring',
			size: [4,4],
			pos: 'top-left',
			speed: 10,
			zoom: 8,
			points: [[0,1],[1,1],[0,0],[0,2],[1,0],[2,0]],
			rule: '245/368'
		},
		{
			id: 'LWSS',
			name: 'Lightweight Spaceship',
			desc: 'Small spaceship that flies horizontally indefinitely',
			size: [5,4],
			pos: 'middle-left',
			speed: 25,
			zoom: 12,
			points: [[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,3],[0,1],[0,3]]
		},
		{
			id: 'MWSS',
			name: 'Medium-Weight Spaceship',
			desc: 'Medium spaceship that flies horizontally indefinitely',
			size: [7,5],
			pos: 'middle-left',
			zoom: 12,
			points: [[2,4],[3,4],[4,4],[5,4],[6,4],[6,3],[6,2],[5,1],[1,3],[0,1],[3,0]]
		},
		{
			id: 'HWSS',
			name: 'Heavyweight Spaceship',
			desc: 'Large spaceship that flies horizontally indefinitely',
			size: [7,5],
			pos: 'middle-left',
			speed: 25,
			zoom: 12,
			points: [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[6,3],[6,2],[5,1],[0,3],[2,0],[3,0],[0,1]]
		},
		{
			id: 'PUFF_TRAIN',
			name: 'Puff Train',
			size: [5,18],
			pos: 'middle-left',
			speed: 25,
			zoom: 5,
			points: [[1,3],[0,2],[2,3],[3,0],[3,3],[4,2],[4,3],[4,1],[0,7],[1,8],[2,8],[2,9],[2,10],[1,11],[3,14],[4,15],[4,16],[4,17],[3,17],[1,17],[2,17],[0,16]]
		},
		{
			id: 'PULSAR',
			name: 'Pulsar Oscilator',
			size: [13,13],
			zoom: 20,
			speed: 2,
			points: [[5,4],[5,3],[5,2],[4,5],[2,5],[3,5],[7,4],[7,2],[7,3],[8,5],[9,5],[10,5],[10,7],[9,7],[8,7],[7,8],[7,9],[7,10],[5,8],[5,9],[5,10],[4,7],[3,7],[2,7],[0,8],[0,9],[0,10],[2,12],[3,12],[4,12],[8,12],[9,12],[10,12],[12,10],[12,9],[12,8],[12,3],[12,2],[12,4],[10,0],[9,0],[3,0],[2,0],[4,0],[0,4],[0,3],[0,2],[8,0]]
		},
		{
			id: 'RPENT',
			name: 'R-pentomino',
			size: [3,3],
			points: [[1,0],[2,0],[0,1],[1,1],[1,2]]
		},
		{
			id: 'DIEHARD',
			name: 'Diehard',
			size: [8,3],
			points: [[6,0],[0,1],[1,1],[1,2],[5,2],[6,2],[7,2]]
		},
		{
			id: 'ACORN',
			name: 'Acorn',
			size: [8,3],
			points: [[1,0],[4,1],[0,2],[1,2],[5,2],[6,2],[7,2]]
		},
		{
			id: 'SQUARE',
			name: '5x5 Square',
			size: [5,5],
			points: [[0,0],[1,0],[2,0],[4,0],[0,1],[3,2],[4,2],[1,3],[2,3],[4,3],[0,4],[2,4],[4,4]]
		},
		{
			id: 'BLOCK_LAYER',
			name: 'Block-Laying Switch Engine',
			size: [8,7],
			zoom: 4,
			pos: 'bottom-right',
			points: [[0,5],[2,5],[2,4],[4,3],[4,2],[4,1],[6,2],[6,0],[6,1],[7,1]]
		},
		{
			id: 'FLAT',
			name: 'Double Block Laying Switch Engine',
			size: [39,1],
			pos: 'middle-left',
			zoom: 1,
			grid: false,
			rule: '23/3',
			points: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[9,0],[10,0],[11,0],[12,0],[13,0],[17,0],[18,0],[19,0],[26,0],[27,0],[28,0],[29,0],[30,0],[31,0],[32,0],[34,0],[35,0],[36,0],[37,0],[38,0]]
		},
		{
			id: 'SHICK',
			name: 'Schick Engine',
			size: [9,9],
			zoom: 8,
			pos: 'middle-right',
			speed: 10,
			points: [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[4,1],[1,3],[4,3],[7,3],[8,3],[8,4],[7,4],[6,4],[7,5],[8,5],[4,5],[1,5],[0,6],[0,7],[0,8],[1,8],[2,8],[3,8],[4,7]]
		},
		{
			id: 'GOSPER',
			name: 'Gosper Glider Gun',
			size: [36,9],
			zoom: 8,
			pos: 'top-left',
			points: [[0,4],[0,5],[1,5],[1,4],[10,4],[10,5],[10,6],[11,3],[12,2],[11,7],[12,8],[13,8],[13,2],[14,5],[16,6],[16,5],[16,4],[15,3],[15,7],[17,5],[20,4],[20,3],[20,2],[21,2],[21,3],[21,4],[22,1],[22,5],[24,1],[24,0],[24,5],[24,6],[34,2],[35,2],[35,3],[34,3]]
		},
		{
			id: 'QSHUTTLE',
			name: 'Queen Bee Shuttle',
			size: [4,7],
			points: [[0,0],[1,0],[2,1],[3,2],[3,3],[3,4],[2,5],[1,6],[0,6]]
		},
		{
			id: 'PENTADECATHLON',
			name: 'Pentadecathlon Oscilator',
			size: [10,1],
			points: [[0,0],[1,0],[2,0],[3,0],[4,0],[6,0],[5,0],[7,0],[8,0],[9,0]]
		},
		{
			id: 'P200_ROCKET_GUN',
			name: 'Period 200 Rocket Gun',
			size: [17,33],
			rule: '34678/3678',
			pos: 'middle-left',
			zoom: 5,
			rle: '5b3obb3o$3b12o$b16o$b16o$3bo10bo$4b10o8$oob3o$7o$b7o$9o$b7o$7o$oob3o8$4b10o$3bo10bo$b16o$b16o$3b12o$5b3obb3o'
		},
		{
			id: 'P432_GLIDER_GUN',
			name: 'Period 432 Glider Gun',
			size: [113,78],
			rle: '75boo8boo24boo$74b4o7boo24boo$73bobobbo24boo$73boobbobo22bobbo$78bobo\
			18boobboo$80boo16b3o$51boo15boo9b3o16bobbo$51boo15boo8bobo16boobo$78b\
			oo17b5o$96bo4bo$66bo29b5o$65boo30boboo$64boobo28bobbo$97b3o$93boobboo$\
			61b3o28bobbo$60bobbo29boo$60bo24boo24boo$61bo23boo24boo3$59bo$60bo$57b\
			obbo$57b3o3$53boboo$54boo$54bo$61bo$60bo$51boo7b3o5boo$51boo15boo41bo$\
			109bobo$110boo6$o$3o$3bo$bboo39boo15boo$43boo15boo3$46bo$46boo$45boboo\
			3$49b3o$49bobbo$52bo$51bo3$oo24boo25bo$oo24boo24bo$8boo42bobbo$7bobbo\
			42b3o$8boobboo$12b3o$11bobbo41boobo$12boboo41boo$11b5o42bo$11bo4bo$12b\
			5o16boo$12boobo16bobo8boo15boo$13bobbo14b3o9boo15boo$13b3o15boo$14boo\
			bboo12bobo$17bobbo12bobobboo$18boo14bobbobo$oo24boo7b4o$oo24boo8boo'
		},
		{
			id: 'ROCKET_LOBE_ROCKET',
			name: 'Rocket - Lobe - Rocket',
			size: [66,52],
			rule: '34678/3678',
			pos: 'bottom-right',
			speed: 25,
			zoom: 4,
			rle: '4booboo36bo$3b6o6bo12boo14b3o$bbob4obo3b5o5boob6o13bo$b8obb7o3b11o13bo\
			$31o$b8obb7o3b11o13bo$bbob4obo3b5o5boob6o13bo$3b6o6bo12boo14b3o$4boob\
			oo36bo3$45bo$44b3o$43b5o$42b7o$41b9o$43b5o$44b3o$43b5o$44b3o$44b3o$43b\
			5o$43b5o$45bo4$29bo31bo$28boo15bo15boo$27b4obobboo6b5o6boobbob4o$26b\
			11o6b5o6b11o$25b13o4b7o4b13o$26b11o6b5o6b11o$27b4obobboo6b5o6boobbob4o\
			$28boo15bo15boo$29bo31bo4$45bo$43b5o$43b5o$44b3o$44b3o$43b5o$44b3o$43b\
			5o$41b9o$42b7o$43b5o$44b3o$45bo'
		},
		{
			id: 'SIDECAR_HWSS',
			name: 'Sidecar on HWSS',
			size: [235,142],
			zoom: 3,
			rle: '29bo$29bobo$12bo17bobo$12boo16bobbo3boo148bo$7boo4boo15bobo4boo147b4o$\
			3boobboo4b3o13bobo153boob4o5boo$3boobboo4boo7bobo4bo144boo8b3oboo3bo3b\
			obbo$12boo9boo149boo9booboo3bo7bo$12bo10bo162b5o3bo6bo6boo$187bo3b3o7b\
			o6boo$197bobbo$25boo170boo$26boo$25bo4bo154bo$31boo150boo$30boo152boo$\
			11bo$8b4o3boboo170boo$oo5b4o4boboboobboo21boo19boo119boo$oo5bobbo3boob\
			oboobbobo21bo19bo122bo9bo$7b4o3boo8b3o20bobo10bo4bobo5bo124bobo$8b4o3b\
			oo8b3o20boo9bobo3boo4b3o112boo9bobo11boo$11bo12b3o31bo3boo6bo115b3o7bo\
			bbo11boo$23bobo7boo23bo3boo6boo95boo19boobo5bobo$23boo8bobo22bo3boo\
			103bo20bobbo6bobo$35bo16bo6bobo93bo9bobo20boobo8bo$35boo16bo6bo92bobo\
			9boo11boo6b3o$51b3o92boo4bobo22bobo6boo$45bo100boo3bobbo15bo6bo$38boo\
			6boo17boo3boo80bobo13boo6boo$38bo6boo18bo5bo81bobo6bo6boo$29bo6bobo\
			116bo6bobo$29bobo4boo28bo3bo91boo9boo$12bo17bobo34b3o104bo$12boo16bobb\
			o140bobo9bo$7boo4boo15bobo142boo8boo$3boobboo4b3o13bobo43b6o103boo11b\
			oo$3boobboo4boo7bobo4bo44bo6bo101b3o7bo3b3o$12boo9boo10boo36bo8bo7bo\
			93boo5b4o4boobo$12bo10bo12boo36bo6bo6b3o94boobbo4bo4bobbo5boo$35bo29bo\
			9b6o6bo98bobbo3bo5boobo5boo$66boo19boo101boboo3b3o$65boo130boo$60bo94b\
			o23bo$30boo29boo90boo23boo$30boo28boo22b3o60bo6boo22bobobbobo$147bobo\
			33boo$16bobo65bobo60boo35bo$16bo3bo62b5o49boo$6boo12bo10boo49boo3boo\
			48boo$6boo8bo4bo7bobbo7bo41boo3boo109bo$20bo7bo7boo3bo143boobboo6b4o$\
			16bo3bo7bo6bo5bo52boo40bo43bobobbob4o5boobobo3boo$16bobo9bo7b5o43bo7bo\
			4bo37bobo40bo3bo3boboo5b3obobbobboo$29bobbo50bo7bo6bo37bo41bo12bo4boob\
			obo$31boo47bobobo5bo8bo33b3o35boo4bo4bo14b4o$81boo7bo8bo33bo14boo21boo\
			5bo19bo$80boo8bo8bo49bo28bo3bo$34boo39bo15bo6bo41bo8bobo5bo22bobo$34bo\
			bo39boo14bo4bo40boo10boo3b4o$22bo12b3o37boo17boo43boo13boboboo14boo$\
			19b4o3boo8b3o10bobo83bo17bobbob3o11bobbo$18b4o3boo8b3o11bo3bo80bo19bob\
			oboo11bo7b5o$11boo5bobbo3booboboobbobo16bo7bo72b3o18b4o12bo6bo5bo$11b\
			oo5b4o4boboboobboo13bo4bo4b4o87boo5bo5bo7bo7boo3bo$19b4o3boboo23bo4bob\
			oboo9boo75bobo9bo9bobbo7bo$22bo26bo3bo3bobbob3o8boo75bo11b3o9boo$49bob\
			o6boboboo$59b4o$23bo12bo24bo$23b3o11boo11bo44bo$26bo9boo12bobo40bobo\
			60boo$25boo23boo42boo60boo$90bo34bo$42boo47boo30boo43bo$43boo45boo32b\
			oo41bobo$43bob3o72bo34bobo8boboo10boo$41bobo3bo71bo30bo4bobbo6booboo\
			10boo$42booboo72b3o29boo5boo6boboo$146boo8bo3boo5bobo$27b3o116boo10boo\
			8bo$26bo3bo124bobbo$25bo5bo123bobo74boo$26bo3bo201bo$27b3o200bobo$27b\
			3o5bo194boo$35bobo4bo$24bo10boo4bobo$23bobo16boo$22bo3boo$11boo9bo3boo\
			204b3o$11boo9bo3boo203b3o$23bobo25b6o24b6o$24bo25bo5bo23bo5bo$56bo29bo\
			$50bo4bo24bo4bo145b3o$52boo28boo13bo134b3o$97boo$29boo65bobo$30bo46boo\
			$27b3o19bo27boo$27bo20boo50bo$48bobo16boo8bo20b3o$20boo45boo7bobo18bo$\
			20boo14bo39bobo18boo$36boo5bobo31bo$35bobo3b3ob3o$40bo7bo18b3o$40boo5b\
			oo18b3o4booboboo14bo$66bo3bo3bo5bo12booboo$65bo5bo3bo3bo$66bo3bo5b3o3b\
			o9bo5bo$20bo29bo16b3o12boo$19b3o5boo20b3o29bobo8booboboo$18b5o4boo20b\
			3o$17boo3boo40bo$35boo3boo5boo3boo9boo26boo$31boo3b5o6boo3boo9bobo25bo\
			bo$22boo6boo4booboo51bo$24bo7bo3booboo38bo12boo$21bo15b3o12boo25bo11b\
			3o$21bobbo27bobo23bobo10boo$20booboo29boo21booboo12bo$21boo30boo21bo5b\
			o$53boo11bo12bo$35b3o11b3o13b3o8boo3boo$19boo3boo9b3o26b5o24bo$19boo3b\
			oo8bo3bo24bobobobo22b3o$20b5o8bo5bo23boo3boo8bo12b5o$21bobo10bo3bo39bo\
			11boo3boo$35b3o11boo3boo21bo13b5o$21b3o42bo24bo3bo$50bo3bo10bobo24bobo\
			$51b3o11bobo11boo12bo$51b3o12bo12boo$66boo$66boo24boo$22boo42boo24boo$\
			22boo$51boo$36boo13boo$36boo'
		}
	];
	
}(typeof exports === 'undefined' ? this : exports));