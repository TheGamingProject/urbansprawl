var BUILDINGTEXTUREZ = [];

function loadBuildingTextures(){
	
	
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE] = [];
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][GRIDTYPE.GRASS] = {
		0: getImage("houses/houseGrassB"),
		1: {
			0: getImage("houses/houseGrassC1"),
			1: getImage("houses/houseGrassC2"),
			2: getImage("houses/houseGrassC3")
		}
	};
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][GRIDTYPE.TREES] = {
		0: getImage("houses/houseTreeB"),
		1: {
			0: getImage("houses/houseTreeC1"),
			1: getImage("houses/houseTreeC2"),
			2: getImage("houses/houseTreeC3")
		}
	};
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][GRIDTYPE.SWAMP] = {
		0: getImage("houses/houseSwampB"),
		1: {
			0: getImage("houses/houseSwampC1"),
			1: getImage("houses/houseSwampC2"),
			2: getImage("houses/houseSwampC3")
		}
	};
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][GRIDTYPE.HILLS] = {
		0: getImage("houses/houseHillB"),
		1: {
			0: getImage("houses/houseHillC1"),
			1: getImage("houses/houseHillC2"),
			2: getImage("houses/houseHillC3")
		}
	};
	BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][GRIDTYPE.NEARRIVER] = {//sameasgrass
		0: getImage("houses/houseGrassB"),
		1: {
			0: getImage("houses/houseGrassC1"),
			1: getImage("houses/houseGrassC2"),
			2: getImage("houses/houseGrassC3")
		}
	};


}

function TownCenter(){
	this.topleft;
	this.texture;
	this.type;
	this.built = false;
	
	this.draw = function(){
		return this.topleft;
	}
	this.getFirstBuildSpots = function(){
		var spots = [];
		//above
		spots.push(new point(this.topleft.x,this.topleft.y-1) );
		spots.push(new point(this.topleft.x+1,this.topleft.y-1) );
		spots.push(new point(this.topleft.x+2,this.topleft.y-1) );
		spots.push(new point(this.topleft.x+3,this.topleft.y-1) );
		//left
		spots.push(new point(this.topleft.x-1,this.topleft.y) );
		spots.push(new point(this.topleft.x-1,this.topleft.y+1) );
		spots.push(new point(this.topleft.x-1,this.topleft.y+2) );
		spots.push(new point(this.topleft.x-1,this.topleft.y+3) );
		//right
		spots.push(new point(this.topleft.x+4,this.topleft.y) );
		spots.push(new point(this.topleft.x+4,this.topleft.y+1) );
		spots.push(new point(this.topleft.x+4,this.topleft.y+2) );
		spots.push(new point(this.topleft.x+4,this.topleft.y+3) );
		//bottom
		spots.push(new point(this.topleft.x,this.topleft.y+4) );
		spots.push(new point(this.topleft.x+1,this.topleft.y+4) );
		spots.push(new point(this.topleft.x+2,this.topleft.y+4) );
		spots.push(new point(this.topleft.x+3,this.topleft.y+4) );
	
		return spots;
	}
	this.progressTurn = function(turn,force){
		if(turn <= this.deadturn && !force) return;
				
		this.deadturn = turn;
		return true;
	}
}

function Market(){
	this.topleft;
	this.texture;
	this.type;
	
	this.draw = function(){
		return this.topleft;
	}


}

function Hospital(){
	this.topleft;
	this.texture;
	this.type;
	
	this.draw = function(){
		return this.topleft;
	}

}

function Entertainment(){
	this.topleft;
	this.texture;
	this.type;
	
	this.draw = function(){
		return this.topleft;
	}

}
var TURNSTOBUILD = [];
TURNSTOBUILD[GRIDTYPE.GRASS] = 5;
TURNSTOBUILD[GRIDTYPE.TREES] = 6;
TURNSTOBUILD[GRIDTYPE.HILLS] = 6;
TURNSTOBUILD[GRIDTYPE.SWAMP] = 8;
TURNSTOBUILD[GRIDTYPE.NEARRIVER] = 4;

function House(){
	this.topleft;
	this.texture;
	this.textureNum;
	this.type;
	this.groundtype;
	
	this.currentTurn = 0; 
	this.TurnsToBuild;
	this.deadturn;//lastupdated
	
	this.entertained = false;
	
	this.start = function(groundtype,turn,nearMarket){
		this.groundtype = groundtype;
		this.deadturn = turn;
		
		this.TurnsToBuild = TURNSTOBUILD[groundtype];
	
		if(nearMarket)
			this.TurnsToBuild = Math.floor(this.TurnsToBuild/2);
	}
	
	this.draw = function(){
		return this.topleft;
	}

	this.progressTurn = function(turn,force){
		if(turn <= this.deadturn && !force) return;
		
		this.currentTurn++;
		if(this.currentTurn === 1){
			this.texture = BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][this.groundtype][0];
		}
		if(this.currentTurn === this.TurnsToBuild){
			this.texture = BUILDINGTEXTUREZ[BUILDTYPE.HOUSE][this.groundtype][1][this.textureNum];
		}
			
		this.deadturn = turn;
		
		return this.currentTurn >= this.TurnsToBuild;
	}
	
}
function Factory(){
	this.topleft;
	this.texture;
	this.type;
	
	this.currentTurn = 0; 
	this.deadturn;//lastupdated
	
	this.start = function(turn){
		this.deadturn = turn;
		
	}
	
	this.draw = function(){
		return this.topleft;
	}

	this.progressTurn = function(turn){
		if(turn <= this.deadturn) return;
				
		this.deadturn = turn;
		return true;
	}
}