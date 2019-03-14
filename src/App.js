import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DatePicker from "react-datepicker";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
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
    var monthString = date.getMonth().toString();
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
    this.setState({
      date: newDate
    });
    this.getForecast(newDate);
  }

  render() {
    const data = [{date:20190202, tmax:33, tmin:20}, {date:20190203, tmax:49, tmin:30}, {date:20190204, tmax:45, tmin:19},{date:20190205, tmax:50, tmin:30}];

    const renderLineChart = (
      <LineChart width={600} height={300} data={this.state.forecastData}>
        <Line type="monotone" dataKey="TMAX" stroke="#8884d8" />
        <Line type="monotone" dataKey="TMIN" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="DATE" />
        <YAxis />
      </LineChart>
      );
    return (
      <div>
        <DatePicker
          selected={this.state.date}
          onChange={this.handleChange}
        />
        {renderLineChart}
      </div>
      
    );
  }
}

export default App;
