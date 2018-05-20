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
      icon,
      onChange
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        onChange={onChange}
        icon={icon} />
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
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any
};

DateTimeInput.defaultProps = {
  icon: 'calendar'
};

export default DateTimeInput;
export {
  DateTimeInput
};