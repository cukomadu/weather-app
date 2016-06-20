
// Inital API Request - https: //api.forecast.io/forecast/0bf718b5981b6235215b4883a6243442/LATITUDE,LONGITUDE

//Internal Hash Routes
// Current View Type - #29.735119288922718/-95.39056615147274/current
// Hourly View Type - #29.735119288922718/-95.39056615147274/hourly
// Weekly View Type - #29.735119288922718/-95.39056615147274/weekly
//-----------------------------------------------------------------------------//


var	apiKey = '0bf718b5981b6235215b4883a6243442'
var baseURL = 'https://api.forecast.io/forecast/' + apiKey

// Handle Default Route
var geoLocationFinder = function(positionObject){
	var latitude = positionObject.coords.latitude
	var	longitude = positionObject.coords.longitude
		location.hash = latitude + '/' + longitude + '/current'
}

var errorHandler = function(error){
	 new error('Unable to find location coordinates. Check your browser location settings')
}


// Define Key Elements
var container = document.querySelector('#container'),
	navigation = document.querySelector('#nav-buttons'),
	hourlyButton = document.querySelector('#hourly'),
	currentButton = document.querySelector('#current'),
	dailyButton = document.querySelector('#daily')


//Create Handler Functions 
var renderCurrentView = function(apiWResponse){
	console.log(apiWResponse)
	var curentTemp = apiWResponse.currently.temperature,
		currentSummary = apiWResponse.currently.summary,
		currentTime = apiWResponse.currently.time

	var htmlString = ''
		htmlString += '<h1>' + Math.floor(curentTemp) + '</h1>'
		htmlString += '<h2>' + currentTime + '</h2>'
		htmlString += '<h2>' + currentSummary + '</h2>'
	
	container.innerHTML = htmlString
}

var renderHourlyView = function(apiWResponse){	
	var hourlyArray = apiWResponse.hourly.data

	// Create Loop for Hourly Array
	for (var i = 0; i < 12; i++) {
			var hourlyObject = hourlyArray[i],
				hourlyTime = hourlyObject.time,
				hourlySummary = hourlyObject.summary,
				hourlyTemp = hourlyObject.temperature,
				hourlyHumidity = hourlyObject.humidity

		var htmlHourlyString = ''
		htmlHourlyString += '<div>'
		htmlHourlyString += '<h1>' + Math.floor(hourlyTemp) + '</h1>'
		htmlHourlyString += '<p>' + hourlyTime + '</p>'
		htmlHourlyString += '<p>' + hourlySummary + '</p>'
		htmlHourlyString += '<p>' + hourlyHumidity + '</p>'
		htmlHourlyString += '</div>'

	}
	container.innerHTML = htmlHourlyString

}


var renderDailyView = function(apiWResponse){
	var dailyArray = apiWResponse.daily.data
	console.log(apiWResponse)
	// Create Loop for Hourly Array
	for (var i = 0; i < 7; i++) {
			var dailyObject = dailyArray[i],
				dailyTime = dailyObject.time,
				dailySummary = dailyObject.summary,
				dailyTemp = dailyObject.temperatureMax,
				dailyHumidity = dailyObject.humidity
				console.log(dailyTemp)

		var htmlDailyString = ''
		htmlDailyString += '<h1>' + Math.floor(dailyTemp) + '</h1>'
		htmlDailyString += '<p>' + dailyTime + '</p>'
		htmlDailyString += '<p>' + dailySummary + '</p>'
		htmlDailyString += '<p>' + dailyHumidity + '</p>'

	}
	container.innerHTML = htmlDailyString
}


var hashObjectData = function(){
	var currentHash = location.hash.substr(1)
	var splitCurrentHash = currentHash.split('/')
	var forecastParams = {
		lat: splitCurrentHash[0],
		lng: splitCurrentHash[1],
		viewType: splitCurrentHash[2]
	}	
	return forecastParams
}


function fetchData(inputlat, inputlng) {
    
 	var fullUrl = baseURL + '/' + inputlat + ',' + inputlng
   
    //Inital API Call
	var geoPromise = $.getJSON(fullUrl)
    return geoPromise
}

// Change Hash Function
	var updateHash = function(eventObj){
		var newHash = eventObj.target.value
		location.hash = hashObjectData().lat + '/' + hashObjectData().lng + '/'+ newHash
	}	


// Create Controller
var controller = function(){
	//Process to build fullUrl for initial API Request
	// since location.hash is a global variable. we need to retreive the lat and long info for our current location from location.hash
	// this is what location.hash looks like right now - #29.741130063122032/-95.77695079302178/current 
	// full url = https: //api.forecast.io/forecast/0bf718b5981b6235215b4883a6243442/LATITUDE,LONGITUDE
	var currentViewType = hashObjectData().viewType

	var weatherPromise = fetchData(hashObjectData().lat, hashObjectData().lng)
	
	if (!location.hash) {
        navigator.geolocation.getCurrentPosition(geoLocationFinder, errorHandler)
        return
    }

	//Condtion for Hash Routing
	if(currentViewType === 'current'){
		weatherPromise.then(renderCurrentView)	
	} 
		
	else if(currentViewType === 'hourly'){
		weatherPromise.then(renderHourlyView)
	}
	
	else if(currentViewType === 'daily'){
		weatherPromise.then(renderDailyView)
	}	
	
}




controller()

//Create any Event Listeners
window.addEventListener('hashchange', controller)
currentButton.addEventListener('click', updateHash)
hourlyButton.addEventListener('click', updateHash)
dailyButton.addEventListener('click', updateHash)



