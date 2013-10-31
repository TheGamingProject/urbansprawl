//ludumdare24.js - 
//coded by @nikpoklitar

/*
 This is the start point for the canvas application 
 All the program control is contained here.
*/

var TOTALX = 800;
var TOTALY = 600;

var canvas;
var context;

var fps = 30;

var contr;//controls

var gameplayobject;

var STATES = {
	help: 0,
	ingame: 1
};
var gamestate = STATES.help;



//this is the function, that the html file calls to basically start the application
function prepareCanvas(canvasDiv, canvasWidth, canvasHeight)
{
	//sets up basic canvas
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); 
	canvas.addEventListener("mousedown", onClick, false);
	canvas.addEventListener("mouseup", onRelease, false);
	//canvas.addEventListener("mousemove",onMouseMove,false);
	
	contr = new controls();//set up controls object
	oldcontr = contr;
	
	//this sets the redraw function to be called 30 times a second
	setInterval(redraw, 1000 / fps);
	
	loadEverything();
}

var loading = 0;

function loadEverything(){
	//load sounds
	var soundlist = ["Launch","BuildFac","BuildEnt","BuildHos","BuildMar",
			"BuildTc","PopCap","Bankrupt"];
	loadAllSound(soundlist,"Music");
	loading++;
	//load images
	var imagelist = ["blueTransparent","purpleTransparent","yellowTransparent",
	
				"envGrass1","envHill1","envMountain1","envRiverBR","envRiverTR",
				"envGrass2","envGrass3","envHill2","envHill3","envSwamp2","envSwamp3",
				"envTree2","envTree3","nonBuildable","greenTransparent","blueTransparent",
				"envRiverLB","envRiverLR","envRiverLT","envRiverTB","envSwamp1","envTree1",
				"buildings/buildingMarket1","buildings/buildingMarket2","buildings/buildingMarket3",
				"buildings/buildingTownCenter1","buildings/buildingTownCenter2","buildings/buildingTownCenter3","envMountain1","envVolcano","envVolcanoGrn",
				
				"houses/houseGrassA","houses/houseTreeA","houses/houseSwampA","houses/houseHillA",
				"houses/houseGrassB","houses/houseGrassC1","houses/houseGrassC2","houses/houseGrassC3",
				"houses/houseTreeB","houses/houseTreeC1","houses/houseTreeC2","houses/houseTreeC3",
				"houses/houseSwampB","houses/houseSwampC1","houses/houseSwampC2","houses/houseSwampC3",
				"houses/houseHillB","houses/houseHillC1","houses/houseHillC2","houses/houseHillC3",
				
				"ui/minimap/grass","ui/minimap/tree","ui/minimap/hill","ui/minimap/swamp",
				"ui/minimap/river","ui/minimap/volcano","ui/minimap/mountain","ui/minimap/towncenter",
				"ui/minimap/hospital","ui/minimap/market","ui/minimap/house","ui/minimap/entertainment",
				"ui/minimap/factory", "ui/rightSideUI","ui/timer","ui/play","ui/ff",
				"envMountain2x4","envMountain4x2",
				"buildings/buildingHospital1","buildings/buildingHospital2","buildings/buildingHospital3",
				"buildings/statue1","buildings/statue2","buildings/statue3",
				"buildings/bar1","buildings/bar2","buildings/bar3", "ui/tryagainBlue",
				"buildings/movieTheater1","buildings/movieTheater2","buildings/movieTheater3",
				"buildings/buildingFactory1","buildings/buildingFactory2","buildings/buildingFactory3",
				"ui/helpOverlay","ui/msgBankrupt","ui/msgFullyPopulated","ui/msgStart","sir-jarlsberg"
				];
				
	loadAllImages(imagelist);
	loading++;
	loadGamePlayContent();
	loading++;
	loadBuildingTextures();
	loading++;
	loadMiniMapStuff();
	loading++;
	
	gameplayobject = new GamePlay();
	
	loading = 100;
}

//resets the entire game to the title screen
function resetGame(){
	gameplayobject = new GamePlay();

	try{//try to pause current music
	if(mus) mus.pause();
	}catch(e){}
}


//process key presses
function keyPressed(evt){
    switch(evt.keyCode){
		case 87://w
		case 38://up
              contr.up = true;
              break;
		case 83://s	  
        case 40://down
              contr.down = true;
              break;
		case 65://a
        case 37://left
              contr.left = true;
              break;
		case 68://d
        case 39://right
              contr.right = true;
              break;
	    case 90://z
			contr.z = true;
			break;
		case 88://x
			contr.x = true;
			break;
		case 74://J
			contr.j = true;
			break;
        }
  }
  //process key releases
  function keyReleased(evt){
    switch(evt.keyCode){
		case 87://w
		case 38://up
			contr.up = false;
			break;
		case 83://s
        case 40://down
			contr.down = false;
			break;
		case 65://a
        case 37://left
			contr.left = false;
			break;
		case 68://d
        case 39://right
			contr.right = false;
			break;
	    case 90://z
			contr.z = false;
			break;
		case 88://x
			contr.x = false;
			break;
		case 82://r
			resetGame();
			break;
		case 77://m 
			togglemusic();
			break;
		case 27://esc
			gameplayobject.stopPlacing();
			break;
		case 70://f
			gameplayobject.toggleSpeed();
			break;
		case 74://j
			contr.j = false;
			break;
        }
  }
  function onMouseMove(e){//is this called too much?
	var cell = getCursorPosition(canvas,e);
	contr.mouse = cell;
  
	if(gamestate === STATES.ingame && gameplayobject) 
		gameplayobject.onMouseMove(cell);
  }
  function onClick(e){
	
	if(gamestate === STATES.ingame && gameplayobject) 
		gameplayobject.onClick(e);
	else{
		gamestate = STATES.ingame;
		playMusic();
	}
  }
  function onRelease(e){
	if(gamestate === STATES.ingame && gameplayobject) 
		gameplayobject.onRelease(e);
  }

 var oldTime = new Date();
 
 //this is the main loop being run
var i =0;
function redraw() {
	var now = new Date();
	
	//find out elapsed time between updates
	//  we will use this with the updates/draws
	var elapsed = now.getTime() - oldTime.getTime();
	oldTime = now;
	//update
	if(gamestate === STATES.ingame)
		gameplayobject.update(elapsed,contr,oldcontr);
  
	//drawing
	canvas.width = canvas.width; // clears the canvas 
	
	if(loading != 100){
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, 800, 600);
		context.font = "20pt Conv_alterebro-pixel-font";
		context.fillStyle = '#000000';
		context.fillText(loading+"", 400, 300);
		return;
	}
	
	gameplayobject.draw(context,elapsed,contr);
	if(contr.j || gamestate === STATES.help) context.drawImage(SIR,0,0,600,600);//easter egg
	
	if(gamestate === STATES.help){
		context.drawImage(HELPOVERLAY,0,0);
		drawBlinking(elapsed);
	}
		
	if(DEBUGGING) drawWords();
	
	oldcontr = contr;
}

function drawBlinking(elapsed){
	time -= elapsed;
	if(time < 0 && on){//to off
		time = offtime;
		on = !on;
	}else if(time < 0 && !on){
		time = ontime;
		on = !on;
	}
	if(on){
		context.font = "20pt Conv_alterebro-pixel-font";
		context.fillStyle = '#FFFFFF';
		context.fillText("CLICK TO CONTINUE", 240, 490);
	}
}
//for blinking
var ontime = 800;
var offtime = 250;

var time = 1000;
var on = true;


