import React from 'react';
import { Input } from 'semantic-ui-react';
import { TimePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function TimeInput(props) {
  const {
    onChange,
    icon
  } = props;
  const rest = getUnhandledProps(TimeInput, props);

  const inputElement = (
    <Input
      { ...rest }
      icon={icon}
      onChange={onChange} />
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
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any
};

TimeInput.defaultProps = {
  icon: 'time'
};

export default TimeInput;
export {
  TimeInput
};