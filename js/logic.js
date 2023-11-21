/* Tasks 

- CSS (please no)
- Clear history button
    - Don't allow same search twice
    - Don't save empty searches
- Easter eggs

*/

//DOM declarations
var inputEl = $('#search-input');
var weatherSection = $('#today');
var forecastSection = $('#forecast');
var searchesSection = $('#searches');
var searchHistoryButtonsDiv = $('#search-history-container');
var searchesBtn = $('#search-history-button');

//converts m/s to mph
var windSpeedConversion = 2.2369362921;

//On search button click, show weather data for city searched
$('#search-button').on('click', event => {
    event.preventDefault();

    var cityName = inputEl.val();

    // API URLs
    var queryForecastURL = ('http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');
    var queryWeatherURL  = ('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');

    getWeatherData(queryForecastURL, queryWeatherURL);
    saveCity(cityName);
})

//Get forecast and weather data 
var getWeatherData = (forecastQuery, weatherQuery) => {
        
    fetch(forecastQuery)
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data);
        forecastSection.empty();
        displayForecast(data);
    })

    //Request current weather data
    fetch(weatherQuery)
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data);
        weatherSection.empty();
        displayWeather(data);
    })
}

//Save search to local storage
var saveCity = city => {
    
    var searchHistoryArray = JSON.parse(localStorage.getItem('previous-searches')) || [];
    console.log(searchHistoryArray);
    searchHistoryArray.push(city);
    localStorage.setItem('previous-searches', JSON.stringify(searchHistoryArray));
}

 searchesBtn.on('click', () => {
    
    searchHistoryButtonsDiv.empty();
    var searches = JSON.parse(localStorage.getItem('previous-searches'));  
    console.log(searches);

    //loop through searches and create button for previous searches
    for(var i=0; i<searches.length; i++){
        var searchHistoryItem = $('<button>').text(searches[i]).addClass('search-history-item');
        
        searchHistoryButtonsDiv.append(searchHistoryItem);
    }

    searchesSection.append(searchHistoryButtonsDiv);
    //add class to new buttons
    //create delegated event listener for click of new button

    $(document).on('click', '.search-history-item', event => {
        desiredCity = event.target.textContent;

        var searchForecastURL = ('http://api.openweathermap.org/data/2.5/forecast?q=' + desiredCity + '&appid=' + openWeatherKey + '&units=metric');
        var searchWeatherURL  = ('https://api.openweathermap.org/data/2.5/weather?q=' + desiredCity + '&appid=' + openWeatherKey + '&units=metric');
        
        getWeatherData(searchForecastURL, searchWeatherURL);
    })
    //on button click, clear display and show data corresponding to city name of new button
})


//Display today's weather
var displayWeather = weatherData => {

    var weatherDiv = $('<div>').addClass('weather-div');
    var HeaderDiv = $('<div>');

    var weatherHeader = $('<h2>');
    weatherHeader.text(weatherData.name + ', (' + weatherData.sys.country + ') ' + dayjs().format('DD/MM/YY'));
    weatherIconURL = ('https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
    var weatherIcon = $('<img>').attr('src', weatherIconURL);
    console.log(weatherIconURL);

    var detailsList = $('<ul>');

    var temp = $('<li>').text('Temperature: ' + weatherData.main.temp + ' \u00B0C');
    var wind = $('<li>').text('Wind Speed: ' + (weatherData.wind.speed * windSpeedConversion).toFixed(2) + ' mph' );
    var humidity = $('<li>').text('Humidity: ' + weatherData.main.humidity + '%');

    weatherSection.append(weatherDiv);
    weatherDiv.append(HeaderDiv).append(detailsList);
    HeaderDiv.append(weatherHeader).append(weatherIcon);
    detailsList.append(temp).append(wind).append(humidity);
}

var displayForecast = forecastData => {

    var forecastDiv = $('<div>').addClass('forecast-div');

    var ifCounter = 0;

    for(var i=0; i<40; i++){
        
        var currentItem = forecastData.list[i + ifCounter];

        if(i % 7 === 0  && i > 0){
            var oneDayForecast = $('<div>').addClass('single-day');
            var dailyInfoList = $('<ul>');
            
            var todaysTemp = currentItem.main.temp;
            var todaysTempEl = $('<li>').text('Temp: ' + todaysTemp + ' \u00B0C');

            var todaysIconURL = 'https://openweathermap.org/img/wn/' + currentItem.weather[0].icon + '.png';
            var todaysIconImage = $('<img>').attr('src', todaysIconURL);
            var todaysIcon = $('<li>').append(todaysIconImage);

            var currentDate = currentItem.dt_txt.slice(0 , 10).split('-').reverse().join('/');
            var currentDateEl = $('<li>').text(currentDate);
            var todaysWind = currentItem.wind.speed;
            var todaysWindEl = $('<li>').text('Wind: ' + todaysWind + ' mph');
            var todaysHumidity = currentItem.main.humidity;
            var todaysHumidityEl = $('<li>').text('Humdidty: ' + todaysHumidity + '%');
   
            dailyInfoList.append(currentDateEl).append(todaysIcon).append(todaysTempEl).append(todaysWindEl).append(todaysHumidityEl)
            oneDayForecast.append(dailyInfoList).css('background-color', 'red');
            forecastDiv.append(oneDayForecast);

            ifCounter++;
        }
    }

    forecastSection.append(forecastDiv);

}
