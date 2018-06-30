import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import {
  CustomPopup as Popup,
  CustomInput as Input,
  withStateInput,
  YearPickerMixin
} from '..';
import { getUnhandledProps } from '../../lib';
import {
  DATE_TIME_INPUT
} from '../../lib/COMPONENT_TYPES';
import { DateTimePickerContent } from '../../components/pickerContent';
import { CustomPropTypes } from '../../lib/customPropTypes';


class DateTimeInput extends YearPickerMixin {

  static META = {
    type: DATE_TIME_INPUT,
    name: 'DateTimeInput'
  }

  constructor(props) {
    super(props);

    this.state = {
      yearsStart: props.wrapperState.dateToShow.year() - 6
    };
  }

  getPicker() {
    const {
      dateToShow,
      activeHour,
      activeMinute,
      mode,
      handleHeaderDateClick,
      handleHeaderTimeClick,
      onYearChange,
      showNextMonth,
      showPrevMonth,
      showNextYear,
      showPrevYear,
      showNextDay,
      showPrevDay,
      onMonthChange,
      onDateClick,
      onHourClick,
      onMinuteClick
    } = this.props.wrapperState;
    return (
      <DateTimePickerContent
        activeDate={dateToShow}
        activeHour={activeHour}
        activeMinute={activeMinute}
        mode={mode}
        handleHeaderDateClick={handleHeaderDateClick}
        handleHeaderTimeClick={handleHeaderTimeClick}
        onYearChange={onYearChange}
        showNextMonth={showNextMonth}
        showPrevMonth={showPrevMonth}
        showNextYear={showNextYear}
        showPrevYear={showPrevYear}
        showNextDay={showNextDay}
        showPrevDay={showPrevDay}
        dateToShow={dateToShow}
        onMonthChange={onMonthChange}
        onDateClick={onDateClick}
        onHourClick={onHourClick}
        onMinuteClick={onMinuteClick}
        yearsRange={this.getYearsRange()}
        onPrevBtnClick={this.onPrevBtnClick}
        onNextBtnClick={this.onNextBtnClick} />
    );
  }

  render() {
    const {
      icon,
      onChange,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        value={value}
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
        trigger={inputElement}>
        { this.getPicker() }
      </Popup>
    );
  }
}

DateTimeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  popupPosition: CustomPropTypes.popupPosition,
  inline: PropTypes.bool,
  value: PropTypes.string,
  wrapperState: CustomPropTypes.wrapperState
};

DateTimeInput.defaultProps = {
  icon: 'calendar',
  inline: false,
  value: ''
};

const WrappedDateTimeInput = withStateInput(DateTimeInput);

export default WrappedDateTimeInput;
export {
  WrappedDateTimeInput as DateTimeInput
};