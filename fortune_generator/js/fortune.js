let ip = null;
fetch("https://api.ipify.org?format=json").then(response => {
  if (response.ok) {
    return response.json();
  }

  throw new Error("Network response was not ok.");
}).then(res => {
  ip = res.ip;

}).catch(error => {
  if ('caches' in window) {
    caches.match('https://api.ipify.org?format=json').then(response => {
      if (response) {
        return response.json();
      }
    }).then(data => {
      if (ip === null && data !== undefined) {
        ip = JSON.parse(data).ip;
      }
    });
  }
});


let goodFortunes = [];
let badFortunes = [];
let special_events = [];
let fortune_generated = false;

// using async and await to prevent fetching the data too late...
async function fetch_data() {
  await fetch("./json/fortune.json")
  .then(response => response.json())
  .then(data => {
    goodFortunes = data.goodFortunes;
    badFortunes = data.badFortunes;
  })

  await fetch("./json/special.json")
  .then(response => response.json())
  .then(data => {
    special_events = data.special_events;
  })
}

const textColorClass = ["good-fortune", "good-fortune", "good-fortune", "good-fortune", "good-fortune", "middle-fortune", "bad-fortune", "bad-fortune"];
const fortuneStatus = ["大吉", "中吉", "小吉", "吉", "末吉", "中平", "凶", "大凶"];
const chineseMonth = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
const week = ['日', '一', '二', '三', '四', '五', '六'];

const title = `<span class="title" style="font-size:8vmin;"><b>今日運勢</b></span>`;
const allGood = `<span class="bad-fortune" style="font-size:6vmin;"><b>萬事皆宜</b></span>`;
const allBad = `<span class="good-fortune" style="font-size:6vmin;"><b>諸事不宜</b></span>`;

// date
const d = new Date();
const date = d.getDate();
const day = d.getDay();
const month = d.getMonth() + 1;
const year = d.getFullYear();

function daysDiff(eventIndex) {
  // define the date right now and the special event date
  const startDate = new Date(year, month - 1, date);
  const endDate = new Date(special_events[eventIndex].year, special_events[eventIndex].month - 1, special_events[eventIndex].date);

  // calculate the difference in milliseconds and convert it to days
  const timeDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return timeDiff;
}

// pre-search jquery - save to a variable to improve performance
const J_l_1_event = $('#l-1-event');
const J_l_1_desc = $('#l-1-desc');
const J_l_2_event= $('#l-2-event');
const J_l_2_desc = $('#l-2-desc');
const J_r_1_event = $('#r-1-event');
const J_r_1_desc = $('#r-1-desc');
const J_r_2_event= $('#r-2-event');
const J_r_2_desc = $('#r-2-desc');
const J_ip_to_fortune = $('#ip-to-fortune');

let special = false;
let special_events_index = 0;

// init page
async function init_page() {
  // fetch fortune.json and special.json
  await fetch_data();

  // hide the elements of show fortune page
  $('#result-page').hide();

  // show date before button pressed
  const showMonth = `<span class="date-color" style="font-size:10vmin; -webkit-writing-mode:vertical-lr;"><b>${chineseMonth[month - 1] + "月"}</b></span>`;
  const showDate = `<span class="date-color" style="font-size:25vmin;"><b>${("0" + date).substr(-2)}</b></span>`;
  const showDay = `<span class="date-color" style="font-size:10vmin; -webkit-writing-mode:vertical-lr; margin-right:10%;"><b>${"星期" + week[day]}</b></span>`;

  $('#month').html(showMonth);
  $('#date').html(showDate);
  $('#weekday').html(showDay);
  
  let showSpecialEventCount = 2, eventIndexPtr = 0;
  let eventIndexList = Array(showSpecialEventCount).fill(-1);
  // check if there is special event today
  for (let i = 0; i < special_events.length; i++) {
    if (daysDiff(i) > 0) {
      if (eventIndexPtr < showSpecialEventCount && eventIndexList[eventIndexPtr] == -1) {
        eventIndexList[eventIndexPtr] = i;
        eventIndexPtr++;
      }
    } else if (daysDiff(i) == 0) {
      special = true;
      special_events_index = i;
    }
  }
  // if there is upcoming event then show
  for (let eventIndex = 0; eventIndex < showSpecialEventCount; eventIndex++) {
    if (eventIndexList[eventIndex] != -1) {
      let days = daysDiff(eventIndexList[eventIndex]);
      let upcoming_event = `<span class="desc" style="font-size:5vmin;">距離<b class="special-event">${special_events[eventIndexList[eventIndex]].event}</b>還剩<b class="special-event">${days}</b>天</span>`; 
      $(`#upcoming-event-${eventIndex + 1}`).html(upcoming_event)
    }
  }

  // show special event if today is a special day
  if (special) {
    let special_event_today = `<span class="desc" style="font-size:9vmin;">今日是<b class="good-fortune">${special_events[special_events_index].event}</b></span>`;
    $('#special-day').html(special_event_today);
  }

  let last_date_str = localStorage.getItem('last_date');
  if (last_date_str !== null && last_date_str !== undefined) {
    let now_date = new Date();
    let last_date = new Date(last_date_str);
    
    if (now_date.getFullYear() === last_date.getFullYear() && now_date.getMonth() === last_date.getMonth() && now_date.getDate() === last_date.getDate()) {
      fortune_generated = true;
      Appear();
    }
  }
}

// event bar
const good_span = event => `<span class="good-fortune" style="font-size:5.6vmin;"><b>宜: </b>${event}</span>`;
const bad_span = event => `<span class="bad-fortune" style="font-size:5.6vmin;"><b>忌: </b>${event}</span>`;
const desc_span = desc => `<span class="desc" style="font-size:3.5vmin;">${desc}</span>`;

function Appear() {
  $('#title').html(title);
  $('#btn').html('打卡成功');
  // disable the btn
  $('#btn').attr("disabled", "disabled");
  //change page
  $('#init-page').hide();
  $('#result-page').show();
  
  // some lengths
  const goodLen = goodFortunes.length;
  const badLen = badFortunes.length;
  const statusLen = fortuneStatus.length;
 
  let status_index = -1;
  let seed1 = -1;
  let seed2 = -1;

  if (!fortune_generated) {
    // transform ip to four numbers
    let num = ip.split(".").map(num => parseInt(num));

    // TODO: improve the hash process
    let hashDate = Math.round(Math.log10(year * ((month << (Math.log10(num[3]) + day - 1)) * (date << Math.log10(num[2] << day)))));
    seed1 = (num[0] >> hashDate) * (num[1] >> Math.min(hashDate, 2)) + (num[2] << 1) * (num[3] >> 3) + (date << 3) * (month << hashDate) + (year * day) >> 2;
    seed2 = (num[0] << (hashDate + 2)) * (num[1] << hashDate) + (num[2] << 1) * (num[3] << 2) + (date << (hashDate - 1)) * (month << 4) + year >> hashDate + (date * day) >> 1;

    // decide the status
    status_index = ((seed1 + seed2) % statusLen + statusLen) % statusLen;

    // update last record
    localStorage.setItem('last_date', d.toISOString());
    localStorage.setItem('last_status_index', status_index.toString());
    localStorage.setItem('last_seed1', seed1.toString());
    localStorage.setItem('last_seed2', seed2.toString());
  } else {
    status_index = parseInt(localStorage.getItem('last_status_index'));
    seed1 = parseInt(localStorage.getItem('last_seed1'));
    seed2 = parseInt(localStorage.getItem('last_seed2'));
  }
  
  let status = `<span class=${textColorClass[status_index]} style="font-size:12vmin;"><b>§ ${fortuneStatus[status_index]} §</b></span>`;
  
  if (special) {
    status_index = special_events[special_events_index].status_index;
    let special_status = `<span class=${textColorClass[status_index]} style="font-size:12vmin;"><b>§ ${fortuneStatus[status_index]} §</b></span>`;
    J_ip_to_fortune.html(special_status);
  }
  else {
    J_ip_to_fortune.html(status);
  }

  // make sure the events won't collide
  let set = new Set();
  let l1 = (seed1 % goodLen + goodLen) % goodLen;
  set.add(goodFortunes[l1].event);
  let l2 = (((seed1 << 1) + date) % goodLen + goodLen) % goodLen;
  while (set.has(goodFortunes[l2].event)) {
    l2 = (l2 + 1) % goodLen;
  } 
  set.add(goodFortunes[l2].event);
  let r1 = (((seed1 >> 1) + (d.getMonth() << 3)) % badLen + badLen) % badLen;
  while (set.has(badFortunes[r1].event)) {
    r1 = (r1 + 2) % badLen;
  } 
  set.add(badFortunes[r1].event);
  let r2 = ((((((seed1 << 3) + (d.getFullYear() >> 5) * (date << 2)) % badLen) * seed2) >> 6) % badLen + badLen) % badLen;
  while (set.has(badFortunes[r2].event)) {
    r2 = (r2 + 1) % badLen;
  } 

  // organize the stuffs below this line... 
  const l1_desc_list = goodFortunes[l1].description;
  const l2_desc_list = goodFortunes[l2].description;
  const r1_desc_list = badFortunes[r1].description;
  const r2_desc_list = badFortunes[r2].description;
  let l_1_event = good_span(goodFortunes[l1].event);
  let l_1_desc = desc_span(l1_desc_list[seed1 % l1_desc_list.length]);
  let l_2_event = good_span(goodFortunes[l2].event);
  let l_2_desc = desc_span(l2_desc_list[seed2 % l2_desc_list.length]);
  let r_1_event = bad_span(badFortunes[r1].event);
  let r_1_desc = desc_span(r1_desc_list[seed1 % r1_desc_list.length]);
  let r_2_event = bad_span(badFortunes[r2].event);
  let r_2_desc = desc_span(r2_desc_list[seed2 % r2_desc_list.length]);

  if (special) {
    // instead clear variable name, use short variable name for here... cuz it's too repetitive
    let Data = special_events[special_events_index];
    if (status_index == 0) {
      J_r_1_event.html(allGood);
    } else {
      J_r_1_event.html(bad_span(Data.badFortunes.r_1_event));
      J_r_1_desc.html(desc_span(Data.badFortunes.r_1_desc));
      J_r_2_event.html(bad_span(Data.badFortunes.r_2_event));
      J_r_2_desc.html(desc_span(Data.badFortunes.r_2_desc));
      
      if (Data.badFortunes.r_1_event.length == 0) {
        J_r_1_event.html(r_1_event);
        J_r_1_desc.html(r_1_desc);
      }
      if (Data.badFortunes.r_2_event.length == 0) {
        J_r_2_event.html(r_2_event);
        J_r_2_desc.html(r_2_desc);
      }
    }
    if (status_index == statusLen - 1) {
      J_l_1_event.html(allBad);
    } else {
      J_l_1_event.html(good_span(Data.goodFortunes.l_1_event));
      J_l_1_desc.html(desc_span(Data.goodFortunes.l_1_desc));
      J_l_2_event.html(good_span(Data.goodFortunes.l_2_event));
      J_l_2_desc.html(desc_span(Data.goodFortunes.l_2_desc));
      
      if (Data.goodFortunes.l_1_event.length == 0) {
        J_l_1_event.html(l_1_event);
        J_l_1_desc.html(l_1_desc);
      }
      if (Data.goodFortunes.l_2_event.length == 0) {
        J_l_2_event.html(l_2_event);
        J_l_2_desc.html(l_2_desc);
      }
    }
  }
  else{
    if (status_index == 0) {
      J_r_1_event.html(allGood);
    } else {
      J_r_1_event.html(r_1_event);
      J_r_1_desc.html(r_1_desc);
      J_r_2_event.html(r_2_event);
      J_r_2_desc.html(r_2_desc);
    }

    if (status_index == statusLen - 1) {
      J_l_1_event.html(allBad);
    } else {
      J_l_1_event.html(l_1_event);
      J_l_1_desc.html(l_1_desc);
      J_l_2_event.html(l_2_event);
      J_l_2_desc.html(l_2_desc);
    }
  }
  $("#copy-result").removeClass("d-none");
}

function getLuck() {
  Update();
}

init_page();
