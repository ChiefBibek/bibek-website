`use strict`;
let key = config.MY_API_TOKEN;
// console.log(key);
let openingCountry = document.querySelector(".country"),
    openingCity = document.querySelector(".city"),
    lastUpdatedDay = document.querySelector(`.day-update`),
    lastUpdatedDate = document.querySelector(`.date-update`),
    lastUpdatedMonth = document.querySelector(`.month-update`),
    lastUpdatedTime = document.querySelector(`.time-update-span`),
    temperatureDetail = document.querySelector(".temperature-detail"),
    currentTemperatureDegree = document.querySelector(".current-temperature-no"),
    humidity = document.querySelector(".humidity"),
    airPressure = document.querySelector(".airpressure"),
    timeForecast = Array.from(document.querySelectorAll(".time-forecast")),
    iconForecast = Array.from(document.querySelectorAll(".icon-forecast")),
    temperatureForecast = Array.from(
        document.querySelectorAll(".temperature-forecast")
    ),
    iconImgTemperature = document.querySelector(".icon-img-temperature");
(latitude = 27.708317),
(longitude = 85.3205817),
(city = `kathmandu`),
(country = `NP`);
const searchBox = document.querySelector(".search"),
    searchBtn = document.querySelector(".search-btn"),
    currentLocation = document.querySelector(".location");
let timeUpdated;
const weekDays = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
const month = [
    `Jan`,
    `Feb`,
    `Mar`,
    `April`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`,
];
let forecastNextTime = [];
let forecastNumber = [];
let forecastLetter = [];
let forecastNextHour = [];
let forecastTemperature = [];

function forecastReset() {
    forecastNextTime = [];
    forecastNumber = [];
    forecastLetter = [];
    forecastNextHour = [];
    forecastTemperature = [];
}

function fetchCurrentLocation() {
    fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
        )
        .then((response) => response.json())
        .then((data) => {
            openingCity.innerText = city;
            openingCountry.innerText = country;

            // console.log(data);
            timeUpdated = new Date();
            lastUpdatedDay.innerText = weekDays[timeUpdated.getDay()];
            lastUpdatedDate.innerText = timeUpdated.getDate();
            lastUpdatedMonth.innerText = month[timeUpdated.getMonth()];
            lastUpdatedTime.innerText = `${timeUpdated.getHours()}:${timeUpdated.getMinutes()}`;
            let hoursUpdated = timeUpdated.getHours();
            let dateUpdated = timeUpdated.getDate();

            let dataArray = data.list;

            // console.log(dataArray);
            dataArray.forEach(function(e) {
                // console.log(e);
                // console.log(e);
                // console.log(e.dt_txt);

                // let getYearArray = Number(e.dt_txt.slice(0, 4));
                // let getMonthArray = Number(e.dt_txt.slice(5, 7));
                let getDateArray = Number(e.dt_txt.slice(8, 10));
                let getHourArray = Number(e.dt_txt.slice(10, 13));
                // console.log(getHourArray);
                // console.log(hoursUpdated);
                // console.log(getDateArray);
                // console.log(dateUpdated);

                // console.log(timeUpdated.getHours());
                // console.log(getHourArray);
                // console.log(getDateArray);

                // console.log(filterArray);
                // console.log(e);
                // console.log(filterArray);

                if (
                    (hoursUpdated === getHourArray ||
                        hoursUpdated === getHourArray + 1 ||
                        hoursUpdated === getHourArray + 2) &&
                    getDateArray === dateUpdated
                ) {
                    // console.log(e);
                    // console.log(e);
                    temperatureDetail.innerText = e.weather[0].description.toUpperCase();

                    currentTemperatureDegree.innerText = e.main.temp;
                    humidity.innerText = e.main.humidity;
                    airPressure.innerText = e.main.pressure;
                    // console.log(e);
                    let iconday;
                    // console.log(getHourArray);
                    //
                    console.log(hoursUpdated);
                    if (hoursUpdated > 6 && hoursUpdated <= 18) {
                        iconday = "d";
                    } else if (hoursUpdated > 18 || hoursUpdated <= 6) {
                        iconday = "n";
                    }
                    let numberIcon = e.weather[0].icon.slice(0, 2);
                    // console.log(iconday);
                    // console.log(numberIcon);
                    // console.log(iconday);

                    iconImgTemperature.src = `https://openweathermap.org/img/wn/${numberIcon}${iconday}@2x.png`;

                    // console.log(e);
                    let forecastNextLetter;
                    // console.log(e);

                    let i = dataArray.indexOf(e);
                    // console.log(i);

                    let fiveArray = dataArray.slice(i + 1, i + 6);
                    // console.log(fiveArray);

                    fiveArray.forEach(function(e) {
                        // console.log(e.dt_txt);
                        // console.log(forecastNextHour);
                        forecastNextHour = Number(e.dt_txt.slice(10, 13));
                        // console.log(forecastNextHour);
                        if (forecastNextHour > 6 && forecastNextHour <= 18) {
                            forecastNextLetter = "d";
                        } else if (forecastNextHour > 18 || forecastNextHour <= 6) {
                            forecastNextLetter = "n";
                        }

                        forecastLetter.push(forecastNextLetter);
                        // console.log(forecastNextHour);
                        // console.log(forecastLetter);
                        forecastNextTime.push(e.dt_txt.slice(10, 16).trim());
                        // console.log(forecastNextTime);
                        // console.log(e);
                        // console.log(forecastTemperature);

                        forecastTemperature.push(e.main.temp);

                        // console.log(forecastTemperature);

                        forecastNumber.push(e.weather[0].icon.slice(0, 2));
                        // console.log(forecastNumber);
                        for (let j = 0; j < 5; j++) {
                            timeForecast[j].innerText = forecastNextTime[j];
                            iconForecast[
                                j
                            ].src = `https://openweathermap.org/img/wn/${forecastNumber[j]}${forecastLetter[j]}@2x.png`;
                            temperatureForecast[j].innerText = forecastTemperature[j];
                        }

                        // console.log(forecastNumber);
                        // console.log(forecastNextTime);

                        // console.log(forecastNextTime);
                    });
                    forecastReset();

                    // console.log(fiveArray);
                    // console.log(i);
                    // console.log(dataArray.length);
                    // for (let i = dataArray.indexOf(e) + 1; i < dataArray.length; i++) {

                    //   // console.log(i);
                    //   // dataArray(i);
                    //   console.log(timeForecast);
                    //   // console.log(dataArray[i]);
                    // }
                }
            });
            // console.log(data.list[0].main);
        });
}

function fetchSearchLocation() {
    let searchedLocation = searchBox.value.trim().toLowerCase();
    fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${searchedLocation}&limit=1&appid=${key}`
        )
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            data.forEach(function(e) {
                // console.log(e.country, e.lat, e.lon);
                country = e.country;
                latitude = e.lat;
                longitude = e.lon;
                city = e.name;
                country = e.country;
                fetchCurrentLocation();
            });
        });
}
fetchCurrentLocation();

function getLocation() {
    fetchSearchLocation();

    searchBox.value = ``;
}
searchBtn.addEventListener("click", getLocation);
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        getLocation();
    }
});