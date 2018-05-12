import React from 'react';
import { Input, Popup } from 'semantic-ui-react';
import { DatePicker } from '../containers';
import PropTypes from 'prop-types';

function DateInput(props) {
  const {
    onChange,
    value
  } = props;
  const onDateChange = (newDate) => {
    onChange(newDate.format('DD-MM-YYYY'));
  };

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
      <DatePicker
        onDateChange={onDateChange} />
    </Popup>
  );
}

DateInput.propTypes = {
  /** (value) => {} where value has format 'DD-MM-YYYY' */
  onChange: PropTypes.func,
  /** selected date value in format 'DD-MM-YYYY' */
  value: PropTypes.string
};

DateInput.defaultProps = {
  value: ''
};

export default DateInput;
export {
  DateInput
};