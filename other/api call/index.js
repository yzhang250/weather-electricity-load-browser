async function getNext12HoursWeather(zipCode){
    let baseUrl = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/";
    let key = "Q0ceMC27pjMflJ8aZRICBSEIum8aypEw" // goto "https://developer.accuweather.com/" register to get new key 50 useage per day per key
    let paramsVal = {
        apikey:key,
        language:"en-us",
        details:true
    }
    let response = await axios.get(baseUrl+zipCode, {params: paramsVal})
    return response.data;
}

async function isHoliday(yearIn, monthIn, dayIn){
    let baseUrl = "https://calendarific.com/api/v2/holidays"; 
    let key = "afe781baddda7188c858428cd10acdc274805301" // goto "https://calendarific.com/" register tp get new key 1000 usage per month per key
    let paramsVal = {
        api_key:key,
        country:"US",
        year:yearIn,
        month:monthIn,
        day:dayIn,
        type:"national"
    }
    let response = await axios.get(baseUrl, {params: paramsVal})
    return response.data.response.holidays.length>0;
}

function getDayOfWeek(year, month, day){
    const weekDays = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    let dateString = year+"-"+month+"-"+day
    let date = new Date(dateString)
    let index = date.getDay()
    return weekDays[index];
}

const ZONES = ["CAPITL","CENTRL","DUNWOD","GENESE","HUD VL","LONGIL","MHK VL","N.Y.C.","NORTH" ,"WEST" ]

var year = 2020
var month = 1
var day = 1
var zipcode = 10001
var zone = ZONES[7]

var isholiday = isHoliday(year, month, day);
var weatherData = getNext12HoursWeather(zipcode);
var weekDay = getDayOfWeek(year, month, day)

isholiday.then( holiday =>{
    weatherData.then(weathers =>{
        let holidayVar = holiday? "Y":"N";
        weathersData = [];
        weathers.forEach(weather => {
            w = {
                dateTime : new Date(weather["DateTime"]),
                Temperature: weather["Temperature"]["Value"],
                WindSpeed: weather["Wind"]["Speed"]["Value"]
            };
            weathersData.push(w);
        });
        console.log(zone);
        console.log(month);
        console.log(weekDay);
        console.log(holidayVar);
        console.log(weathersData);
    })
})