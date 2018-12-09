import * as moment from 'moment';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Form } from 'semantic-ui-react';

import {
  DateInput,
  DateInputOnChangeData,
  DatesRangeInput,
  DatesRangeInputOnChangeData,
  DateTimeInput,
  DateTimeInputOnChangeData,
  MonthInput,
  MonthInputOnChangeData,
  TimeInput,
  TimeInputOnChangeData,
  YearInput,
  YearInputOnChangeData,
} from '../src/inputs';

moment.locale('en');

type DateTimeFormHandleChangeData = DateInputOnChangeData
  | DatesRangeInputOnChangeData
  | DateTimeInputOnChangeData
  | MonthInputOnChangeData
  | TimeInputOnChangeData
  | YearInputOnChangeData;

function App() {
  return (
    <div className='example-calendar-container'>
      <h2>As text fields</h2>
      <DateTimeForm />
      <h2>Inline</h2>
      <DateTimeFormInline />
    </div>
  );
}

class DateTimeForm extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      year: '',
      date: '',
      dateStartYear: '',
      time: '',
      dateTime: '',
      datesRange: '',
      month: '',
    };
  }

  public render() {
    return (
      <Form>
        <DateInput
          placeholder='Date'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='date'
          value={this.state.date}
          iconPosition='left'
          preserveViewMode={false}
          autoComplete='off'
          onChange={this.handleChange} />
        <br />
        <DateInput
          startMode='year'
          popupPosition='bottom right'
          placeholder='Date startMode year'
          className='example-calendar-input'
          name='dateStartYear'
          value={this.state.dateStartYear}
          iconPosition='left'
          autoComplete='off'
          preserveViewMode={false}
          onChange={this.handleChange} />
        <br />
        <TimeInput
          placeholder='Time'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='time'
          autoComplete='off'
          value={this.state.time}
          iconPosition='left'
          onChange={this.handleChange} />
        <br />
        <DateTimeInput
          placeholder='Date Time'
          className='example-calendar-input'
          popupPosition='bottom right'
          name='dateTime'
          value={this.state.dateTime}
          iconPosition='left'
          preserveViewMode={false}
          autoComplete='off'
          onChange={this.handleChange} />
        <br />
        <DatesRangeInput
          dateFormat='DD.MM.YY'
          placeholder='From - To'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='datesRange'
          value={this.state.datesRange}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange} />
        <br />
        <YearInput
          placeholder='Year'
          className='example-calendar-input'
          name='year'
          popupPosition='bottom right'
          value={this.state.year}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange} />
        <br />
        <MonthInput
          placeholder='Month'
          className='example-calendar-input'
          name='month'
          popupPosition='bottom right'
          value={this.state.month}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange} />
      </Form>
    );
  }

  private handleChange = (event: React.SyntheticEvent, {name, value}: DateTimeFormHandleChangeData) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
}

class DateTimeFormInline extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      year: '',
      month: '',
      date: '',
      time: '',
      dateTime: '',
      datesRange: '',
    };
  }

  public render() {
    return (
      <Form>
        <DateInput
          inline
          className='example-calendar-input'
          value={this.state.date}
          name='date'
          onChange={this.handleChange} />
        <br />
        <TimeInput
          inline
          className='example-calendar-input'
          value={this.state.time}
          name='time'
          onChange={this.handleChange} />
        <br />
        <DateTimeInput
          inline
          className='example-calendar-input'
          value={this.state.dateTime}
          name='dateTime'
          onChange={this.handleChange} />
        <br />
        <DatesRangeInput
          inline
          className='example-calendar-input'
          value={this.state.datesRange}
          name='datesRange'
          onChange={this.handleChange} />
        <br />
        <YearInput
          inline
          className='example-calendar-input'
          value={this.state.year}
          name='year'
          onChange={this.handleChange} />
        <br />
        <MonthInput
          inline
          className='example-calendar-input'
          value={this.state.month}
          name='month'
          onChange={this.handleChange} />
      </Form>
    );
  }

  private handleChange = (event: React.SyntheticEvent, {name, value}: DateTimeFormHandleChangeData) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
