import React from 'react';
import { Input } from 'semantic-ui-react';
import { MonthPicker, CustomPopup as Popup } from '../../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../utils.js';

function MonthInput(props) {
  const {
    onChange,
    icon,
    popupPosition,
    inline
  } = props;
  const onMonthChange = (event, data) => {
    _.invoke(props, 'onChange', event, { ...props, value: data.value });
  };
  const rest = getUnhandledProps(MonthInput, props);

  const inputElement = (
    <Input
      { ...rest }
      icon={icon}
      onChange={onChange} />
  );
  if (inline) {
    return <MonthPicker onMonthChange={onMonthChange} />;
  }
  return (
    <Popup
      position={popupPosition}
      trigger={inputElement}>
      <MonthPicker
        onMonthChange={onMonthChange} />
    </Popup>
  );
}

MonthInput.propTypes = {
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

MonthInput.defaultProps = {
  icon: 'calendar',
  inline: false
};

export default MonthInput;
export {
  MonthInput
};