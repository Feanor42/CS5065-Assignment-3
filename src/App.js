import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DatePicker from "react-datepicker";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, Tooltip } from 'recharts';
import "react-datepicker/dist/react-datepicker.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      forecastData: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.getForecast = this.getForecast.bind(this);
  }

  componentDidMount(){
    this.getForecast(this.state.date);
  }

  getForecast(date){
    var yearString = date.getFullYear().toString();
    var monthString = (date.getMonth() + 1).toString();
    if(monthString.length < 2){
      monthString = "0" + monthString;
    }
    var dayString = date.getDate().toString();
    if(dayString.length < 2){
      dayString = "0" + dayString;
    }
    var dateString = yearString + monthString + dayString;
    fetch('http://localhost:5000/forecast/' + dateString, {
            method: 'GET'
          }).then(res => res.json())
          .then(response => {
            this.setState({forecastData: response});
          })
          .catch(error => console.error('Error:', error));
  }

  handleChange(newDate) {
    if(newDate != null){
      this.setState({
        date: newDate
      });
      this.getForecast(newDate);
    }
  }

  render() {
    const renderLineChart = (
      <LineChart width={600} height={300} data={this.state.forecastData}
      margin={{ top: 15, right: 30, left: 20, bottom: 20 }}>
        <Line type="monotone" dataKey="TMAX" stroke="#e81414" />
        <Line type="monotone" dataKey="TMIN" stroke="#1353e8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="DATE">
          <Label value="Date" offset={-10} position="insideBottom" />
        </XAxis>
        <Legend verticalAlign="top" height={36}/>
        <YAxis>
          <Label value="Temperature (F)" offset={10} position="insideBottomLeft" angle={-90} />
        </YAxis> 
        <Tooltip />
      </LineChart>
      );

    return (
      <div className="App">
        <DatePicker
          className="DatePicker"
          dateFormat="yyyyMMdd"
          selected={this.state.date}
          onChange={this.handleChange}
        />
        {renderLineChart}
      </div>
      
    );
  }
}

export default App;
