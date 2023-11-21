//DOM declarations
var inputEl = $('#search-input');
var weatherSection = $('#today');
var forecastSection = $('#forecast');
var historyDiv = $('#history');
var searchHistoryButtonsDiv = $('#search-history-container');
var clearBtn = $('#clear-history');

//converts m/s to mph
var windSpeedConversion = 2.2369362921;

//On search button click, show weather data for city searched
$('#search-button').on('click', event => {
    event.preventDefault();

    var cityName = inputEl.val();

    if(cityName === ''){
        alert('Please enter a city');
        return;
    }

    // API URLs
    var queryForecastURL = ('http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');
    var queryWeatherURL  = ('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');

    getWeatherData(queryForecastURL, queryWeatherURL);
    saveCity(cityName);

    cityName.text('');
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
    console.log('SearchHistoryArray: ' +  searchHistoryArray);
    searchHistoryArray.push(city);
    localStorage.setItem('previous-searches', JSON.stringify(searchHistoryArray));
}

    searchHistoryButtonsDiv.empty();
    var searches = JSON.parse(localStorage.getItem('previous-searches')) || [];  
    console.log(searches);

    //loop through searches and create button for previous searches
    
    if(searches.length >= 5){
        
        for(var i=0; i<5; i++){
        
            if((searches[searches.length - (i+1)]) != ''){
                var searchHistoryItem = $('<button>').text(searches[searches.length - (i+1)]).addClass('search-history-item btn btn-primary my-1')
                searchHistoryButtonsDiv.append(searchHistoryItem).addClass('d-flex flex-column');
            }
    
        }
    }

    else{ 
        for(var j=0; j<searches.length; j++){
            var searchHistoryItem = $('<button>').text(searches[j]).addClass('search-history-item btn btn-primary my-1');
            searchHistoryButtonsDiv.prepend(searchHistoryItem).addClass('d-flex flex-column');
        }

        
    }
   

    clearBtn.on('click', () => {

        var clearConfirm =  confirm('Are you sure you want clear your history?');
     
        if(clearConfirm === true){
            searchHistoryButtonsDiv.empty();
            localStorage.clear();
        }
     })

    historyDiv.append(searchHistoryButtonsDiv).addClass('d-flex flex-column-reverse my-2');


$(document).on('click', '.search-history-item', event => {
    desiredCity = event.target.textContent;

    var searchForecastURL = ('http://api.openweathermap.org/data/2.5/forecast?q=' + desiredCity + '&appid=' + openWeatherKey + '&units=metric');
    var searchWeatherURL  = ('https://api.openweathermap.org/data/2.5/weather?q=' + desiredCity + '&appid=' + openWeatherKey + '&units=metric');
    
    getWeatherData(searchForecastURL, searchWeatherURL);
})


//Display today's weather
var displayWeather = weatherData => {

    var weatherDiv = $('<div>').addClass('weather-div');
    var HeaderDiv = $('<div>').addClass('date-and-icon');

    var weatherHeader = $('<h2>');
    weatherHeader.text(weatherData.name + ' (' + weatherData.sys.country + '), ' + dayjs().format('DD/MM/YY'));
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
    var forecastHeader = $('<h2>').text('5 Day Forecast').addClass('forecast-header');
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
            var todaysHumidityEl = $('<li>').text('Humidity: ' + todaysHumidity + '%');
   
            dailyInfoList.append(currentDateEl).append(todaysIcon).append(todaysTempEl).append(todaysWindEl).append(todaysHumidityEl)
            oneDayForecast.append(dailyInfoList).css('background-color', 'rgba(2,117,216,0.5)');
            forecastDiv.append(oneDayForecast);

            ifCounter++;
        }
    }

    forecastSection.append(forecastHeader).append(forecastDiv);

}
