const apikey = "3a6cf6c1aaa80ed070ea8607177f148d";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiurl + city + `&appid=${apikey}`);
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    document.querySelector(".forecast").style.display = "none";
  } else {
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity-value").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind-value").innerHTML = data.wind.speed + "km/h";

    const condition = data.weather[0].main;
    if (condition === "Clouds") weatherIcon.src = "cloudy.png";
    else if (condition === "Clear") weatherIcon.src = "clear.png";
    else if (condition === "Rain") weatherIcon.src = "rain.png";
    else if (condition === "Drizzle") weatherIcon.src = "drizzle.png";
    else if (condition === "Mist") weatherIcon.src = "mist.png";
    else if (condition === "Haze") weatherIcon.src = "haze.png";

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";

    getForecast(city);
  }
}

async function getForecast(city) {
  const response = await fetch(forecastUrl + city + `&appid=${apikey}`);
  const data = await response.json();

  const forecastCards = document.querySelector(".forecast-cards");
  forecastCards.innerHTML = "";

  const dailyMap = new Map();

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(date) && item.dt_txt.includes("12:00:00")) {
      dailyMap.set(date, item);
    }
  });

  let count = 0;
  for (let [date, item] of dailyMap) {
    if (count >= 5) break;

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    const dayName = new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
    const icon = item.weather[0].main;
    const temp = Math.round(item.main.temp);

    let iconSrc = "cloudy.png";
    if (icon === "Clear") iconSrc = "clear.png";
    else if (icon === "Rain") iconSrc = "rain.png";
    else if (icon === "Drizzle") iconSrc = "drizzle.png";
    else if (icon === "Mist") iconSrc = "mist.png";
    else if (icon === "Haze") iconSrc = "haze.png";

    card.innerHTML = `
      <p>${dayName}</p>
      <img src="${iconSrc}" alt="${icon}">
      <p>${temp}°C</p>
    `;
    forecastCards.appendChild(card);
    count++;
  }

  document.querySelector(".forecast").style.display = "block";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});