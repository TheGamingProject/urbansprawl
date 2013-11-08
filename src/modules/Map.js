var GRIDSIZE = 24;
var VIEWSIZE = 12;
var TILESIZE = 50;


function Map(){
	this.grid;
}

function initMap(){
	var x=0,y=0;
	map = new Map();
	
	map.grid = [];
	for(y=0;y<GRIDSIZE;y++){
		map.grid[y] = [];
		for(x=0;x<GRIDSIZE;x++){
			var r = Math.round(Math.random()*2);
			map.grid[y][x] = initGridspot(container,r,{"x":x,"y":y});
		}
	}
}

Map.prototype.moveMap = function moveMap(){


}

