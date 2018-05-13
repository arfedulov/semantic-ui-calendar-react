import React from 'react';
import { Input, Popup } from 'semantic-ui-react';
import { TimePicker } from '../containers';
import PropTypes from 'prop-types';

function TimeInput(props) {
  const {
    onChange,
    value,
    className,
    placeholder
  } = props;

  const inputElement = (
    <Input
      placeholder={placeholder}
      className={className}
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
  /** (value) => {} where value has format 'hh:mm' */
  onChange: PropTypes.func,
  /** selected time value in format 'hh:mm' */
  value: PropTypes.string,
  className: PropTypes.string,
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