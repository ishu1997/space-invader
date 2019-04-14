let video,img;
let poseNet;

var drops = [];
var canvasWidth = 640;
var canvasHeight = 480;
let noseX=canvasWidth/2 , noseY=canvasHeight/2;
var posenet_loaded = false;
var score = 0;




//player
var player = {
//	color : "#FFF",
//	x : noseX-30,
	width : 60,
// y :noseY-50,
	height: 60,
	draw : function(x,y){
		image( img_player,x,y, this.width, this.height);
	}
}



//enemies
var enemies  = [];
function Enemy(I){
	I.active = true;
	I.x = Math.random() * canvasWidth;
	I.y = 0;
	I.width = 50;
	I.height = 50;
	I.yVelocity = 1;
	I.inBounds = function(){
		return I.x >= 0 && I.y >= 0 && I.x < canvasWidth - I.width && I.y < canvasHeight - I.height;
	}
	I.draw = function(){
		image(img_enemy, I.x, I.y, I.width, I.height);
	}
	I.update= function(){
		I.active = I.active && I.inBounds();
		I.y += I.yVelocity;
	}
	return I;
}



//bullet
var bullets = [];
function Bullet(I){
	I.active = true;
	// I.x = player.x + player.width/2;
	// I.y = player.y +  player.height/2;
   I.x = noseX-3 ;
   I.y = noseY-30;
	I.width = 5;
	I.height = 8;
	I.yVelocity = 5;
	I.inBounds = function(){
		return I.x >= 0 && I.y >= 0 && I.x < canvasWidth - I.width && I.y < canvasHeight - I.height;
	}
	I.update = function(){
		I.active  = I.active && I.inBounds();
		I.y -= I.yVelocity;
	}
	I.draw = function(){
		image(img_bullet, I.x, I.y, I.width, I.height);
	}
	return I;
}


//collision function

function collision_bullet(enemy, bullet){
	return bullet.x + bullet.width >= enemy.x && bullet.x < enemy.x + enemy.width &&
			bullet.y + bullet.height >= enemy.y && bullet.y < enemy.y + enemy.height;
}

function collision_player(enemy, bullet){
	// return (noseX-30) + bullet.width >= enemy.x && (noseX-30) < enemy.x + enemy.width &&
	// 		(noseY-30) + bullet.height >= enemy.y && (noseY-30) < enemy.y + enemy.height;

var distance = int(dist(noseX,noseY , enemy.x+25 , enemy.y+25));
if(distance<=50){
	return true;
}else{
	return false;
}
}


function setup() {
  createCanvas(640, 480);
// 	var x = (windowWidth - canvasWidth) / 2;
// var y = (windowHeight - canvasHeight) / 2;
// cnv.position(x, y);

  img_enemy = loadImage('images/enemy.png');
  img_player = loadImage('images/player.png');
  img_bullet = loadImage("images/bullet.png");
  video =  createCapture(VIDEO);
  video.hide();
// implemenying natively through tensorflow.js



poseNet  = ml5.poseNet(video);
poseNet.on('pose' , gotPosses);
if(poseNet){
	posenet_loaded = true;
}


  //console.log(ml5);
}

function gotPosses(poses){
//console.log(poses);
if(poses.length>0){
let newX = poses[0].pose.keypoints[0].position.x;
let newY = poses[0].pose.keypoints[0].position.y;

//using lerp function to smoothing the motion of the player
noseX = lerp(noseX , newX , 0.5);
noseY = lerp(noseY ,newY , 0.5);
}
}
//
// function modelReady(){
// //  console.log('model ready');
// }


function draw() {
// background(220);
image(video,0,0);
fill(255,0,0);
//ellipse(noseX,noseY,50);

//filter(THRESHOLD);


player.draw(noseX-30 , noseY-30);

if(posenet_loaded){


setTimeout(bullets.push(Bullet({})) , 1000);

// setInterval(enemies.forEach(function(enemy){
// 	enemy.yVelocity+= 0.2;
// }),10000);

	bullets = bullets.filter(function(bullet){
		return bullet.active;
	});
	bullets.forEach(function(bullet){
		bullet.update();
		bullet.draw();
	});

if(Math.random()<0.05){
		enemies.push(Enemy({}));
	}
	enemies = enemies.filter(function(enemy){
		return enemy.active;
	});
	enemies.forEach(function(enemy){
		enemy.update();
		enemy.draw();
	});

  bullets.forEach(function(bullet){
		enemies.forEach(function(enemy){
			if(collision_bullet(enemy, bullet)){
				enemy.active = false;
				bullet.active = false;
				score++;
			}

		});
	});

	enemies.forEach(function(enemy){
		if(collision_player(enemy, player)){
			enemy.active = false;
			noLoop();
			textSize(40);
			text("GAME OVER", 180, 200);
		}
	});
}
}
