import React from 'react';
import { Input } from 'semantic-ui-react';
import { TimePicker, CustomPopup as Popup } from '../../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../utils.js';

function TimeInput(props) {
  const {
    onChange,
    icon,
    popupPosition,
    inline
  } = props;
  const rest = getUnhandledProps(TimeInput, props);

  const inputElement = (
    <Input
      { ...rest }
      icon={icon}
      onChange={onChange} />
  );
  if (inline) {
    return <TimePicker onTimeChange={onChange} />;
  }
  return (
    <Popup
      position={popupPosition}
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
  icon: PropTypes.any,
  popupPosition: PropTypes.oneOf([
    'top left',
    'top right',
    'bottom left',
    'bottom right',
    'right center',
    'left center',
    'top center',
    'bottom center'
  ]),
  inline: PropTypes.bool
};

TimeInput.defaultProps = {
  icon: 'time',
  inline: false
};

export default TimeInput;
export {
  TimeInput
};