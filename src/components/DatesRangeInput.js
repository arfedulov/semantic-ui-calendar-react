import React from 'react';
import { Input } from 'semantic-ui-react';
import { DatesRangePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function DatesRangeInput(props) {
  const {
    onChange,
    value,
    placeholder
  } = props;
  const rest = getUnhandledProps(DatesRangeInput, props);
  
  const inputElement = (
    <Input
      { ...rest }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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
      <DatesRangePicker
        onDatesRangeChange={onChange} />
    </Popup>
  );
}

DatesRangeInput.propTypes = {
  /** (value) => {} where value has format 'DD-MM-YYYY - DD-MM-YYYY' */
  onChange: PropTypes.func,
  /** selected date value in format 'DD-MM-YYYY - DD-MM-YYYY' */
  value: PropTypes.string,
  placeholder: PropTypes.string
};

DatesRangeInput.defaultProps = {
  value: '',
  placeholder: ''
};

export default DatesRangeInput;
export {
  DatesRangeInput
};