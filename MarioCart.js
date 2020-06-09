let car;
var cnt_x, cnt_z, x, z, theta;
let acc_x;
let acc_z;
let heading, heading_ori;
let boxes = [];
var box_num;
function preload() {
  car = loadModel('assets/car.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  x = 0;
  z = 0;
  acc_x = createVector(0,0);
  acc_z = createVector(0,0);
  heading = createVector(1,0);
  heading_ori = createVector(1,0);
  cnt_x = 1;
  cnt_z = 1;
  theta = 0;
  colorMode(HSB);
  box_num = 50;
  for (let i = 0; i < box_num; i++) {
    boxes.push(new Boxes());
  }
}

function draw() {  
  noLights();
  ambientLight(15); 
  spotLight(255, 0, 255, x*15, 0, -z*15, heading.x, 0, -heading.y, PI/3, 300);
  camera(x*15-heading.x*300, -50, -z*15+heading.y*300, x*15, -20, -z*15, 0, 1, 0);
  if (keyIsDown(87)) { //w
    if(acc_x.mag()>1&&acc_x.mag()<7){ acc_x.add(acc_x.mult(0.4)); }
    else if(acc_x.mag()>7) { acc_x = acc_x; }
    else { acc_x = p5.Vector.add(acc_x, heading); }
    cnt_x = 1;
    if (keyIsDown(65)) { //a
      acc_z = createVector(-heading.y, heading.x).mult(acc_x.mag()/10);    
      theta += atan(acc_z.mag()/acc_x.mag()); 
      heading = createVector(heading_ori.x*cos(theta)-heading_ori.y*sin(theta), heading_ori.x*sin(theta)+heading_ori.y*cos(theta));
      cnt_z = 1;
    } else if (keyIsDown(68)) { //d
      acc_z = createVector(heading.y, -heading.x).mult(acc_x.mag()/10);   
      theta -= atan(acc_z.mag()/acc_x.mag()); 
      heading = createVector(heading_ori.x*cos(theta)-heading_ori.y*sin(theta), heading_ori.x*sin(theta)+heading_ori.y*cos(theta));
      cnt_z = 1;
    } 
  } else if (keyIsDown(83)) { //s
    if(acc_x.mag()>1){ acc_x.sub(acc_x.mult(0.1)); }
    else if(acc_x.mag()>7) { acc_x = acc_x; }
    else { acc_x = p5.Vector.sub(acc_x, heading); }
    cnt_x = 1;
  }
  
  x += acc_x.x+acc_z.x;
  z += acc_x.y+acc_z.y;
  if(x>=300) {
    x = 299;
  } else if(x<0) {
    x = 1;
  } 
  if(z>300) {
    z = 299;
  } else if(z<0) {
    z = 1;
  }
  //console.log(x, z);
  background(10);
  //orbitControl();
  push();
  rotateY(PI);
  rotateZ(PI);
  scale(15);
  //camera(x-heading_ori.x, -3000, z-heading_ori.y, x, 0, z, 1, 0, 0);
  translate(x, 0, z);
  rotateY(HALF_PI);
  rotateY(-theta);
  normalMaterial();
  model(car);
  pop();
  
  push();
  fill(230);
  stroke(12);
  specularMaterial(250);
  rotateX(HALF_PI);
  translate(2250, -2250, 0);
  plane(4500, 4500);
  pop();
  
  for (let i = 0; i < box_num; i++) {
    boxes[i].update();
    if(sqrt(sq(x-boxes[i].x)+sq(z-boxes[i].z))<3) { boxes[i].H = random(0, 255); }
  }
  
  
  if(acc_x.mag()>=0.01) {
    acc_x.mult(cnt_x); 
    cnt_x*=0.9;
  }
  if(acc_z.mag()>=0.0001) {
    acc_z.mult(cnt_z); 
    cnt_z*=0.7;
  }
}

class Boxes {
  constructor() {
    this.x = random(0, 300);
    this.z = random(0, 300);
    this.y = -2;
    this.acc_x = 0;
    this.acc_z = 0;
    this.H = 0;
  }
  
  update() {
    push();
    fill(this.H, 255, 255);
    scale(15);
    translate(this.x, this.y, -this.z);
    box(4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}
