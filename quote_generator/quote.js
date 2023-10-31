const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const buttonElement = document.querySelector("button");

let quotes = [];

fetch("quotes.json")
.then(response => response.json())
.then(data => {
  quotes = data.quotes;
});


function Appear() {
  console.log(quotes);
  const index = Math.floor(Math.random() * quotes.length);
  const {quote, author} = quotes[index];
  quoteElement.innerHTML = `<b style='font-size:28px;'>"</b>` + quote + `<b style='font-size:28px;'>"</b>` ;
  authorElement.innerHTML = "- " + author;
}

function getQuote() {
  Update();
}
