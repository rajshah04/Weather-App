const userTab = document.querySelector("[data-userWeather]") ;
const searchTab = document.querySelector("[data-searchWeather]") ;
const userContainer = document.querySelector(".weather-container") ;

const grantAccessContainer = document.querySelector(".grant-location-container") ;
const searchForm = document.querySelector("[data-searchForm") ;
const loadingScreen = document.querySelector(".loading-container") ;
const userInfoContainer = document.querySelector(".user-info-container") ;

// initially variables needed

let currentTab = userTab ;
const API_KEY = "e8abebd4d7295dc8d628c58c2f136942" ;
currentTab.classList.add("current-tab") ;

// one more is pending
getfromSessionStorage() // if the latitude and longitude are present , then it will show the data

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab") ;
        currentTab = clickedTab ;
        currentTab.classList.add("current-tab") ;

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active") ;
            grantAccessContainer.classList.remove("active") ;
            searchForm.classList.add("active") ;
        }
        else {
            // first I was on search tab , now I want to see my weather
            searchForm.classList.remove("active") ;
            userInfoContainer.classList.remove("active") ;

            // now I am in Your Weather tab , so I need to display the weather now , so let's check local storage for coordinates , if we have saved them there
            getfromSessionStorage() ;
        }
    }
}

userTab.addEventListener('click' , () => {
    // pass clicked tab as input parameter
    switchTab(userTab) ;
})

searchTab.addEventListener('click' , () => {
    // pass clicked tab as input parameter
    switchTab(searchTab) ;
})

// checking if coordinates are already present in the session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates") ;
    if(!localCoordinates){
        grantAccessContainer.classList.add("active") ;
    }
    else {
        const coordinates = JSON.parse(localCoordinates) ;
        // this function will bring the weather information based on the coordinates given
        fetchUserWeatherInfo(coordinates) ;
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat , lon} = coordinates ;
    // make the grantContainer invisible
    grantAccessContainer.classList.remove("active") ;
    // make the loading gif visible
    loadingScreen.classList.add("active") ;

    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;
        const data = await response.json() ;
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        renderWeatherInfo(data) ;

    } catch(err){
        loadingScreen.classList.remove("active") ;
    }
}

function renderWeatherInfo(weatherInfo) {
    // first , we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]") ;
    const countryIcon = document.querySelector("[data-countryIcon]") ;
    const desc = document.querySelector("[data-weatherDesc]") ;
    const weatherIcon = document.querySelector("[data-weatherIcon]") ;
    const temp = document.querySelector("[data-temp]") ;
    const windspeed = document.querySelector("[data-windspeed]") ;
    const humidity = document.querySelector("[data-humidity]") ;
    const cloudiness = document.querySelector("[data-cloudiness]") ;

    // fetch values from weather info objects and put in UI elements
    // here, we used optional chaining concept of javascript , to access the nested objects
    cityName.innerText = weatherInfo?.name ;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png` ;
    desc.innerText = weatherInfo?.weather?.[0]?.description ;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` ;
    temp.innerText = weatherInfo?.main?.temp + " °C" ;
    // temp.innerText = `${weatherInfo?.main?.temp} °C` ;
    windspeed.innerText = weatherInfo?.wind?.speed + " m/s" ;
    humidity.innerText = `${weatherInfo?.main?.humidity}.00%`  ;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}.00%` ;
}

const grantAccessButton = document.querySelector("[data-grantAccess]") ;
grantAccessButton.addEventListener('click' , getLocation) ;

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition) ;
    }
    else{
        // hw -> show an alert for no geolocation support available
        alert("Your current browser version does not support Location access. Please try again later.") ;
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude ,
        lon: position.coords.longitude ,
    } ;

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates)) ;
    fetchUserWeatherInfo(userCoordinates) ;
}

const searchCity = document.querySelector("[data-searchInput]") ;
// const searchBtn = document.querySelector(".btn") ;
searchForm.addEventListener('submit' , (e) => {
    e.preventDefault() ;
    let cityName = searchCity.value ;
    if(cityName === "")
        return ;
    else    
        // searchCityWeather(cityName) ;
        fetchSearchWeatherInfo(cityName) ;
}) ;

// searchBtn.addEventListener('click' , searchCityWeather()) ;
//  whenever a button is inside a form tag , clicking on the button will cause the page to reload automatically 

// async function searchCityWeather(cityName) {
async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active") ;
    userInfoContainer.classList.remove("active") ;
    grantAccessContainer.classList.remove("active") ;
    try{
        // const cityName = searchCity.value ;
        console.log(cityName) ;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`) ;

        const data = await response.json() ;
        loadingScreen.classList.remove("active") ;
        userInfoContainer.classList.add("active") ;
        // console.log(data?.visibility) ;
        renderWeatherInfo(data) ;
    }catch(err){
        console.log("An error occured" , err) ;
    }
}

// Add error section i.e. when the user inputs wrong city name
// Add media query for paramater cards