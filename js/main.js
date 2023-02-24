"use strict";

const AllCards = document.querySelectorAll(".card");
const searchInput = document.querySelector(".search input");
let forecastLocation = {};
let forecastDays = [];
let forecastCurrent = {};

function getForecastData(value = "cairo") {
  let searchKeyword = value.trim().toLowerCase();
  if (searchKeyword == "") {
    searchKeyword = "cairo";
  }
  return new Promise(function (func) {
    let req = new XMLHttpRequest();
    req.open(
      "GET",
      `https://api.weatherapi.com/v1/forecast.json?key=52ff9b89a58d4f49b60163743232302&q=${searchKeyword}&days=3`
    );
    req.send();
    req.addEventListener("loadend", function () {
      if (req.status == 200) {
        forecastLocation = JSON.parse(req.response).location;
        forecastDays = JSON.parse(req.response).forecast.forecastday;
        forecastCurrent = JSON.parse(req.response).current;
        func();
      }
    });
  });
}

// Function to display today weather
function displayTodayData() {
  let day, dayOfMonth, monthName;
  day = new Date(forecastCurrent.last_updated).toLocaleDateString("en-us", {
    weekday: "long",
  });
  dayOfMonth = new Date(forecastCurrent.last_updated).getDate();
  monthName = new Date(forecastCurrent.last_updated).toLocaleDateString(
    "en-us",
    {
      month: "long",
    }
  );

  AllCards[0].querySelector(".day").innerHTML = day;
  AllCards[0].querySelector(".month").innerHTML = dayOfMonth + monthName;
  AllCards[0].querySelector(".location").innerHTML = forecastLocation.name;
  AllCards[0].querySelector(".degree").innerHTML =
    forecastCurrent.temp_c + "<sup>o</sup>C";

  AllCards[0]
    .querySelector("img")
    .setAttribute("src", forecastCurrent.condition.icon);

  AllCards[0].querySelector(".weather-state").innerHTML =
    forecastCurrent.condition.text;

  AllCards[0].querySelector(".rain").innerHTML =
    forecastDays[0].hour[0].chance_of_rain + "%";

  AllCards[0].querySelector(".wind").innerHTML =
    forecastCurrent.wind_kph + "km/h";
}

// Function to display the rest days weather
function displayRestDaysData() {
  // Displaying today weather
  displayTodayData();
  let day;

  for (let i = 1; i < AllCards.length; i++) {
    // Get the date in specified formate
    day = new Date(forecastDays[i].date).toLocaleDateString("en-us", {
      weekday: "long",
    });

    AllCards[i].querySelector(".day").innerHTML = day;

    AllCards[i].querySelector(".degree").innerHTML =
      forecastDays[i].day.maxtemp_c + "<sup>o</sup>C";

    AllCards[i].querySelector(".sec-degree").innerHTML =
      forecastDays[i].day.mintemp_c + "<sup>o</sup>C";

    AllCards[i]
      .querySelector("img")
      .setAttribute("src", forecastDays[i].day.condition.icon);

    AllCards[i].querySelector(".weather-state").innerHTML =
      forecastDays[i].day.condition.text;
  }
}

document
  .querySelector(".main-section .search button")
  .addEventListener("click", function () {
    let searchValue = document.querySelector(
      ".main-section .search input"
    ).value;
    get(searchValue);
  });

async function get(search) {
  await getForecastData(search);
  displayRestDaysData();
}

get();
