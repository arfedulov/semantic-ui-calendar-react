import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { getUnhandledProps } from '../../lib';
import { DATES_RANGE_INPUT } from '../../lib/COMPONENT_TYPES';
import { DatesRangePickerContent } from '../../components/pickerContent';
import {
  CustomPopup as Popup,
  CustomInput as Input,
  withStateInput
} from '../';
import { CustomPropTypes } from '../../lib/customPropTypes';

class DatesRangeInput extends React.Component {

  static META = {
    type: DATES_RANGE_INPUT,
    name: 'DatesRangeInput'
  }

  getPicker() {
    const {
      handleHeaderDateClick,
      showNextMonth,
      showPrevMonth,
      dateToShow,
      datesRange,
      setDatesRange,
      isDateDisabled,
      prevDisabled,
      nextDisabled,
    } = this.props.wrapperState;
    return (
      <DatesRangePickerContent
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        isDateDisabled={isDateDisabled}
        handleHeaderDateClick={handleHeaderDateClick}
        showNextMonth={showNextMonth}
        showPrevMonth={showPrevMonth}
        dateToShow={dateToShow}
        datesRange={datesRange}
        setDatesRange={setDatesRange} />
    );
  }

  render() {
    const {
      onChange,
      icon,
      popupPosition,
      inline,
      hoverable
    } = this.props;
    
    const rest = getUnhandledProps(DatesRangeInput, this.props);
    const inputElement = (
      <Input
        { ...rest }
        onChange={onChange}
        icon={icon} />
    );
    if (inline) {
      return (
        this.getPicker()
      );
    }
    return (
      <Popup
        position={popupPosition}
        trigger={inputElement}
        hoverable={hoverable}>
        { this.getPicker() }
      </Popup>
    );
  }
}

DatesRangeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  /** Character that used to divide dates in string. */
  popupPosition: CustomPropTypes.popupPosition,
  inline: PropTypes.bool,
  wrapperState: CustomPropTypes.wrapperState,
  hoverable: PropTypes.bool
};

DatesRangeInput.defaultProps = {
  icon: 'calendar',
  inline: false,
  hoverable: true
};

const WrappedDatesRangeInput = withStateInput(DatesRangeInput);

export default WrappedDatesRangeInput;
export {
  WrappedDatesRangeInput as DatesRangeInput
};