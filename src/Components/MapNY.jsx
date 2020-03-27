import rd3 from 'react-d3-library';
import React from "react";
import node from "./d3_map"

const RD3Component = rd3.Component;


export default class MapNY extends React.Component {

    constructor(props) {
        super(props);
        this.state = { d3: '' }
    }

    componentDidMount() {
        // console.log("mount")
        // console.log(node);
        this.setState({ d3: node });
    }

    render() {
        return (
            <div>
                <RD3Component data={this.state.d3} />
            </div>
        )
    }
};