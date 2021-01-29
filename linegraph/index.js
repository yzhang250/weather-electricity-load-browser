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

async function getPredict(inputs){
    let baseUrl = "https://ussouthcentral.services.azureml.net/workspaces/d53edbbac2e848cf8a74c034f195ea53/services/9cf6d1493a08452b9374fbd8ff9895cf/execute?api-version=2.0&details=true"
    let token = "Ukp+NrbjjWDLJvf+/oM+4Gkt+AFPAWRNxMRa7NOMWxFRWokU6dCffR+jvr5redS9B4lWtHv7vvcDPWb9JN1O1A=="
    let headersIn = {
        'Authorization' : 'Bearer '+token,
        'Content-Type' : 'application/json'
    }
    let inputData = {
        'Inputs':{
            'input1':{
                'ColumnNames': [
                    'zone',
                    'Month',
                    'Hour',
                    'Weekday',
                    'Holiday',
                    'Temperature',
                    'WindSpeed',
                    'ZoneLoad'
                  ],
                'Values': inputs
            }
        },
        'GlobalParameters': {}
    }
    console.log(inputData)
    let response = await axios({
        method: 'post',
        url: baseUrl,
        headers: headersIn,
        data: inputData
    })

    return response;
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

// Added for line graph

var margin = {top: 30, right: 40, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var x = d3.scalePoint().range([0, width]);
var y0 = d3.scaleLinear().range([height, 0]);
var y1 = d3.scaleLinear().range([height, 0]);

var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


// Original code from Xiguang
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
        // console.log(zone);
        // console.log(month);
        // console.log(weekDay);
        // console.log(holidayVar);
        // console.log(weathersData);
        let inputDatas = [];
        weathersData.forEach(data =>{
            input = [
                zone,
                month.toString(),
                data["dateTime"].getHours().toString(),
                weekDay,
                holidayVar,
                data["Temperature"].toString(),
                data["WindSpeed"].toString(),
                "0"
            ];
            inputDatas.push(input);
        });

        // console.log(inputDatas);
        var predictResponse = getPredict(inputDatas);


        predictResponse.then( response =>{
            let predictDatas = response.data.Results.output1.value.Values;
            // data processing for line charts
            var results = predictDatas.map(function(p) {
              return {
                    "zone": p[0],
                    "Month": +p[1],
                    "Hour":  +p[2],
                    "Weekday": p[3],
                    "Holiday": p[4],
                    "Temperature": +p[5],
                    "WindSpeed": +p[6],
                    "ZoneLoad": +p[7],
                    "predict": +p[8]
                  }
                  });
        // console.log(results);


        d3.csv("ny_stats.csv").then(function(dt) {
              dt.forEach(function(d) {
              d.zipcode = +d.zipcode;
              d.population_zone_pct = +d.population_zone_pct;
            });
              // console.log(dt);

        var selected_zone = dt.filter(z => z.zipcode === zipcode).map(i => i.zone)[0]; // change the zip code to the selected one.
        // console.log(selected_zone);

        var pop_pram = dt.filter(z => z.zipcode === zipcode).map(i => i.population_zone_pct)[0];
        // console.log(pop_pram);

        var load = results.filter(r => r.zone === selected_zone).map(function(i) {
        return {
          "zipcode": zipcode, //change
          "zone": selected_zone,
          "hour": i.Hour,
          "temperature": i.Temperature,
          "windspeed": i.WindSpeed,
          "pload": i.predict * pop_pram
            }
          });

          // console.log(load.length)


          var yaxis0 = d3.axisLeft()
              .ticks(5)
              .scale(y0);

          var yaxis1 = d3.axisRight()
              .ticks(5)
              .scale(y1);

          var xaxis = d3.axisBottom()
              .ticks(load.length)
              .scale(x);


          var load_min = d3.min(load,function(d){return d.pload;});
          var load_max = d3.max(load,function(d){return d.pload;});

          var temp_min = d3.min(load,function(d){return d.temperature;});
          var temp_max = d3.max(load,function(d){return d.temperature;});

          // console.log(load_min);
          // console.log(load_max);
          var x_range = load.filter(l => l.zipcode === zipcode).map(i => i.hour);

          var a = d3.extent(load, function(d) { return d.hour; });
          // console.log("xrange",x_range);

          x.domain(x_range);
          y0.domain([load_min, load_max]);
          y1.domain([temp_min, temp_max]);

          var line0 = d3.line()
          .x(function(d) { return x(d.hour); })
          .y(function(d) { return y0(d.pload); })
          .curve(d3.curveMonotoneX);

          var line1 = d3.line()
          .x(function(d) { return x(d.hour); })
          .y(function(d) { return y1(d.temperature); })
          .curve(d3.curveMonotoneX);


          svg.append("path")
              .style("stroke", "steelblue")
              .style("fill", "none")
              .attr("d", line0(load));

          svg.append("path").
                style("stroke", "red")
                .style("fill", "none")
                .attr("d", line1(load));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xaxis);

          svg.append("g")
              .attr("class", "axisSteelBlue")
              .call(yaxis0);

          svg.append("g")
              .attr("class", "axisRed")
              .attr("transform", "translate(" + width + " ,0)")
              .call(yaxis1);

          svg.selectAll(".dot")
              .data(load)
              .enter().append("circle")
              .attr("class", "dot")
              .attr("cx", function(d) { return x(d.hour) })
              .attr("cy", function(d) { return y0(d.pload) })
              .style("fill","steelblue")
              .attr("r", 5);


          svg.selectAll(".dot1")
                  .data(load)
                  .enter().append("circle")
                  .attr("class", "dot")
                  .attr("cx", function(d) { return x(d.hour) })
                  .attr("cy", function(d) { return y1(d.temperature) })
                  .style("fill","red")
                  .attr("r", 5);

          svg.append("text")
              .attr("transform",
                    "translate(" + (width/2) + " ," +
                                           (height + margin.top - 1) + ")")
              .style("text-anchor", "middle")
              .style("font-family","sans-serif")
              .text("Next 12 Hours");

          svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("fill","steelblue")
                .style("font-family","sans-serif")
                .text("Load MW");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", width + margin.right - 20)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("fill","red")
            .style("font-family","sans-serif")
            .text("Temperature F");

            svg.append("text")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight","bold")
                .style("font-family","sans-serif")
                .text("Temperature and Predicted Load of Next 12 Hours for")

            svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2) + 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("font-weight","bold")
                    .style("font-family","sans-serif")
                    .text("Zipcode " + zipcode + " in LoadZone " + zone);

          })


        }).catch(function (error) {
            console.log("error",error);})
    })
})
