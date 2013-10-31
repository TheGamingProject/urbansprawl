var TURNTIME = 1250;
var DEBUGGING = false;
var FASTFORWARDSPEED = 2;

var BUILDINGCOST = [];
BUILDINGCOST[BUILDTYPE.TC] = 10000;
BUILDINGCOST[BUILDTYPE.MARKET] = 500;
BUILDINGCOST[BUILDTYPE.HOSPITAL] = 1000;
BUILDINGCOST[BUILDTYPE.FACTORY] = 3000;
BUILDINGCOST[BUILDTYPE.ENTERTAINMENT] = 750;
BUILDINGCOST[BUILDTYPE.HOUSE] = -1;

var BUILDINGTEXTURES = [];
var NOBUILD; 
var CLOCK;
var SIR;

var HOUSEWORTH = [];
HOUSEWORTH[GRIDTYPE.GRASS] = 4;
HOUSEWORTH[GRIDTYPE.TREES] = 6.5;
HOUSEWORTH[GRIDTYPE.HILLS] = 7.5;
HOUSEWORTH[GRIDTYPE.SWAMP] = 2.5;
HOUSEWORTH[GRIDTYPE.RIVER] = 5;
HOUSEWORTH[GRIDTYPE.NEARRIVER] = 5;

var HOUSEDESC = [];
HOUSEDESC[GRIDTYPE.GRASS] = "rent: "+HOUSEWORTH[GRIDTYPE.GRASS]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.GRASS];
HOUSEDESC[GRIDTYPE.TREES] = "rent: "+HOUSEWORTH[GRIDTYPE.TREES]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.TREES];
HOUSEDESC[GRIDTYPE.HILLS] = "rent: "+HOUSEWORTH[GRIDTYPE.HILLS]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.HILLS];
HOUSEDESC[GRIDTYPE.SWAMP] = "rent: "+HOUSEWORTH[GRIDTYPE.SWAMP]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.SWAMP];
HOUSEDESC[GRIDTYPE.RIVER] = "rent: "+HOUSEWORTH[GRIDTYPE.NEARRIVER]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.NEARRIVER];
HOUSEDESC[GRIDTYPE.NEARRIVER] = "rent: "+HOUSEWORTH[GRIDTYPE.NEARRIVER]
		+" buildtime: "+TURNSTOBUILD[GRIDTYPE.NEARRIVER];
HOUSEDESC[GRIDTYPE.MOUNTAINS] = "in the mountains...";
HOUSEDESC[GRIDTYPE.VOLCANO] = "it's getting hot in here";

function getBuildingSize(b){
	switch(b){
		case BUILDTYPE.TC:
			return new point(4,4);
			break;
		case BUILDTYPE.FACTORY:
		case BUILDTYPE.ENTERTAINMENT:
		case BUILDTYPE.HOSPITAL:
		case BUILDTYPE.MARKET:
			return new point(2,2);
			break;
		case BUILDTYPE.HOUSE:
			return new point(1,1);
			break;
	}
}

//
var HOSPITALUPKEEP_TIER1 = 40;//pop 20 or under spawns 3
var HOSPITALUPKEEP_TIER2 = 60;//pop 40 or under spawns 2
var HOSPITALUPKEEP_TIER3 = 70;//pop 50 or under spawns 1

var TURNSPERHOUSEPICK = 3;
var TOWNCENTER_POINTZ = 6;
var HOUSESTOBUILD = 3;//per towncenter

var MARKETRADIUS = 4;
var MARKETBONUS = 11;

var ENTERTAINMENTRADIUS = 3;
var ENTERTAINMENTBONUS = 2; //spotincome * this

var FACTORYINCOME = BUILDINGCOST[BUILDTYPE.FACTORY] / 20;
var FACTORYRADIUS = 3;
var POLLUTED_MP_DEBUFF_PERCENT = .25;//becomes 25% of original

var INCOMEDISPLAY = 500;//ms

var GREENTRAN, UIBG, YELLOWTRAN;
var HELPOVERLAY, MSG_BANKRUPT, MSG_FULLPOP, MSG_START;
var PLAY, FASTFORWARD;

var OURGREEN = "#60B890";
var OURRED = "#A82028";

var STARTINGCASH = BUILDINGCOST[BUILDTYPE.TC] + 500;

function loadGamePlayContent(){
	NOBUILD = getImage("nonBuildable");
	BUILDINGTEXTURES[BUILDTYPE.TC] = {
		0: getImage("buildings/buildingTownCenter1"),
		1: getImage("buildings/buildingTownCenter2"),
		2: getImage("buildings/buildingTownCenter3")
	};
	BUILDINGTEXTURES[BUILDTYPE.MARKET] = {
		0: getImage("buildings/buildingMarket1"),
		1: getImage("buildings/buildingMarket2"),
		2: getImage("buildings/buildingMarket3")
	};
	BUILDINGTEXTURES[BUILDTYPE.HOSPITAL] = {
		0: getImage("buildings/buildingHospital1"),
		1: getImage("buildings/buildingHospital2"),
		2: getImage("buildings/buildingHospital3")
	};
	
	BUILDINGTEXTURES[BUILDTYPE.ENTERTAINMENT] = {
		0: {
			0: getImage("buildings/statue1"),
			1: getImage("buildings/statue2"),
			2: getImage("buildings/statue3")
		},
		1: {
			0: getImage("buildings/bar1"),
			1: getImage("buildings/bar2"),
			2: getImage("buildings/bar3")
		},
		2: {
			0: getImage("buildings/movieTheater1"),
			1: getImage("buildings/movieTheater2"),
			2: getImage("buildings/movieTheater3")
		}
	};
	BUILDINGTEXTURES[BUILDTYPE.FACTORY] = {
		0: getImage("buildings/buildingFactory1"),
		1: getImage("buildings/buildingFactory2"),
		2: getImage("buildings/buildingFactory3")
	};

	BUILDINGTEXTURES[BUILDTYPE.HOUSE] = []; 
	BUILDINGTEXTURES[BUILDTYPE.HOUSE][GRIDTYPE.GRASS] = getImage("houses/houseGrassA");
	BUILDINGTEXTURES[BUILDTYPE.HOUSE][GRIDTYPE.TREES] = getImage("houses/houseTreeA"),
	BUILDINGTEXTURES[BUILDTYPE.HOUSE][GRIDTYPE.SWAMP] = getImage("houses/houseSwampA"),
	BUILDINGTEXTURES[BUILDTYPE.HOUSE][GRIDTYPE.HILLS] = getImage("houses/houseHillA"),
	BUILDINGTEXTURES[BUILDTYPE.HOUSE][GRIDTYPE.NEARRIVER] = getImage("houses/houseGrassA")//grass

	GREENTRAN = getImage("blueTransparent"); 
	PURPTRAN = getImage("purpleTransparent");
	YELLOWTRAN = getImage("yellowTransparent");
	
	UIBG = getImage("ui/rightSideUI");
	CLOCK = getImage("ui/timer");
	
	HELPOVERLAY = getImage("ui/helpOverlay");
	MSG_BANKRUPT = getImage("ui/msgBankrupt");
	MSG_FULLPOP = getImage("ui/msgFullyPopulated");
	MSG_START = getImage("ui/msgStart");
	TRYAGAIN = getImage("ui/tryagainBlue");
	
	PLAY = getImage("ui/play");
	FASTFORWARD = getImage("ui/ff");
	
	SIR = getImage("sir-jarlsberg");
}
	
function GamePlay(){
	//UI
	this.myMiniMap;
	this.viewport = new point(GRIDSIZE/2 - VIEWSIZE/2,GRIDSIZE/2 - VIEWSIZE/2);
	
	this.towncenter_button = new rect(600,184,200,38);
	this.market_button = new rect(600,226,200,38);//42
	this.hospital_button = new rect(600,268,200,38);
	this.factory_button = new rect(600,310,200,38);
	this.entertainment_button = new rect(600,352,200,38);
	this.tryagainRect = new rect(300-125,428,250,63);
	this.playff_button = new rect(600+7,25,23,16);

	
	this.displayincome;
	//GAME vars
	this.myMap;
	this.buildMap;//building map
	this.mysteryMap;
	
	this.gameover = false;
	this.cash = STARTINGCASH;
	this.upkeep = 0;
	this.turn = 0;
	this.turnP = 0;
	this.entertainmentcost = BUILDINGCOST[BUILDTYPE.ENTERTAINMENT];//doubles
	
	this.placing = -1;//not placing any
	this.selected = -1;
	this.selectedTer = -1;
	
	this.towncenters = [];
	this.markets = [];
	this.hospitals = [];
	this.entertainments = [];
	this.factorys = [];
	
	this.focusmarket;
	
	this.population = 0;
	this.spawning;
	this.income = 0;
	
	this.housetotals = [];
	this.housetotals[GRIDTYPE.GRASS] = 0;
	this.housetotals[GRIDTYPE.TREES] = 0;
	this.housetotals[GRIDTYPE.SWAMP] = 0;
	this.housetotals[GRIDTYPE.HILLS] = 0;
	this.housetotals[GRIDTYPE.NEARRIVER] = 0;
	
	this.fastforward = false;
	this.toggleSpeed = function(){
		this.fastforward = !this.fastforward;
	}
	
	this.update = function(elapsed,controls,lastcontrols){
		//if(this.turn > 200) return;
	VIEWSIZE, GRIDSIZE
		if(!this.viewport)
			this.viewport = new point(GRIDSIZE/2 - VIEWSIZE/2,GRIDSIZE/2 - VIEWSIZE/2);
		this.myMap.update(contr,oldcontr,this.viewport);

		if(this.fastforward) elapsed *= FASTFORWARDSPEED;
		if(this.towncenters.length > 0) this.turnP += elapsed;
		if(!this.gameover && this.turnP > TURNTIME){			
			//--------------TURN LOGIC-------------
			console.log("do turn "+this.turn);
			
			//this.upkeep = Math.floor(.01* this.turn * this.population + 10);
			//this.upkeep = this.towncenters.length * BUILDINGCOST[BUILDTYPE.TC] * .03
			this.upkeep = this.hospitals.length * BUILDINGCOST[BUILDTYPE.HOSPITAL] * .10 
					+ this.markets.length * BUILDINGCOST[BUILDTYPE.MARKET] * .05;
				
			this.upkeep += BUILDINGCOST[BUILDTYPE.TC] * .01;
			this.upkeep += (this.towncenters.length-1) * BUILDINGCOST[BUILDTYPE.TC] * .05;
			
			if(this.factorys.length > 0){//factory upkeep
				this.upkeep += BUILDINGCOST[BUILDTYPE.FACTORY] * .10;
				this.upkeep += (this.factorys.length-1) * BUILDINGCOST[BUILDTYPE.FACTORY] * .25;			}
					
			var extra;
			if(this.turn > 1){
				extra = .20 * this.turn * this.population;//.5 * Math.pow(this.turn,2);	
				this.upkeep += extra;
			}
			var ex2 = 0;
			if(this.turn > 250){
				ex2 = ((this.population)/10+ Math.pow(this.turn,1.20)) * 4 ;
			}else if(this.turn > 185){
				ex2 = ((this.population)/10+ Math.pow(this.turn,1.23)) * 4 ;
			}else if(this.turn > 125){
				ex2 = ((this.population)/10+ Math.pow(this.turn,1.33)) * 4 ;
			}else if(this.turn > 50){
				ex2 = ((this.population)/10+ Math.pow(this.turn,1.35)) * 4 ;
			}else if(this.turn > 25){
				ex2 =this.population * 25;
			}
			
			var w = {
				1:"buildingupkeep"+this.upkeep,
				2:"firstupkeep: "+extra,
				3:"secondupkeep:"+ex2,
				4:"incomeperturn: "+this.income
				
			};
			setWords(w);
			
			this.upkeep += ex2;
			this.income = 0;
			//update/logic for buildings (lets rid this? -what?)
			for(var y = 0; y<GRIDSIZE ;y++){
				for(var x = 0; x<GRIDSIZE ;x++){
					var b = this.buildMap[x][y];
					if(b === -1) continue;
					if(b.topleft.x === x && b.topleft.y === y){
						this.updateBuilding(b);
					}
				}
			}
			//make money
			this.cash += Math.floor(this.income);
			this.displayer = INCOMEDISPLAY;
			
			//every 10 turns
			if(this.turn != 0 && this.turn % 10 === 0){
				this.addCash(-this.upkeep);
				this.displayerU = 1000;
			}
			
			
			if(this.cash < 0 ){
				this.cash = 0;
				this.gameover = true;
				playSound("Bankrupt");
			}
			//this.updateMysteryPoints();
			
			this.turn++;
			this.turnP -= TURNTIME;
			//--------------END TURN LOGIC -----------------------
		}
		
		
	}
	this.updateBuilding = function(building){
		if(!building) return;
		switch(building.type){
			case BUILDTYPE.TC:
			
				if(!building.built){//starting set
					var v = building.getFirstBuildSpots();
					v = this.validateHouseSpots(v);
					console.log(v);
					var picks = getUniqueNumbers(HOUSESTOBUILD,v.length);
					//make these real
					for(var i in picks){
						var coord = v[picks[i]];
						var h = this.createNewHouse(coord);
						
					}
					
					building.built = true;
				}
				if(building.progressTurn(this.turn) && this.turn > 0 
						&& this.turn % TURNSPERHOUSEPICK === 0){
					var picks = this.getMysteryHousePick(this.spawning);
					//make these real
					for(var i in picks){
						var coord = picks[i];
						var h = this.createNewHouse(coord);
					}
				}
			
				break;
			case BUILDTYPE.HOUSE:
				if(building.progressTurn(this.turn)){
					//get paid, in main turn thing now
					var rent = Number(this.getWorth(building.topleft));
					
					if(this.myMap.mapgrid[building.topleft.x][building.topleft.y].polluted)
						rent *= POLLUTED_MP_DEBUFF_PERCENT;
					 this.income += rent;
				}
				
				break;
			case BUILDTYPE.HOSPITAL:
				//do nothing?
			
			break;
			case BUILDTYPE.FACTORY:
				if(building.progressTurn(this.turn)){
					//get paid, in main turn thing now
					 this.income += FACTORYINCOME;
				}
				
				break;
		}
	
	}
	//happens once per update
	this.updateMysteryPoints = function(){
		this.mm = true;
		this.mysteryMap = new Array(GRIDSIZE);
		for(var i = 0;i<GRIDSIZE;i++){
			this.mysteryMap[i] = new Array(GRIDSIZE);
			for(var j=0;j<GRIDSIZE;j++){
				//figure out pointz
				var pointz = 0;
				
				//check houses
				var top;
					try{ top= this.buildMap[i][j - 1].type === BUILDTYPE.HOUSE ||
							this.buildMap[i][j - 1].type === BUILDTYPE.TC;
					}catch(e){top = false;}
					var bot;
					try{ bot= this.buildMap[i][j + 1].type === BUILDTYPE.HOUSE ||
							this.buildMap[i][j + 1].type === BUILDTYPE.TC;
					}catch(e){bot = false;}
					var lef;
					try{ lef= this.buildMap[i -1][j].type === BUILDTYPE.HOUSE ||
							this.buildMap[i -1][j].type === BUILDTYPE.TC;
					}catch(e){lef = false;}
					var rig;
					try{ rig= this.buildMap[i + 1][j].type === BUILDTYPE.HOUSE ||
							this.buildMap[i + 1][j].type === BUILDTYPE.TC;
					}catch(e){rig = false;}
				if(top) pointz += 2;
				if(bot) pointz += 2;
				if(lef) pointz += 2;
				if(rig) pointz += 2;
				
				
				
				//check accross river
					//3 accross,4 directional
				var rbot;
				try{ rbot = this.myMap.mapgrid[i][j + 1].spottype === GRIDTYPE.RIVER &&
						this.buildMap[i-1][j + 2].type === BUILDTYPE.HOUSE &&
						this.buildMap[i][j + 2].type === BUILDTYPE.HOUSE &&
						this.buildMap[i+1][j + 2].type === BUILDTYPE.HOUSE;
					}catch(e){rbot = false;}
				var rtop;
				try{ rtop = this.myMap.mapgrid[i][j - 1].spottype === GRIDTYPE.RIVER &&
						this.buildMap[i-1][j - 2].type === BUILDTYPE.HOUSE &&
						this.buildMap[i][j - 2].type === BUILDTYPE.HOUSE &&
						this.buildMap[i+1][j - 2].type === BUILDTYPE.HOUSE;
					}catch(e){rbot = false;}
				var rlef;
				try{ rlef = this.myMap.mapgrid[i-1][j].spottype === GRIDTYPE.RIVER &&
						this.buildMap[i-2][j - 1].type === BUILDTYPE.HOUSE &&
						this.buildMap[i-2][j].type === BUILDTYPE.HOUSE &&
						this.buildMap[i-2][j + 1].type === BUILDTYPE.HOUSE;
					}catch(e){rbot = false;}
				var rrig;
				try{ rrig = this.myMap.mapgrid[i+1][j].spottype === GRIDTYPE.RIVER &&
						this.buildMap[i+2][j - 1].type === BUILDTYPE.HOUSE &&
						this.buildMap[i+2][j].type === BUILDTYPE.HOUSE &&
						this.buildMap[i+2][j + 1].type === BUILDTYPE.HOUSE;
					}catch(e){rbot = false;}
				
				if(rtop) pointz += 1;
				if(rbot) pointz += 1;
				if(rlef) pointz += 1;
				if(rrig) pointz += 1;
				
				if(!(top || bot || lef | rig
					|| rtop || rbot || rlef | rrig))
					continue;
				var tcpoints = 0;
				//check tc's
				for(var z in this.towncenters){
					var a = TOWNCENTER_POINTZ - this.getDumbDistance(this.towncenters[z].topleft,new point(i,j));
					if(a > 0){
						tcpoints += a;
					}
				}
				if(pointz > 0){
					pointz += tcpoints;
				}
				else
					pointz = 0;//not near any other houses
				//terrain
				switch(this.myMap.mapgrid[i][j].spottype){
					case GRIDTYPE.TREES:
						pointz +=4;break;
					case GRIDTYPE.HILLS:
						pointz +=4;break;
					case GRIDTYPE.NEARRIVER:
						pointz +=6;break;
					
				}
				
				//check markets
				for(var m in this.markets){
					m = this.markets[m].topleft;
					
					if(m.x - (MARKETRADIUS/2) <= i  && i < m.x + (MARKETRADIUS/2+2) &&
							m.y - (MARKETRADIUS/2) <= j  && j < m.y + (MARKETRADIUS/2+2) ){
						pointz += MARKETBONUS;
					}
				}
				if(this.myMap.mapgrid[i][j].polluted)
					pointz = Math.ceil(pointz*POLLUTED_MP_DEBUFF_PERCENT);
				
				this.mysteryMap[i][j] = pointz;
			}
		}
		
	}
	this.draw = function(context,elapsed,controls){		this.myMap.draw(context,0,this.viewport,this.buildMap);
		//draw building overlay
		for(var y = -3; y<VIEWSIZE ;y++){
			for(var x = -3; x<VIEWSIZE ;x++){	
			try{
				//this just gets the drawspot
				var building = this.buildMap[this.viewport.x + x][this.viewport.y + y];
				if(building === -1) continue;
				var p = building.draw();
				var sz = getBuildingSize(building.type);
				if(p.x === this.viewport.x + x && p.y === this.viewport.y + y){

					context.drawImage(building.texture,(p.x - this.viewport.x)*TILESIZE ,
							(p.y - this.viewport.y)*TILESIZE-TILESIZE, 								sz.x*TILESIZE,sz.y*TILESIZE + TILESIZE);
				}
			}catch(e){}//do nothing, because its just grabbing to far up
			}
		}
		//draw placing
		if(this.placing != -1){
			//draw w/e building hovering
			var a = new point(Math.floor(controls.mouse.x/TILESIZE),Math.floor(controls.mouse.y/TILESIZE));
			var p = new point(a.x*TILESIZE,a.y*TILESIZE - TILESIZE);
			if(p.x < TILESIZE*VIEWSIZE){
				var sz = getBuildingSize(this.placing);
				var sa;
				
				if(this.placing === BUILDTYPE.HOSPITAL)
					sa = this.isHospitalSpotAvail(new point(a.x+this.viewport.x,a.y+this.viewport.y),
						sz.x,sz.y);
				else if(this.placing === BUILDTYPE.FACTORY)
					sa = this.isFactorySpotAvail(new point(a.x+this.viewport.x,a.y+this.viewport.y),
						sz.x,sz.y);
				else
					sa = this.isSpotAvail(new point(a.x+this.viewport.x,a.y+this.viewport.y),
						sz.x,sz.y);
				
				var t;
				if(this.placing != BUILDTYPE.ENTERTAINMENT)
					t = BUILDINGTEXTURES[this.placing][0];
				else
					t = BUILDINGTEXTURES[this.placing][this.currentEntertainment][0];
					
				//option overlays
				if(this.placing === BUILDTYPE.MARKET){
					var m = a;
					context.drawImage(GREENTRAN,(m.x - MARKETRADIUS/2)*TILESIZE,
							(m.y - MARKETRADIUS/2)*TILESIZE,
							(MARKETRADIUS+2)*TILESIZE,(MARKETRADIUS+2)*TILESIZE);
				}
				if(this.placing === BUILDTYPE.ENTERTAINMENT){
					for(var y = 0; y<GRIDSIZE ;y++){
						for(var x = 0; x<GRIDSIZE ;x++){
							m = a;
							
							var d = new point(0,0);
									if(m.x > x)
										d.x = Math.abs(m.x+1 -x);
									else
										d.x = Math.abs(m.x -x);
									if(m.y > y)
										d.y = Math.abs(m.y+1 -y);
									else
										d.y = Math.abs(m.y -y)
							
							if(m.x - (ENTERTAINMENTRADIUS) <= x  && x < m.x + (ENTERTAINMENTRADIUS+2) &&
									m.y - (ENTERTAINMENTRADIUS) <= y  && y < m.y + (ENTERTAINMENTRADIUS+2) 
									
									){
								if(!((d.x ===(ENTERTAINMENTRADIUS+1) && d.y ===(ENTERTAINMENTRADIUS+1)))){
								
									context.drawImage(GREENTRAN,x*TILESIZE,y*TILESIZE);
								}
							}
						}
					}
				}
				if(this.placing === BUILDTYPE.FACTORY){
					var m = a;
					context.drawImage(YELLOWTRAN,(m.x - FACTORYRADIUS)*TILESIZE,
							(m.y - FACTORYRADIUS)*TILESIZE,(FACTORYRADIUS*2+2)*TILESIZE,
							(FACTORYRADIUS*2+2)*TILESIZE);
				}
				context.drawImage(t,p.x,p.y,
						sz.x*TILESIZE,sz.y*TILESIZE + TILESIZE);
				if(!sa){
					context.drawImage(NOBUILD,p.x, p.y + TILESIZE, sz.x*TILESIZE, sz.y*TILESIZE);
				}
			}
		}
		//debug overlay

		if(this.mm && DEBUGGING)
		for(var y = 0; y<VIEWSIZE ;y++){
			for(var x = 0; x<VIEWSIZE ;x++){
				context.font = "bold 12px Georgia";
				context.fillStyle = '#000000';
				var vx = x + this.viewport.x;
				var vy = y + this.viewport.y;
				
				if(this.mysteryMap[vx][vy])
					context.fillText(this.mysteryMap[vx][vy],x*TILESIZE +10 ,y*TILESIZE +10);
			}
		}
		//draw market selected?
		if(this.selected === BUILDTYPE.MARKET || this.placing === BUILDTYPE.MARKET){
			for(var m in this.markets){
				var m = this.markets[m].topleft;
				context.drawImage(GREENTRAN,(m.x - this.viewport.x- MARKETRADIUS/2)*TILESIZE,
						(m.y - this.viewport.y - MARKETRADIUS/2)*TILESIZE,(MARKETRADIUS+2)*TILESIZE,
						(MARKETRADIUS+2)*TILESIZE);
			}
		}
		//draw entertainment overlay
		if(this.selected === BUILDTYPE.ENTERTAINMENT || this.placing === BUILDTYPE.ENTERTAINMENT){
			for(var j = 0; j<VIEWSIZE ;j++){
				for(var i = 0; i<VIEWSIZE ;i++){
					var x = this.viewport.x + i;
					var y = this.viewport.y + j;
				
					if(this.myMap.mapgrid[x][y].entertained){
						context.drawImage(PURPTRAN,i*TILESIZE,j*TILESIZE);
					}
				}
			}
		}
		//draw factories overlay
		if(this.selected === BUILDTYPE.FACTORY || this.placing === BUILDTYPE.FACTORY
				|| this.placing === BUILDTYPE.HOSPITAL){
			for(var j = 0; j<VIEWSIZE ;j++){
				for(var i = 0; i<VIEWSIZE ;i++){
					var x = this.viewport.x + i;
					var y = this.viewport.y + j;
				
					if(this.myMap.mapgrid[x][y].polluted){
						context.drawImage(YELLOWTRAN,i*TILESIZE,j*TILESIZE);
					}
				}
			}
		}
		
		//draw sidestuff
		//minimap
		this.myMiniMap.draw(context,600,400,this.myMap,this.viewport,this.buildMap);
		//bg
		context.drawImage(UIBG,600,0,200,600);
		//clock
		if(this.turnP <= TURNTIME && this.turn > 0){
			var cl = Math.floor((this.turnP / TURNTIME)*8);
			context.drawImage(CLOCK,54*cl,0,54,54,600+20,30,54,54);
		}
		//top text
		context.font = "16pt Conv_alterebro-pixel-font";
		context.fillStyle = '#FFFFFF';
		context.fillText(""+Math.floor(this.cash),600+113,54);
		context.font = "14pt Conv_alterebro-pixel-font";
		context.fillText("POP:"+this.population,600+79,32);
		//landtypes desc HOUSEDESC
		if(this.selectedTer != -1){
			context.font = "12pt Conv_alterebro-pixel-font";
			switch(this.selectedTer){
				case GRIDTYPE.GRASS:
					context.fillText("GRASS",600+8,162);
					break;
				case GRIDTYPE.TREES:
					context.fillText("TREES",600+46,159);
					break;
				case GRIDTYPE.NEARRIVER:
					context.fillText("RIVER",600+88,159);
					break;
				case GRIDTYPE.SWAMP:
					context.fillText("SWAMP",600+126,159);
					break;
				case GRIDTYPE.HILLS:
					context.fillText("HILLS",600+164,162);
					break;
			}
			context.font = "14pt Conv_alterebro-pixel-font";
			
			//landtype info
			if(this.selectedTer != GRIDTYPE.RIVER){
				if(this.selectedText && this.selectedText != -1)
					context.fillText(""+this.selectedText,600+38,171);
				else
					context.fillText(""+HOUSEDESC[this.selectedTer],600+38,171);
			}
		}
		// play/ff button
		if(this.fastforward)
			context.drawImage(FASTFORWARD,this.playff_button.x,this.playff_button.y);
		else
			context.drawImage(PLAY,this.playff_button.x,this.playff_button.y);
			
		//income text flash
		this.displayer -= elapsed;
		if(this.displayer > 0){
			context.font = "16pt Conv_alterebro-pixel-font";
			context.fillStyle = OURGREEN;
			context.fillText("+ $"+Math.floor(this.income),600+146,34);
		}
		//upkeep text flash
		this.displayerU -= elapsed;
		if(this.displayerU > 0){
			context.font = "16pt Conv_alterebro-pixel-font";
			context.fillStyle = OURRED;
			context.fillText("+ $"+Math.floor(this.upkeep),600+146,60);
		}
		context.font = "16pt Conv_alterebro-pixel-font";
		//hospital
		//var spawning;//= HOUSESTOBUILD;//this.towncenters.length*HOUSESTOBUILD
		var color;
		var s;
		/*
		if(this.population < HOSPITALUPKEEP_TIER1 * (this.hospitals.length+1)){
			this.spawning = 3;
		}else
			this.spawning = 0;
		s = this.spawning +" - "+ this.population +"/" + (HOSPITALUPKEEP_TIER1 * (this.hospitals.length+1));
		*/
		if(this.population < HOSPITALUPKEEP_TIER1 * (this.hospitals.length+1)){
			color = OURGREEN;
			this.spawning = HOUSESTOBUILD;
			this.spawning *= this.towncenters.length;
			s = this.spawning +" - "+ this.population +"/" + (HOSPITALUPKEEP_TIER1 * (this.hospitals.length+1));
		}else if(this.population < HOSPITALUPKEEP_TIER2 * (this.hospitals.length+1) ){
			color = "#FFFF00";
			this.spawning = HOUSESTOBUILD - 1;
			this.spawning *= this.towncenters.length;
			s = this.spawning +" - "+ this.population +"/" + (HOSPITALUPKEEP_TIER2 * (this.hospitals.length+1));
		}else if(this.population < HOSPITALUPKEEP_TIER3 * (this.hospitals.length+1) ){
			color = OURRED;
			this.spawning = HOUSESTOBUILD - 2;
			this.spawning *= this.towncenters.length;
			s = this.spawning +" - "+ this.population +"/" + (HOSPITALUPKEEP_TIER3 * (this.hospitals.length+1));
		}else{
			color = "#AAAAAA";
			this.spawning = 0;
			this.spawning *= this.towncenters.length;
			s = this.spawning +" - "+ this.population +"/" + (HOSPITALUPKEEP_TIER3 * (this.hospitals.length+1));
		}
		
		context.fillStyle = color;
		context.fillText(s,600+113,74);
		//upkeep
		context.fillStyle = '#FFFFFF';
		context.fillText(""+Math.floor(this.upkeep),600+113,94);
		//landtypes 
		if(this.turn > 0)
			context.fillText("Turn: "+(this.turn-1), 620, 100);
		context.font = "20pt Conv_alterebro-pixel-font";
		context.fillText(""+this.housetotals[GRIDTYPE.GRASS],600+20,138);
		context.fillText(""+this.housetotals[GRIDTYPE.TREES],600+58,138);
		context.fillText(""+this.housetotals[GRIDTYPE.NEARRIVER],600+96,138);
		context.fillText(""+this.housetotals[GRIDTYPE.SWAMP],600+134,138);
		context.fillText(""+this.housetotals[GRIDTYPE.HILLS],600+174,138);
		
		//buttons 
			//change text on the buttons here
		context.font = "20pt Conv_alterebro-pixel-font";
		if(this.cash - BUILDINGCOST[BUILDTYPE.TC] < 0){
			context.fillStyle = '#DC143C';
		}else if(this.cash - BUILDINGCOST[BUILDTYPE.TC] - this.upkeep <= 0){
			context.fillStyle = '#F8B820';//if you have enough but not after upkeep
		}else if(this.cash >= BUILDINGCOST[BUILDTYPE.TC]){
			context.fillStyle = OURGREEN;;//if you have enough
		}
		context.fillText("$"+BUILDINGCOST[BUILDTYPE.TC],600+114,208);
		if(this.cash - BUILDINGCOST[BUILDTYPE.MARKET] < 0){
			context.fillStyle = '#DC143C';
		}else if(this.cash - BUILDINGCOST[BUILDTYPE.MARKET] - this.upkeep <= 0){
			context.fillStyle = '#F8B820';
		}else if(this.cash >= BUILDINGCOST[BUILDTYPE.MARKET]){
			context.fillStyle = OURGREEN;;
		}
		context.fillText("$"+BUILDINGCOST[BUILDTYPE.MARKET],600+114,245);
		if(this.cash - BUILDINGCOST[BUILDTYPE.HOSPITAL] < 0){
			context.fillStyle = '#DC143C';
		}else if(this.cash - BUILDINGCOST[BUILDTYPE.HOSPITAL] - this.upkeep <= 0){
			context.fillStyle = '#F8B820';
		}else if(this.cash >= BUILDINGCOST[BUILDTYPE.HOSPITAL]){
			context.fillStyle = OURGREEN;;
		}
		context.fillText("$"+BUILDINGCOST[BUILDTYPE.HOSPITAL],600+114,290);
		if(this.cash - BUILDINGCOST[BUILDTYPE.FACTORY] < 0){
			context.fillStyle = '#DC143C';
		}else if(this.cash - BUILDINGCOST[BUILDTYPE.FACTORY] - this.upkeep <= 0){
			context.fillStyle = '#F8B820';
		}else if(this.cash >= BUILDINGCOST[BUILDTYPE.FACTORY]){
			context.fillStyle = OURGREEN;;
		}
		context.fillText("$"+BUILDINGCOST[BUILDTYPE.FACTORY],600+114,330);
		if(this.cash - this.entertainmentcost < 0){
			context.fillStyle = '#DC143C';
		}else if(this.cash - this.entertainmentcost - this.upkeep <= 0){
			context.fillStyle = '#F8B820';
		}else if(this.cash >= this.entertainmentcost){
			context.fillStyle = OURGREEN;;
		}
		context.fillText("$"+this.entertainmentcost,600+114,372);
		//building numbers
		context.font = "22pt Conv_alterebro-pixel-font";
		context.fillStyle = "#000000";
		context.fillText(""+this.towncenters.length,600+175, 209);
		context.fillText(""+this.markets.length,600+175, 252);
		//context.fillStyle = color;//make this match the other color for spawning
		context.fillText(""+this.hospitals.length,600+175, 290);
		context.fillStyle = "#000000";
		context.fillText(""+this.factorys.length,600+175, 331);
		context.fillText(""+this.entertainments.length,600+175, 373);
		
		
		//start msg
		if(this.turn === 1)
			context.drawImage(MSG_START,0,0);
		//gameover msgs
		if(this.gameover){
			if(this.gameover === "win")
				context.drawImage(MSG_FULLPOP,0,0);
			else
				context.drawImage(MSG_BANKRUPT,0,0);
				
			//draw try again box
			context.drawImage(TRYAGAIN,this.tryagainRect.x,this.tryagainRect.y);
		}
		
		if(DEBUGGING){
			context.fillStyle = "#000000";
			context.fillText("x"+this.viewport.x +" y"+this.viewport.y,20, 20);
			if(this.heldstart)
				context.fillText("start x"+this.heldstart.x +" y"+this.heldstart.y,20, 40);
			if(this.heldprog)
				context.fillText("prog x"+this.heldprog.x +" y"+this.heldprog.y,20, 60);
			
		}
	}
	
	this.startMap = function(){
		this.myMap = new Map();
		this.myMap.loadcontent();//this should be static?
		this.myMap.generate();
		
		this.myMiniMap = new MiniMap();
		
		this.buildMap = new Array(GRIDSIZE);
		for(var i = 0;i<GRIDSIZE;i++){
			this.buildMap[i] = new Array(GRIDSIZE);
			for(var j=0;j<GRIDSIZE;j++){
				this.buildMap[i][j] = -1;//nothing
			}
		}
		this.turn = 0;
	}
	this.heldstart;
	this.helddown = false;
	this.heldprog;
	
	this.onClick = function(e){
		var cell = getCursorPosition(canvas,e);

		if(cell.x < 600){
			this.helddown = true;
			this.heldstart = cell;
			this.heldprog = new point(0,0);
		
			//not placing, but selecting for infos :)
			var p = new point(Math.floor(cell.x/50) +this.viewport.x,
					Math.floor(cell.y/50)+this.viewport.y);
			
			this.selected = this.selectedTer = this.selectedText = -1;
			
			var v = false
			if(this.buildMap[p.x][p.y] != -1){
				
				if(this.selected != this.buildMap[p.x][p.y].type)
					this.selected = this.buildMap[p.x][p.y].type;
				else
					this.selected = -1;
				if(this.buildMap[p.x][p.y].type === BUILDTYPE.HOUSE){
					v = true;
				}
			}else{
				v = true;
			}
			if(v){
				this.selectedTer = this.myMap.mapgrid[p.x][p.y].spottype;
					if(this.selectedTer != GRIDTYPE.VOLCANO &&
							this.selectedTer != GRIDTYPE.RIVER &&
							this.selectedTer != GRIDTYPE.MOUNTAINS){
						this.selectedText = "Revenue: "+this.getWorth(p)
							+" Buildtime: "+TURNSTOBUILD[this.selectedTer];
					}
			}
		
		}else{
			//check buttons
			if(isPointInRect(cell, this.towncenter_button)){
				if(this.placing === BUILDTYPE.TC)
					this.placing = -1;
				else if(this.cash >= BUILDINGCOST[BUILDTYPE.TC]){
					this.placing = BUILDTYPE.TC;
				}
			}
			if(isPointInRect(cell, this.market_button)){
				if(this.placing === BUILDTYPE.MARKET)
					this.placing = -1;
				else if(this.cash >= BUILDINGCOST[BUILDTYPE.MARKET]){
					this.placing = BUILDTYPE.MARKET;
				}
			}
			if(isPointInRect(cell, this.hospital_button)){
				if(this.placing === BUILDTYPE.HOSPITAL)
					this.placing = -1;
				else if(this.cash >= BUILDINGCOST[BUILDTYPE.HOSPITAL]){
					this.placing = BUILDTYPE.HOSPITAL;
				}
			}
			if(isPointInRect(cell, this.entertainment_button)){
				if(this.placing === BUILDTYPE.ENTERTAINMENT)
					this.placing = -1;
				else if(this.cash >= BUILDINGCOST[BUILDTYPE.ENTERTAINMENT]){
					this.placing = BUILDTYPE.ENTERTAINMENT;
				}
			}
			if(isPointInRect(cell, this.factory_button)){
				if(this.placing === BUILDTYPE.FACTORY)
					this.placing = -1;
				else if(this.cash >= BUILDINGCOST[BUILDTYPE.FACTORY]){
					this.placing = BUILDTYPE.FACTORY;
				}
			}
		}
		
		//if in minimap
		if(cell.x > 600 && cell.y > 400){
			this.miniClicked = true;
			this.viewport = this.myMiniMap.moveViewport(new point(cell.x - 600,cell.y - 400));
		}
	}
	this.miniClicked = false;
	this.onMouseMove = function(e){
		var cell = e;
		
		if(e.x < 0 || e.x > 600 || e.y < 0 || e.y > 600)//should we disable this durning placing?
			this.helddown = false;
		
		if(this.helddown && !(cell.x == this.heldstart.x && cell.y == this.heldstart.y) ){
			//record movement
			this.heldprog.x += this.heldstart.x - cell.x;
			this.heldprog.y += this.heldstart.y - cell.y;
			//process movmenet
			var vx = Math.floor(this.heldprog.x /50);
			if(vx != 0){
				this.viewport.x += vx;
				if(this.viewport.x < 0)
					this.viewport.x = 0;
				if(this.viewport.x > 12)
					this.viewport.x = 12;
				
				this.heldprog.x -= vx*50;
			}
			var vy = Math.floor(this.heldprog.y /50);
			if(vy != 0){
				this.viewport.y += vy;
				if(this.viewport.y < 0)
					this.viewport.y = 0;
				if(this.viewport.y > 12)
					this.viewport.y = 12;
					
				this.heldprog.y -= vy*50;
			}
			this.heldstart = cell;
		}
		
		if(cell.x > 600 && cell.y > 400 && this.miniClicked)
			this.viewport = this.myMiniMap.moveViewport(new point(cell.x - 600,cell.y - 400));
	}
	this.onRelease = function(e){
		this.helddown = false;
		var cell = getCursorPosition(canvas,e);
		
		if(!this.gameover && this.placing != -1 && cell.x < 600){//build it!
			var p = new point(Math.floor(cell.x/50) +this.viewport.x,Math.floor(cell.y/50)+this.viewport.y);
			//place but check if its all grass
			this.tryPlaceHere(p);
		}
		if(isPointInRect(cell, this.playff_button))
			this.toggleSpeed();
		
		if(this.gameover){
			if(isPointInRect(cell, this.tryagainRect)){
				resetGame();//should this be here? the other file should have main control
			}
		}
		//if(cell.x > 600 && cell.y > 400)
		//	this.viewport = this.myMiniMap.moveViewport(new point(cell.x - 600,cell.y - 400));
		this.miniClicked = false;	
		
	}
	this.startMap();
	
	//tryplacehere will place it and take money
	this.tryPlaceHere = function(spot){
		//for towncenter, we want 4x4 of grass
		var sz = getBuildingSize(this.placing);
		switch(this.placing){
			case BUILDTYPE.TC:
				//check spots
				var sa = this.isSpotAvail(spot,sz.x,sz.y);
				if(!sa) return false;
				//place
				var b = new TownCenter();
				b.texture = BUILDINGTEXTURES[BUILDTYPE.TC][getRandom(0,2)];

				b.topleft = spot;
				b.type = BUILDTYPE.TC;
				
				if(this.towncenters.length === 0){//fixing delayed start
					this.turnP = TURNTIME;
					playSound("Launch");
				}else
					playSound("BuildTc");
				this.towncenters.push(b);
				
				for(var y = spot.y; y<spot.y+sz.y ;y++){
					for(var x = spot.x; x<spot.x+sz.x ;x++){
						this.buildMap[x][y] = b;
					}
				}
				break;
			case BUILDTYPE.MARKET:
				//check spots
				var sa = this.isSpotAvail(spot,sz.x,sz.y);
				if(!sa) return false;
				//place
				var b = new Market();
				b.texture = BUILDINGTEXTURES[BUILDTYPE.MARKET][getRandom(0,2)];
				b.topleft = spot;
				b.type = BUILDTYPE.MARKET;
				for(var y = spot.y; y<spot.y+sz.y ;y++){
					for(var x = spot.x; x<spot.x+sz.x ;x++){
						this.buildMap[x][y] = b;
					}
				}
				this.markets.push(b);
				playSound("BuildMar");
				break;
			case BUILDTYPE.HOSPITAL://
				//check spots
				var sa = this.isHospitalSpotAvail(spot);
				if(!sa) return false;
				//place
				var b = new Hospital();
				b.texture = BUILDINGTEXTURES[BUILDTYPE.HOSPITAL][getRandom(0,2)];
				b.topleft = spot;
				b.type = BUILDTYPE.HOSPITAL;
				for(var y = spot.y; y<spot.y+sz.y ;y++){
					for(var x = spot.x; x<spot.x+sz.x ;x++){
						this.buildMap[x][y] = b;
					}
				}
				this.hospitals.push(b);
				playSound("BuildHos");
				break;
			case BUILDTYPE.ENTERTAINMENT:
				//check spots
				var sa = this.isSpotAvail(spot,sz.x,sz.y);
				if(!sa) return false;
				//place
				var b = new Entertainment();
				//rotate textures (statue,bar,movietheatre
				var color = getRandom(0,2);
				b.texture = BUILDINGTEXTURES[BUILDTYPE.ENTERTAINMENT][this.currentEntertainment][getRandom(0,2)];
				this.currentEntertainment = (this.currentEntertainment+1) % 3;
				b.topleft = spot;
				b.type = BUILDTYPE.ENTERTAINMENT;
				for(var y = spot.y; y<spot.y+sz.y ;y++){
					for(var x = spot.x; x<spot.x+sz.x ;x++){
						this.buildMap[x][y] = b;
					}
				}
				//make ground entertained
				for(var y = 0; y<GRIDSIZE ;y++){
				for(var x = 0; x<GRIDSIZE ;x++){
					m = b.topleft;
					
					var d = new point(0,0);
							if(m.x > x)
								d.x = Math.abs(m.x+1 -x);
							else
								d.x = Math.abs(m.x -x);
							if(m.y > y)
								d.y = Math.abs(m.y+1 -y);
							else
								d.y = Math.abs(m.y -y)
					
					if(m.x - (ENTERTAINMENTRADIUS) <= x  && x < m.x + (ENTERTAINMENTRADIUS+2) &&
							m.y - (ENTERTAINMENTRADIUS) <= y  && y < m.y + (ENTERTAINMENTRADIUS+2) 
							
							){
						if(!((d.x ===(ENTERTAINMENTRADIUS+1) && d.y ===(ENTERTAINMENTRADIUS+1)))){
						
							this.myMap.mapgrid[x][y].entertained = true;
						}
					}
				}}
				playSound("BuildEnt");
				this.entertainments.push(b);

				break;
			case BUILDTYPE.FACTORY:
				//check spots
				var sa = this.isFactorySpotAvail(spot,sz.x,sz.y);
				if(!sa) return false;
				//place
				var b = new Factory();
				b.start(this.turn);
				//rotate textures (statue,bar,movietheatre
				var color = getRandom(0,2);
				b.texture = BUILDINGTEXTURES[BUILDTYPE.FACTORY][getRandom(0,2)];
				b.topleft = spot;
				b.type = BUILDTYPE.FACTORY;
				for(var y = spot.y; y<spot.y+sz.y ;y++){
					for(var x = spot.x; x<spot.x+sz.x ;x++){
						this.buildMap[x][y] = b;
					}
				}
				//make ground polluted
				for(var y = 0; y<GRIDSIZE ;y++){
				for(var x = 0; x<GRIDSIZE ;x++){
					m = b.topleft;
					
					
					if(m.x - (FACTORYRADIUS) <= x  && x < m.x + (FACTORYRADIUS+2) &&
							m.y - (FACTORYRADIUS) <= y  && y < m.y + (FACTORYRADIUS+2) ){

						this.myMap.mapgrid[x][y].polluted = true;

					}
				}}
				playSound("BuildFac");
				this.factorys.push(b);

				break;
		}
		//take money
		if(this.placing === BUILDTYPE.ENTERTAINMENT){
			this.addCash(-this.entertainmentcost);
			this.entertainmentcost *= 2;
		}else
			this.addCash(-BUILDINGCOST[this.placing]);
		this.placing = -1;
	}
	this.currentEntertainment = 0;
	
	this.isSpotAvail = function(spot,sizex,sizey){
		for(var y = spot.y; y<spot.y+sizey ;y++){
			for(var x = spot.x; x<spot.x+sizex ;x++){
				try{//catches outof bounds
					if((this.myMap.mapgrid[x][y].spottype != GRIDTYPE.GRASS &&
						this.myMap.mapgrid[x][y].spottype != GRIDTYPE.NEARRIVER
						&& this.myMap.mapgrid[x][y].spottype != GRIDTYPE.TREES)
							|| this.buildMap[x][y] != -1)
						return false;
				}catch(e){return false;}
			}
		}
		return true;
	}
	this.createNewHouse = function(coord){
		var h = new House;
		h.topleft = coord;
		h.type = BUILDTYPE.HOUSE;
		h.textureNum = getRandom(0,2);
		var ter = this.getGridTerrain(coord);
		h.texture = BUILDINGTEXTURES[BUILDTYPE.HOUSE][ter];
		this.housetotals[ter]++;
		this.population++;
		
		h.start(ter,this.turn,this.areAjacentMarkets(coord));
		if(i === "1")//one starts ahead
			h.progressTurn(this.turn,true);
			
		this.buildMap[coord.x][coord.y] = h;
		
			
		return h;
	}
	this.isHouseSpotAvail = function(spot){

		try{//catches outof bounds
			if(this.myMap.mapgrid[spot.x][spot.y].spottype === GRIDTYPE.RIVER ||
					this.myMap.mapgrid[spot.x][spot.y].spottype === GRIDTYPE.MOUNTAINS
					|| this.myMap.mapgrid[spot.x][spot.y].spottype === GRIDTYPE.VOLCANO
					|| this.buildMap[spot.x][spot.y] != -1)
				return false;
		}catch(e){return false;}

		return true;
	}
	this.isHospitalSpotAvail = function(spot){
		if(!this.isSpotAvail(spot,2,2)  ){
		
			return false;
		}
		var spots = [];//two of these have to be houses
		//above
		try{spots.push(new point(spot.x,spot.y-1) ); }catch(e){}
		try{spots.push(new point(spot.x+1,spot.y-1) );}catch(e){}
		//left
		try{spots.push(new point(spot.x-1,spot.y) );}catch(e){}
		try{spots.push(new point(spot.x-1,spot.y+1) );}catch(e){}
		//right
		try{spots.push(new point(spot.x+2,spot.y) );}catch(e){}
		try{spots.push(new point(spot.x+2,spot.y+1) );}catch(e){}
		//bottom
		try{spots.push(new point(spot.x,spot.y+2) );}catch(e){}
		try{spots.push(new point(spot.x+1,spot.y+2) );}catch(e){}
		
		//check if in pollution
		if(this.myMap.mapgrid[spot.x][spot.y].polluted ||
				this.myMap.mapgrid[spot.x][spot.y+1].polluted ||
				this.myMap.mapgrid[spot.x+1][spot.y].polluted ||
				this.myMap.mapgrid[spot.x+1][spot.y+1].polluted){
			return false;
		}
		
		var nearby = 0;
		for(var i in spots){
			var v = spots[i];
			try{if(this.buildMap[v.x][v.y] != -1 && this.buildMap[v.x][v.y].type === BUILDTYPE.HOUSE){
				nearby++;
			}}catch(e){}
		}
		if(nearby < 1){
			return false;
		}
		
		return true;
	}
	this.isFactorySpotAvail = function(spot){
		if(!this.isSpotAvail(spot,2,2)  ){
			return false;
		}
		//make ground entertained
		var m = spot;
		for(var y = m.y - (FACTORYRADIUS); y< m.y + (FACTORYRADIUS+2) ;y++){
		for(var x = m.x - (FACTORYRADIUS); x< m.x + (FACTORYRADIUS+2) ;x++){
			try{
			if(this.myMap.mapgrid[x][y].polluted || this.buildMap[x][y].type === BUILDTYPE.HOSPITAL){
				return false;
			}
			}catch(e){}
		}}
		
		
		return true;
	}
	this.validateHouseSpots = function(array){
		var arr = [];
	
		for(var a in array){
			var p = array[a];
			//check if its available spot
			if(this.isHouseSpotAvail(p))
				arr.push(p);
		}	
		
		return arr;
	}
	this.getGridTerrain = function(point){
		return this.myMap.mapgrid[point.x][point.y].spottype;
	}
	
	this.getWorth = function(point){
		var v = HOUSEWORTH[this.myMap.mapgrid[point.x][point.y].spottype];
		
		if(isNaN(v)) 
			throw "ohhh";
		if(this.myMap.mapgrid[point.x][point.y].entertained) 
			v *= ENTERTAINMENTBONUS;
		return v;
	}
	this.getDumbDistance = function(pt1,pt2){
		return Math.abs(pt1.x-pt2.x) + Math.abs(pt1.y-pt2.y)
	}
	this.stopPlacing = function(){
		this.placing = -1;
	}
	this.getMysteryHousePick = function(amt){
		//this.mysteryMap[i][j]
		this.updateMysteryPoints();
		
		var theHat = [];//the hat lol
		var uniques = [];
		for(var i = 0;i<GRIDSIZE;i++){
			for(var j=0;j<GRIDSIZE;j++){
				if(this.isHouseSpotAvail(new point(i,j)))
					for(var a=0;a<this.mysteryMap[i][j];a++){
						var p = new point(i,j);
						theHat.push(p);
						uniques[i+"_"+j] = p;
					}	
			}
		}
		//now draw from the hat
		//var picks

		var arr = [], unilen = 0;
		for(var u in uniques){
			arr.push(uniques[u]);
			unilen++;
		}
		
		if(unilen === 0){
			this.gameover = "win";
			playSound("PopCap");
			return [];//end game?
		}else if(unilen <= amt){//end of game?
			
			return arr;
		}else{
			do{
				picks = getUniqueNumbers(amt,theHat.length);
				
				//make these real
				var arr = [];
				for(var i in picks){
					arr.push( theHat[picks[i]] );
				}
				
			}while(!checkUniqueness(arr));
			console.log("PICKS: "+arr);
		}
		return arr;
	}
	this.areAjacentMarkets = function(point){
		try{ top= this.buildMap[i][j - 1].type === BUILDTYPE.MARKET;
		}catch(e){top = false;}
		var bot;
		try{ bot= this.buildMap[i][j + 1].type === BUILDTYPE.MARKET;
		}catch(e){bot = false;}
		var lef;
		try{ lef= this.buildMap[i -1][j].type === BUILDTYPE.MARKET;
		}catch(e){lef = false;}
		var rig;
		try{ rig= this.buildMap[i + 1][j].type === BUILDTYPE.MARKET;
		}catch(e){rig = false;}
		
		return top || bot || lef || rig;
	}
	this.addCash = function(amt){
		this.cash += amt;
		if( isNaN(this.cash))
			throw "wtf";
	}
}
//not efficient
function checkUniqueness(picks){
	for(var i in picks)
		for(var j in picks)
			if(i != j && picks[i].x === picks[j].x && picks[i].y === picks[j].y){
				//debugger;
				return false;
			}
	return true;
}
