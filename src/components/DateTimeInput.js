import React from 'react';
import { Input } from 'semantic-ui-react';
import { DateTimePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps, cloneReplaceValue } from '../utils.js';

class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: '',
      selectedTime: ''
    };
  }

  getDateTime = ({ date = '', time = '' }) => {
    return `${date} ${time}`;
  }

  onDateChange = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getDateTime({ date: data.value.format('DD-MM-YYYY') }));
      this.props.onChange(event, newData);
      return {
        selectedDate: data.value.format('DD-MM-YYYY')
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
      value,
      placeholder,
      onChange
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        onChange={onChange}
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