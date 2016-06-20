
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
	console.log('coords', positionObject)
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
	//currentView = document.querySelector('#currentContainer')
	//hourlyView = document.querySelector('#hourlyContainer')
	//dailyView = document.querySelector('#dailyContainer')


//Time Conversion Function
var timeConversion = function(inputMilsec){    
   	 	var date = new Date(inputMilsec * 1000)
    	var h = date.getHours() % 12
    	var m = date.getMinutes()
    	var amPm = ''
    
    	if(m < 10){
        	m = '0' + m
    	} 

    	if (h === 0) {
            h = 12
        } 

        if (h >= 12) {
            amPm = "PM"
        } else {
            amPm = "AM"
        }
    
    	return h + ':' + m + ' ' + amPm 
}

/*var time = function() {
	todaysDate = new Date ()
	currentTime = timeConversion(todaysDate)
	console.log(currentTime)
	container.innerHTML += currentTime
}

setInterval(time, 1000) */


//Create Handler Functions 
var renderCurrentView = function(apiWResponse){
	console.log(apiWResponse)
	var curentTemp = apiWResponse.currently.temperature,
		currentSummary = apiWResponse.currently.summary,
		currentTime = apiWResponse.currently.time

	var htmlString = ''
		htmlString += '<div id="currentContainer">'
		htmlString += '<h1>' + Math.floor(curentTemp) + '&deg' + 'F' + '</h1>'
		//htmlString += '<h2>' + timeConversion(currentTime) + '</h2>'
		//htmlString += '<h2>' + currentSummary + '</h2>'
		htmlString += '</div>'
	
	container.innerHTML = htmlString
}

var renderHourlyView = function(apiWResponse){	
	var hourlyArray = apiWResponse.hourly.data
	var htmlHourlyString = ''
	// Create Loop for Hourly Array
	for (var i = 0; i < 12; i++) {
			var hourlyObject = hourlyArray[i],
				hourlyTime = hourlyObject.time,
				hourlySummary = hourlyObject.summary,
				hourlyTemp = hourlyObject.temperature,
				hourlyRainChance = hourlyObject.precipProbability * 100

		
		htmlHourlyString += '<div id="hourlyContainer">'
		htmlHourlyString += '<h2>' + timeConversion(hourlyTime) + '</h2>'
		htmlHourlyString += '<p>' + Math.floor(hourlyTemp) + '&deg' + 'F' + '</p>'
		htmlHourlyString += '<p>' + hourlySummary + '</p>'
		htmlHourlyString += '<p> Rain Chance: ' + Math.floor(hourlyRainChance) + '%' + '</p>'
		htmlHourlyString += '</div>'

	}
	container.innerHTML = htmlHourlyString

}

var daysOfWeek =[
	"Sun",
	"Monday",
	"Tuesday",
	"Wed",
	"Thur",
	"Fri",
	"Sat",
]



var renderDailyView = function(apiWResponse){
	var dailyArray = apiWResponse.daily.data
	console.log(apiWResponse)
	var htmlDailyString = ''

	// Create Loop for Hourly Array
	for (var i = 0; i < 7; i++) {
		console.log(i)
			var dailyObject = dailyArray[i],
				dailyTime = dailyObject.time,
				dailySummary = dailyObject.summary,
				dailyTemp = dailyObject.temperatureMax,
				dailyRainChance = dailyObject.precipProbability * 100
 
			// convert .time property to js date object
			var dateObject = new Date(dailyTime * 1000)
			// get day-integer
			var dayOfWeekInt = dateObject.getDay()


			
			htmlDailyString += '<div id="dailyContainer">'
			htmlDailyString += '<h1>' + daysOfWeek[dayOfWeekInt] + '</h1>'
			htmlDailyString += '<h3>' + Math.floor(dailyTemp) + '&deg' + 'F' + '</h3>'
			//htmlDailyString += '<p>' + timeConversion(dailyTime) + '</p>'
			htmlDailyString += '<p>' + dailySummary + '</p>'
			htmlDailyString += '<p> Rain Chance: ' + Math.floor(dailyRainChance) + '%' + '</p>'
			htmlDailyString += '</div>'
			
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
    
 	var fullUrl = baseURL + '/' + inputlat + ',' + inputlng + '?callback=?'
   
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

	// var weatherPromise = fetchData( hashObjectData().lat, hashObjectData().lng )
	
	if (!location.hash) {
		console.log('fetching coords??')
        navigator.geolocation.getCurrentPosition(geoLocationFinder, errorHandler)
        // fetchData(hashObjectData().lat, hashObjectData().lng)

        return
    }

	//Condtion for Hash Routing
	if(currentViewType === 'current'){
		fetchData(hashObjectData().lat, hashObjectData().lng).then(renderCurrentView)	
	} 
		
	else if(currentViewType === 'hourly'){
		fetchData(hashObjectData().lat, hashObjectData().lng).then(renderHourlyView)
	}
	
	else if(currentViewType === 'daily'){
		fetchData(hashObjectData().lat, hashObjectData().lng).then(renderDailyView)
	}	

}


// location.hash = hashObjectData().lat + '/' + hashObjectData().lng + '/'+ 'current'
controller()

//Create any Event Listeners
window.addEventListener('hashchange', controller)
currentButton.addEventListener('click', updateHash)
hourlyButton.addEventListener('click', updateHash)
dailyButton.addEventListener('click', updateHash)



