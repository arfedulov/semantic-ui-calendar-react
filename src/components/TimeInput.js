import React from 'react';
import { Input, Popup } from 'semantic-ui-react';
import { TimePicker } from '../containers';
import PropTypes from 'prop-types';

function TimeInput(props) {
  const {
    onChange,
    value
  } = props;

  const inputElement = (
    <Input
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
  value: PropTypes.string
};

TimeInput.defaultProps = {
  value: ''
};

export default TimeInput;
export {
  TimeInput
};