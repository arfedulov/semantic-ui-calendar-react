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
  DatesRangeInput,
  YearPicker,
  YearInput,
  MonthPicker,
  MonthInput } from '../src';
import moment from 'moment';

moment.locale('en');

function App() {
  return (
    <div className="example-calendar-container">
      <h2>As form inputs</h2>
      <DateTimeForm />
      <h2>Inline</h2>
      <h3>Date-picker</h3>
      <DatePicker />
      <h3>Time-picker</h3>
      <TimePicker />
      <h3>Year-picker</h3>
      <YearPicker />
      <h3>Month-picker</h3>
      <MonthPicker />
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
      year: '',
      month: '',
      date: '',
      time: '',
      dateTime: '',
      datesRange: ''
    };
  }

  handleYearChange = (event, { value }) => {
    this.setState({ year: value });
  }

  handleMonthChange = (event, { value }) => {
    this.setState({ month: value });
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
          iconPosition="left"
          onChange={this.handleDateChange} />
        <br />
        <TimeInput
          placeholder="Time"
          className="example-calendar-input"
          value={this.state.time}
          iconPosition="left"
          onChange={this.handleTimeChange} />
        <br />
        <DateTimeInput
          placeholder="Date Time"
          className="example-calendar-input"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleDateTimeChange} />
        <br />
        <DatesRangeInput
          placeholder="From - To"
          className="example-calendar-input"
          value={this.state.datesRange}
          iconPosition="left"
          onChange={this.handleDatesRangeChange} />
        <br />
        <YearInput
          placeholder="Year"
          className="example-calendar-input"
          value={this.state.year}
          iconPosition="left"
          onChange={this.handleYearChange} />
        <br />
        <MonthInput
          placeholder="Month"
          className="example-calendar-input"
          value={this.state.month}
          iconPosition="left"
          onChange={this.handleMonthChange} />
      </Form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);