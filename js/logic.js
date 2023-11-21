//DOM declarations
var inputEl = $('#search-input');
var weatherSection = $('#today');
var forecastSection = $('#forecast');
var searchesSection = $('#searches');
var searchHistoryButtonsDiv = $('#search-history-container')
var searchesBtn = $('#search-history-button');

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
var getWeatherData = (forecastQuery, weatherQuery, city) => {
        
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
    
    searchHistoryButtonsDiv.empty()
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

    var weatherDiv = $('<div>');
    var HeaderDiv = $('<div>');

    var weatherHeader = $('<h2>');
    weatherHeader.text(weatherData.name + ', (' + weatherData.sys.country + ') ' + dayjs().format('DD/MM/YY'));
    weatherIconURL = ('https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
    var weatherIcon = $('<img>').attr('src', weatherIconURL);
    console.log(weatherIconURL);

    var detailsList = $('<ul>');

    var temp = $('<li>').text('Temperature: ' + weatherData.main.temp);
    var wind = $('<li>').text('Wind Speed: ' + (weatherData.wind.speed * 2.2369362921).toFixed(2) + 'mph' );
    var humidity = $('<li>').text('Humidity: ' + weatherData.main.humidity + '%');

    weatherSection.append(weatherDiv);
    weatherDiv.append(HeaderDiv).append(detailsList);
    HeaderDiv.append(weatherHeader).append(weatherIcon);
    detailsList.append(temp).append(wind).append(humidity);
}

var displayForecast = forecastData => {

    var forecastDiv = $('<div>');
    var highs = [];
    var lows = [];

    var highestTemp;
    var lowestTemp;

    for(var i=0; i<40; i++){
        if(i>0){

            var currentHigh = forecastData.list[i].main.temp_max;
            var prevHigh = forecastData.list[i-1].main.temp_max;

            var currentLow = forecastData.list[i].main.temp_min;
            var prevLow = forecastData.list[i-1].main.temp_min;
    
            highestTemp = higherValue(currentHigh, prevHigh, highestTemp);
            lowestTemp = lowerValue(currentLow, prevLow, lowestTemp);

            if(i % 8 === 0 || i === 39){
                var oneDayForecast = $('<div>').addClass('single-day');
                var dailyInfoList = $('<ul>')
                var highTempEl = $('<li>').text('Highs: ' + highestTemp);
                var lowTempEl = $('<li>').text('Lows: ' + lowestTemp);
                
                var currentDate = forecastData.list[i].dt_txt.slice(0 , 10).split('-').reverse().concat();
                console.log(currentDate);
                dailyInfoList.append(highTempEl).append(lowTempEl);
                oneDayForecast.append(dailyInfoList).css('background-color', 'red');
                forecastDiv.append(oneDayForecast);

                highs.push(highestTemp);
                lows.push(lowestTemp);

                highestTemp = -Infinity;
                lowestTemp = Infinity;
                continue;
            }
        }
    }

    forecastSection.append(forecastDiv);

}

var higherValue = (current, previous, stored) => {
    
    if(current > previous){
        finalValue = current;

    }
    else if(previous > current){
        finalValue = previous;
    }
    else if(current === previous){
        finalValue = current;
    }

    if(stored > finalValue){
        finalValue = stored;
        
    }
    return finalValue;
}

var lowerValue = (current, previous, stored) => {
    
    if(current < previous){
        finalValue = current;
    }
    else if(previous < current){
        finalValue = previous;
    }
    else{
        finalValue = current;
    }

    if(stored < finalValue){
        finalValue = stored;
    }

    return finalValue;
}