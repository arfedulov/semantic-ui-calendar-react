import React from 'react';
import { Input } from 'semantic-ui-react';
import { DatePicker, CustomPopup as Popup } from '../containers';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

function DateInput(props) {
  const {
    onChange,
    icon,
    dateFormat,
    startMode,
    popupPosition,
    inline,
    value
  } = props;
  const onDateChange = (event, data) => {
    if (data.value.format) {
      data.value = data.value.format(dateFormat);
    }
    onChange(event, data);
  };
  const rest = getUnhandledProps(DateInput, props);
  const inputElement = (
    <Input
      { ...rest }
      value={value}
      onChange={onDateChange}
      icon={icon} />
  );
 
  if (inline) {
    return (
      <DatePicker
        dateFormat={dateFormat}
        startMode={startMode}
        onDateChange={onDateChange} />
    );
  }
  return (
    <Popup
      on="click"
      position={popupPosition}
      className="suir-calendar popup"
      hoverable
      trigger={inputElement}>
      <DatePicker
        initialValue={value}
        startMode={startMode}
        onDateChange={onDateChange} />
    </Popup>
  );
}

DateInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``
   */
  dateFormat: PropTypes.string,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
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
  inline: PropTypes.bool,
  value: PropTypes.string
};

DateInput.defaultProps = {
  icon: 'calendar',
  dateFormat: 'DD-MM-YYYY',
  startMode: 'day',
  inline: false
};

export default DateInput;
export {
  DateInput
};