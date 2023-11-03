let ip;

$.getJSON("https://api.ipify.org?format=json", function(data) {
  ip = data.ip;
})

let fortunes = [];

fetch("fortune.json")
.then(response => response.json())
.then(data => {
  fortunes = data.Fortunes;
})

const textColor = ["#e74c3c", "#e74c3c", "#e74c3c", "#70ad47", "#000000bf", "#000000bf", "#000000bf"];
const fortuneStatus = ["大吉", "中吉", "小吉", "中平", "凶", "小凶", "大凶"];

const allGood = `<span style='font-size: 32px; color: #e74c3c;'>萬事皆吉</span>`;
const allBad = `<span style='font-size: 32px; color: #000000bf;'>萬事皆凶</span>`;

function Appear() {
  let p = 0;
  let num = [0, 0, 0, 0];
  for(let i = 0; i < 14; i++) {
    if(ip[i] == '.') {
      p++;
      continue;
    }
    num[p] = num[p] * 10 + parseInt(ip[i]);
  }
  let d = new Date();
  let seed = (num[0] >> 3) * (num[1] >> 2) + (num[2] << 1) * (num[3] >> 3) + (d.getDate() << 3) * ((d.getMonth() + 1) << 5) + 2;
  const len = fortunes.length;
  let status = `<span style='font-size: 60px; color: ${textColor[seed % 7]};'><b>§ ${fortuneStatus[seed % 7]} §</b></span>`;
  $('#ip-to-fortune').html(status);
  let left_1, left_2, right_1, right_2;
  left_1 = `<span style='font-size: 28px; color: #e74c3c;'><b>宜:</b> ${fortunes[seed % len].event}</span>`;
  left_2 = `<span style='font-size: 28px; color: #e74c3c;'><b>宜:</b> ${fortunes[(seed + d.getDate()) % len].event}</span>`;
  right_1 = `<span style='font-size: 28px; color: #000000bf;'><b>忌:</b> ${fortunes[seed % len + d.getMonth()].event}</span>`;
  right_2 = `<span style='font-size: 28px; color: #000000bf;'><b>忌:</b> ${fortunes[(seed + d.getDate() + 1) % len].event}</span>`;
  if(seed % 7 == 0){
    $('#right-1').html(allBad);
    $('#left-1').html(left_1);
    $('#left-2').html(left_2);
  }
  else if(seed % 7 == 6){
    $('#left-1').html(allGood);
    $('#right-1').html(right_1);
    $('#right-2').html(right_2);
  }
  else{
    $('#right-1').html(right_1);
    $('#right-2').html(right_2);
    $('#left-1').html(left_1);
    $('#left-2').html(left_2);
  }
}

function getLuck() {
  Update();
}
