import React from 'react';
import { Input } from 'semantic-ui-react';
import { DateTimePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: '',
      selectedTime: ''
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      selectedDate,
      selectedTime
    } = this.state;
    const filled = selectedDate && selectedTime;
    const updated = (selectedDate !== prevState.selectedDate || selectedTime !== prevState.selectedTime);
    if (filled && updated) {
      this.props.onChange(selectedDate + ' ' + selectedTime);
    }
  }

  onDateChange = (newDate) => {
    this.setState({
      selectedDate: newDate.format('DD-MM-YYYY')
    });
  }

  onTimeChange = (newTime) => {
    this.setState({
      selectedTime: newTime
    });
  }

  onInputFieldChange = (event) => {
    this.props.onChange(event.target.value);
  }

  render() {
    const {
      value,
      placeholder
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        onChange={this.onInputFieldChange}
        placeholder={placeholder}
        value={value}
        icon="calendar"
        iconPosition="left"
        type="text" />
    );
    return (
      <Popup
        on="click"
        className="suir-calendar popup"
        hoverable
        trigger={inputElement}>
        <DateTimePicker
          onDateChange={this.onDateChange}
          onTimeChange={this.onTimeChange} />
      </Popup>
    );
  }
}

DateTimeInput.propTypes = {
  /** (value) => {} where value has format 'DD-MM-YYYY hh:mm' */
  onChange: PropTypes.func,
  /** selected date and time value in format 'DD-MM-YYYY hh:mm' */
  value: PropTypes.string,
  placeholder: PropTypes.string
};

DateTimeInput.defaultProps = {
  value: '',
  placeholder: ''
};

export default DateTimeInput;
export {
  DateTimeInput
};