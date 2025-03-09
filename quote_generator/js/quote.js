const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const buttonElement = document.querySelector("button");

let quotes = [];

fetch("./json/quotes.json")
  .then((response) => response.json())
  .then((data) => {
    quotes = data.quotes;
  });

function Appear() {
  const index = Math.floor(Math.random() * quotes.length);
  const { quote, author } = quotes[index];

  quoteElement.innerHTML = `<b style='font-size:28px;'>"${quote}"</b>`;
  authorElement.innerHTML = "- " + author;

  const container = document.getElementById("imageContainer");
  const folderPath = "./backgrounds/";
  // TODO: Get number of images from a JSON file.
  const numDarkImages = 0;
  const numLightImages = 0;

  if (numDarkImages && numLightImages) {
    const isDark = Math.random() < 0.5;
    let randomIndex, randomImage;
    const darkModeIcon = document.querySelector("#dark-mode-icon");
    console.log(isDark);
    if (isDark) {
      randomIndex = Math.floor(Math.random() * numDarkImages) + 1;
      randomImage = folderPath + "dark/" + randomIndex + ".jpg";
      darkModeIcon.onclick();
    } else {
      randomIndex = Math.floor(Math.random() * numLightImages) + 1;
      randomImage = folderPath + "light/" + randomIndex + ".jpg";
    }
    container.style.backgroundImage = "url('" + randomImage + "')";
    container.style.opacity = 0.85;
    container.style.backgroundSize = "100% 100%";
  }
}

function getQuote() {
  Update();
}
