const fortuneElement = document.getElementById("ip-to-fortune");

let ip;

$.getJSON("https://api.ipify.org?format=json", function(data) {
  ip = data.ip;
})

function Appear() {
  let p = 0;
  let num = [0, 0, 0, 0];
  for(let i = 0; i < ip.length; i++) {
    if(ip[i] == '.') {
      p++;
      continue;
    }
    num[p] = num[p] * 10 + parseInt(ip[i]);
  }
  let seed = ((num[0] >> 3) * (num[1] >> 2) + (num[2] << 1) * (num[3] >> 3) + 1) % 7;
  console.log(seed);
  let textColor = ["#e74c3c", "#e74c3c", "#e74c3c", "", "#000000bf", "#000000bf", "#000000bf"];
  let fortune = ["大吉", "中吉", "小吉", "中平", "凶", "小凶", "大凶"];
  fortuneElement.innerHTML = `<span style='font-size: 60px; color: ${textColor[seed]};'><b>§ ${fortune[seed]} §</b></span>`;
  // $('#ip').html(fortune);
}

function getLuck() {
  Update();
}
