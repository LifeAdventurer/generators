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

const allGood = `<span style='font-size: 32px; color: #000000bf;'>萬事皆宜</span>`;
const allBad = `<span style='font-size: 32px; color: #e74c3c;'>諸事不宜</span>`;

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
  let seed = (num[0] >> 3) * (num[1] >> 2) + (num[2] << 1) * (num[3] >> 3) + (d.getDate() << 3) * ((d.getMonth() + 1) << 5) + d.getFullYear();
  const len = fortunes.length;

  let status = `<span style='font-size: 60px; color: ${textColor[seed % 7]};'><b>§ ${fortuneStatus[seed % 7]} §</b></span>`;
  $('#ip-to-fortune').html(status);

  let left_1, left_2, right_1, right_2;
  let l1, l2, r1, r2;
  let set = new Set();
  l1 = seed % len;
  set.add(l1);
  l2 = (seed + d.getDate()) % len;
  while(set.has(l2)) l2 = (l2 + 1) % len;
  set.add(l2);
  r1 = (seed + d.getMonth() << 3) % len;
  while(set.has(r1)) r1 = (r1 + 2) % len;
  set.add(r1);
  r2 = (seed + (d.getFullYear() >> 5) * (d.getDate << 2)) % len;
  while(set.has(r2)) r2 = (r2 + 1) % len;
  left_1 = `<span style='font-size: 28px; color: #e74c3c;'><b>宜:</b> ${fortunes[l1].event}</span>`;
  left_2 = `<span style='font-size: 28px; color: #e74c3c;'><b>宜:</b> ${fortunes[l2].event}</span>`;
  right_1 = `<span style='font-size: 28px; color: #000000bf;'><b>忌:</b> ${fortunes[r1].event}</span>`;
  right_2 = `<span style='font-size: 28px; color: #000000bf;'><b>忌:</b> ${fortunes[r2].event}</span>`;
  if(seed % 7 == 0){
    $('#right-1').html(allGood);
    $('#left-1').html(left_1);
    $('#left-2').html(left_2);
  }
  else if(seed % 7 == 6){
    $('#left-1').html(allBad);
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
