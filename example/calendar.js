import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'semantic-ui-react';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangePicker,
  DatesRangeInput } from '../src';
import moment from 'moment';

moment.locale('ru');

function App(props) {
  return (
    <div className="example-calendar-container">
      <h2>As form inputs</h2>
      <DateTimeForm />
      <h2>Inline</h2>
      <h3>Date-picker</h3>
      <DatePicker />
      <h3>Time-picker</h3>
      <TimePicker />
      <h3>DateTime-picker</h3>
      <DateTimePicker />
      <h3>Dates range picker</h3>
      <DatesRangePicker />
    </div>
  );
}

class DateTimeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      time: '',
      dateTime: '',
      datesRange: ''
    };
  }

  handleDateChange = (event, { value }) => {
    this.setState({ date: value });
  }

  handleTimeChange = (event, { value }) => {
    this.setState({ time: value });
  }

  handleDateTimeChange = (event, { value }) => {
    this.setState({ dateTime: value });
  }

  handleDatesRangeChange = (event, { value }) => {
    this.setState({ datesRange: value });
  }

  render() {
    return (
      <Form>
        <DateInput
          placeholder="Date"
          className="example-calendar-input"
          value={this.state.date}
          onChange={this.handleDateChange} />
        <br />
        <TimeInput
          placeholder="Time"
          className="example-calendar-input"
          value={this.state.time}
          onChange={this.handleTimeChange} />
        <br />
        <DateTimeInput
          placeholder="Date Time"
          className="example-calendar-input"
          value={this.state.dateTime}
          onChange={this.handleDateTimeChange} />
        <br />
        <DatesRangeInput
          placeholder="From - To"
          className="example-calendar-input"
          value={this.state.datesRange}
          onChange={this.handleDatesRangeChange} />
      </Form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);