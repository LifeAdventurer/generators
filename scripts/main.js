function check_ip_valid(n1, n2, n3, n4) {
  if (n1 > 255 || n2 > 255 || n3 > 255 || n4 > 255) return false;
  // private network
  if (n1 === 10) return false;
  // Carrier-grade NAT
  if (n1 == 100 && n2 == 64) return false;
  // localhost
  if (n1 === 127 && n2 === 0 && n3 === 0) return false;
  // link-local address
  if (n1 == 169 && n2 == 254) return false;
  // private network
  if (n1 === 172) { if (n2 >= 16 && n2 <= 31) return false; }
  if (n1 === 192) {
    if (n2 === 168) return false; // private network
    if (n2 === 0 && n3 === 0) return false; // IANA RFC 5735
    if (n2 === 0 && n3 === 2) return false; // TEST-NET-1 RFC 5735
    if (n2 === 88 && n3 === 99) return false; // 6to4
  }
  if (n1 == 198) {
    if (n2 == 18) return false; // RFC 2544
    if (n2 == 51 && n3 == 100) return false; // TEST-NET-2 RFC 5735
  }
  if (n1 == 203 && n3 == 113) return false; // TEST-NET-3 RFC 5735
  // class D network
  if (n1 == 224) return false;
  // class E network
  if (n1 == 255) return false;
  return true;
}

let goodFortunes = -1;
let badFortunes = -1;
let badLen = -1;
let goodLen = -1;
let buckets = {};
const statusLen = 8;

const fs = require("fs");
fs.readFile('../fortune_generator/json/fortune.json', 'utf8', (err, content) => {
    if (err) {
        return;
    }

    let tmp = JSON.parse(content);

    goodFortunes = tmp.goodFortunes;
    goodLen = goodFortunes.length;
    badFortunes = tmp.badFortunes;
    badLen = badFortunes.length;

    let num = null;
    const dates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 30];
    let buckets = {};
    let day = 0;
    let run_cnt = 0;
    let current_year = (new Date()).getFullYear();
    while (run_cnt != 2000) {
        let n1 = parseInt(Math.random() * 255 + 1);
        let n2 = parseInt(Math.random() * 255 + 1);
        let n3 = parseInt(Math.random() * 255 + 1);
        let n4 = parseInt(Math.random() * 255 + 1);
        if (!check_ip_valid(n1, n2, n3, n4)) continue;
        let index = `${n1}.${n2}.${n3}.${n4}`;
        if (buckets[index] != undefined) continue;
        buckets[index] = [-1, -1, -1, -1, -1];
        for (let i = 1; i <= 12; i++) {
            for (let j = 1; j <= dates[i - 1]; j++) {
                day %= 7;
                run(current_year, i, j, day, [n1, n2, n3, n4], buckets);
                day++;
            }
        }
        run_cnt++;
    }

    fs.writeFile("./res.txt", JSON.stringify(buckets), (err) => {
        console.log(err);
    });
});

// calculate hash and write result
function run(year, month, date, day, ip, buckets) {
  let num = ip;

  // NOTE: hardcode
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
      seedMagic = (seed1 ^ seed2) + parseInt(seed1.toString().split('').reverse().join(''));
  } else if (seed1 < seed2) {
      let collatzLen = 0;
      let temp = Math.abs(seed1 - seed2);
      while (temp !== 1) {
          temp = temp % 2 === 0 ? temp / 2 : 3 * temp + 1;
          collatzLen++;
      }
      seedMagic = collatzLen + seed2.toString(2).replace(/0/g, '').length;
  } else {
      seedMagic = seed1 + seed2;
  }
  status_index = ((seedMagic) % statusLen + statusLen) % statusLen;

  // make sure the events won't collide
  const set = new Set();
  const l1 = (seed1 % goodLen + goodLen) % goodLen;
  set.add(goodFortunes[l1].event);
  let l2 = (((seed1 << 1) + date) % goodLen + goodLen) % goodLen;
  while (set.has(goodFortunes[l2].event)) {
    l2 = (l2 + 1) % goodLen;
  }
  set.add(goodFortunes[l2].event);
  let r1 = (((seed1 >> 1) + (month << 3)) % badLen + badLen) % badLen;
  while (set.has(badFortunes[r1].event)) {
    r1 = (r1 + 2) % badLen;
  }
  set.add(badFortunes[r1].event);
  let r2 = ((((((seed1 << 3) + (year >> 5) * (date << 2)) % badLen) *
        seed2) >> 6) % badLen + badLen) % badLen;
  while (set.has(badFortunes[r2].event)) {
    r2 = (r2 + 1) % badLen;
  }
  // NOTE: hardcode end

  // write l1, l2, r1, r2
  let index = `${ip[0]}.${ip[1]}.${ip[2]}.${ip[3]}`;
  buckets[index][0] = l1;
  buckets[index][1] = l2;
  buckets[index][2] = r1;
  buckets[index][3] = r2;
  buckets[index][4] = status_index
}
