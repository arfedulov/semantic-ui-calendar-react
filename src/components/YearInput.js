import React from 'react';
import { Input } from 'semantic-ui-react';
import { YearPicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function YearInput(props) {
  const {
    onChange,
    icon,
    popupPosition
  } = props;
  const rest = getUnhandledProps(YearInput, props);

  const inputElement = (
    <Input
      { ...rest }
      icon={icon}
      onChange={onChange} />
  );
  return (
    <Popup
      on="click"
      position={popupPosition}
      className="suir-calendar popup"
      hoverable
      trigger={inputElement}>
      <YearPicker
        onYearChange={onChange} />
    </Popup>
  );
}

YearInput.propTypes = {
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
  ])
};

YearInput.defaultProps = {
  icon: 'calendar'
};

export default YearInput;
export {
  YearInput
};