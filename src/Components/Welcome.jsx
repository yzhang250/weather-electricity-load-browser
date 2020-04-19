import React, { Component } from 'react'

export default class Welcome extends Component {
    render() {
        return (
            <div>
                <h3>Interactive Visualization Of Electricity Consumption Prediction Based On Weather Forecast</h3>
                <p>Electricity consumption is an indicator of the economic development situation in an economy. United States’ consumption of electricity increased almost monoton- ically since 1960. Unfortunately, electricity cannot be stored at a large scale. Hence, the power generation must balance with the load at any time. However, the load can change dramatically across hours. For instance, the load at 5pm is generally higher than the load at 11pm. The power utilities have to run high-cost power plants to cover the peak load, which induces higher elec- tricity prices and more consumption on energy sources. Another factor affects the consumption of electricity is weather. The load on grid soars during the period of extreme weather. In recent decade, energy demand management has been promoted by power companies but remarkable improvement in electricity utilization was not observed. One of the root causes is that the current energy demand m</p>
                <p>To overcome the drawback of existing energy demand management systems, the current proposal will provide a unique tool visualizing the weather forecast data and the prediction of power load in the next 24 hours in the area of interest. It will help the consumers anticipate the price of electricity, which is generally negatively correlated to the power load level, and plan the utilization of electricity for the sake of saving. The consumer of electricity and power generation companies will be potential stakeholders since the proposed tool will provide insight to the correlation between weather and power utilization.</p>
            </div>
        )
    }
}
