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

  const inputElement = (
    <Input
      { ...rest }
      onChange={onChange}
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
        onTimeChange={onChange} />
    </Popup>
  );
}

TimeInput.propTypes = {
  /** (event, data) => {} where data.value has format 'hh:mm' */
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