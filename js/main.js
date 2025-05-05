
var diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
var diasSemanaCompleto = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const day1Text = document.getElementById("day1");
const day2Text = document.getElementById("day2");
const day3Text = document.getElementById("day3");
const day4Text = document.getElementById("day4");

const currentLocation = document.getElementById("currentLocation");

const currentMainTemperature = document.getElementById("currentMainTemperature");
const currentMinTemperature = document.getElementById("currentMinTemperature");
const currentMaxTemperature = document.getElementById("currentMaxTemperature");

var whiteSkycons = new Skycons({"color": "#fff"});
var darkSkycons = new Skycons({"color": "#000"});
var coords;


function setTime(){ 
    var date = new Date;
    
    var day = diasSemana[date.getDay()];
    var hora = convertHour(date.getHours());
    var minutos = date.getMinutes();
    var segundos = date.getSeconds();
    var meridiano = date.getHours() < 12 ? "AM" : "PM";
    if(hora == 7 && minutos == 00 && segundos == 0 && meridiano == "PM"  ){
        resetClasses();
        renewValues();
    }
    if(hora == 12 && minutos == "00" && segundos == 0 && meridiano == "AM"){
        resetClasses();
        renewValues();
    }
    if(hora == 5 && minutos == "00" && segundos == 0 && meridiano == "AM"){
        resetClasses();
        renewValues();
    }

    
    document.getElementById("time").innerHTML = day + ", " + addZero(hora) + " : " + addZero(minutos) + " " + meridiano;
    
    
    
    setTimeout(setTime, 1000);
}



function addZero(num){
    if(num < 10){
        return "0"+num;
    }else{
        return num;
    }
}

function convertHour(hour){
    if(hour > 12){
        return hour%=12;
    }else if(hour == 0){
        return 12;
    }else{
        return hour;
    }
}

function renewValues(){
    
        let urlAPICurrent = 'https://api.openweathermap.org/data/2.5/weather?lat='+coords.latitude +'&lon='+coords.longitude+'&appid=b31a4dc735c0601f6143f5c67ab6fe9d&units=metric';
        fetch(urlAPICurrent)
            .then(response => response.json())
            .then(currentWeather =>{
                var city = currentWeather.name;
                var country = currentWeather.sys.country;
                currentLocation.innerHTML = city + ", " + country;
                
                                    

        })
        let urlAPIForecast = 'https://api.openweathermap.org/data/2.5/onecall?lat='+coords.latitude+'&lon='+coords.longitude+'&exclude=hourly,minutely&appid=b31a4dc735c0601f6143f5c67ab6fe9d&units=metric';
        fetch(urlAPIForecast)
            .then(response => response.json())
            .then(forecastWeather =>{
                var date = new Date;
                
                var hora = convertHour(date.getHours());
                var minutos = date.getMinutes();
                
                var meridiano = date.getHours() < 12 ? "AM" : "PM";
                        
                let iconCurrentWeather = forecastWeather.daily[0].weather[0].main;
                if(iconCurrentWeather == "Clouds"){
                    if(forecastWeather.daily[0].weather[0].description == "few clouds"){
                        iconCurrentWeather = "Partly-cloudy-day";
                    }else{
                        iconCurrentWeather = "Cloudy";
                    }
                }
                if((hora >= 7 && minutos >=0 && meridiano == "PM") || (hora < 5 && meridiano == "AM")){
                    
                    document.querySelector(".div-current-day").classList.add("night");
                    document.querySelector(".div-current-day").dataset.class = "night";
                    document.querySelector(".separator").style.borderTop = "1px solid rgb(255, 255, 255)";
                    if(forecastWeather.daily[0].weather[0].main == "Clear"){
                        whiteSkycons.add("iconCurrentDay", Skycons.CLEAR_NIGHT);
                    }else{
                        whiteSkycons.add("iconCurrentDay", Skycons.PARTLY_CLOUDY_NIGHT);
                    }
                    
                }else{
                    switch(iconCurrentWeather){
                    case "Clear":
                        darkSkycons.add("iconCurrentDay", Skycons.CLEAR_DAY);
                        document.querySelector(".div-current-day").classList.add("sunny");
                        document.querySelector(".div-current-day").dataset.class = "sunny";
                        document.querySelector(".separator").style.borderTop = "1px solid rgb(0, 0, 0)";
                        break;    
                    case "Partly-cloudy-day":
                        darkSkycons.add("iconCurrentDay", Skycons.PARTLY_CLOUDY_DAY);
                        document.querySelector(".div-current-day").classList.add("Partly-cloudy-day");
                        document.querySelector(".separator").style.borderTop = "1px solid rgb(0, 0, 0)";
                        break; 
                    case "Cloudy":
                        darkSkycons.add("iconCurrentDay", Skycons.CLOUDY);
                        document.querySelector(".div-current-day").classList.add("cloudy");
                        document.querySelector(".div-current-day").dataset.class = "cloudy";
                        document.querySelector(".separator").style.borderTop = "1px solid rgb(0, 0, 0)";  
                        break; 
                    case "Rain":
                        whiteSkycons.add("iconCurrentDay", Skycons.RAIN);
                        document.querySelector(".div-current-day").classList.add("rainy");
                        document.querySelector(".div-current-day").dataset.class = "rainy";
                        document.querySelector(".separator").style.borderTop = "1px solid rgb(255, 255, 255)";
                        break; 
                    default: 
                        darkSkycons.add("iconCurrentDay", Skycons.CLEAR_DAY);
                        document.querySelector(".div-current-day").classList.add("sunny");
                        document.querySelector(".div-current-day").dataset.class = "sunny";
                        document.querySelector(".separator").style.borderTop = "1px solid rgb(0, 0, 0)";
                        break; 

                }
                }
                
                    
                
                currentMainTemperature.innerHTML = Math.round(forecastWeather.daily[0].temp.day);
                currentMinTemperature.innerHTML = Math.round(forecastWeather.daily[0].temp.min);
                currentMaxTemperature.innerHTML = Math.round(forecastWeather.daily[0].temp.max);
                
                
                for(var i =1; i<5; i++){
                    let weatherforecast = forecastWeather.daily[i].weather[0].main;
                    console.log(weatherforecast)
                    switch(weatherforecast){
                        case "Clear":
                            darkSkycons.add("iconDay"+i, Skycons.CLEAR_DAY);                        
                            document.getElementById("divForecastDay"+i).classList.add("sunny");
                            document.getElementById("divForecastDay"+i).dataset.class = "sunny";
                            break;    
                        case "Clouds":                        
                            if(forecastWeather.daily[i].weather[0].description == "few clouds"){
                                darkSkycons.add("iconDay"+i, Skycons.PARTLY_CLOUDY_DAY);
                                document.getElementById("divForecastDay"+i).classList.add("partly-cloudy-day");
                                document.getElementById("divForecastDay"+i).dataset.class = "partly-cloudy-day";
                            }else{
                                darkSkycons.add("iconDay"+i, Skycons.CLOUDY);
                                document.getElementById("divForecastDay"+i).classList.add("cloudy");
                                document.getElementById("divForecastDay"+i).dataset.class = "cloudy";

                            }
                            
                            break;                     
                        case "Rain":
                            whiteSkycons.add("iconDay"+i, Skycons.RAIN);
                            document.getElementById("divForecastDay"+i).classList.add("rainy"); 
                            document.getElementById("divForecastDay"+i).dataset.class = "rainy";

                            break; 
                        default: 
                            darkSkycons.add("iconDay"+i, Skycons.CLEAR_DAY);         
                            document.getElementById("divForecastDay"+i).classList.add("sunny");
                            document.getElementById("divForecastDay"+i).dataset.class = "sunny";

                            break; 
                    }
                    document.getElementById("mainTemperature"+i).innerHTML = Math.round(forecastWeather.daily[i].temp.day);
                    document.getElementById("extraTemperatures"+i).innerHTML = Math.round(forecastWeather.daily[i].temp.min) + '° / ' + Math.round(forecastWeather.daily[i].temp.max) + '°';
                    
                }
                

        })
                
        


        var date = new Date;
        
        day1Text.innerHTML = diasSemanaCompleto[(date.getDay()+1)%7];
        day2Text.innerHTML = diasSemanaCompleto[(date.getDay()+2)%7];
        day3Text.innerHTML = diasSemanaCompleto[(date.getDay()+3)%7];
        day4Text.innerHTML = diasSemanaCompleto[(date.getDay()+4)%7];
   
    
}

function resetClasses(){
    let classWeatherMain = document.querySelector(".div-current-day").dataset.class;
    let classWeatherDay1 = document.getElementById("divForecastDay1").dataset.class;
    let classWeatherDay2 = document.getElementById("divForecastDay2").dataset.class;
    let classWeatherDay3 = document.getElementById("divForecastDay3").dataset.class;
    let classWeatherDay4 = document.getElementById("divForecastDay4").dataset.class;

    if(classWeatherMain && classWeatherDay1 && classWeatherDay2 && classWeatherDay3 && classWeatherDay4){
        document.querySelector(".div-current-day").classList.remove(classWeatherMain);
        document.getElementById("divForecastDay1").classList.remove(classWeatherDay1);
        document.getElementById("divForecastDay2").classList.remove(classWeatherDay2);
        document.getElementById("divForecastDay3").classList.remove(classWeatherDay3);
        document.getElementById("divForecastDay4").classList.remove(classWeatherDay4);
        whiteSkycons.remove("iconCurrentDay");
        whiteSkycons.remove("iconDay1");
        whiteSkycons.remove("iconDay2");
        whiteSkycons.remove("iconDay3");
        whiteSkycons.remove("iconDay4");
        darkSkycons.remove("iconCurrentDay");
        darkSkycons.remove("iconDay1");
        darkSkycons.remove("iconDay2");
        darkSkycons.remove("iconDay3");
        darkSkycons.remove("iconDay4");
    }else{
        console.log("no definido")
    }
    
}

if(navigator.geolocation){ 
    //intentamos obtener las coordenadas del usuario
    navigator.geolocation.getCurrentPosition(            

        (pos) => {
            coords = pos.coords;
            
            console.log(coords.latitude);
            console.log(coords.longitude);
            renewValues();
            setTime();
            
            
            whiteSkycons.play();
            darkSkycons.play();
        },
        (err) => {
            console.log(err);
        }, 
        {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0
        }
            

        )
}else{
    //el navegador del usuario no soporta el API de Geolocalizacion de HTML5
    alert("Por favor, otorgue permiso al navagador");
}



