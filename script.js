var api_key = 'fb4f224600996dde22caa09827e026ec';

let default_city = 'London';
let default_country = 'uk';
let current_weather_api_url = `https://api.openweathermap.org/data/2.5/weather?q=${default_city},${default_country}&APPID=${api_key}`;


const searchicon = document.querySelector('#searchicon');
const search = document.querySelector('#citySearch');
const pressure = document.querySelector('#pressure');
const humidity = document.querySelector('#humidity');
const wind = document.querySelector('#wind');
const fahrenheit = document.querySelector('#fahrenheit');
const celsius = document.querySelector('#celsius');
const city = document.querySelector('#city');
const time = document.querySelector('#time');
const cloudy = document.querySelector('#cloudy');
const minTempC = document.querySelector('#minTempC');
const maxTempC = document.querySelector('#maxTempC');
const minTempF = document.querySelector('#minTempF');
const maxTempF = document.querySelector('#maxTempF');


function search_locations (data) {

    searchicon.addEventListener('click', e=> {
        for (let i=0; i<data.length; i++) {
            if (data[i].name === search.value) {
                default_country = data[i].country;
                default_city = search.value;
                break;
            }
        }
        current_weather_api_url = `https://api.openweathermap.org/data/2.5/weather?q=${default_city},${default_country}&APPID=${api_key}`
        current_weather();
    })
}


async function city_list () {
    try {
        const response = await fetch('city_list.json');
        var city_data = await response.json();
        search_locations(city_data);
    } catch {
        console.log('json file did not load.');
    }
}

city_list();


async function current_weather() {
    try {    
        const response = await fetch(current_weather_api_url);
        var current_weather_data = await response.json();
        console.log(current_weather_data);
        weather_details(current_weather_data);
        locationinfo(current_weather_data);
        timezone(current_weather_data);
        clouddata(current_weather_data);
        show_temperature(current_weather_data);
    }   catch (err) {
        console.log('No City Found. Try Again.');
    }
}

current_weather();


function weather_details(data) {
    pressure.textContent = data.main.pressure;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed}km/h`;
}


function celsiusconversion(temperature) {
    return Math.round(temperature - 273.15) + '\u00B0' + 'C';
}

function fahrenheitconversion(temperature) {
    return Math.round((temperature - 273.15) * 9/5 + 32) + '\u00B0' + 'F';
}



function show_temperature(data) {

    let current_temperature = data.main.temp;
    let min_temperature = data.main.temp_min;
    let max_temperature = data.main.temp_max;

    minTempC.textContent = celsiusconversion(min_temperature);
    maxTempC.textContent = celsiusconversion(max_temperature);
    minTempF.textContent = fahrenheitconversion(min_temperature);
    maxTempF.textContent = fahrenheitconversion(max_temperature);
    celsius.textContent = celsiusconversion(current_temperature);
    fahrenheit.textContent = fahrenheitconversion(current_temperature);
}


function locationinfo(data) {
    city.textContent = data.name;
}


function timezone(data) {

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let weathertimezone =  new Date(data.dt * 1000 + (data.timezone * 1000));
    let hrs = weathertimezone.getHours();
    let minutes = weathertimezone.getMinutes();
    let day = days[weathertimezone.getDay()];
    let date = weathertimezone.getDate();
    let month = months[weathertimezone.getMonth()];
    let year = weathertimezone.getFullYear();

    let finaltimezone = hrs + ':' + minutes + ' - ' + day + ', ' + date + ' ' + month + ' ' + year;
    time.textContent = finaltimezone;
}


function clouddata(data) {
    cloudy.textContent = data.weather[0].description;
}


function search_location() {
    searchicon.addEventListener('click', e=> {
        default_city = search.value;
        console.log(default_city);
        current_weather();
    })
}

search_location();
