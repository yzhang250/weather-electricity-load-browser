import rd3 from 'react-d3-library';
import React from "react";
// import node from "./d3_map"
import { Divider } from '@material-ui/core';
import * as d3 from "d3";
import { feature } from "topojson-client"
import { planarRingArea } from "topojson";

const RD3Component = rd3.Component;


export default class MapNY extends React.Component {

    constructor(props) {
        super(props);
        this.state = { d3: '', 
        time: this.props.time}
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

    componentDidMount() {
        // console.log("component did mount");

        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }

        const palette = ["red", "green", "black", "yellow", "pink", "blue"]
        const colors = [choose(palette), choose(palette), choose(palette), choose(palette)]
        // console.log(colors);
        fetch(this.url).then(
            response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(topology => {
                    var geojson = feature(topology, topology.objects.NYS_zip);
                    this.svg.selectAll("path")
                        .data(geojson.features)
                        .enter().append("path")
                        // .attr("fill", "grey")
                        .attr("d", this.path)
                        .attr("fill", function (d) {
                            if (parseInt(d.properties.ZCTA5CE10) % 4 == 1) {
                                return colors[0]
                            } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 2) {
                                return colors[1]
                            } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 3) {
                                return colors[2]
                            } else {
                                return colors[3]
                            }
                        }
                        );
                }).then(() =>{
                    this.setState({ d3: this.node })
                }
               )
            }
        )
        
    }

    componentDidUpdate(prevProps){

        function choose(choices) {
            var index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }

        const palette = ["red", "green", "black", "yellow", "pink", "blue"]
        const colors = [choose(palette), choose(palette), choose(palette), choose(palette)]

        this.svg.selectAll("path")
        .attr("fill", function (d) {
            if (parseInt(d.properties.ZCTA5CE10) % 4 == 1) {
                return colors[0]
            } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 2) {
                return colors[1]
            } else if (parseInt(d.properties.ZCTA5CE10) % 4 == 3) {
                return colors[2]
            } else {
                return colors[3]
            }
        });
        // this.setState({ d3: this.node });
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
                <h7>Weather map</h7>
                <RD3Component data={this.state.d3} />
                <Divider />
                <h7>E-load map</h7>
                <RD3Component data={this.state.d3} />
            </div>
        )
    }
};