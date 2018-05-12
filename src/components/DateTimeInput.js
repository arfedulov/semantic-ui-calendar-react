import React from 'react';
import { Input, Popup } from 'semantic-ui-react';
import { DateTimePicker } from '../containers';
import PropTypes from 'prop-types';

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

  render() {
    const { value } = this.props;
  
    const inputElement = (
      <Input
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
  value: PropTypes.string
};

DateTimeInput.defaultProps = {
  value: ''
};

export default DateTimeInput;
export {
  DateTimeInput
};