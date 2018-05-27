import React from 'react';
import { Input } from 'semantic-ui-react';
import { DatesRangePicker, CustomPopup as Popup } from '../../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../utils.js';

function DatesRangeInput(props) {
  const {
    onChange,
    icon,
    dateFormat,
    divider,
    popupPosition,
    inline
  } = props;
  const rest = getUnhandledProps(DatesRangeInput, props);
  
  const inputElement = (
    <Input
      { ...rest }
      onChange={onChange}
      icon={icon} />
  );
  if (inline) {
    return (
      <DatesRangePicker
        position={popupPosition}
        dateFormat={dateFormat}
        divider={divider}
        onDatesRangeChange={onChange} />
    );
  }
  return (
    <Popup
      on="click"
      className="suir-calendar popup"
      hoverable
      trigger={inputElement}>
      <DatesRangePicker
        position={popupPosition}
        dateFormat={dateFormat}
        divider={divider}
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
  icon: PropTypes.any,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``.
   */
  dateFormat: PropTypes.string,
  /** Character that used to divide dates in string. */
  divider: PropTypes.string,
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

DatesRangeInput.defaultProps = {
  icon: 'calendar',
  inline: false
};

export default DatesRangeInput;
export {
  DatesRangeInput
};