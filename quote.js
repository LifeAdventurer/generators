const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const buttonElement = document.querySelector("button");

const quotes = [
  {
    quote: "To AC is human. To AK divine.",
    author: "Moon"
  },
  {
    quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    author: "Albert Einstein"
  },
  {
    quote: "A dream is what makes people love life even when it is painful.",
    author: "Theodore Zeldin"
  },
  {
    quote: "Don’t quit. Suffer now and live the rest of your life as a champion.",
    author: "Muhammad Ali"
  },
];

function Appear() {
  const index = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[index];
  console.log(index)
  quoteElement.innerHTML = `<b style='font-size:16px;'>"</b>` + quote + `<b style='font-size:16px;'>"</b>` ;
  authorElement.innerHTML = "- " + author;
}

function getQuote() {
  let a = parseInt(Math.random() * 255);
  let str = `rgba(${a}, ${Math.abs(a - 127)}, ${Math.abs(a - 255)}, 0.55)`;
  console.log(str);
  Update(str);
}

getQuote();