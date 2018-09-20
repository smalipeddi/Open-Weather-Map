var app = angular.module('openWeatherApp', []);

/**
  * Service to Fetch weather Details for a given city
*/
app.factory('weatherService', weatherService);

/**
  * Controller 
*/

app.controller('OWAController', ['$scope', '$http', '$log' , 'weatherService' ,function($scope, $http, $log, weatherService ) {

  $scope.weatherDetailsOfAllCities = [];
  $scope.unit = {
        name: 'metric'
  };

  $scope.submit = function() {
	  weatherService.getWeatherDetails().then(function(response) {
	  	console.log(response);
	  	console.log("sunitha");
	    $scope.weatherInfo = response.data;
	    $scope.hideTable = true;
	    $scope.weatherInfo.length === 0 ? $scope.hideTable : !($scope.hideTable);
	  
	    $scope.data = {};
	    $scope.data.city = $scope.weatherInfo.name;
	    $scope.data.country = $scope.weatherInfo.sys.country;
	    $scope.data.temperature = $scope.weatherInfo.main.temp;

        $scope.data.wind = $scope.weatherInfo.wind.speed;
	    $scope.data.cloud = $scope.weatherInfo.weather[0].description;

	    var sunrise = new Date($scope.weatherInfo.sys.sunrise * 1000).toLocaleString();
	    $scope.data.sunrise = moment(sunrise).format('hh:mm');

	    var sunset = new Date($scope.weatherInfo.sys.sunset * 1000).toLocaleString();
	    $scope.data.sunset = moment(sunset).format('hh:mm');

	    $scope.weatherDetailsOfAllCities.push($scope.data);
	    $log.info($scope.data);
	    $scope.city = "";

	    
	  },function(reason){
	  	$scope.error = reason.data.message;
	  	$log.info = reason.data.message;
	  	alert($log.info);


	  });
  }

  $scope.orderByMe = function(x) {
    $scope.myOrderBy = x;
  }
}]);


function weatherService($http) {
 return {
  getWeatherDetails: function() {
   var city = document.getElementById("city").value;
   var apiKey = "b9c56f739aa6baec73076c50188256dc";
   return $http.get("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey);
  }

 }
}

/**
  * Filter to Format Temperature for Metric/Imperial Units 
*/

app.filter('formatTemperatureFilter', function() {
    return function(input ,unit ) {
    	var degreesSymbol = '\u00B0';
        var label = "";
        unit === 'metric' ? label = 'C' : label = 'F';

	    function convertKelvinToCelsius(value) {
	        return Math.round(value - 273.0);
	    }

	    function convertKelvinToFarenheit(value) {
	        return Math.round(((value - 273.0) * 9.0 / 5.0) + 32);
	    }

	    function addDegreesSymbol(value) {
	        return value += degreesSymbol;
	    }

	    var value = parseInt(input, 10),convertedValue;

	    if (isNaN(value)) throw new Error('Input is not a number');

	    if (unit === 'metric') {
	        convertedValue = convertKelvinToCelsius(value);
	    } else if (unit === 'imperial') {
	        convertedValue = convertKelvinToFarenheit(value);
	    } else {
	        throw new Error('Not a valid unit');
	    }
	        return convertedValue = convertedValue + " " + '\u00B0' + label ;
	    };

});

/**
  * Filter to Format Speed for Metric/Imperial Units 
*/
app.filter('formatWindFilter', function() {
    return function(input ,unit) {
    	
    	var label = "";
        unit === 'metric' ? label = 'km/hr' : label = 'm/hr';
	   
	    function convertMilesPerHrToKmPerHr(value) {
	        return Math.round(value * 1.61);
	    }

	    var value = parseInt(input, 10),convertedValue;

	    if (isNaN(value)) throw new Error('Input is not a number');

	    if (unit === 'metric') {
	        convertedValue = convertMilesPerHrToKmPerHr(value);
	    }
	    else if( unit == 'imperial'){
	    	convertedValue = value;
	    }else{
	    	 throw new Error('Not a valid unit');
	    }
	        return convertedValue = convertedValue +  " " + label ;
	    };

});

/**
  * Filter to Capitalize Description
*/
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

