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

  handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form>
        <DateInput
          name="date"
          placeholder="Date"
          value={this.state.date}
          iconPosition="left"
          onChange={this.handleChange} />
        <TimeInput
          name="time"
          placeholder="Time"
          value={this.state.time}
          iconPosition="left"
          onChange={this.handleChange} />
        <DateTimeInput
          name="dateTime"
          placeholder="Date Time"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleChange} />
        <DatesRangeInput
          name="datesRange"
          placeholder="From - To"
          value={this.state.datesRange}
          iconPosition="left"
          onChange={this.handleChange} />
      </Form>
    );
  }
}
```

Also you can build a form with inline pickers as inputs. Just set ``inline`` prop on input element and it will be displayed as inline picker:
```javascript
class DateTimeFormInline extends React.Component {
 handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form>
        <DateInput
          inline
          name="date"
          value={this.state.date}
          onChange={this.handleDateChange} />
      </Form>
    );
  }
}
```

# Locales support

Since ``semantic-ui-calendar-react`` uses moment.js it has complete locales support.
To change locale you need to set ``moment``'s locale in a scope that contains ``semantic-ui-calendar-react`` components:

```javascript

moment.locale('ru')

// code that uses ``semantic-ui-calendar-react`` components

```

# Supported elements

### DateInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| {string} Date formatting string. You can use here anything that can be passed to ``moment().format``. Default: ``DD-MM-YYYY``|
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``startMode`` | {string} Display mode to start. One of ['year', 'month', 'day']. Default: ``day``   |
| ``closable`` | {bool} If true, popup closes after selecting a date   |

### TimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a time   |

### DateTimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| {string} Date formatting string. You can use here anything that can be passed to ``moment().format``. Default: ``DD-MM-YYYY``|
| ``divider`` | {string} Date and time divider. Default: `` `` |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``startMode`` | {string} Display mode to start. One of ['year', 'month', 'day']. Default: ``day``   |
| ``closable`` | {bool} If true, popup closes after selecting a date-time   |

### DatesRangeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``dateFormat``| {string} Date formatting string. You can use here anything that can be passed to ``moment().format``. Default: ``DD.MM.YY``|
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a dates range   |

### YearInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a year   |

### MonthInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a month   |