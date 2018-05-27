import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'semantic-ui-react';
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
  YearInput,
  MonthInput
} from '../src';
import moment from 'moment';

moment.locale('en');

function App() {
  return (
    <div className="example-calendar-container">
      <h2>As text fields</h2>
      <DateTimeForm />
      <h2>Inline</h2>
      <DateTimeFormInline />
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
      dateStartYear: '',
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

  handleDateStartYearChange = (event, { value }) => {
    this.setState({ dateStartYear: value });
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
        <DateInput
          startMode="year"
          popupPosition="bottom left"
          placeholder="Date startMode year"
          className="example-calendar-input"
          value={this.state.dateStartYear}
          iconPosition="left"
          onChange={this.handleDateStartYearChange} />
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

class DateTimeFormInline extends React.Component {
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
          inline
          className="example-calendar-input"
          value={this.state.date}
          onChange={this.handleDateChange} />
        <br />
        <TimeInput
          inline
          className="example-calendar-input"
          value={this.state.time}
          onChange={this.handleTimeChange} />
        <br />
        <DateTimeInput
          inline
          className="example-calendar-input"
          value={this.state.dateTime}
          onChange={this.handleDateTimeChange} />
        <br />
        <DatesRangeInput
          inline
          className="example-calendar-input"
          value={this.state.datesRange}
          onChange={this.handleDatesRangeChange} />
        <br />
        <YearInput
          inline
          className="example-calendar-input"
          value={this.state.year}
          onChange={this.handleYearChange} />
        <br />
        <MonthInput
          inline
          className="example-calendar-input"
          value={this.state.month}
          onChange={this.handleMonthChange} />
      </Form>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);