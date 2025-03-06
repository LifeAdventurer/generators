let ip = null;
fetch("https://api.ipify.org?format=json").then((response) => {
  if (response.ok) {
    return response.json();
  }

  throw new Error("Network response was not ok.");
}).then((res) => {
  ip = res.ip;
}).catch((_error) => {
  if ("caches" in window) {
    caches.match("https://api.ipify.org?format=json").then((response) => {
      if (response) {
        return response.json();
      }
    }).then((data) => {
      if (ip === null && data !== undefined) {
        ip = JSON.parse(data).ip;
      }
    });
  }
});

let goodFortunes = [];
let badFortunes = [];
let special_events = [];

// using async and await to prevent fetching the data too late...
async function fetch_data() {
  await fetch("./json/fortune.json")
    .then((response) => response.json())
    .then((data) => {
      goodFortunes = data.goodFortunes;
      badFortunes = data.badFortunes;
    });

  async function fetch_events(path) {
    await fetch(path)
      .then((response) => response.json())
      .then((data) => {
        special_events.push(...data.special_events);
      });
  }

  await fetch_events("./json/custom_special.json");
  await fetch_events("./json/static_special.json");
  await fetch_events("./json/cyclical_special.json");
}

const textColorClass = [
  "good-fortune",
  "good-fortune",
  "good-fortune",
  "good-fortune",
  "good-fortune",
  "middle-fortune",
  "bad-fortune",
  "bad-fortune",
];
const fortuneStatus = [
  "大吉",
  "中吉",
  "小吉",
  "吉",
  "末吉",
  "中平",
  "凶",
  "大凶",
];
const chineseMonth = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];
const week = ["日", "一", "二", "三", "四", "五", "六"];

const title =
  `<span class="title" style="font-size:8vmin;"><b>今日運勢</b></span>`;
const allGood =
  `<span class="bad-fortune" style="font-size:6vmin;"><b>萬事皆宜</b></span>`;
const allBad =
  `<span class="good-fortune" style="font-size:6vmin;"><b>諸事不宜</b></span>`;

// date
const d = new Date();
const date = d.getDate();
const day = d.getDay();
const month = d.getMonth() + 1;
const year = d.getFullYear();

function validateNumber(value, min, max, fieldName, event) {
  value = parseInt(value);
  if (isNaN(value) || value < min || value > max) {
    console.warn(
      `illegal event: ${fieldName} should be between ${min} and ${max}`,
      event,
    );
    return null;
  }
  return value;
}

function isLeapYear(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
}

const daysPerMonth = [
  0,
  31,
  28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];
const maxDate = new Date(8640000000000000);

function daysDiff(eventIndex) {
  // define the date right now and the special event date
  const event = special_events[eventIndex];
  const startDate = new Date(year, month - 1, date);
  let eventYear = -1, eventMonth = -1, eventDate = -1;
  if (!("triggerDate" in event)) {
    console.warn("illegal event: missing `triggerDate` field", event);
    return -1;
  } else if (
    Object.prototype.toString.call(event.triggerDate) !== "[object Object]"
  ) {
    console.warn(
      "illegal event: `triggerDate` field should be a json object",
      event,
    );
    return -1;
  }
  const triggerDate = event.triggerDate;

  let isCustomEvent = false;
  eventYear = year;
  if ("year" in triggerDate) {
    eventYear = validateNumber(
      triggerDate.year,
      1,
      maxDate.getFullYear(),
      "triggerDate.year",
      event,
    );
    if (eventYear === null) {
      return -1;
    }
    isCustomEvent = true;
  }

  if (!("month" in triggerDate)) {
    console.warn("illegal event: `triggerDate` missing `month` field", event);
    return -1;
  }
  eventMonth = validateNumber(
    triggerDate.month,
    1,
    12,
    "triggerDate.Month",
    event,
  );
  if (eventMonth === null) {
    return -1;
  }

  if (
    !("date" in triggerDate) &&
    (!("week" in triggerDate) || !("weekday" in triggerDate))
  ) {
    console.warn(
      "illegal event: `triggerDate` require (`week` and `weekday`) or `date` field",
      event,
    );
    return -1;
  }

  if ("date" in triggerDate) {
    let days = daysPerMonth[eventMonth];
    if (isLeapYear(eventYear) && eventMonth == 2) days += 1;
    eventDate = validateNumber(
      triggerDate.date,
      1,
      days,
      "triggerDate.date",
      event,
    );
    if (eventDate === null) {
      return -1;
    }
  } else {
    triggerDate.week = validateNumber(
      triggerDate.week,
      1,
      5,
      "triggerDate.week",
      event,
    );
    triggerDate.weekday = validateNumber(
      triggerDate.weekday,
      1,
      7,
      "triggerDate.weekday",
      event,
    );
    if (triggerDate.week === null || triggerDate.weekday === null) {
      return -1;
    }

    const firstDayOfMonth = new Date(eventYear, eventMonth - 1, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Sunday -> 7
    const adjustedFirstDayWeekday = firstDayWeekday === 0 ? 7 : firstDayWeekday;
    const firstTargetDay = 1 +
      (triggerDate.weekday - adjustedFirstDayWeekday + 7) % 7;
    eventDate = firstTargetDay + (triggerDate.week - 1) * 7;
  }

  if (
    !isCustomEvent &&
    (month > eventMonth || (month == eventMonth && date > eventDate))
  ) {
    eventYear += 1;
  }

  const endDate = new Date(
    eventYear,
    eventMonth - 1,
    eventDate,
  );

  // calculate the difference in milliseconds and convert it to days
  const timeDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return timeDiff;
}

// pre-search jquery - save to a variable to improve performance
const J_l_1_event = $("#l-1-event");
const J_l_1_desc = $("#l-1-desc");
const J_l_2_event = $("#l-2-event");
const J_l_2_desc = $("#l-2-desc");
const J_r_1_event = $("#r-1-event");
const J_r_1_desc = $("#r-1-desc");
const J_r_2_event = $("#r-2-event");
const J_r_2_desc = $("#r-2-desc");
const J_ip_to_fortune = $("#ip-to-fortune");

let special = false;
let special_events_index = -1;
let l1 = -1, l2 = -1, r1 = -1, r2 = -1;
let status_index = -1;
let seed1 = -1, seed2 = -1;
let fortune_generated = false;
let preview_result = false;
let current_day_special_events = [];

// init page
async function init_page() {
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('fi') && urlParams.has('si') && urlParams.has('ei')) { // fortune_index, status_index, event_index
    status_index = parseInt(urlParams.get('si'));
    special_events_index = parseInt(urlParams.get('ei'));
    [l1, l2, r1, r2] = urlParams.get('fi').split(':').map(num => parseInt(num));
    if (isNaN(status_index) || isNaN(special_events_index) || isNaN(l1) || isNaN(l2) || isNaN(r1) || isNaN(r2)) {
      special_events_index = -1;
      l1 = -1, l2 = -1, r1 = -1, r2 = -1;
      status_index = -1;
    } else {
      preview_result = true;
      if (special_events_index != -1) special = true;
    }
  }
  // fetch data from `fortune.json`
  await fetch_data();

  // hide the elements of show fortune page
  $("#result-page").hide();

  // show date before button pressed
  const showMonth =
    `<span class="date-color" style="font-size:10vmin; -webkit-writing-mode:vertical-lr;"><b>${
      chineseMonth[month - 1] + "月"
    }</b></span>`;
  const showDate = `<span class="date-color" style="font-size:25vmin;"><b>${
    ("0" + date).slice(-2)
  }</b></span>`;
  const showDay =
    `<span class="date-color" style="font-size:10vmin; -webkit-writing-mode:vertical-lr; margin-right:10%;"><b>${
      "星期" + week[day]
    }</b></span>`;

  $("#month").html(showMonth);
  $("#date").html(showDate);
  $("#weekday").html(showDay);

  if (preview_result) Appear();
  if (!preview_result) {
    const showSpecialEventCount = 2;
    let eventIndexList = Array(showSpecialEventCount).fill(-1);
    let eventDiffDaysIndexList = Array(showSpecialEventCount).fill(
      Number.MAX_SAFE_INTEGER,
    );

    // check if there is special event today
    for (let i = 0; i < special_events.length; i++) {
      let diffCount = daysDiff(i);
      if (diffCount > 0) {
        let j = 0;
        for (; j < showSpecialEventCount; j++) {
          if (diffCount < eventDiffDaysIndexList[j]) {
            break;
          }
        }

        eventDiffDaysIndexList[j] = diffCount;
        eventIndexList[j] = i;
      } else if (diffCount === 0) {
        special = true;
        current_day_special_events.push(i);
      }
    }

    special_events_index = ip.split(".").map(num => parseInt(num)).reduce((acc, cur) => acc + cur);
    special_events_index %= current_day_special_events.length;
    special_events_index = current_day_special_events[special_events_index];

    // if there is upcoming event then show
    for (let eventIndex = 0; eventIndex < showSpecialEventCount; eventIndex++) {
      if (eventIndexList[eventIndex] != -1) {
        const days = daysDiff(eventIndexList[eventIndex]);
        const upcoming_event =
          `<span class="desc" style="font-size:5vmin;">距離<b class="special-event">${
            special_events[eventIndexList[eventIndex]].event
          }</b>還剩<b class="special-event">${days}</b>天</span>`;
        $(`#upcoming-event-${eventIndex + 1}`).html(upcoming_event);
      }
    }

    // show special event if today is a special day
    if (special) {
      const special_event_today =
        `<span class="desc" style="font-size:9vmin;">今日是<b class="good-fortune">${
          special_events[special_events_index].event
        }</b></span>`;
      $("#special-day").html(special_event_today);
    }

    const last_date_str = localStorage.getItem("last_date");
    if (last_date_str !== null && last_date_str !== undefined) {
      const now_date = new Date();
      const last_date = new Date(last_date_str);

      if (
        now_date.getFullYear() === last_date.getFullYear() &&
        now_date.getMonth() === last_date.getMonth() &&
        now_date.getDate() === last_date.getDate()
      ) {
        fortune_generated = true;
        Update();
      }
    }
  }
}

// event bar
const good_span = (event) =>
  `<span class="good-fortune" style="font-size:5.6vmin;"><b>宜: </b>${event}</span>`;
const bad_span = (event) =>
  `<span class="bad-fortune" style="font-size:5.6vmin;"><b>忌: </b>${event}</span>`;
const desc_span = (desc) =>
  `<span class="desc" style="font-size:3.5vmin;">${desc}</span>`;

function Appear() {
  $("#title").html(title);
  $("#btn").html("打卡成功");
  // disable the btn
  $("#btn").attr("disabled", "disabled");
  //change page
  $("#init-page").hide();
  $("#result-page").show();

  // some lengths
  const goodLen = goodFortunes.length;
  const badLen = badFortunes.length;
  const statusLen = fortuneStatus.length;

  if (!fortune_generated && !preview_result) {
    // transform ip to four numbers
    const num = ip.split(".").map((num) => parseInt(num));

    // TODO: improve the hash process
    const hashDate = Math.round(
      Math.log10(
        year *
          ((month << (Math.log10(num[3]) + day - 1)) *
            (date << Math.log10(num[2] << day))),
      ),
    );
    seed1 = (num[0] >> hashDate) * (num[1] >> Math.min(hashDate, 2)) +
        (num[2] << 1) * (num[3] >> 3) + (date << 3) * (month << hashDate) +
        (year * day) >> 2;
    seed2 = (num[0] << (hashDate + 2)) * (num[1] << hashDate) +
        (num[2] << 1) * (num[3] << 2) +
        (date << (hashDate - 1)) * (month << 4) + year >>
      hashDate + (date * day) >> 1;

    // decide the status
    let seedMagic = 0;
    if (seed1 > seed2) {
      seedMagic = (seed1 ^ seed2) +
        parseInt(seed1.toString().split("").reverse().join(""));
    } else if (seed1 < seed2) {
      let collatzLen = 0;
      let temp = Math.abs(seed1 - seed2);
      while (temp !== 1) {
        temp = temp % 2 === 0 ? temp / 2 : 3 * temp + 1;
        collatzLen++;
      }
      seedMagic = collatzLen + seed2.toString(2).replace(/0/g, "").length;
    } else {
      seedMagic = seed1 + seed2;
    }
    status_index = (seedMagic % statusLen + statusLen) % statusLen;

    // update last record
    localStorage.setItem("last_date", d.toISOString());
    localStorage.setItem("last_status_index", status_index.toString());
    localStorage.setItem("last_seed1", seed1.toString());
    localStorage.setItem("last_seed2", seed2.toString());
  } else if (!preview_result) {
    status_index = parseInt(localStorage.getItem("last_status_index"));
    seed1 = parseInt(localStorage.getItem("last_seed1"));
    seed2 = parseInt(localStorage.getItem("last_seed2"));
  }

  const status = `<span class=${
    textColorClass[status_index]
  } style="font-size:12vmin;"><b>§ ${fortuneStatus[status_index]} §</b></span>`;

  if (special) {
    status_index = special_events[special_events_index].status_index;
    const special_status = `<span class=${
      textColorClass[status_index]
    } style="font-size:12vmin;"><b>§ ${
      fortuneStatus[status_index]
    } §</b></span>`;
    J_ip_to_fortune.html(special_status);
  } else {
    J_ip_to_fortune.html(status);
  }

  // make sure the events won't collide
  if (!preview_result) {
    const set = new Set();
    l1 = (seed1 % goodLen + goodLen) % goodLen;
    set.add(goodFortunes[l1].event);
    l2 = (((seed1 << 1) + date) % goodLen + goodLen) % goodLen;
    while (set.has(goodFortunes[l2].event)) {
      l2 = (l2 + 1) % goodLen;
    }
    set.add(goodFortunes[l2].event);
    r1 =
      (((seed1 >> 2) + ((month * 42 + year) << 3 + 3) + 19) % badLen + badLen) %
      badLen;
    if (
      r1 == 0 &&
      (Math.abs(seed1) % 2 === Math.abs(seed2) % 2 || seed1 % 2 === 0 ||
        seed2 % 3 === 1)
    ) {
      r1 = (r1 + (Math.abs(seed1 - seed2) % 100) >> 4) % badLen;
    }
    while (set.has(badFortunes[r1].event)) {
      r1 = (r1 + 7) % badLen;
    }
    set.add(badFortunes[r1].event);
    r2 = (((((seed1 << 3 + 7) + (year >> 5) * (date << 2 + 3)) *
          seed2) >> 4 + seed2 % 42) % badLen + badLen) % badLen;
    if (
      r2 == 0 &&
      (Math.abs(seed1) % 3 % 2 === Math.abs(seed2) % 3 % 2 ||
        seed1 % 3 === seed2 % 2 || (month % 3 === 1 && year % 2 === 1) ||
        month % 4 === 3 || date % 7 === 2)
    ) {
      r2 = ((r2 - (Math.abs(seed1 + seed2) % 10) >> 1) % badLen + badLen) %
        badLen;
    }
    while (set.has(badFortunes[r2].event)) {
      r2 = (r2 + 17) % badLen;
    }
  }

  // organize the stuffs below this line...
  const l1_desc_list = goodFortunes[l1].description;
  const l2_desc_list = goodFortunes[l2].description;
  const r1_desc_list = badFortunes[r1].description;
  const r2_desc_list = badFortunes[r2].description;
  const l_1_event = good_span(goodFortunes[l1].event);
  const l_1_desc = desc_span(
    l1_desc_list[Math.abs(seed1) % l1_desc_list.length],
  );
  const l_2_event = good_span(goodFortunes[l2].event);
  const l_2_desc = desc_span(
    l2_desc_list[Math.abs(seed2) % l2_desc_list.length],
  );
  const r_1_event = bad_span(badFortunes[r1].event);
  const r_1_desc = desc_span(
    r1_desc_list[Math.abs(seed1) % r1_desc_list.length],
  );
  const r_2_event = bad_span(badFortunes[r2].event);
  const r_2_desc = desc_span(
    r2_desc_list[Math.abs(seed2) % r2_desc_list.length],
  );

  if (special) {
    // instead clear variable name, use short variable name for here... cuz it's too repetitive
    const Data = special_events[special_events_index];
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
  } else {
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
  $("#copy-result-button").removeClass("d-none");
}

function getLuck() {
  Update();
}

init_page();
