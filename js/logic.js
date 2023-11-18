//DOM declarations
var inputEl = $('#search-input');
var weatherSection = $('#today');
var forecastSection = $('#forecast');
var searchesSection = $('#searches');
var searchesBtn = $('#search-history-button');



//On search button click, show weather data for city searched
$('#search-button').on('click', event => {
    event.preventDefault();

    var cityName = inputEl.val();
    
    // API URLs
    var queryForecastURL = ('http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');
    var queryWeatherURL  = ('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + openWeatherKey + '&units=metric');

    //request forecast data
    fetch(queryForecastURL)
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data);
    })

    //Request current weather data
    fetch(queryWeatherURL)
    .then(response => {
    return response.json();
    })
    .then(data => {
        console.log(data);
        weatherSection.empty();
        displayWeather(data);
        saveCity(cityName);
    })


})


//Save search to local storage
var saveCity = city => {
    
    var searchHistoryArray = JSON.parse(localStorage.getItem('previous-searches')) || [];
    console.log(searchHistoryArray);
    searchHistoryArray.push(city);
    localStorage.setItem('previous-searches', JSON.stringify(searchHistoryArray));
}

 searchesBtn.on('click', () => {
    
    var searches = JSON.parse(localStorage.getItem('previous-searches'));  
    console.log(searches);

    //loop through searches and create button for previous searches 
    //add class to new buttons
    //create delegated event listener for click of new button
    //on button click, clear display and show data corresponding to city name of new button
})


//Display today's weather
var displayWeather = weatherData => {

    var weatherDiv = $('<div>');
    var HeaderDiv = $('<div>');

    var weatherHeader = $('<h2>');
    weatherHeader.text(weatherData.name + ' ' + dayjs().format('DD/MM/YY'));
    weatherIconURL = ('https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
    var weatherIcon = $('<img>').attr('src', weatherIconURL);
    console.log(weatherIconURL)

    var detailsList = $('<ul>');

    var temp = $('<li>').text('Temperature: ' + weatherData.main.temp);
    var wind = $('<li>').text('Wind Speed: ' + (weatherData.wind.speed * 2.2369362921).toFixed(2) + 'mph' );
    var humidity = $('<li>').text('Humidity: ' + weatherData.main.humidity + '%');

    weatherSection.append(weatherDiv);
    weatherDiv.append(HeaderDiv).append(detailsList);
    HeaderDiv.append(weatherHeader).append(weatherIcon);
    detailsList.append(temp).append(wind).append(humidity);

}
