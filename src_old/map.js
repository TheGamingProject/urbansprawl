var GRIDSIZE = 24;
var VIEWSIZE = 12;
var TILESIZE = 50;


function Map(){
	
	this.mapgrid;//is a double array [][]
	
	
	this.tiletextures;
	this.loadcontent = function(){
		this.tiletextures = {
			grass1: getImage("envGrass1"),
			grass2: getImage("envGrass2"),
			grass3: getImage("envGrass3"),
			tree1: getImage("envTree1"),
			tree2: getImage("envTree2"),
			tree3: getImage("envTree3"),
			hills1: getImage("envHill1"),
			hills2: getImage("envHill2"),
			hills3: getImage("envHill3"),
			swamp1: getImage("envSwamp1"),
			swamp2: getImage("envSwamp2"),
			swamp3: getImage("envSwamp3"),
			
			riverBR: getImage("envRiverBR"),
			riverLB: getImage("envRiverLB"),
			riverLR: getImage("envRiverLR"),
			riverLT: getImage("envRiverLT"),
			riverTB: getImage("envRiverTB"),
			riverTR: getImage("envRiverTR"),
			
			volcano: getImage("envVolcano"),
			greenVolcano: getImage("envVolcanoGrn"),
			mountains: getImage("envMountain1"),
			mountains2x4: getImage("envMountain2x4"),
			mountains4x2: getImage("envMountain4x2")
		};
	}
	
	this.volcanoLoc;
	this.volcanoSprite;
	
	//-------------GENERATE ZONE---------------
	this.generate = function(){
		this.mapgrid = new Array(GRIDSIZE);
		for(var i = 0;i<GRIDSIZE;i++){
			this.mapgrid[i] = new Array(GRIDSIZE);
			for(var j=0;j<GRIDSIZE;j++){
				this.mapgrid[i][j] = new gridspot(GRIDTYPE.GRASS);
			}
		}
		
		
		//hills
		var hillsnum = 3;
		i = 0;
		do{
			var p = this.getRandomUnusedPoint(2,GRIDSIZE-4,0,GRIDSIZE-4);
			
			var dx = getRandom(-2,2);
			
			this.mapgrid[p.x][p.y].spottype = GRIDTYPE.HILLS;
			this.mapgrid[p.x+1][p.y].spottype = GRIDTYPE.HILLS;
			this.mapgrid[p.x][p.y+1].spottype = GRIDTYPE.HILLS;
			this.mapgrid[p.x+1][p.y+1].spottype = GRIDTYPE.HILLS;
			
			this.mapgrid[dx+ p.x][p.y+2].spottype = GRIDTYPE.HILLS;
			this.mapgrid[dx+ p.x+1][p.y+2].spottype = GRIDTYPE.HILLS;
			this.mapgrid[dx+ p.x][p.y+3].spottype = GRIDTYPE.HILLS;
			this.mapgrid[dx+p.x+1][p.y+3].spottype = GRIDTYPE.HILLS;
			
			i++;
		}while(i< hillsnum);
		//trees
		var singtrees = 35;
		i = 0;
		do{
			var p = this.getRandomUnusedPoint(0,GRIDSIZE-1,0,GRIDSIZE-1);
			if(this.mapgrid[p.x][p.y].spottype != GRIDTYPE.GRASS)
				continue;
			this.mapgrid[p.x][p.y].spottype = GRIDTYPE.TREES;
			i++;
		}while(i<singtrees);
		
		var grouptrees = 4;
		i = 0
		do{
			var start = this.getRandomUnusedBox(0,GRIDSIZE,0,GRIDSIZE,4,4);
			var rbox = randomBox(4,4,12);

			for(var x=0;x<4;x++)
				for(var y=0;y<4;y++)
					if(rbox[x][y])
						this.mapgrid[x+start.x][y+start.y].spottype = GRIDTYPE.TREES;
				
			i++;
		}while(i<grouptrees);
		
		//swamps
		var swamps = 5;
		i = 0;
		do{
			var start = this.getRandomUnusedBox(0,GRIDSIZE,0,GRIDSIZE,2,2);
			var rbox = randomBox(2,2,3);
			for(var y=0;y<2;y++)
				for(var x=0;x<2;x++)
					if(rbox[x][y])
						this.mapgrid[x+start.x][y+start.y].spottype = GRIDTYPE.SWAMP;
				
			i++;
		}while(i<swamps);
		
		//mountains 2 (3x3) & 1 (2x4)
		var smallmounts = 2;
		var i=0;
		
			do{
				var rand = getRandom(0,2);
				if(rand === 0){//3x3
					var p = this.getRandomUnusedBox(0,GRIDSIZE, 0, GRIDSIZE,3,3);
				
					this.mapgrid[p.x][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+2][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+2][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+2].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+2].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+2][p.y+2].spottype = GRIDTYPE.MOUNTAINS;
					
					this.mapgrid[p.x][p.y].basetexture = this.tiletextures.mountains;
					this.mapgrid[p.x][p.y].bigtexture = true;
				
				}else if(rand === 1){//4x2
					var p = this.getRandomUnusedBox(0,GRIDSIZE, 0, GRIDSIZE,4,2);
				
					this.mapgrid[p.x][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+2][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+3][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+2][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+3][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					
					this.mapgrid[p.x][p.y].basetexture = this.tiletextures.mountains4x2;
					this.mapgrid[p.x][p.y].bigtexture = true;
				}else{
					var p = this.getRandomUnusedBox(0,GRIDSIZE, 0, GRIDSIZE,2,4);
				
					this.mapgrid[p.x+1][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+2].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x+1][p.y+3].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+1].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+2].spottype = GRIDTYPE.MOUNTAINS;
					this.mapgrid[p.x][p.y+3].spottype = GRIDTYPE.MOUNTAINS;
					
					this.mapgrid[p.x][p.y].basetexture = this.tiletextures.mountains2x4;
					this.mapgrid[p.x][p.y].bigtexture = true;
				}
				
				i++;
			}while(i< smallmounts);
			
			
		
		var volcanopick = getRandom(0,3);
		this.volcanoSprite = getRandom(0,99) > 30 ? 
				this.tiletextures.volcano : this.tiletextures.greenVolcano;
				
		if(volcanopick === 0){//top
			var p = this.getRandomUnusedBox(0,GRIDSIZE, 0, 0,4,2);
			this.volcanoLoc = new point(p.x,p.y-2);
			
			this.setGridType(p.x,p.y,4,2,GRIDTYPE.VOLCANO);
		}
		if(volcanopick === 1){//bot
			var p = this.getRandomUnusedBox(0,GRIDSIZE, GRIDSIZE-2,GRIDSIZE-2,4,2);
			this.volcanoLoc = new point(p.x,p.y);
			
			this.setGridType(p.x,p.y,4,2,GRIDTYPE.VOLCANO);
		}
		if(volcanopick === 2){//left
			var p = this.getRandomUnusedBox(0,0, 0, GRIDSIZE,2,4);
			this.volcanoLoc = new point(p.x-2,p.y);
			
			this.setGridType(p.x,p.y,2,4,GRIDTYPE.VOLCANO);
		}
		if(volcanopick === 3){//right
			var p = this.getRandomUnusedBox(GRIDSIZE-2,GRIDSIZE-2, 0, GRIDSIZE,2,4);
			this.volcanoLoc = new point(p.x,p.y);
			
			this.setGridType(p.x,p.y,2,4,GRIDTYPE.VOLCANO);
		}
		
		//river
		var start;
		var stop;
		if(getRandom(0,1) == 0){//leftright
			start = new point(23,getRandom(0,23));
			stop = new point(0,getRandom(0,23));
		}else{
			start = new point(getRandom(0,23),23);
			stop = new point(getRandom(0,23),0);
		}
		if(this.makeRiver(start,stop) === -1){
			//if we mess up river, lets restart
			this.generate();
		}
		this.assignTextures();
		
	}
	this.makeRiver = function(start,stop){
		this.mapgrid[start.x][start.y].spottype = GRIDTYPE.RIVER;
		var current = new point(start.x,start.y);
		
		var mx = 1, my= 0;
		
		var timeout = 1000;
		do{
			var dx = stop.x - current.x;
			var dy = stop.y - current.y;
				
			var yheavy=false;
			var next = new point(0,0);
			
			timeout--;
			if(timeout < 0)//so it doesnt crash
				return -1;
			
			if(Math.abs(dy) >= Math.abs(dx) ){
				//longer to get to y
				yheavy = true;
			}
			
			//draw choice
			var r = getRandom(0,99);
			
			var override = false;
			
			//if you are 1 away, go to it
			if((Math.abs(dx) === 1 && dy === 0) ||
					(Math.abs(dy) === 1 && dx === 0)){
				next.x = stop.x;
				next.y = stop.y;
				r = -1;
			}
			
			//previous way has 60%
			if(r >= 0 && r <= 60){
				next.x = current.x + mx;
				next.y = current.y + my;
				//override if next spot is out of place
				if(next.x < 0 || next.x >= GRIDSIZE ||
						next.y < 0 || next.y >= GRIDSIZE)
					override = true;
			}
			//way towards exit is 20%
			if(override || r > 60 && r <= 85){
			
				if(yheavy){
					next.x = current.x;
					next.y = current.y + getSign(dy);
				}else{
					next.x = current.x + getSign(dx);
					next.y = current.y;
				}
			} 
			//opposite is 10%
			if(r > 85){
				if(!yheavy){
					next.x = current.x;
					next.y = current.y + getSign(dy);
				}else{
					next.x = current.x + getSign(dx);
					next.y = current.y;
				}
			}
			//switch stuff up
			mx = next.x - current.x;
			my = next.y - current.y;
			
			//check to see if only 1 near 
			var top;
			try{ top= this.mapgrid[next.x][next.y - 1].spottype === GRIDTYPE.RIVER;
			}catch(e){top = false;}
			var bot;
			try{ bot= this.mapgrid[next.x][next.y + 1].spottype === GRIDTYPE.RIVER;
			}catch(e){bot = false;}
			var lef;
			try{ lef= this.mapgrid[next.x -1][next.y ].spottype === GRIDTYPE.RIVER;
			}catch(e){lef = false;}
			var rig;
			try{ rig= this.mapgrid[next.x + 1][next.y].spottype === GRIDTYPE.RIVER;
			}catch(e){rig = false;}
			
			if(next.x < 0 || next.x >= GRIDSIZE ||
						next.y < 0 || next.y >= GRIDSIZE){
				continue;
			}
			
			if(!(top ^ bot ^ lef ^ rig) || 
					this.mapgrid[next.x][next.y].spottype === GRIDTYPE.MOUNTAINS){
				continue;
			}
			
			

			current.x = next.x;
			current.y = next.y;
			
			this.mapgrid[current.x][current.y].spottype = GRIDTYPE.RIVER;
		}while(current.x != stop.x || current.y != stop.y);
	
	
	}
	
	this.assignTextures = function(){

		for(var y=0;y<GRIDSIZE;y++){
				for(var x=0;x<GRIDSIZE;x++){
					switch(this.mapgrid[x][y].spottype){
						case GRIDTYPE.GRASS:
							var r = getRandom(0,2);
							var text;
							if(r === 0)
								text = this.tiletextures.grass1;
							if(r === 1)
								text = this.tiletextures.grass2;
							if(r === 2)
								text = this.tiletextures.grass3;
						
							this.mapgrid[x][y].basetexture = text;
							//is this NEAR RIVER??? lets rename it if it is :)
							var top;
							try{ top= this.mapgrid[x][y - 1].spottype === GRIDTYPE.RIVER;
							}catch(e){top = false;}
							var bot;
							try{ bot= this.mapgrid[x][y + 1].spottype === GRIDTYPE.RIVER;
							}catch(e){bot = false;}
							var lef;
							try{ lef= this.mapgrid[x -1][y ].spottype === GRIDTYPE.RIVER;
							}catch(e){lef = false;}
							var rig;
							try{ rig= this.mapgrid[x + 1][y].spottype === GRIDTYPE.RIVER;
							}catch(e){rig = false;}
							
							if(top || bot || rig || lef)
								this.mapgrid[x][y].spottype = GRIDTYPE.NEARRIVER;
							
							break;
						case GRIDTYPE.TREES:
							var r = getRandom(0,2);
							var text;
							if(r === 0)
								text = this.tiletextures.tree1;
							if(r === 1)
								text = this.tiletextures.tree2;
							if(r === 2)
								text = this.tiletextures.tree3;
						
							this.mapgrid[x][y].basetexture = text;
							break;
						case GRIDTYPE.HILLS:
							var r = getRandom(0,2);
							var text;
							if(r === 0)
								text = this.tiletextures.hills1;
							if(r === 1)
								text = this.tiletextures.hills2;
							if(r === 2)
								text = this.tiletextures.hills3;
						
							this.mapgrid[x][y].basetexture = text;
							break;
						case GRIDTYPE.SWAMP:
							var r = getRandom(0,2);
							var text;
							if(r === 0)
								text = this.tiletextures.swamp1;
							if(r === 1)
								text = this.tiletextures.swamp2;
							if(r === 2)
								text = this.tiletextures.swamp3;
						
							this.mapgrid[x][y].basetexture = text;
							break;
						case GRIDTYPE.RIVER: {
							var top;
							try{ top= this.mapgrid[x][y - 1].spottype === GRIDTYPE.RIVER;
							}catch(e){top = false;}
							var bot;
							try{ bot= this.mapgrid[x][y + 1].spottype === GRIDTYPE.RIVER;
							}catch(e){bot = false;}
							var lef;
							try{ lef= this.mapgrid[x -1][y ].spottype === GRIDTYPE.RIVER;
							}catch(e){lef = false;}
							var rig;
							try{ rig= this.mapgrid[x + 1][y].spottype === GRIDTYPE.RIVER;
							}catch(e){rig = false;}
							
							var go;
							do{
								go = true;
								if(top && bot)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverTB;
								else if(lef && rig)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverLR;
								else if(top && lef)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverLT;
								else if(top && rig)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverTR;
								else if(bot && lef)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverLB;
								else if(bot && rig)
									this.mapgrid[x][y].basetexture = this.tiletextures.riverBR;
								else{//else one of the edges
									if(y === 0){//top/down
										top = true;
									}
									if(y === GRIDSIZE-1){//top/down
										bot = true;
									}
									if(x === 0){//top/down
										lef = true;
									}
									if(x === GRIDSIZE-1){//top/down
										rig = true;
									}
									go = false;
								}
							}while(!go);
							
						}break;
						
						case GRIDTYPE.MOUNTAINS:{
							//we do this upthere
						}break;
					}
			}
		}
		
	}
	//--------------UPDATE/DRAW ZONE---------------
	
	
	this.update = function(controls,lastcontrols,viewport){

		if(controls.left && controls.right)
			;
		else if(controls.left && viewport.x > 0){
			viewport.x--;
		}else if(controls.right && viewport.x < 12){
			viewport.x++;
		}	

		if(controls.up && controls.down)
			;
		else if(controls.up && viewport.y > 0){
			viewport.y--;
		}else if(controls.down && viewport.y < 12){
			viewport.y++;
		}
	}
	
	this.draw = function(context,elapsed,viewport,buildingmap){
		for(var y = -2; y<VIEWSIZE ;y++){
			for(var x = -2; x<VIEWSIZE ;x++){
				try{//try to skip first couple levels
				if(buildingmap[viewport.x + x][viewport.y + y] != -1) 
					continue;
				}catch(e){ continue;}
				this.mapgrid[viewport.x + x][viewport.y + y].draw(context,x,y);
				if(this.mapgrid[viewport.x + x][viewport.y + y].spottype === GRIDTYPE.MOUNTAINS)
					continue;
				context.strokeStyle = "#000000";
				//context.strokeRect(x * SPOTSIZE, y * SPOTSIZE, 50, 50);

			}
		}
		//volcano lol
		context.drawImage(this.volcanoSprite, (this.volcanoLoc.x -viewport.x)*50,
				(this.volcanoLoc.y- viewport.y)*50,200,201);
		
		context.font = "bold 12px Georgia";
		context.fillStyle = '#FF0000';
		//context.fillText("coord: " +viewport.x+" "+viewport.y, 0, 10);
	
	}
	
	this.getRandomUnusedPoint = function(startx,endx,starty,endy){
		var p;
		
		do{
			p = new point(getRandom(startx,endx),getRandom(starty,endy));
		
		}while(this.mapgrid[p.x][p.y].spottype != GRIDTYPE.GRASS);
		
		return p;
	}
	this.getRandomUnusedBox = function(startx,endx,starty,endy,sizex,sizey){
		var p;
		var goood = true;
		
		if(endx + sizex >= GRIDSIZE)
			endx =  GRIDSIZE - 1 - sizex;
		if(endy + sizey >= GRIDSIZE)
			endy =  GRIDSIZE - 1 - sizey;
		
		do{
			p = new point(getRandom(startx,endx),getRandom(starty,endy));
			goood = true;
			
			for(var y=0;y<sizey;y++){
				for(var x=0;x<sizex;x++){
					if(this.mapgrid[p.x + x][p.y + y].spottype != GRIDTYPE.GRASS)
						goood = false;
				}
			}

		}while(!goood);
		
		return p;
	}
	this.setGridType = function(x,y,sizex,sizey,gridtype){
		for(var j=0;j<sizey;j++)
				for(var i=0;i<sizex;i++)
					this.mapgrid[x + i][y + j].spottype = gridtype;
	}
}

//this creates a box, with random spotsused distrubuted in the box
function randomBox(sizex,sizey,spotsused){
	if(sizex*sizey < spotsused)
		throw "wtf";
		
	var box = new Array(sizey);
	for(var i=0;i<sizex;i++){
		box[i] = new Array(sizey);
		for(var j=0;j<sizey;j++){
			box[i][j] = false;
		}
	}
	var i =0;
	do{	
	
		var r = getRandom(0,sizex*sizey - 1);
		var y = Math.floor( r/sizex );
		var x = r%sizex;
	
	
		var p = new point(x,y);
		if(box[p.x][p.y])
			continue;
			
		box[p.x][p.y] = true;
		i++;
	}while(i<spotsused);
	
	return box;
}
