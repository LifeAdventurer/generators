const canvas = document.getElementById("Matrix")
const context = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./*-+#$%^@!~?><:;[]{}\」=_αβΓγΔδεζηΘθικΛλμΞξΠπρΣσςτυΦφχΨψΩω×≦≧≠∞≒≡～∩∠∪∟⊿∫∮∵∴＄￥〒￠￡℃€℉╩◢ⅩⅨⅧⅦⅥⅤⅣⅢⅡⅠあいうえおがぎぐげござじずぜぞだぢつでづどにぬのばひぴぶへぺぼみゃょァゐゎè";

const fontSize = 16;
const columns = canvas.width / fontSize; 

const charArr = [];
for(let i = 0; i < columns; ++i) {
  charArr[i] = 1;
}

let frame = 0;

function Update(str) {
  context.fillStyle = "rgba(0, 0, 0, 0.05)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = str;
  context.font = fontSize + "px monospace";
  
  for(let i = 0; i < columns; ++i){
    const text = chars[Math.floor(Math.random() * chars.length)];
    context.fillText(text, i * fontSize, charArr[i] * fontSize);
    if(charArr[i] * fontSize > canvas.height && Math.random() > 0.90){
      charArr[i] = 0;
    }
    charArr[i]++;
  }
  frame++;
  if(frame <= 40 * (Math.floor(Math.random() * 10) + 3)) requestAnimationFrame(Update(str)); // 40 frames a cycle
  else{
    frame = 0;
    Appear();
  }
}

//Update();
