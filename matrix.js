const canvas = document.getElementById("Matrix")
const context = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./*-+#$%^@!~?><:;[]{}\|=_αβΓγΔδεζηΘθικΛλμΞξΠπρΣσςτυΦφχΨψΩω";

const fontSize = 16;
const columns = canvas.width / fontSize; 

const charArr = [];
for(let i = 0; i < columns; ++i) {
  charArr[i] = 1;
}

let frame = 0;

function Update() {
  context.fillStyle = "rgba(0, 0, 0, 0.05)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let str = `rgba(${parseInt(Math.random() * 30) + 220}, 130, 130, 0.55)`;
  context.fillStyle = str;
  context.font = fontSize + "px monospace";
  
  for(let i = 0; i < columns; ++i){
    const text = chars[Math.floor(Math.random() * chars.length)];
    context.fillText(text, i * fontSize, charArr[i] * fontSize);
    if(charArr[i] * fontSize > canvas.height && Math.random() > 0.95){
      charArr[i] = 0;
    }
    charArr[i]++;
  }
  frame++;
  if(frame <= 40 * (Math.floor(Math.random() * 100) + 3)) requestAnimationFrame(Update); // 40 a frame
}

Update();
