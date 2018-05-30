import React from 'react';
import { Input } from 'semantic-ui-react';
import { DateTimePicker, CustomPopup as Popup } from '../../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps, cloneReplaceValue } from '../../utils.js';

class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: '',
      selectedTime: ''
    };
  }

  getDateTime = ({ date = '', time = '' }) => {
    return `${date}${this.props.divider}${time}`;
  }

  onDateChange = (event, data) => {
    const { dateFormat } = this.props;
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getDateTime({ date: data.value.format(dateFormat) }));
      this.props.onChange(event, newData);
      return {
        selectedDate: data.value.format(dateFormat)
      };
    });
  }

  onTimeChange = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getDateTime({ date: prevState.selectedDate, time: data.value }));
      this.props.onChange(event, newData);
      return {
        selectedTime: data.value
      };
    });
  }

  render() {
    const {
      icon,
      onChange,
      startMode,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        value={value}
        onChange={onChange}
        icon={icon} />
    );
    if (inline) {
      return (
        <DateTimePicker
          dateFormat={this.props.dateFormat}
          startMode={startMode}
          onDateChange={this.onDateChange}
          onTimeChange={this.onTimeChange} />
      );
    }
    return (
      <Popup
        position={popupPosition}
        trigger={inputElement}>
        <DateTimePicker
          initialValue={value}
          dateFormat={this.props.dateFormat}
          startMode={startMode}
          onDateChange={this.onDateChange}
          onTimeChange={this.onTimeChange} />
      </Popup>
    );
  }
}

DateTimeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``.
   */
  dateFormat: PropTypes.string,
  /** Characters that are used to divide date and time in string. */
  divider: PropTypes.string,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
  popupPosition: PropTypes.oneOf([
    'top left',
    'top right',
    'bottom left',
    'bottom right',
    'right center',
    'left center',
    'top center',
    'bottom center'
  ]),
  inline: PropTypes.bool,
  value: PropTypes.string
};

DateTimeInput.defaultProps = {
  icon: 'calendar',
  dateFormat: 'DD-MM-YYYY',
  divider: ' ',
  startMode: 'day',
  inline: false
};

export default DateTimeInput;
export {
  DateTimeInput
};