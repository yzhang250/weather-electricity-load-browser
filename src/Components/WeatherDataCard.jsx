import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { WiThermometer } from "weather-icons-react";
import { WiStrongWind } from "weather-icons-react";
import { WiHumidity } from "weather-icons-react";
import BatteryCharging30Icon from '@material-ui/icons/BatteryCharging30';
import PinDropIcon from '@material-ui/icons/PinDrop';




const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function WeatherDataCard(props) {
  const classes = useStyles();

  function HeadRow() {
    return (
      <React.Fragment>
        <Grid item xs={2}>
         <PinDropIcon fontSize="large"/>
        </Grid>
        <Grid item xs={2}>
          <WiThermometer size={48} color='#000' />
        </Grid>
        <Grid item xs={2}>
          <WiStrongWind size={48} color='#000' />
        </Grid>
        <Grid item xs={2}>
          <WiHumidity size={48} color='#000' />
        </Grid>
        <Grid item xs={2}>
          <BatteryCharging30Icon fontSize="large"/>
        </Grid>
      </React.Fragment>
    );
  }

  function ContentRow() {
    return (
      <React.Fragment>
        <Grid item xs={2}>
          <Grid>Location </Grid>
          {props.data.zipcode} in {props.data.zone}
        </Grid>
        <Grid item xs={2}>
        <Grid>Temperature (F) </Grid>
          {props.data.temperature.toString()}
        </Grid>
        <Grid item xs={2}>
        <Grid>Wind Speed (MPH) </Grid>
          {props.data.windSpeed.toString()} 
        </Grid>
        <Grid item xs={2}>
        <Grid>Humidity (%) </Grid>
          {props.data.humidity.toString()}
        </Grid>
        <Grid item xs={2}>
        <Grid>Zone Load (MWH) </Grid>
          {props.data.load.toString()}
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <HeadRow />
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <ContentRow />
        </Grid>
      </Grid>
    </div>
  );
}