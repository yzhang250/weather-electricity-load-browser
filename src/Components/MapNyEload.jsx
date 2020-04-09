import rd3 from 'react-d3-library';
import React from "react";
// import node from "./d3_map"
import { Divider } from '@material-ui/core';
import * as d3 from "d3";
import { feature } from "topojson-client"
// import { planarRingArea } from "topojson";
import data from "../data/combined _cleaned.csv"
import zip2zone_data from '../data/ny_zone_zip.csv';

const RD3Component = rd3.Component;


export default class MapNyEload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            d3: '',
            time: this.props.time,
            data: {},
            zip2zone: {},
        }
    }
    width = 1100 * .75;
    height = 550 * .75;

    node = document.createElement('div');
    projection = d3.geoMercator().center([-76.5, 42.3]).scale(5000 * .75);
    path = d3.geoPath().projection(this.projection);



    svg = d3.select(this.node).append("svg")
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

        let zip2zone = {};
        let zoneLoad = {};
        let minLoad = 1200;
        let maxLoad = 800;

        let t = timeCovert(this.props.time);
        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }

        const palette = ["red", "green", "black", "yellow", "pink", "blue"]
        const colors = [choose(palette), choose(palette), choose(palette), choose(palette)]
        let _data = {};
        d3.csv(zip2zone_data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                zip2zone[data[i].zipcode] = data[i].zone;
            }

        }).then(d3.csv(data)
            .then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    if (t === data[i].DATE) {
                        _data[data[i].zipcode] = data[i].zone_load_total;
                        minLoad = Math.min(minLoad, data[i].zone_load_total);
                        maxLoad = Math.max(maxLoad, data[i].zone_load_total)
                        // todo: zoneLoad is the zone temperature, now is using the zip shown latest in the zone to assign the temp, this can be further refine by taking average
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
                            let x = d3.scaleLinear()
                                .domain([minLoad, maxLoad])
                                .range([1, 9]);

                            let color = d3.scaleThreshold()
                                .domain(d3.range(1, 9))
                                .range(d3.schemeBlues[9]);

                            this.svg.selectAll("path")
                                .data(geojson.features)
                                .enter().append("path")
                                // .attr("fill", "grey")
                                .attr("d", this.path)
                                .attr("fill", function (d) {
                                    let zipcode = d.properties.ZCTA5CE10;
                                    let zone = zip2zone[zipcode];
                                    let load = zoneLoad[zone];
                                    if (load === undefined) {
                                        return "grey"
                                    } else {
                                        // console.log(x(temperature));
                                        return color(x(load));
                                    }


                                }
                                );
                        }).then(() => {
                            this.setState({ d3: this.node })
                        }
                        )
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

        let zip2zone = {};
        let zoneLoad = {};
        let minLoad = 1000000;
        let maxLoad = 0;

        let t = timeCovert(this.props.time);
        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }

        const palette = ["red", "green", "black", "yellow", "pink", "blue"]
        const colors = [choose(palette), choose(palette), choose(palette), choose(palette)]
        let _data = {};
        d3.csv(zip2zone_data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                zip2zone[data[i].zipcode] = data[i].zone;
            }

        }).then(d3.csv(data).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                if (t === data[i].DATE) {
                    // console.log(t);
                    _data[data[i].zipcode] = data[i].HourlyWetBulbTemperature;
                    minLoad = Math.min(minLoad, data[i].zone_load_total);
                    maxLoad = Math.max(maxLoad, data[i].zone_load_total)
                    // todo: zoneLoad is the zone temperature, now is using the zip shown latest in the zone to assign the temp, this can be further refine by taking average
                    zoneLoad[zip2zone[data[i].zipcode]] = data[i].zone_load_total;
                }
            }
            return _data
        }).then((_data) => {
            let x = d3.scaleLinear()
                .domain([minLoad, maxLoad])
                .range([1, 9]);

            let color = d3.scaleThreshold()
                .domain(d3.range(1, 9))
                .range(d3.schemeBlues[9]);
            this.svg.selectAll("path")
                .attr("fill", function (d) {
                    let zipcode = d.properties.ZCTA5CE10;
                    let zone = zip2zone[zipcode];
                    let load = zoneLoad[zone];
                    // console.log(color(x(load)))
                    if (load === undefined) {
                        return "grey"
                    } else {
                        // console.log(x(temperature));
                        return color(x(load));
                    }
                }
                );
        })).catch(function (err) {
            throw err;
        })

    }

    handleTimeChange = (time) => {
        // this.svg.selectAll("path")
        // // .data(geojson.features)
        // // .enter().append("path")
        // .attr("fill", "grey")
        // .attr("d", this.path)
        // .attr("fill", function (d) {
        //     if (parseInt(d.properties.ZCTA5CE10) % 4 == 1) {
        //         return colors[0]
        //     } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 2) {
        //         return colors[1]
        //     } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 3) {
        //         return colors[2]
        //     } else {
        //         return colors[3]
        //     }
        // });

        this.setState({ d3: this.node });
    }

    render() {
        return (
            <div>
                <h7>E-load map</h7>
                <RD3Component data={this.state.d3} />
            </div>
        )
    }
};