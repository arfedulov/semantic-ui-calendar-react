:tada: Starting with version 0.8.0 it's css free.
:warning: Uncompatible with *semantic-ui-react* version 0.83.0

# semantic-ui-calendar-react
Datepicker react component based on semantic-ui-react components

My intention was to create something that looks like this https://github.com/mdehoog/Semantic-UI-Calendar.

Here you can find a live example https://arfedulov.github.io/semantic-ui-calendar-react

# installation
```
npm i semantic-ui-calendar-react
```

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
          onChange={this.handleChange}
        />
        <TimeInput
          name="time"
          placeholder="Time"
          value={this.state.time}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <DateTimeInput
          name="dateTime"
          placeholder="Date Time"
          value={this.state.dateTime}
          iconPosition="left"
          onChange={this.handleChange}
        />
        <DatesRangeInput
          name="datesRange"
          placeholder="From - To"
          value={this.state.datesRange}
          iconPosition="left"
          onChange={this.handleChange}
        />
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
          name='date'
          value={this.state.date}
          onChange={this.handleDateChange}
        />
      </Form>
    );
  }
}
```

or you can make it cleanable in the following way,

```javascript
class ClearableDateTimeForm extends React.Component {
  handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <Form>
        <DateInput
          clearable
          clearIcon={<Icon name="remove" color="red" />}
          name="date"
          value={this.state.date}
          onChange={this.handleDateChange}
        />
      </Form>
    );
  }
}
```

# Locales support

Since ``semantic-ui-calendar-react`` uses moment.js it supports locales.
You can set locale globally:

```javascript
import moment from 'moment';
import 'moment/locale/ru';
```

You can also set locale for *Input component locally using ``localization`` prop.

```jsx
<DateInput localization='ru' />
```

# Supported elements

### DateInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``dateFormat``| {string} Date formatting string. You can use here anything that can be passed to ``moment().format``. Default: ``DD-MM-YYYY``|
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``startMode`` | {string} Display mode to start. One of ['year', 'month', 'day']. Default: ``day``   |
| ``closable`` | {bool} If true, popup closes after selecting a date   |
| ``initialDate`` | {string\|moment\|Date} Date on which calendar opens. By default it opens on today's date. (Do not be confused by property name. For setting some default value just set into `value` prop). |
| ``disable`` | {string\|moment\|Date\|string[]\|moment[]\|Date[]} Date or list of dates that are displayed as disabled |
| ``enable`` | {string[]\|moment[]\|Date[]} Date or list of dates that are enabled (the rest are disabled) |
| ``maxDate`` | {string\|moment} Maximum date that can be selected |
| ``minDate`` | {string\|moment} Minimum date that can be selected |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``preserveViewMode`` | {bool} Preserve last mode (`day`, `hour`, `minute`) each time user opens dialog. Default ``true`` |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``marked`` | {moment\|Date\|moment[]\|Date[]} Date or list of dates that are displayed as marked |
| ``markColor`` | {string\|SemanticCOLORs} String specifying the mark color. Must be one of the Semantic UI colors |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### TimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a time   |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``timeFormat`` | {string} One of ["24", "AMPM", "ampm"]. Default: ``"24"`` |
| ``disableMinute`` | {bool} If ``true``, minutes picker won't be shown after picking the hour. Default: ``false`` |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### DateTimeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``dateTimeFormat`` | {string} Datetime formatting string for the input's `value`. You can use any string here that can be passed to ``moment().format``. If provided, it overrides ``dateFormat``, ``divider``, and ``timeFormat``. **Note:** this does not affect the formats used to display the pop-up date and time pickers; it only affects the format of the input's `value` field. Default: ``null`` |
| ``dateFormat``| {string} Date formatting string. You can use any string here that can be passed to ``moment().format``. Default: ``DD-MM-YYYY``. This formats only the date component of the datetime. |
| ``timeFormat`` | {string} One of ["24", "AMPM", "ampm"]. Default: ``"24"`` |
| ``divider`` | {string} Date and time divider. Default: `` `` |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``startMode`` | {string} Display mode to start. One of ['year', 'month', 'day']. Default: ``day``   |
| ``closable`` | {bool} If true, popup closes after selecting a date-time   |
| ``initialDate`` | {string\|moment\|Date} Date on which calendar opens. By default it opens on today's date. (Do not be confused by property name. For setting some default value just set into `value` prop). |
| ``disable`` | {string\|moment\|string[]\|moment[]} Date or list of dates that are displayed as disabled |
| ``maxDate`` | {string\|moment} Maximum date that can be selected |
| ``minDate`` | {string\|moment} Minimum date that can be selected |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``preserveViewMode`` | {bool} Preserve last mode (`day`, `hour`, `minute`) each time user opens dialog. Default ``true`` |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``marked`` | {moment\|Date\|moment[]\|Date[]} Date or list of dates that are displayed as marked |
| ``markColor`` | {string\|SemanticCOLORs} String specifying the mark color. Must be one of the Semantic UI colors |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### DatesRangeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``dateFormat``| {string} Date formatting string. You can use here anything that can be passed to ``moment().format``. Default: ``DD.MM.YY``|
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a dates range   |
| ``initialDate`` | {string\|moment\|Date} Date on which calendar opens. By default it opens on today's date. (Do not be confused by property name. For setting some default value just set into `value` prop). |
| ``maxDate`` | {string\|moment} Maximum date that can be selected |
| ``minDate`` | {string\|moment} Minimum date that can be selected |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``marked`` | {moment\|Date\|moment[]\|Date[]} Date or list of dates that are displayed as marked |
| ``markColor`` | {string\|SemanticCOLORs} String specifying the mark color. Must be one of the Semantic UI colors |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``allowSameEndDate`` | {boolean} Allow end date to be the same as start date. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### YearInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a year   |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``initialDate`` | {string\|moment\|Date} Date on which calendar opens. By default it opens on today's date. (Do not be confused by property name. For setting some default value just set into `value` prop). |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### MonthInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a month   |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``dateFormat`` | {string} Moment date formatting string. Default: ``"MMM"`` |
| ``disable`` | {string\|Moment\|Date\|string[]\|Moment[]\|Date[]} Date or list of dates that are displayed as disabled. |
| ``maxDate`` | {string\|Moment\|Date\|string[]\|Moment[]\|Date[]} Maximum date that can be selected. |
| ``minDate`` | {string\|Moment\|Date\|string[]\|Moment[]\|Date[]} Minimum date that can be selected. |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |

### MonthRangeInput

| Prop | Description |
| -----| ------------|
| all that can be used with SUIR Form.Input | |
| ``popupPosition``| {string} One of ['top left', 'top right', 'bottom left', 'bottom right', 'right center', 'left center', 'top center', 'bottom center']. Default: ``top left``|
| ``inline`` | {bool} If ``true`` inline picker displayed. Default: ``false`` |
| ``closable`` | {bool} If true, popup closes after selecting a month   |
| ``inlineLabel`` | {bool} A field can have its label next to instead of above it. |
| ``closeOnMouseLeave`` | {bool} Should close when cursor leaves calendar popup. Default: ``true`` |
| ``dateFormat`` | {string} Moment date formatting string. Default: ``"MMM"`` |
| ``maxDate`` | {string\|Moment\|Date\|string[]\|Moment[]\|Date[]} Maximum date that can be selected. |
| ``minDate`` | {string\|Moment\|Date\|string[]\|Moment[]\|Date[]} Minimum date that can be selected. |
| ``mountNode`` | {any} The node where the picker should mount. |
| ``onClear`` | {func} Called after clear icon has clicked. |
| ``clearable`` | {boolean} Using the clearable setting will let users remove their selection from a calendar. |
| ``clearIcon`` | {any} Optional Icon to display inside the clearable Input. |
| ``pickerWidth`` | {string} Optional width value for picker (any string value that could be assigned to `style.width`). |
| ``pickerStyle`` | {object} Optional `style` object for picker. |
| ``duration`` | {number} Optional duration of the CSS transition animation in milliseconds. Default: `200` |
| ``animation`` | {string} Optional named animation event to used. Must be defined in CSS. Default: `'scale'` |
| ``localization`` | {string} Sets Moment date locale locally for this component. |
| ``icon`` | {string\|false} icon to display inside Input. |
| ``iconPosition`` | {'left'\|'right'} icon position inside Input. Default: 'right'. |
| ``hideMobileKeyboard`` | {bool} Try to prevent mobile keyboard appearing. |
