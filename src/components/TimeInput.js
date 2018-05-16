import React from 'react';
import { Input } from 'semantic-ui-react';
import { TimePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function TimeInput(props) {
  const {
    onChange,
    value,
    placeholder
  } = props;
  const rest = getUnhandledProps(TimeInput, props);

  const onTimeChange = (newTime) => {
    if (typeof newTime === 'string') {
      onChange(newTime);
    }
    if (newTime.target) {
      onChange(newTime.target.value);
    }
  };

  const inputElement = (
    <Input
      { ...rest }
      onChange={onTimeChange}
      placeholder={placeholder}
      value={value}
      icon="time"
      iconPosition="left"
      type="text" />
  );
  return (
    <Popup
      on="click"
      className="suir-calendar popup"
      hoverable
      trigger={inputElement}>
      <TimePicker
        onTimeChange={onTimeChange} />
    </Popup>
  );
}

TimeInput.propTypes = {
  /** (value) => {} where value has format 'hh:mm' */
  onChange: PropTypes.func,
  /** selected time value in format 'hh:mm' */
  value: PropTypes.string,
  placeholder: PropTypes.string
};

TimeInput.defaultProps = {
  value: '',
  placeholder: ''
};

export default TimeInput;
export {
  TimeInput
};