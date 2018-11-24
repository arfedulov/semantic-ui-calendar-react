import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'semantic-ui-react';
import moment from 'moment';

import {
  YearInput,
  MonthInput,
  DateInput,
  DatesRangeInput,
  TimeInput,
  DateTimeInput,
} from '../src';

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

  handleChange = (event, {name = undefined, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form>
        <DateInput
          placeholder="Date"
          popupPosition="bottom right"
          className="example-calendar-input"
          name="date"
          value={this.state.date}
          iconPosition="left"
          preserveViewMode={false}
          autoComplete="off"
          onChange={this.handleChange} />
        <br />
        <DateInput
          startMode="year"
          popupPosition="bottom right"
          placeholder="Date startMode year"
          className="example-calendar-input"
          name="dateStartYear"
          value={this.state.dateStartYear}
          iconPosition="left"
          autoComplete="off"
          preserveViewMode={false}
          onChange={this.handleChange} />
        <br />
        <TimeInput
          placeholder="Time"
          popupPosition="bottom right"
          className="example-calendar-input"
          name="time"
          autoComplete="off"
          value={this.state.time}
          iconPosition="left"
          disableMinute={false}
          onChange={this.handleChange} />
        <br />
        <DateTimeInput
          placeholder="Date Time"
          className="example-calendar-input"
          popupPosition="bottom right"
          name="dateTime"
          value={this.state.dateTime}
          iconPosition="left"
          preserveViewMode={false}
          autoComplete="off"
          onChange={this.handleChange} />
        <br />
        <DatesRangeInput
          dateFormat="DD.MM.YY"
          placeholder="From - To"
          popupPosition="bottom right"
          className="example-calendar-input"
          name="datesRange"
          value={this.state.datesRange}
          iconPosition="left"
          autoComplete="off"
          onChange={this.handleChange} />
        <br />
        <YearInput
          placeholder="Year"
          className="example-calendar-input"
          name="year"
          popupPosition="bottom right"
          value={this.state.year}
          iconPosition="left"
          autoComplete="off"
          onChange={this.handleChange} />
        <br />
        <MonthInput
          placeholder="Month"
          className="example-calendar-input"
          name="month"
          popupPosition="bottom right"
          value={this.state.month}
          iconPosition="left"
          autoComplete="off"
          onChange={this.handleChange} />
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