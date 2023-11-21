let ip;
$.getJSON("https://api.ipify.org?format=json", function(data) {
  ip = data.ip;
})

let goodFortunes = [];
let badFortunes = [];
let special_events = [];

// using async and await to prevent fetching the data too late...
async function fetch_data(){
  await fetch("fortune.json")
  .then(response => response.json())
  .then(data => {
    goodFortunes = data.goodFortunes;
    badFortunes = data.badFortunes;
  })

  await fetch("special.json")
  .then(response => response.json())
  .then(data => {
    special_events = data.special_events;
  })
}

// color adjust
const goodColor = "#e74c3c";
const badColor = "#000000bf";
const middleColor = "#5eb95e";
const descColor = "#7f7f7f";
const dateColor = "#054310C9";

const textColor = [goodColor, goodColor, goodColor, goodColor, goodColor, middleColor, badColor, badColor];
const fortuneStatus = ["大吉", "中吉", "小吉", "吉", "末吉", "中平", "凶", "大凶"];
const chineseMonth = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
const week = ['日', '一', '二', '三', '四', '五', '六'];

const title = `<span style='font-size:8vmin; color:#000000CC;'><b>今日運勢<b></span>`;
const allGood = `<span style='font-size:6vmin; color:${badColor};'><b>萬事皆宜<b></span>`;
const allBad = `<span style='font-size:6vmin; color:${goodColor};'><b>諸事不宜<b></span>`;

// date
const d = new Date();
const date = d.getDate();
const day = d.getDay();
const month = d.getMonth() + 1;
const year = d.getFullYear();

function daysDiff(eventIndex){
  // define the date right now and the special event date
  const startDate = new Date(`${year}-${month}-${date}`);
  const endDate = new Date(`${special_events[eventIndex].year}-${special_events[eventIndex].month}-${special_events[eventIndex].date}`);

  // calculate the difference in milliseconds and convert it to days
  const timeDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
  return timeDiff;
}

let special = false;
let special_events_index = 0;

// init page
async function init_page(){
  // fetch fortune.json and special.json
  await fetch_data();

  // hide the elements of show fortune page
  $('#ip-to-fortune').hide();
  $('#l-1-event').hide();
  $('#l-1-desc').hide();
  $('#l-2-event').hide();
  $('#l-2-desc').hide();
  $('#r-1-event').hide();
  $('#r-1-desc').hide();
  $('#r-2-event').hide();
  $('#r-2-desc').hide();

  // show date before button pressed
  const showMonth = `<span style='font-size:10vmin; color:${dateColor}; -webkit-writing-mode:vertical-lr;'><b>${chineseMonth[month - 1] + "月"}<b></span>`;
  const showDate = `<span style='font-size:25vmin; color:${dateColor};'><b>${("0" + date).substr(-2)}<b></span>`;
  const showDay = `<span style='font-size:10vmin; color:${dateColor}; -webkit-writing-mode:vertical-lr; margin-right:10%;'><b>${"星期" + week[day]}<b></span>`;

  $('#month').html(showMonth);
  $('#date').html(showDate);
  $('#weekday').html(showDay);
  
  let eventIndex_1 = -1, eventIndex_2 = -1;
  // check if there is special event today
  for(let i = 0; i < special_events.length; i++){
    if(daysDiff(i) > 0){
      if(eventIndex_1 == -1) eventIndex_1 = i;
      else if(eventIndex_2 == - 1) eventIndex_2 = i;
    }
    else if(daysDiff(i) == 0){
      special = true;
      special_events_index = i;
    }
  }

  if(eventIndex_1 != -1){
    let days = daysDiff(eventIndex_1);
    let upcoming_event_1 = `<span style='font-size:5vmin; color:${descColor};'><b>距離${special_events[eventIndex_1].event}還剩${days}天<b></span>`;
    $('#upcoming-event-1').html(upcoming_event_1);
  }
  if(eventIndex_2 != -1){
    let days = daysDiff(eventIndex_2);
    let upcoming_event_2 = `<span style='font-size:5vmin; color:${descColor};'><b>距離${special_events[eventIndex_2].event}還剩${days}天<b></span>`;
    $('#upcoming-event-2').html(upcoming_event_2);
  }

  // show special event if today is a special day
  if(special){
    let special_event_today = `<span style='font-size:9vmin; color:${descColor};'><b>今日是${special_events[special_events_index].event}<b></span>`;
    $('#special-day').html(special_event_today);
  }
}

// event bar
const good_span = event => `<span style='font-size:5.6vmin; color:${goodColor};'><b>宜: </b>${event}</span>`;
const bad_span = event => `<span style='font-size:5.6vmin; color:${badColor};'><b>忌: </b>${event}</span>`;
const desc_span = desc => `<span style='font-size:3.5vmin; color:${descColor};'>${desc}</span>`;

function Appear() {
  //change page
  $('#title').html(title);
  $('#month').hide();
  $('#date').hide();
  $('#weekday').hide();
  $('#special-day').hide();
  $('#upcoming-event-1').hide();
  $('#upcoming-event-2').hide();
  $('#btn').html('打卡成功');
  // toggle the elements on show status page
  $('#ip-to-fortune').toggle();
  $('#l-1-event').toggle();
  $('#l-1-desc').toggle();
  $('#l-2-event').toggle();
  $('#l-2-desc').toggle();
  $('#r-1-event').toggle();
  $('#r-1-desc').toggle();
  $('#r-2-event').toggle();
  $('#r-2-desc').toggle();

  // transform ip to four numbers
  let num = ip.split(".").map(num => parseInt(num));
  
  // some lengths
  const goodLen = goodFortunes.length;
  const badLen = badFortunes.length;
  const statusLen = fortuneStatus.length;

  // TODO: improve the hash process
  let hashDate = Math.round(Math.log10(year * ((month << (Math.log10(num[3]) + 1)) * (date << Math.log10(num[2])))));
  let seed1 = (num[0] >> hashDate) * (num[1] >> Math.min(hashDate, 2)) + (num[2] << 1) * (num[3] >> 3) + (date << 3) * (month << hashDate) + (year * day) >> 2;
  let seed2 = (num[0] << (hashDate + 2)) * (num[1] << hashDate) + (num[2] << 1) * (num[3] << 3) + (date << (hashDate - 1)) * (month << 4) + year >> hashDate + (date * day) >> 1;
  
  // decide the status
  let status_index = ((seed1 + seed2) % statusLen + statusLen) % statusLen;
  let status = `<span style='font-size:12vmin; color:${textColor[status_index]};'><b>§ ${fortuneStatus[status_index]} §</b></span>`;
  
  if(special){
    status_index = special_events[special_events_index].status_index;
    let special_status = `<span style='font-size:12vmin; color:${textColor[status_index]};'><b>§ ${fortuneStatus[status_index]} §</b></span>`;
    $('#ip-to-fortune').html(special_status);
  }
  else{
    $('#ip-to-fortune').html(status);
  }

  // make sure the events won't collide
  let set = new Set();
  let l1 = (seed1 % goodLen + goodLen) % goodLen;
  set.add(goodFortunes[l1].event);
  let l2 = (((seed1 << 1) + date) % goodLen + goodLen) % goodLen;
  while(set.has(goodFortunes[l2].event)){
    l2 = (l2 + 1) % goodLen;
  } 
  set.add(goodFortunes[l2].event);
  let r1 = (((seed1 >> 1) + (d.getMonth() << 3)) % badLen + badLen) % badLen;
  while(set.has(badFortunes[r1].event)){
    r1 = (r1 + 2) % badLen;
  } 
  set.add(badFortunes[r1].event);
  let r2 = ((((((seed1 << 3) + (d.getFullYear() >> 5) * (date << 2)) % badLen) * seed2) >> 6) % badLen + badLen) % badLen;
  while(set.has(badFortunes[r2].event)){
    r2 = (r2 + 1) % badLen;
  } 
  
  // organize the stuffs below this line... 
  let l_1_event = good_span(goodFortunes[l1].event);
  let l_1_desc = desc_span(goodFortunes[l1].description); 
  let l_2_event = good_span(goodFortunes[l2].event);
  let l_2_desc = desc_span(goodFortunes[l2].description);
  let r_1_event = bad_span(badFortunes[r1].event);
  let r_1_desc = desc_span(badFortunes[r1].description);
  let r_2_event = bad_span(badFortunes[r2].event);
  let r_2_desc = desc_span(badFortunes[r2].description);

  if(special){
    // instead clear variable name, use short variable name for here... cuz it's too repetitive
    let Data = special_events[special_events_index];
    if(status_index == 0){
      r_1_event = allGood;
    }
    else{
      r_1_event = bad_span(Data.badFortunes.r_1_event);
      r_1_desc = desc_span(Data.badFortunes.r_1_desc);
      r_2_event = bad_span(Data.badFortunes.r_2_event);
      r_2_desc = desc_span(Data.badFortunes.r_2_desc);
    }
    if(status_index == statusLen - 1){
      l_1_event = allBad;
    }
    else{
      l_1_event = good_span(Data.goodFortunes.l_1_event);
      l_1_desc = desc_span(Data.goodFortunes.l_1_desc);
      l_2_event = good_span(Data.goodFortunes.l_2_event);
      l_2_desc = desc_span(Data.goodFortunes.l_2_desc);
    }
    
    $('#l-1-event').html(l_1_event);
    $('#l-1-desc').html(l_1_desc);
    $('#l-2-event').html(l_2_event);
    $('#l-2-desc').html(l_2_desc);
    $('#r-1-event').html(r_1_event);
    $('#r-1-desc').html(r_1_desc);
    $('#r-2-event').html(r_2_event);
    $('#r-2-desc').html(r_2_desc);
  }
  else{
    if(status_index == 0){
      $('#r-1-event').html(allGood);
    }
    else{
      $('#r-1-event').html(r_1_event);
      $('#r-1-desc').html(r_1_desc);
      $('#r-2-event').html(r_2_event);
      $('#r-2-desc').html(r_2_desc);
    }
    if(status_index == statusLen - 1){
      $('#l-1-event').html(allBad);
    }
    else{
      $('#l-1-event').html(l_1_event);
      $('#l-1-desc').html(l_1_desc);
      $('#l-2-event').html(l_2_event);
      $('#l-2-desc').html(l_2_desc);
    }
  }
}

function getLuck() {
  Update();
}

init_page();