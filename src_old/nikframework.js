//this function is for debugging, use 'setWords()' to put strings on the screen
function drawWords(){
	context.font = "bold 24px sans-serif";
	context.fillStyle = '#000000';
	var i=0
	for(var w in words){
		i++;
		context.fillText("0: " + words[w], 40, 350+i*30);
	}
}
var words = [];
//sets the current debugging words to 'wordss'
function setWords(wordss){
	words = wordss;
}
var musicon;
try{
	if(localStorage["musicon"] === "true")
		musicon = true;
	else if(localStorage["musicon"] === "false")
		musicon = false;
	else
		musicon = true;
}catch(e){
  musicon = true;
}
//toggles music on/off
function togglemusic(){
	try{
	if(musicon){
		//stop music
		mus.pause();
		musicon = false;
	}else{
		musicon = true;
		mus.play();
	}
	}catch(e){}
	try{localStorage["musicon"]  = musicon;}catch(e){console.log("localstorage disabled");}
}
var sounds = new Array();
//this function loads all the sounds needed in the game
function loadAllSound(soundlist,bgmusic){
	
	var b = Modernizr.audio && Modernizr.audio.ogg;//checks if browser can play ogg's
	var c = Modernizr.audio && Modernizr.audio.mp3;//checks if browser can play mp3's
	
	var i;
	//loads in all the sounds in either mp3 of .ogg form
	for(i=0;i<20;i++){
		try{
		if (b){//ogg
			sounds[soundlist[i]] = document.getElementById(soundlist[i]);
		}else if (c){//mp3
			sounds[soundlist[i]] = document.getElementById(soundlist[i]+'M');
		}
		}catch(e){}
	}
	//and music
	try{
	if (b)
		mus = document.getElementById(bgmusic);
	else if (c)
		mus = document.getElementById(bgmusic+'M');
	}catch(e){}

}
function playMusic(){
	try{ if(musicon && mus) mus.play(); }catch(e){}
}
function pauseMusic(){
	if(mus) mus.pause();
}
//this function will be used in each level to play a specific sound
function playSound(id){
	
	if(!musicon) return;

	try{
	var sound = sounds[id];
	if(sound){//if sounds not null
		sound.currentTime=0;//reset time if it was played already
		sound.play();
	}
	//setWords(id +" " +new Date().getTime());
	return sound;
	}catch(e){}
}
var images;
function loadAllImages(imagelist){
	images = [];
	
	for(var v in imagelist){
		var a = imagelist[v];
		images[a] = loadImage(a);
	}
}
//loads a png of 'name' from the images folder
function loadImage(name) {
  var image = new Image();

  image.src = "images/" + name + ".png";
  if(!image)
	throw "null image loaded";
  
  return image;
}
function getImage(name){
	if(!images[name]){
		debugger;
	}
	return images[name];
}