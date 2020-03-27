import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react'


export default class DateTimePicker extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <div>
                <form style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                }} noValidate>
                    <TextField
                        id="datetime-local"
                        label="Time to view"
                        type="datetime-local"
                        defaultValue="2017-05-24T00:00"
                        style={{
                            marginLeft: 4,
                            marginRight: 4,
                            width: 220,
                            fontSize:10
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
                <Button variant="contained" onClick={this.props.turnOffWelcome}>Submit</Button>
            </div>
        )
    }
}
