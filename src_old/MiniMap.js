var MINIMAPTEXTURES = [];
var MINMAPBUILDINGS = [];



function loadMiniMapStuff(){
	MINIMAPTEXTURES[GRIDTYPE.GRASS] = getImage("ui/minimap/grass");
	MINIMAPTEXTURES[GRIDTYPE.TREES] = getImage("ui/minimap/tree");
	MINIMAPTEXTURES[GRIDTYPE.HILLS] = getImage("ui/minimap/hill");
	MINIMAPTEXTURES[GRIDTYPE.SWAMP] = getImage("ui/minimap/swamp");
	MINIMAPTEXTURES[GRIDTYPE.RIVER] = getImage("ui/minimap/river");
	MINIMAPTEXTURES[GRIDTYPE.NEARRIVER] = getImage("ui/minimap/grass");//grass
	MINIMAPTEXTURES[GRIDTYPE.VOLCANO] = getImage("ui/minimap/volcano");
	MINIMAPTEXTURES[GRIDTYPE.MOUNTAINS] = getImage("ui/minimap/mountain");
	
	MINMAPBUILDINGS[BUILDTYPE.TC] = getImage("ui/minimap/towncenter");
	MINMAPBUILDINGS[BUILDTYPE.HOSPITAL] = getImage("ui/minimap/hospital");
	MINMAPBUILDINGS[BUILDTYPE.MARKET] = getImage("ui/minimap/market");
	MINMAPBUILDINGS[BUILDTYPE.HOUSE] = getImage("ui/minimap/house");
	MINMAPBUILDINGS[BUILDTYPE.ENTERTAINMENT] = getImage("ui/minimap/entertainment");
	MINMAPBUILDINGS[BUILDTYPE.FACTORY] = getImage("ui/minimap/factory");
}

function MiniMap(){

	this.update = function(){

		

		return 
	}
	//this is 200x200
	this.draw = function(context,spotx,spoty,map,viewport,buildingmap){
		context.fillStyle = "#000000";
		context.fillRect(spotx, spoty, 200, 200);
		
		for(var y = 0; y<GRIDSIZE ;y++){
			for(var x = 0; x<GRIDSIZE ;x++){
				//context.fillStyle = GRIDCOLORS[map.mapgrid[x][y].spottype];
				//context.fillRect(spotx + x * 8 + 4, spoty+ y * 8 + 4, 8, 8);
				context.drawImage(MINIMAPTEXTURES[map.mapgrid[x][y].spottype],
						spotx + x * 8 + 4, spoty+ y * 8 + 4);	
			}
		}
		for(var y = 0; y<GRIDSIZE; y++){
			for(var x = 0; x<GRIDSIZE; x++){
				try{if(buildingmap[x][y].topleft.x != x || buildingmap[x][y].topleft.y != y ) 
					continue;
				context.drawImage(MINMAPBUILDINGS[buildingmap[x][y].type],
						spotx + x * 8 + 4, spoty+ y * 8 + 4);}catch(e){}	
			}
		}
		//draw viewbox
		context.strokeStyle = "#000000";
		context.strokeRect(spotx + viewport.x * 8 + 4, spoty + viewport.y * 8  + 4, 8 * 12, 8 * 12);
		
	}

	this.moveViewport = function(clickpoint){
		clickpoint.x -= 4;
		clickpoint.y -= 4;
		var gridpoint = new point(Math.floor(clickpoint.x/8) - 6,Math.floor(clickpoint.y/8) - 6);

		if(gridpoint.x < 0)
			gridpoint.x = 0;
		if(gridpoint.y < 0)
			gridpoint.y = 0;
		if(gridpoint.x > 12)
			gridpoint.x = 12;
		if(gridpoint.y > 12)
			gridpoint.y = 12;
			
		return gridpoint;
	}

}