function getBaseGeoUrl() {
  return `https://api.openweathermap.org/geo/1.0/direct?limit=1&appid=${getApiKey()}`;
}

function getBaseWeatherUrl() {
  return `https://api.openweathermap.org/data/3.0/onecall?exclude=hourly&appid=${getApiKey()}`;
}
function getApiKey() {
  return "e8e6c14c32a29720f6e13266006ad7c5";
}
function getBaseReverseGeoUrl() {
  return `https://api.openweathermap.org/geo/1.0/reverse?limit=1&appid=${getApiKey()}`;
}

function updateCurrentWeather(currentData) {
  temp = currentData.temp;
  let unit = document.querySelector("#celsius").classList.contains("active")
    ? "celsius"
    : "fahrenheit";
  let currentTempetature = convertToUnits(temp, unit);
  let currentTemperaturaElement = document.querySelector("#current-temp");
  currentTemperaturaElement.innerHTML = currentTempetature;
  let weatherDescription = document.querySelector("#wether-description");
  weatherDescription.innerHTML = currentData.weather[0].description;
  let humidity = currentData.humidity;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = humidity;
  let wind = currentData.wind_speed;
  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = wind;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", currentData.weather[0].description);
}
function updateWeatherData(response) {
  updateCurrentWeather(response.data.current);
}
function updateCityData(city, country) {
  let cityNameP = document.querySelector("#city");
  let cityNameH1 = document.querySelector("#city-h1");
  let countryName = document.querySelector("#country");
  cityNameP.innerHTML = city;
  cityNameH1.innerHTML = city;
  countryName.innerHTML = country;
}
function changeWeatherData(lat, lon) {
  axios
    .get(`${getBaseWeatherUrl()}&lat=${lat}&lon=${lon}&units=metric`)
    .then(updateWeatherData);
}
function setWeather(response) {
  let city = response.data[0].name;
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let country = response.data[0].country;

  updateCityData(city, country);
  changeWeatherData(lat, lon);
}

function changeCityName(event) {
  event.preventDefault();
  let input = document.querySelector("#input-city");
  axios.get(`${getBaseGeoUrl()}&q=${input.value}`).then(setWeather);
}

function convertToUnits(celsiusTemperatura, units) {
  return units === "fahrenheit"
    ? Math.round((celsiusTemperatura * 9) / 5 + 32)
    : Math.round(celsiusTemperatura);
}

function changeUnits(event) {
  event.preventDefault();
  let isActive = event.target.classList.contains("active");
  if (!isActive) {
    event.target.classList.add("active");
    event.target.classList.remove("hand");
    let id = event.target.id === "fahrenheit" ? "#celsius" : "#fahrenheit";
    let unit = document.querySelector(id);
    unit.classList.remove("active");
    unit.classList.add("hand");
    // change current temperatura
    let currentTemperatura = document.querySelector("#current-temp");

    currentTemperatura.innerHTML = convertToUnits(temp, event.target.id);
    let currentUnits = document.querySelector("#current-units");
    if (event.target.id === "fahrenheit") currentUnits.innerHTML = "°F";
    else currentUnits.innerHTML = "°C";
  }
}

function setInitialWeaterData(city) {
  axios.get(`${getBaseGeoUrl()}&q=${city}`).then(setWeather);
}

function setLocalWeather(event) {
  event.preventDefault();
  let input = document.querySelector("#input-city");
  input.value = "";
  navigator.geolocation.getCurrentPosition(handlePosition);
}
function setLocalCityName(response) {
  updateCityData(response.data[0].name, response.data[0].country);
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  axios
    .get(`${getBaseReverseGeoUrl()}&lat=${lat}&lon=${lon}`)
    .then(setLocalCityName);
  changeWeatherData(lat, lon);
}

function initListeners() {
  let cityInput = document.querySelector("#input-city-form");
  cityInput.addEventListener("submit", changeCityName);

  let geolocation = document.querySelector("#location");
  geolocation.addEventListener("click", setLocalWeather);

  let meterUnitsCelsius = document.querySelector("#celsius");
  let meterUnitsFahrenheit = document.querySelector("#fahrenheit");

  meterUnitsCelsius.addEventListener("click", changeUnits);
  meterUnitsFahrenheit.addEventListener("click", changeUnits);
}
function setCurrentDayData() {
  let date = new Date();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let weekDay = weekDays[date.getDay()];
  let todayWeekDay = document.querySelector("#weekday");
  todayWeekDay.innerHTML = weekDay;
  let todayDate = document.querySelector("#current-date");
  todayDate.innerHTML = " " + date.getDate();
  let currentTime = document.querySelector("#current-time");
  currentTime.innerHTML = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let temp = null;

setInitialWeaterData("Kharkiv");
setCurrentDayData();
initListeners();
