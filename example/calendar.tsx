import moment from 'moment';
// import 'moment/locale/ru';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  Checkbox,
  Form,
  Header,
  Icon,
} from 'semantic-ui-react';

import {
  DateInput,
  DateInputOnChangeData,
  DatesRangeInput,
  DatesRangeInputOnChangeData,
  DateTimeInput,
  DateTimeInputOnChangeData,
  MonthInput,
  MonthInputOnChangeData,
  MonthRangeInput,
  MonthRangeInputOnChangeData,
  TimeInput,
  TimeInputOnChangeData,
  YearInput,
  YearInputOnChangeData,
} from '../src/inputs';

type DateTimeFormHandleChangeData = DateInputOnChangeData
  | DatesRangeInputOnChangeData
  | DateTimeInputOnChangeData
  | MonthInputOnChangeData
  | MonthRangeInputOnChangeData
  | TimeInputOnChangeData
  | YearInputOnChangeData;

class App extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      clearable: false,
    };
  }

  public render() {
    return (
      <div className='example-calendar-container'>
        <Header as='h2' dividing>
          As text fields
          <Header.Subheader>
            <Checkbox
              label='Make data inputs clearable'
              checked={this.state.clearable}
              onChange={this.handleCheckboxChange.bind(this)}
            />
          </Header.Subheader>
        </Header>

        <DateTimeForm clearable={this.state.clearable}
        />
        <h2>Inline</h2>
        <DateTimeFormInline />
      </div>
    );
  }

  private handleCheckboxChange() {
    this.setState(() => ({
      clearable: !this.state.clearable,
    }));
  }
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
      monthRange: '',
    };
  }

  public render() {
    const { clearable } = this.props;

    return (
      <Form>
        <DateInput
          placeholder='Date'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='date'
          closable
          clearIcon={(<Icon name='remove' color='red' />)}
          clearable={clearable}
          animation='scale'
          duration={200}
          hideMobileKeyboard
          value={this.state.date}
          iconPosition='left'
          preserveViewMode={false}
          autoComplete='off'
          onChange={this.handleChange}
        />
        <br />
        <DateInput
          startMode='year'
          popupPosition='bottom right'
          placeholder='Date startMode year'
          className='example-calendar-input'
          name='dateStartYear'
          animation='fly left'
          duration={300}
          closable
          hideMobileKeyboard
          clearable={clearable}
          value={this.state.dateStartYear}
          iconPosition='left'
          autoComplete='off'
          preserveViewMode={false}
          onChange={this.handleChange}
        />
        <br />
        <TimeInput
          placeholder='Time'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='time'
          animation='horizontal flip'
          duration={300}
          closable
          autoComplete='off'
          hideMobileKeyboard
          clearable={clearable}
          value={this.state.time}
          iconPosition='left'
          onChange={this.handleChange}
          minutesStep={5}
          minutesPerRow={3}
        />
        <br />
        <DateTimeInput
          placeholder='Date Time'
          className='example-calendar-input'
          popupPosition='bottom right'
          name='dateTime'
          closable
          clearable={clearable}
          hideMobileKeyboard
          value={this.state.dateTime}
          iconPosition='left'
          preserveViewMode={false}
          autoComplete='off'
          onChange={this.handleChange}
        />
        <br />
        <DatesRangeInput
          dateFormat='DD.MM.YY'
          placeholder='From - To'
          popupPosition='bottom right'
          className='example-calendar-input'
          name='datesRange'
          closable
          hideMobileKeyboard
          clearable={clearable}
          value={this.state.datesRange}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange}
        />
        <br />
        <YearInput
          placeholder='Year'
          className='example-calendar-input'
          name='year'
          popupPosition='bottom right'
          clearable={clearable}
          closable
          hideMobileKeyboard
          value={this.state.year}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange}
        />
        <br />
        <MonthInput
          placeholder='Month'
          className='example-calendar-input'
          name='month'
          popupPosition='bottom right'
          clearable={clearable}
          closable
          hideMobileKeyboard
          value={this.state.month}
          iconPosition='left'
          autoComplete='off'
          onChange={this.handleChange}
        />
        <br />
        <MonthRangeInput
          placeholder='MonthRange'
          dateFormat='YYYY-MM'
          name='monthRange'
          popupPosition='bottom right'
          clearable={clearable}
          closable
          hideMobileKeyboard
          iconPosition='left'
          autoComplete='off'
          value={this.state.monthRange}
          onChange={this.handleChange}/>
      </Form>
    );
  }

  private handleChange = (event: React.SyntheticEvent, { name, value }: DateTimeFormHandleChangeData) => {
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
      monthRange: '',
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
          onChange={this.handleChange}
          marked={[new Date()]}
          markColor='orange'
        />
        <br />
        <TimeInput
          inline
          className='example-calendar-input'
          value={this.state.time}
          name='time'
          onChange={this.handleChange}
        />
        <br />
        <DateTimeInput
          inline
          className='example-calendar-input'
          value={this.state.dateTime}
          name='dateTime'
          onChange={this.handleChange}
        />
        <br />
        <DatesRangeInput
          inline
          className='example-calendar-input'
          value={this.state.datesRange}
          name='datesRange'
          onChange={this.handleChange}
        />
        <br />
        <YearInput
          inline
          className='example-calendar-input'
          value={this.state.year}
          name='year'
          onChange={this.handleChange}
        />
        <br />
        <MonthInput
          inline
          className='example-calendar-input'
          value={this.state.month}
          name='month'
          onChange={this.handleChange}
        />
        <br/>
        <MonthRangeInput
          inline
          className='example-calendar-input'
          value={this.state.monthRange}
          name='monthRange'
          onChange={this.handleChange}
        />
      </Form>
    );
  }

  private handleChange = (event: React.SyntheticEvent, { name, value }: DateTimeFormHandleChangeData) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
