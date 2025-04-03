const cDisplay = document.querySelector(".cityDisplay");
const tDisplay = document.querySelector(".tempDisplay");
const dDisplay = document.querySelector(".descDisplay");
const hDisplay = document.querySelector(".humidityDisplay");
const form = document.querySelector(".weatherForm");
const card = document.querySelector(".card");

const apiKey = "410bd8e6fcc497d3a45349d820a0518e";

//getting the event. writing it as an aysnc function to use await to get promises.
form.addEventListener("submit", async event => {
    event.preventDefault();
    const input = document.querySelector(".cityInput").value;

    if(input){
        try{
            const weatherData = await getWeatherData(input);
            displayWeather(weatherData);
        } catch(error){
            console.error(error);
            displayError(error);
        }
    }else{
        displayError("Please enter a city");
    }
});

//city - it is the placeholder for the variable input
async function getWeatherData(city){
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiURL);

    if(!response.ok){
        throw new Error(`Could not fetch weather data for city ${city}`);

    }

    return await response.json();
}

// data - json format structure.
function displayWeather(data){
    console.log(data);
    // destructuring the data in smaller units.
    const {name: city, 
            main: {temp, humidity},
            weather: [{description}]} = data;
    console.log(description);

    const html = `
        <h1 class="cityDisplay">${city}</h1>
        <p class="tempDisplay">${Math.round(temp - 273.15)}°C</p>
        <p class="humidityDisplay">${humidity}</p>
        <p class="emojiDisplay">${getEmoji(data)}</p>
        <p class="descDisplay">${description}</p>
    `

    card.textContent = "";
    card.style.display = "block";
    card.innerHTML = html;
    card.style.display = "flex";
    card.style.flexDirection = "column";
    // card.style.alignItems = "center";
    card.style.justifyContent = "center";
}

function getEmoji(data){
    const {weather: [{id}]} = data;
    let weatherEmoji;

    if(id >= 200 && id < 300){
        weatherEmoji = "⛈️";
    }else if(id >= 300 && id < 600){
        weatherEmoji = "🌧️";
    }else if(id >= 600 && id < 700){
        weatherEmoji = "❄️";
    }else if(id === 800){
        weatherEmoji = "☀️";
    }else if(id > 800){
        weatherEmoji = "☁️";
    }else{
        weatherEmoji = "❓";
    }

    return weatherEmoji;
}

function displayError(msg){
    const eDisplay = document.createElement("p");
    eDisplay.textContent = msg;
    eDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.appendChild(eDisplay);
}