import rd3 from 'react-d3-library';
import React from "react";
import * as d3 from "d3";
import { feature } from "topojson-client"
import data from "../data/sample.csv"
import zip2zone_data from '../data/ny_zone_zip.csv';
import WeatherDataCard from "./WeatherDataCard"
import Grid from '@material-ui/core/Grid';


const RD3Component = rd3.Component;


export default class MapNY extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            d3: '',
            d3_eload: '',
            time: this.props.time,
            data: {},
            zip2zone: {},
            weatherData: {
                zipcode: "",
                zone: "",
                temperature: "",
                windSpeed: "",
                humidity: "",
                load: ""
            }
        }
    }
    width = 800 * .75;
    height = 700 * .75;

    node = document.createElement('div');
    node_eload = document.createElement('div');
    projection = d3.geoMercator().center([-72, 43.5]).scale(4300 * .75);
    projection_eload = d3.geoMercator().center([-72, 43.5]).scale(4300 * .75);

    path = d3.geoPath().projection(this.projection);
    path_eload = d3.geoPath().projection(this.projection_eload);



    svg = d3.select(this.node).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
    svg_eload = d3.select(this.node_eload).append("svg")
        .attr("width", this.width)
        .attr("height", this.height);


    url = "/NYS.json"





    componentDidMount = () => {
        // console.log("component did mount");
        const timeCovert = (time) => {
            // source: 2015-01-01T01:00
            // target : 2015-01-01 01:00:00

            return time.slice(0, 10) + " " + time.slice(11) + ":00";

        }

        function getScaledArray(min, max, scale){
            let result = [min];
            for(let i = 1; i< scale -1; i++ ){
                let addson = (max - min) / (scale -1);
                result.push(min + i*addson);
            }
            result.push(max);
            return result;
        }

        let zip2zone = {};
        let zoneTmp = {};
        let zoneHumidity = {}
        let zoneWind = {}
        let minTemp = 100;
        let maxTemp = -20;
        let zoneLoad = {};
        let minLoad = 1200;
        let maxLoad = 800;
        let loadLegendArray = [];
        let tempLegendArray = [];

        let t = timeCovert(this.state.time);
        console.log("did mount" + this.props.time)
        let _data = {};
        d3.csv(zip2zone_data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                zip2zone[data[i].zipcode] = data[i].zone;
            }

        }).then(d3.csv(data)
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (t === data[i].DATE) {
                        _data[data[i].zipcode] = data[i].HourlyWetBulbTemperature;
                        minLoad = Math.min(minLoad, data[i].zone_load_total);
                        maxLoad = Math.max(maxLoad, data[i].zone_load_total)
                        minTemp = Math.min(minTemp, data[i].HourlyWetBulbTemperature);
                        maxTemp = Math.max(maxTemp, data[i].HourlyWetBulbTemperature);
                        loadLegendArray = getScaledArray(minLoad, maxLoad, 9);
                        tempLegendArray = getScaledArray(minTemp, maxTemp, 9);
                        // todo: zonetmp is the zone temperature, now is using the zip shown latest in the zone to assign the temp, this can be further refine by taking average
                        zoneTmp[zip2zone[data[i].zipcode]] = data[i].HourlyWetBulbTemperature;
                        zoneWind[zip2zone[data[i].zipcode]] = data[i].HourlyWindSpeed;
                        zoneHumidity[zip2zone[data[i].zipcode]] = data[i].HourlyRelativeHumidity;
                        zoneLoad[zip2zone[data[i].zipcode]] = data[i].zone_load_total;
                    }
                }
                return _data
            }).then((_data) => {
                // console.log(_data);
                fetch(this.url).then(
                    response => {
                        if (response.status !== 200) {
                            console.log(`There was a problem: ${response.status}`)
                            return
                        }
                        response.json().then(topology => {
                            var geojson = feature(topology, topology.objects.NYS_zip);
                            var x = d3.scaleLinear()
                                .domain([minTemp, maxTemp])
                                .range([1, 9]);

                            let color = d3.scaleThreshold()
                                .domain(d3.range(1, 9))
                                .range(d3.schemeReds[9]);

                            this.svg.selectAll("path")
                                .data(geojson.features)
                                .enter().append("path")
                                // .attr("fill", "grey")
                                .attr("d", this.path)
                                .attr("id", (d) => { return "zip" + d.properties.ZCTA5CE10 })
                                .attr("stroke", "black")
                                .attr("stroke-width", 0.3)
                                .attr("fill", function (d) {
                                    let zipcode = d.properties.ZCTA5CE10;
                                    let zone = zip2zone[zipcode];
                                    let temperature = zoneTmp[zone];
                                    if (temperature === undefined) {
                                        // console.log("grey")
                                        return "grey"
                                    } else {
                                        // console.log(x(temperature));
                                        return color(x(temperature));
                                    }


                                }
                                )
                                .on("click", d => {
                                    // console.log(d.properties.ZCTA5CE10);
                                    d3.select("#zip" + d.properties.ZCTA5CE10)
                                        .attr("stroke-width", 2)
                                    this.props.onZipChange(d.properties.ZCTA5CE10);
                                    this.setState({
                                        weatherData: {
                                            zipcode: d.properties.ZCTA5CE10,
                                            zone: zip2zone[d.properties.ZCTA5CE10],
                                            temperature: zoneTmp[zip2zone[d.properties.ZCTA5CE10]],
                                            windSpeed: zoneWind[zip2zone[d.properties.ZCTA5CE10]],
                                            humidity: zoneHumidity[zip2zone[d.properties.ZCTA5CE10]],
                                            load: zoneLoad[zip2zone[d.properties.ZCTA5CE10]]
                                        }
                                    })
                                })
                                .attr("text-anchor", "middle")
                                .style("font-size", "16px")
                                .text("Weather map")
                            // This will plot the eload map

                            let x_eload = d3.scaleLog()
                                .domain([minLoad, maxLoad])
                                .range([1, 9]);

                            let color_eload = d3.scaleThreshold()
                                .domain(d3.range(1, 9))
                                .range(d3.schemeBlues[9]);

                            this.svg_eload.selectAll("path")
                                .data(geojson.features)
                                .enter().append("path")
                                // .attr("fill", "grey")
                                .attr("d", this.path_eload)
                                .attr("stroke", "black")
                                .attr("stroke-width", 0.3)
                                .attr("fill", function (d) {
                                    let zipcode = d.properties.ZCTA5CE10;
                                    let zone = zip2zone[zipcode];
                                    let load = zoneLoad[zone];
                                    if (load === undefined) {
                                        return "grey"
                                    } else {
                                        // console.log(x(temperature));
                                        return color_eload(x_eload(load));
                                    }
                                }
                                )
                                .on("click", d => {
                                    // console.log(d.properties.ZCTA5CE10);
                                    this.props.onZipChange(d.properties.ZCTA5CE10);
                                    this.setState({
                                        weatherData: {
                                            zipcode: d.properties.ZCTA5CE10,
                                            zone: zip2zone[d.properties.ZCTA5CE10],
                                            temperature: zoneTmp[zip2zone[d.properties.ZCTA5CE10]],
                                            windSpeed: zoneWind[zip2zone[d.properties.ZCTA5CE10]],
                                            humidity: zoneHumidity[zip2zone[d.properties.ZCTA5CE10]],
                                            load: zoneLoad[zip2zone[d.properties.ZCTA5CE10]]
                                        }
                                    })
                                })
                            this.svg.append("text")
                                .attr("x", (this.width / 2))
                                .attr("y", 30)
                                .attr("text-anchor", "middle")
                                .style("font-size", "16px")
                                .text("Temperature map");

                            for(let i = 0; i < 9; i++){
                                this.svg.append("rect")
                                .attr("class", "legend")
                                .attr("x", 10)
                                .attr("y", 60 + i*17)
                                .attr("width", 40)
                                .attr("height", 10)
                                .attr("fill", color(i))
                    
                                this.svg.append("text")
                                .attr("class", "legend")
                                .text(tempLegendArray[i].toFixed(2))
                                .attr("font-size", "12px")
                                .attr("x", 55)
                                .attr("y", 60+ i*17 + 10)                  
                            }

                            this.svg_eload.append("text")
                                .attr("x", (this.width / 2))
                                .attr("y", 30)
                                .attr("text-anchor", "middle")
                                .style("font-size", "16px")
                                .text("Electricity load map");
                            
                            for(let i = 0; i < 9; i++){
                                this.svg_eload.append("rect")
                                .attr("class", "legend")
                                .attr("x", 10)
                                .attr("y", 60 + i*17)
                                .attr("width", 40)
                                .attr("height", 10)
                                .attr("fill", color_eload(i))
                    
                                this.svg_eload.append("text")
                                .attr("class", "legend")
                                .text(loadLegendArray[i].toFixed(2))
                                .attr("font-size", "12px")
                                .attr("x", 55)
                                .attr("y", 60+ i*17 + 10)                 
                            }


                        })
                            .then(() => {
                                this.setState({ d3: this.node, d3_eload: this.node_eload });
                            })

                    }
                )
            })).catch(function (err) {
                throw err;
            })

        // console.log(colors);

    }

    componentDidUpdate(prevProps) {
        const timeCovert = (time) => {
            // source: 2015-01-01T01:00
            // target : 2015-01-01 01:00:00

            return time.slice(0, 10) + " " + time.slice(11) + ":00";

        }
        function getScaledArray(min, max, scale){
            let result = [min];
            for(let i = 1; i< scale -1; i++ ){
                let addson = (max - min) / (scale -1);
                result.push(min + i*addson);
            }
            result.push(max);
            return result;
        }
        let loadLegendArray = [];
        let tempLegendArray = [];
        let zoneLoad = {};
        let minLoad = 1000000;
        let maxLoad = 0;
        let zip2zone = {};
        let zoneTmp = {};
        let zoneHumidity = {}
        let zoneWind = {}
        let minTemp = 100;
        let maxTemp = -20;
        let t = timeCovert(this.props.time);
        console.log(this.props.time)
        let _data = {};
        d3.csv(zip2zone_data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                zip2zone[data[i].zipcode] = data[i].zone;
            }

        }).then(d3.csv(data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                if (t === data[i].DATE) {
                    _data[data[i].zipcode] = data[i].HourlyWetBulbTemperature;
                    minTemp = Math.min(minTemp, data[i].HourlyWetBulbTemperature);
                    maxTemp = Math.max(maxTemp, data[i].HourlyWetBulbTemperature)
                    // todo: zonetmp is the zone temperature, now is using the zip shown latest in the zone to assign the temp, this can be further refine by taking average
                    zoneTmp[zip2zone[data[i].zipcode]] = data[i].HourlyWetBulbTemperature;
                    zoneWind[zip2zone[data[i].zipcode]] = data[i].HourlyWindSpeed;
                    zoneHumidity[zip2zone[data[i].zipcode]] = data[i].HourlyRelativeHumidity;
                    minLoad = Math.min(minLoad, data[i].zone_load_total);
                    maxLoad = Math.max(maxLoad, data[i].zone_load_total)
                                            loadLegendArray = getScaledArray(minLoad, maxLoad, 9);
                        tempLegendArray = getScaledArray(minTemp, maxTemp, 9);
                    // todo: zoneLoad is the zone temperature, now is using the zip shown latest in the zone to assign the temp, this can be further refine by taking average
                    zoneLoad[zip2zone[data[i].zipcode]] = data[i].zone_load_total;
                }
            }
            return _data
        }).then((_data) => {
            var x = d3.scaleLinear()
                .domain([minTemp, maxTemp])
                .range([1, 9]);

            let color = d3.scaleThreshold()
                .domain(d3.range(1, 9))
                .range(d3.schemeReds[9]);

            this.svg.selectAll("path")
                .attr("fill", function (d) {
                    let zipcode = d.properties.ZCTA5CE10;
                    let zone = zip2zone[zipcode];
                    let temperature = zoneTmp[zone];
                    if (temperature === undefined) {
                        return "grey"
                    } else {
                        // console.log(x(temperature));
                        return color(x(temperature));
                    }
                })
                .on("click", d => {
                    // console.log(d.properties.ZCTA5CE10);

                    // this can be used to add thick stroke on map
                    // d3.select("#zip" + d.properties.ZCTA5CE10)
                    //     .attr("stroke-width", 2)
                    this.props.onZipChange(d.properties.ZCTA5CE10);
                    this.setState({
                        weatherData: {
                            zipcode: d.properties.ZCTA5CE10,
                            zone: zip2zone[d.properties.ZCTA5CE10],
                            temperature: zoneTmp[zip2zone[d.properties.ZCTA5CE10]],
                            windSpeed: zoneWind[zip2zone[d.properties.ZCTA5CE10]],
                            humidity: zoneHumidity[zip2zone[d.properties.ZCTA5CE10]],
                            load: zoneLoad[zip2zone[d.properties.ZCTA5CE10]]
                        }
                    })
                })

            let x_eload = d3.scaleLog()
                .domain([minLoad, maxLoad])
                .range([1, 9]);

            let color_eload = d3.scaleThreshold()
                .domain(d3.range(1, 9))
                .range(d3.schemeBlues[9]);

            this.svg_eload.selectAll("path")
                .attr("fill", function (d) {
                    let zipcode = d.properties.ZCTA5CE10;
                    let zone = zip2zone[zipcode];
                    let load = zoneLoad[zone];
                    // console.log(color(x(load)))
                    if (load === undefined) {
                        return "grey"
                    } else {
                        // console.log(x(temperature));
                        return color_eload(x_eload(load));
                    }
                }
                )
                .on("click", d => {
                    // console.log(d.properties.ZCTA5CE10);
                    this.props.onZipChange(d.properties.ZCTA5CE10);
                    this.setState({
                        weatherData: {
                            zipcode: d.properties.ZCTA5CE10,
                            zone: zip2zone[d.properties.ZCTA5CE10],
                            temperature: zoneTmp[zip2zone[d.properties.ZCTA5CE10]],
                            windSpeed: zoneWind[zip2zone[d.properties.ZCTA5CE10]],
                            humidity: zoneHumidity[zip2zone[d.properties.ZCTA5CE10]],
                            load: zoneLoad[zip2zone[d.properties.ZCTA5CE10]]
                        }
                    })
                });

        })).catch(function (err) {
            throw err;
        })

    }

    render() {
        return (
            <div>
                <WeatherDataCard data={this.state.weatherData} />
                <br />

                {/* <Paper elevation={1} > */}
                    <Grid container spacing={3}>
                        <Grid item xs={6}><RD3Component data={this.state.d3} /></Grid>
                        <Grid item xs={6}><RD3Component data={this.state.d3_eload} /></Grid>
                    </Grid>
                {/* </Paper> */}
            </div>
        )
    }
};