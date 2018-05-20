import React from 'react';
import { Input } from 'semantic-ui-react';
import { DatesRangePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function DatesRangeInput(props) {
  const {
    onChange,
    icon
  } = props;
  const rest = getUnhandledProps(DatesRangeInput, props);
  
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
      <DatesRangePicker
        onDatesRangeChange={onChange} />
    </Popup>
  );
}

DatesRangeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any
};

DatesRangeInput.defaultProps = {
  icon: 'calendar'
};

export default DatesRangeInput;
export {
  DatesRangeInput
};