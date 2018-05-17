# semantic-ui-calendar-react
Datepicker react component based on semantic-ui-react components

My intention was to create something that looks like this https://github.com/mdehoog/Semantic-UI-Calendar.

Here you can find a live example https://arfedulov.ru/examples/semantic-ui-calendar-react.

# installation
``npm i semantic-ui-calendar-react``

Also you need to add css in your html:
``<link rel="stylesheet" type="text/css" href="node_modules/semantic-ui-calendar-react/dist/css/calendar.min.css">``

# usage
Let's create a form that needs date-related input fields.

Import input components:
```javascript
import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput
} from 'semantic-ui-calendar-react';
```
Then build a form:
```javascript
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

  handleDateChange = (newDate) => {
    this.setState({ date: newDate });
  }

  handleTimeChange = (newTime) => {
    this.setState({ time: newTime });
  }

  handleDateTimeChange = (newDateTime) => {
    this.setState({ dateTime: newDateTime });
  }

  handleDatesRangeChange = (newDatesRange) => {
    this.setState({ datesRange: newDatesRange });
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
```
And you have a form with date/time inputs.
