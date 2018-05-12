import React from 'react';
import ReactDOM from 'react-dom';
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
    <div className="tmp-calendar-container">
      <h2>Inline datepicker</h2>
      <DatePicker />
      <h2>Time picker</h2>
      <TimePicker />
      <h2>DateTime picker</h2>
      <DateTimePicker />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);