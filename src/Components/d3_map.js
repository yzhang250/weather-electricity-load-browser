import * as d3 from "d3";
import { feature } from "topojson-client"

var width = 960 * .75, height = 550 * .75;

var node = document.createElement('div');
var projection = d3.geoMercator().center([-76.5, 43.0]).scale(5000 * .75);
var path = d3.geoPath().projection(projection);

var svg = d3.select(node).append("svg")
    .attr("width", width)
    .attr("height", height);

var url = "/NYS.json"

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
                .attr("fill", function (d) {
                    if (d.properties.ZCTA5CE10 == "14138") {
                        return "red"
                    } else {
                        return "grey"
                    }
                }
                )
                .attr("d", path);
        })
    }
)


export default node;