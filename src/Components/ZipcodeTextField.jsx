import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react'


export default class ZipcodeTextField extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             value: ""
        }
    }

    handleValueChange = (e) => {
        this.setState({value:e.target.value})
    }
    onClick = (e) => {
        this.props.turnOffWelcome();
        this.props.turnOnPred();
        this.props.onZipChange(this.state.value);
     }
    
    render() {
        return (
            <div>
                <form style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }} noValidate>
                    <TextField 
                    id="standard-basic" 
                    label="Zipcode" 
                    defaultValue="10001"
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