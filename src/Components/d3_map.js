// This script is no longer needed as the Component has been integrated into MapNY


import * as d3 from "d3";
import { feature } from "topojson-client"
import { planarRingArea } from "topojson";
import React from "react";
import { Component } from "react-d3-library"


const [time, setTime] = React.useState(this.props.time);
console.log(this.state.time);

var width = 1100*.75, height = 550*.75;

var node = document.createElement('div');
var projection = d3.geoMercator().center([-76.5, 42.3]).scale(5000*.75);
var path = d3.geoPath().projection(projection);

var svg = d3.select(node).append("svg")
    .attr("width", width)
    .attr("height", height);

var url = "/NYS.json"

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }


// const [data, setData] = React.useState(false);
// data = {
//     "14138": {
//         "temperature" : 77,
//         "wind speed":20
//     },
// }

const palette = ["red", "green", "black", "yellow", "pink", "blue"]
const colors =  [choose(palette), choose(palette), choose(palette), choose(palette)]

fetch(url).then(
    response => {
        if (response.status !== 200) {
          console.log(`There was a problem: ${response.status}`)
          return
        }
        response.json().then(topology => {
            var geojson = feature(topology, topology.objects.NYS_zip);
            // console.log("geojson", geojson)
            svg.selectAll("path")
                .data(geojson.features)
                .enter().append("path")
                // .attr("fill", "grey")
                .attr("fill", function (d) {
                    if (parseInt(d.properties.ZCTA5CE10) % 4 == 1) {
                        return colors[0]
                    } else if(parseInt(d.properties.ZCTA5CE10) %4 == 2){
                        return colors[1]
                    } else if(parseInt(d.properties.ZCTA5CE10) %4 == 3){
                        return colors[2]
                    } 
                    else {
                        return colors[3]
                    }
                }
                )
                .attr("d", path);
          })
    }
)



export default node;
