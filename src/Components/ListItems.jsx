import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import Container from '@material-ui/core/Container';
import DateTimePicker from "./DateTimePicker"
import React, { Component } from 'react'

export default class ListItems extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {

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
          onTimeChange={this.props.onTimeChange}/> : <div />}
        </Container>
        <ListItem>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Prediction" />
        </ListItem>
      </List>
    )
  }
}
