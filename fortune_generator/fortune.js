let ip;

$.getJSON("https://api.ipify.org?format=json", function(data) {
  ip = data.ip;
})

let goodFortunes = [];
let badFortunes = [];

fetch("fortune.json")
.then(response => response.json())
.then(data => {
  goodFortunes = data.goodFortunes;
  badFortunes = data.badFortunes;
})

const textColor = ["#e74c3c", "#e74c3c", "#e74c3c", "#70ad47", "#000000bf", "#000000bf", "#000000bf"];
const fortuneStatus = ["大吉", "中吉", "小吉", "中平", "凶", "小凶", "大凶"];

const allGood = `<span style='font-size: 5.8vmin; color: #000000bf;'><b>萬事皆宜<b></span>`;
const allBad = `<span style='font-size: 5.8vmin; color: #e74c3c;'><b>諸事不宜<b></span>`;

function Appear() {
  $('#btn').html('打卡成功');
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
  let date = d.getDate() + 4;
  let seed = (num[0] >> 3) * (num[1] >> 2) + (num[2] << 1) * (num[3] >> 3) + (date << 3) * ((d.getMonth() + 1) << 5) + d.getFullYear();
  const goodLen = goodFortunes.length;
  const badLen = badFortunes.length;

  let status = `<span style='font-size: 10vmin; color: ${textColor[seed % 7]};'><b>§ ${fortuneStatus[seed % 7]} §</b></span>`;
  $('#ip-to-fortune').html(status);

  let l_1_event, l_1_desc, l_2_event, l_2_desc, r_1_event, r_1_desc, r_2_event, r_2_desc;
  let l1, l2, r1, r2;
  let set = new Set();
  l1 = seed % goodLen;
  set.add(goodFortunes[l1].event);
  l2 = ((seed << 1) + date) % goodLen;
  while(set.has(goodFortunes[l2].event)) l2 = (l2 + 1) % goodLen;
  set.add(goodFortunes[l2].event);
  r1 = ((seed >> 1) + (d.getMonth() << 3)) % badLen;
  while(set.has(badFortunes[r1].event)) r1 = (r1 + 2) % badLen;
  set.add(badFortunes[r1].event);
  r2 = ((seed << 3 ) + (d.getFullYear() >> 5) * (date << 2)) % badLen;
  while(set.has(badFortunes[r2].event)) r2 = (r2 + 1) % badLen;
  l_1_event = `<span style='font-size: 5.3vmin; color: #e74c3c;'><b>宜: </b>${goodFortunes[l1].event}</span>`;
  l_1_desc = `<span style='font-size: 3.2vmin; color: #7f7f7f;'>${goodFortunes[l1].description}</span>`;
  l_2_event = `<span style='font-size: 5.3vmin; color: #e74c3c;'><b>宜: </b>${goodFortunes[l2].event}</span>`;
  l_2_desc = `<span style='font-size: 3.2vmin; color: #7f7f7f;'>${goodFortunes[l2].description}</span>`;
  r_1_event = `<span style='font-size: 5.3vmin; color: #000000bf;'><b>忌: </b>${badFortunes[r1].event}</span>`;
  r_1_desc = `<span style='font-size: 3.2vmin; color: #7f7f7f;'>${badFortunes[r1].description}</span>`;
  r_2_event = `<span style='font-size: 5.3vmin; color: #000000bf;'><b>忌: </b>${badFortunes[r2].event}</span>`;
  r_2_desc = `<span style='font-size: 3.2vmin; color: #7f7f7f;'>${badFortunes[r2].description}</span>`;
  if(seed % 7 == 0){
    $('#r-1-event').html(allGood);
    $('#l-1-event').html(l_1_event);
    $('#l-1-desc').html(l_1_desc);
    $('#l-2-event').html(l_2_event);
    $('#l-2-desc').html(l_2_desc);
  }
  else if(seed % 7 == 6){
    $('#l-1-event').html(allBad);
    $('#r-1-event').html(r_1_event);
    $('#r-1-desc').html(r_1_desc);
    $('#r-2-event').html(r_2_event);
    $('#r-2-desc').html(r_2_desc);
  }
  else{
    $('#l-1-event').html(l_1_event);
    $('#l-1-desc').html(l_1_desc);
    $('#l-2-event').html(l_2_event);
    $('#l-2-desc').html(l_2_desc);
    $('#r-1-event').html(r_1_event);
    $('#r-1-desc').html(r_1_desc);
    $('#r-2-event').html(r_2_event);
    $('#r-2-desc').html(r_2_desc);
  }
}

function getLuck() {
  Update();
}
