import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'semantic-ui-react';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateInput,
  TimeInput,
  DateTimeInput } from '../src';
import moment from 'moment';

moment.locale('en');

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
    </div>
  );
}

class DateTimeForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '',
      time: '',
      dateTime: ''
    };
  }

  handleDateChange = (newDate) => {
    this.setState({ date: newDate });
  }

  handleTimeChange = (newTime) => {
    this.setState({ time: newTime });
  }

  handleDateTimeChange = (newDateTime) => {
    this.setState({ dateTime: newDateTime });
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
      </Form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);