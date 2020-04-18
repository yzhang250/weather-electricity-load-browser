import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react'


export default class ZipcodeTextField extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             value: this.props.zipcode,

        }
    }
    handleValueChange = (e) => {
        console.log("state.value is " + e.target.value)
        this.setState({value:e.target.value})
        this.zipcode = e.target.value
    }
    onClick = (e) => {
        this.props.turnOffWelcome();
        this.props.turnOnPred();
        this.props.onZipChange(this.state.value);
     }

     componentDidUpdate =(prevProps) =>{
        if (prevProps.zipcode !== this.props.zipcode) {
            this.setState({value: this.props.zipcode});
          }
     }
    
    render() {
        console.log("props.zipcode: "+this.props.zipcode)
        // if (this.state.value !== this.props.zipcode) {
        //     this.setState({value:this.props.zipcode})
        // }
        console.log("state.value: " + this.state.value)
        return (
            <div>
                <form style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }} noValidate>
                    <TextField 
                    id="standard-basic" 
                    label="Zipcode" 
                    value={this.state.value}
                    // value={this.props.zipcode}
                    onChange={this.handleValueChange}
                    />
                    {/* <TextField
                        id="datetime-local"
                        label="Time to view"
                        type="datetime-local"
                        
                        style={{
                            marginLeft: 4,
                            marginRight: 4,
                            width: 220,
                            fontSize:10
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleValueChange}
                    /> */}
                </form>
                <Button variant="contained" style={{marginTop:20, marginLeft:60}} onClick={this.onClick}>Submit</Button>
            </div>
        )
    }
}
