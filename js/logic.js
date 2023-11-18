//DOM declarations
var inputEl = $('#search-input');
var weatherSection = $('#today')

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
    })

})

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

