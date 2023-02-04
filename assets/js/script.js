// required variables
let citySearches = []; // object for local storage
var latitude = "";
var longitude = "";
var date = "";
var city = "";
var sunrise = "";
var firstLight = "";
var dawn = "";
var dusk = "";
var lastLight = "";
var sunset = "";
var imageURL = "";

let searchBtn = document.querySelector("#search-button");
let searchForm = document.querySelector("#search-form");
let initialImage = document.querySelector("#initial-image");
let mainContainer = document.querySelector(".main-content-container");
let myLocationsSection = document.querySelector("#my-locations-section");

const mapContent = $(".overflow-hidden");
const history = $("#history");



// pulls info from local storage and saves to the city searches object


$("#search-button").click(function (event) {
  event.preventDefault();

  const queryParam = $("#search-input").val();
  city = $("#search-input").val();
  const location =
    "https://nominatim.openstreetmap.org/search.php?city=" +
    queryParam +
    "&format=jsonv2";
  console.log(location);

  if (!queryParam) {
    return;
  }

  fetch(location)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCityData(data);
      
      latitude = data[0].lat;
      longitude = data[0].lon;
      imageURL =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        latitude +
        "%2c%20" +
        longitude +
        "8&zoom=12&size=600x600&key=AIzaSyCoIJTitaSal9kU_w5Gz0c-M5epiS69i44";


      // call to sunset api

      const sunriseSunset =
        "https://api.sunrisesunset.io/json?lat=" +
        latitude +
        "&lng=" +
        longitude +
        "&date=" +
        date;
      $.ajax({
        url: sunriseSunset,
        method: "GET",
      }).then(function (sunriseSunsetResponse) {
        console.log(sunriseSunsetResponse);

        //saving API response to global scoped variables
        sunrise = sunriseSunsetResponse.results.sunrise;
        firstLight = sunriseSunsetResponse.results.first_light;
        dawn = sunriseSunsetResponse.results.dawn;
        dusk = sunriseSunsetResponse.results.dusk;
        lastLight = sunriseSunsetResponse.results.last_light;
        sunset = sunriseSunsetResponse.results.sunset;


        //adds sunrise data to HTML
        $("#first-light").text(firstLight);
        $("#sunrise").text(sunrise);
        $("#dawn-time").text(dawn);
        $("#dusk-time").text(dusk);
        $("#last-light").text(lastLight);
        $("#sunset").text(sunset);
        $("#map-title").text(city);

        // Card Titles

        $("#sunrise-card").text(city + " Sunrise Information");
        $("#sunset-card").text(city + " Sunset Information");
        //map image
        $("#mapimage").attr("src", imageURL);
  


      });
      savedToLS(data, city);
      createButton(city);
    });

    

    // saved to local storage 
function savedToLS(data, cityName) {
  const cities = JSON.parse(localStorage.getItem("location")) || []
  console.log(data[0].display_name, cityName);
  cities.push(data[0].display_name);
  localStorage.setItem("location", JSON.stringify(cities))
  
  }

    //a button is generated for the searched city

    function createButton (cityName) {
      const button = $('<button class="button">' + cityName + "</button>");
      button.click(getHistory)
      history.append(button)
      
      }

        // stored city name and the data are linked

  function getHistory(event) {
    const queryParam = $("#search-input").val();
    city = $("#search-input").val();
    const location =
      "https://nominatim.openstreetmap.org/search.php?city=" +
      queryParam +
      "&format=jsonv2";
    console.log(location);
  
    if (!queryParam) {
      return;
    }
  
    fetch(location)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        
       

      })
      displayCityData(data);
    }

    function sunGet(event) {
      latitude = data[0].lat;
      longitude = data[0].lon;
      imageURL =
        "https://maps.googleapis.com/maps/api/staticmap?center=" +
        latitude +
        "%2c%20" +
        longitude +
        "8&zoom=12&size=600x600&key=AIzaSyCoIJTitaSal9kU_w5Gz0c-M5epiS69i44";


      // call to sunset api

      const sunriseSunset =
        "https://api.sunrisesunset.io/json?lat=" +
        latitude +
        "&lng=" +
        longitude +
        "&date=" +
        date;
      $.ajax({
        url: sunriseSunset,
        method: "GET",
      }).then(function (sunriseSunsetResponse) {
        console.log(sunriseSunsetResponse);
        
        //saving API response to global scoped variables
        sunrise = sunriseSunsetResponse.results.sunrise;
        firstLight = sunriseSunsetResponse.results.first_light;
        dawn = sunriseSunsetResponse.results.dawn;
        dusk = sunriseSunsetResponse.results.dusk;
        lastLight = sunriseSunsetResponse.results.last_light;
        sunset = sunriseSunsetResponse.results.sunset;


        //adds sunrise data to HTML
        $("#first-light").text(firstLight);
        $("#sunrise").text(sunrise);
        $("#dawn-time").text(dawn);
        $("#dusk-time").text(dusk);
        $("#last-light").text(lastLight);
        $("#sunset").text(sunset);
        $("#map-title").text(city);

        // Card Titles

        $("#sunrise-card").text(city + " Sunrise Information");
        $("#sunset-card").text(city + " Sunset Information");
        //map image
        $("#mapimage").attr("src", imageURL);
        
      });
    }

  function displayCityData(data) {
    const cardContainer = $('<div class="myCard">');

    const cityName = $("<div>City: " + data[0].display_name + " </div>");
    const latDiv = $("<div>Lat: " + data[0].lat + " </div>");
    const lonDiv = $("<div>Lon: " + data[0].lon + " </div>");
    const cityBlurb = $(
      "<div> Here is how to find " +
        "<strong>" +
        city +
        "</strong>" +
        ", have fun seeing the sights!" +
        "</div>"
    );

    cardContainer.append(cityName);
    cardContainer.append(latDiv);
    cardContainer.append(lonDiv);
    cardContainer.append(cityBlurb);
    mapContent.empty();
    mapContent.append(cardContainer);
  }
  
});

// sets initial display values for main container and -
// mylocations sections.
mainContainer.style.display = "none";
myLocationsSection.style.display = "none";

// function that hides initial image  -
// and displays main container and my locations sections
// will need to add other criteria in case the user submits empty fields.
function switchInitialImage() {
  if (initialImage.style.display !== "none") {
    initialImage.style.display = "none";
    mainContainer.style.display = "inherit";
    myLocationsSection.style.display = "inherit";
  }
}

// click event that prevents default and then -
// checks if button clicked is the searchBtn and then -
// calls switchInitialImage function.
searchForm.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target === searchBtn) {
    switchInitialImage();
  }
});

// moment .js
var timeDisplayEl = $("#time-display");

// handle displaying the time
function displayTime() {
  var rightNow = moment().format("llll");
  timeDisplayEl.text(rightNow);
  setInterval(displayTime, 1000);
}

// Datepicker widget
$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
    maxDate: "+3m" // sets max date on date picker
  });
});

// saves the date to the date variable
$("#datepicker").on("change", function () {
  date = $(this).val();
});

//runs the time function
displayTime();
