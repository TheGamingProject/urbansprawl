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

function gridspot(spottype){
	this.spottype = spottype;
	this.basetexture;
	this.bigtexture;//true if its a mountain or something?
	this.entertained = false;
	this.polluted = false;

	this.draw = function(context,gridx,gridy){
		if(this.basetexture){
		
			if(this.bigtexture){
				context.drawImage(this.basetexture,gridx * SPOTSIZE, gridy * SPOTSIZE,this.basetexture.width*2,this.basetexture.height*2+1);
			}else{
				context.drawImage(this.basetexture, 0,0,
					25,50,gridx * SPOTSIZE, gridy * SPOTSIZE - 50,50,101);
			}
		}else{
			if(this.spottype === GRIDTYPE.MOUNTAINS) return;
			context.fillStyle = GRIDCOLORS[this.spottype];
			context.fillRect(gridx * SPOTSIZE, gridy * SPOTSIZE, 50, 50);
		}
	}
}