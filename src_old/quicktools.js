//quicktools.js
//  has basic functions and objects we need to use accross the entire game
//  more things were added here when i needed them

//the controls object
// is a simple struct with a booleans for all the main controls
function controls(){
this.mouse = new point(0,0);

this.x = false;
this.z = false;

this.w = false;
this.a = false;
this.s = false;
this.d = false;

this.up = false;
this.left = false;
this.bot = false;
this.right = false;

this.j = false;
}

//a point is a (x,y)
//(number,number)
function point(xx,yy){
this.x = xx;
this.y = yy;
}
//a rectangle is a point with width and height
//(number,number,number,number)
function rect(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}
//iimage is my simple object to draw textures quickly
//(texture,point,point)
function iimage(image,src,size){
	this.image = image;
	if(!this.image)
		throw "No image loaded";
	this.src = src;
	this.size = size;

	this.draw = function(context,position,offset){
		//draw the image at this 'position' with 'offset'
		context.drawImage(this.image,
				this.src.x,this.src.y,this.size.x,this.size.y,
				position.x + offset.x,position.y + offset.y,this.size.x,this.size.y
				);
	}

}
//isPointInRect checks if a point, 'pt',
//  is in, a rectangle with cooridinates 'rpt', with size 'rsz'
//(point,point,point)
function isPointInRect(pt,rpt, rsz){
	//logic that checks a point is in a rectangle
	 if(!(pt.x < rpt.x || pt.y < rpt.y
		|| pt.x > rpt.x + rsz.x || pt.y > rpt.y + rsz.y)){
			//alert();
			return true;		
	}else
		return false;
}
function isPointInRect(pt,rect){
	//logic that checks a point is in a rectangle
	 if(!(pt.x < rect.x || pt.y < rect.y
		|| pt.x > rect.x + rect.w || pt.y > rect.y + rect.h)){
			//alert();
			return true;		
	}else
		return false;
}

//isRectTouching is supposed to check if two rectangles 
//  are touching, but it has incorrect logic, corrected by twoRectsTouching
//(point,point,point,point)
function isRectTouching(pt1,sz1,pt2,sz2){
	//check if all 4 of the corners of rect1 are in this
	return isPointInRect(pt1,pt2,sz2)//topleft
		|| isPointInRect(new point(pt1.x +sz1.x,pt1.y),pt2,sz2)//top right
		|| isPointInRect(new point(pt1.x +sz1.x,pt1.y + sz1.y),pt2,sz2)//bot right
		|| isPointInRect(new point(pt1.x,pt1.y + sz1.y),pt2,sz2);//bot left

}
//twoRectsTouching correctly tests if one rectangle is within another
//(rectangle,rectangle)
function twoRectsTouching(rect1,rect2){
	return  (rect1.x < rect2.x + rect2.w && rect1.x +rect1.w > rect2.x &&
			rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y);
}
function getRandom(x){
	Math.floor((Math.random()*x));
}
function getRandom(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//t is either a image or an array of textures
function getRandomTexture(t){
	debugger;
	if(!t.length) return t;
	
	var r = getRandom(0,t.length);
	
	return t[r];
}

function getSign(num){
	if(num === 0)
		return  - 1;
	if(num < 0)
		return -1;
	if(num > 0)
		return 1;
}

//from http://diveintohtml5.info/canvas.html
function getCursorPosition(canvas,e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
	x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
	
	return new point(x,y);
}

//http://stackoverflow.com/questions/2380019/generate-8-unique-random-numbers-between-1-and-100
function getUniqueNumbers(amt,max){
	var arr = []
	while(arr.length < amt){
	  var randomnumber=Math.ceil(Math.random()*max) -1;
	  var found=false;
	  for(var i=0;i<arr.length;i++){
		if(arr[i]==randomnumber){found=true;break}
	  }
	  if(!found)arr[arr.length]=randomnumber;
	}
	return arr;
}