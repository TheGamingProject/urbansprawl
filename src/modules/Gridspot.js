var GRIDTYPE = { GRASS: 0,
				 TREES: 1,
				 HILLS: 2,
				 SWAMP: 3,
				 MOUNTAINS: 4,
				 RIVER: 5,
				 NEARRIVER: 6,
				 VOLCANO: 7
}
var BUILDTYPE = { TC: 0,
				 MARKET: 1,
				 HOSPITAL: 2,
				 FACTORY: 3,
				 HOUSE: 4,
				 ENTERTAINMENT: 5,
}

var SPOTSIZE = 50;
var GRIDCOLORS = [];
GRIDCOLORS[GRIDTYPE.GRASS] = "#00FF00";
GRIDCOLORS[GRIDTYPE.TREES] = "#4D9126";
GRIDCOLORS[GRIDTYPE.HILLS] = "#C7BE3E";
GRIDCOLORS[GRIDTYPE.SWAMP] = "#3FDF9D";
GRIDCOLORS[GRIDTYPE.MOUNTAINS] = "#A1727A";
GRIDCOLORS[GRIDTYPE.RIVER] = "#3E3EC9";
GRIDCOLORS[GRIDTYPE.NEARRIVER] = "#00FFAA";

function Gridspot(container, spottype, coord){
	var model = new creatjs.Shape();
	var color
	
	switch(spottype){
		case GRIDTYPE.GRASS:
			color = "green";
			break;
		case GRIDTYPE.TREES:
			color = "brown";
			break;
		case GRIDTYPE.HILLS:
			color = "yellow";
			break;
	}
	
	
	model.graphics.beginFill(color).drawRectangle(coord.x*SPOTSIZE,coord.y*SPOTSIZE,SPOTSIZE,SPOTSIZE);
	container.addChild(model);
}

function initGridspot(container, spottype, coord){
	return new Gridspot(container, spottype, coord);
}