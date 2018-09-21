//declare variables and select elements

var ROOT_URL = "http://api.openweathermap.org/data/2.5/weather?zip=";
var API_KEY = '46828e64a164cdc0880c6c7c884826a2';
//select the elements cityTitle, zip input bar, weather div, img with class icon, span with class temp, span with class humid, select the span with the class deg
var cityTitle = document.querySelector(".cityTitle");
var zip = document.querySelector(".zip");

var weather = document.querySelector('div');
var icon = document.querySelector('.icon');
var i = 0;
var temp = document.querySelector('.temp');
var humid = document.querySelector('.humid');
var deg = document.querySelector('.deg');
var convert = document.querySelector('.convert');
var kelvin;

var icons = [{
    weather: "img/cloudy.png"
  },
  {
    weather: "img/partly-cloudy.png"
  },
  {
    weather: "img/rain.png"
  },
  {
    weather: "img/snow.png"
  },
  {
    weather: "img/sun.png"
  },
  {
    weather: "img/thunderstorm.png"
  },
];

var position = [];
var centerPosition = [];

function showGoogleMaps() {
  // Map positions
  const latLng = new google.maps.LatLng(position[0], position[1]);
  const centerLatLng = new google.maps.LatLng(centerPosition[0], centerPosition[1]);

  // Map options
  const mapOptions = {
    zoom: 12,
    streetViewControl: false,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: centerLatLng
  }

  // Create map
  map = new google.maps.Map(document.getElementById('googlemap'), mapOptions);


  // Show Marker
  marker = new google.maps.Marker({
    position: latLng,
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP
  });
}


function iconSelector(weather) {
  switch (weather) {
    case 'Cloudy':
    case 'Clouds':
      icon.src = icons[0].weather;
      break;
    case 'Partly-cloudy':
      icon.src = icons[1].weather;
      break;
    case 'Wet':
    case 'Rain':
      icon.src = icons[2].weather;
      break;
    case 'Cold':
    case 'Snow':
      icon.src = icons[3].weather;
      break;
    case 'Dry':
    case 'Mist':
    case 'Hot':
    case 'Calm':
    case 'Clear':
    case 'Sun':
      icon.src = icons[4].weather;
      break;
    case 'Stormy':
    case 'Thunderstorm':
      icon.src = icons[5].weather;
      break;
  }
  // Maps event
  showGoogleMaps();
  return;
}


//define functions
function KtoF(kelvin) {
  return Math.floor((1.8 * kelvin) - 459.67);
}

function KtoC(kelvin) {
  return Math.floor(kelvin - 273.15);
}

convert.addEventListener('click', function () {

  if (convert.textContent === 'Convert to F') {
    convert.textContent = 'Convert to C';
    temp.textContent = KtoF(kelvin);
    deg.innerHTML = '&deg; F';
  } else {
    temp.textContent = KtoC(kelvin);
    deg.innerHTML = '&deg; C';
    convert.textContent = 'Convert to F';
  }

});


//define functions

function getWeather(zipCode) {

  if (zipCode.length !== 5) {
    alert('The zip Code should be 5 characters');
    return;
  }

  $.ajax({
    type: 'GET',
    url: `${ROOT_URL}${zipCode},us&appid=${API_KEY}`,
    dataType: 'json',
    success: function (data) {
      console.log('ALL DATA', data);
      cityTitle.textContent = data.name;
      weather.textContent = data.weather[0].main;
      humid.textContent = data.main.humidity;
      kelvin = data.main.temp;
      temp.innerHTML = KtoF(kelvin);
      iconSelector(data.weather[0].main);

      position.push(data.coord.lat, data.coord.lon);
      centerPosition.push(data.coord.lat, data.coord.lon);
    },
    error: function (error) {
      console.log("There was an error");
      alert('This Zip Code not exist');
    }
  });
}

//call functions and/or add Event Listeners
zip.addEventListener('keypress', function (e) {
  if (e.keyCode == 13) {
    //console.log("Pressing Enter");
    getWeather(zip.value);
  }
});