var fs = require('fs')

let num = [26, 236, 238, 27];
const dates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30];
const statusLen = 8;
var buckets = {};
let day = 0;
var cnt = 0;

const goodFortunes = [
    {
      "event": "睡覺",
      "description": "品質良好，精神煥發"
    },
    {
      "event": "做家務",
      "description": "整潔使人心情愉悅"
    },
    {
      "event": "冥想",
      "description": "平靜心靈，緩解焦慮"
    },
    {
      "event": "攝影",
      "description": "捕捉到美好瞬間"
    },
    {
      "event": "喝咖啡",
      "description": "精力充沛燃燒脂肪"
    },
    {
      "event": "朋友聚會",
      "description": "充滿歡笑和美好回憶"
    },
    {
      "event": "體育鍛鍊",
      "description": "能量滿滿，效果顯著"
    },
    {
      "event": "出遊" ,
      "description": "好天氣，好心情"
    },
    {
      "event": "吃大餐",
      "description": "聯絡感情"
    },
    {
      "event": "逛書店",
      "description": "新書上架，打折推銷"
    },
    {
      "event": "學新技能",
      "description": "快速上手"
    },
    {
      "event": "唱歌",
      "description": "被星探發掘"
    },
    {
      "event": "上課",
      "description": "整天不累，100% 消化"
    },
    {
      "event": "洗澡",
      "description": "重獲能量"
    },
    {
      "event": "請教問題",
      "description": "問題皆獲高人指點"
    },
    {
      "event": "網購",
      "description": "心儀商品皆促銷"
    },
    {
      "event": "放假",
      "description": "休息充電，明日再戰"
    },
    {
      "event": "早睡",
      "description": "好夢連連"
    },
    {
      "event": "早起",
      "description": "朝氣蓬勃，神采飛揚"
    },
    {
      "event": "發文章",
      "description": "瀏覽數暴增"
    },
    {
      "event": "點外賣",
      "description": "準時到達，新鮮好吃"
    },
    {
      "event": "做善事",
      "description": "積善成福"
    },
    {
      "event": "散步",
      "description": "空氣良好，放鬆身心"
    }
];

const badFortunes =  [
    {
      "event": "體育鍛鍊",
      "description": "不慎受傷"
    },
    {
      "event": "攝影",
      "description": "照片全消失"
    },
    {
      "event": "出遊",
      "description": "天氣不晴朗"
    },
    {
      "event": "吃大餐",
      "description": "被要求請客"
    },
    {
      "event": "學新技能",
      "description": "屢試不爽，始終不懂"
    },
    {
      "event": "唱歌",
      "description": "嗓子發炎"
    },
    {
      "event": "洗澡",
      "description": "水溫不穩"
    },
    {
      "event": "請教問題",
      "description": "疑難雜症，均無解答"
    },
    {
      "event": "網購",
      "description": "錯過促銷"
    },
    {
      "event": "放假",
      "description": "隔日工作量倍增"
    },
    {
      "event": "晚睡",
      "description": "失眠，明日精神渙散"
    },
    {
      "event": "晚起",
      "description": "整天都不順"
    },
    {
      "event": "發文章",
      "description": "搜索枯腸，不知所云"
    },
    {
      "event": "點外賣",
      "description": "路況壅塞，餐點冷掉"
    },
    {
      "event": "喝咖啡",
      "description": "晚上失眠"
    },
    {
      "event": "散步",
      "description": "被害蟲咬傷"
    }
];

const badLen = badFortunes.length;
const goodLen = goodFortunes.length;

while (cnt != 2000) {
        let n1 = parseInt(Math.random() * 255 + 1);
        let n2 = parseInt(Math.random() * 255 + 1);
        let n3 = parseInt(Math.random() * 255 + 1);
        let n4 = parseInt(Math.random() * 255 + 1);

        if (!check(n1, n2, n3, n4)) continue;

        // buckets[`${n1}.${n2}.${n3}.${n4}`] = [0, 0, 0, 0, 0, 0, 0, 0];
        buckets[`${n1}.${n2}.${n3}.${n4}`] = [0, 0, 0, 0];
        for (let i = 1; i <= 12; i++) {
            for (let j = 1; j <= dates[i - 1]; j++) {
                day %= 7;
                run(2023, i, j, day, [n1, n2, n3, n4]);
                day++;
            }
        }

        cnt++;
}

fs.writeFile('./res.txt', JSON.stringify(buckets), err => {
    console.log(err);
});

function check(n1, n2, n3, n4) {
    if (n1 > 255 || n2 > 255 || n3 > 255 || n4 > 255) return false;


    if (n1 === 10) return false;

    if (n1 === 127 && n2 === 0 && n3 === 0) return false;

    if (n1 == 169 && n2 == 254) return false;

    if (n1 === 172) if (n2 >= 16 && n2 <= 31) return false;

    if (n1 === 192) {
        if (n2 === 168) return false;
        if (n2 === 0 && n3 === 0) return false;
        if (n2 === 0 && n3 === 2) return false;
        if (n2 === 88 && n3 === 99) return false;
    }

    return true;
}

function run(year, month, date, day, ip) {
    let num = ip;
    let index = `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
    let d = new Date(year, month, date);

    let hashDate = Math.round(Math.log10(year * ((month << (Math.log10(num[3]) + day - 1)) * (date << Math.log10(num[2] << day)))));
    let seed1 = (num[0] >> hashDate) * (num[1] >> Math.min(hashDate, 2)) + (num[2] << 1) * (num[3] >> 3) + (date << 3) * (month << hashDate) + ((year * day) >> 2);
    let seed2 = (num[0] << (hashDate + 2)) * (num[1] << hashDate) + (num[2] << 1) * (num[3] << 3) + (date << (hashDate - 1)) * (month << 4) + (year >> hashDate) + ((date * day) >> 1);

    // decide the status
    let status_index = ((seed1 + seed2) % statusLen + statusLen) % statusLen;
    // buckets[index][Math.max(status_index - parseInt(day / Math.PI), 0)]++;
    // buckets[index][status_index]++;

    let set = new Set();
    let l1 = (seed1 % goodLen + goodLen) % goodLen;
    let l2 = (((seed1 << 1) + date) % goodLen + goodLen) % goodLen;

    while (l1 == l2) {
        l2 = (l2 + 1) % goodLen;
    }

    set.add(goodFortunes[l1].event);
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

    // write l1, l2, r1, r2
    buckets[index][0] = l1;
    buckets[index][1] = l2;
    buckets[index][2] = r1;
    buckets[index][3] = r2;
}
