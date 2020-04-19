import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import Container from '@material-ui/core/Container';
import DateTimePicker from "./DateTimePicker"
import React, { Component } from 'react'
import ZipcodeTextField from './ZipcodeTextField';

export default class ListItems extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    // console.log(this.props.zipcode)
    return (
      <List>
        <ListItem button onClick={this.props.turnOnWelcome}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
        <Container>
          {this.props.open ? <DateTimePicker turnOffWelcome={this.props.turnOffWelcome}
            onTimeChange={this.props.onTimeChange} turnOffPred={this.props.turnOffPred}/> : <div />}
        </Container>
        <ListItem>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Prediction" />
        </ListItem>
        <Container>
        {this.props.open ? <ZipcodeTextField turnOffWelcome={this.props.turnOffWelcome}
          onZipChange={this.props.onZipChange} turnOnPred={this.props.turnOnPred} zipcode={this.props.zipcode} /> : <div />}
      </Container>
      </List>
    
    )
  }
}
