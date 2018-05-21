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
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleDateChange} />
        <TimeInput
          placeholder="Time"
          value={this.state.time}
          iconPosition="left"
          onChange={this.handleTimeChange} />
        <DateTimeInput
          placeholder="Date Time"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleDateTimeChange} />
        <DatesRangeInput
          placeholder="From - To"
          value={this.state.datesRange}
          iconPosition="left"
          onChange={this.handleDatesRangeChange} />
      </Form>
    );
  }
}
```
And you have a form with date/time inputs.

# Supported elements

### DateInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| Date formatting string. You can use here anything that can be passed to ``moment().format``|

### TimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |

### DateTimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| Date formatting string. You can use here anything that can be passed to ``moment().format``|
| ``divider`` | Date and time divider |

### DatesRangeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| Date formatting string. You can use here anything that can be passed to ``moment().format``|
| ``divider`` | Dates divider |