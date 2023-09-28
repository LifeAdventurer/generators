const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let h = window.innerHeight
let w = window.innerWidth

canvas.height = h;
canvas.width = w;

let string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./*-+";

let maxCount = 300;
let fontSize = 13;
let columns = w / fontSize; 

class Matrix {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    this.value = string[parseInt(Math.random() * 67)]; // Math.floor() is fine too
    this.speed = (Math.random() * 10 + 10)
    
    ctx.font = fontSize + "px sans-serif";
    let str = `rgba(0, ${parseInt(Math.random() * 70) + 180}, 0)`;
    ctx.fillStyle = str;
    ctx.fillText(this.value, this.x, this.y);
    this.y += this.speed;
    
    if(this.y > h){
      this.x = parseInt(Math.random() * columns) * fontSize;
      this.y = (Math.random() * h) / 2 - 50;
      this.speed = (-Math.random() * 10 + 10);
    }
  }
}

let charArr = [];
let cnt = 0;

function Move() {
  if(charArr.length < maxCount) {
    let currentChar = new Matrix(parseInt(Math.random() * columns) * fontSize, (Math.random() * h) / 2 - 50);
    charArr.push(currentChar);
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, w, h);
  for(let i = 0; i < charArr.length && (cnt % 3 == 1); ++i){
    charArr[i].draw(ctx);
  }
  requestAnimationFrame(Move);
  cnt++;
}

Move();