import React from 'react';
import PropTypes from 'prop-types';

import {
  CustomPopup as Popup,
  CustomInput as Input,
  withStateInput,
  YearPickerMixin
} from '..';
import { getUnhandledProps } from '../../lib';
import {
  DATE_INPUT
} from '../../lib/COMPONENT_TYPES.js';
import { DatePickerContent } from '../../components';
import { CustomPropTypes } from '../../lib/customPropTypes';
import { isMoment } from '../../../node_modules/moment';

class DateInput extends YearPickerMixin {

  static META = {
    type: DATE_INPUT,
    name: 'DateInput'
  }

  constructor(props) {
    super(props);

    this.state = {
      yearsStart: props.wrapperState.dateToShow.year() - 6 // int
    };
  }

  getPicker() {
    const {
      mode,
      handleHeaderDateClick,
      onYearChange,
      showNextYear,
      showPrevYear,
      dateToShow,
      onMonthChange,
      showNextMonth,
      showPrevMonth,
      onDateClick,
      activeDate,
      isDateDisabled,
      nextDisabled,
      prevDisabled,
    } = this.props.wrapperState;
    return (
      <DatePickerContent
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        isDateDisabled={isDateDisabled}
        mode={mode}
        handleHeaderDateClick={handleHeaderDateClick}
        onYearChange={onYearChange}
        showNextYear={showNextYear}
        showPrevYear={showPrevYear}
        dateToShow={dateToShow}
        onMonthChange={onMonthChange}
        showNextMonth={showNextMonth}
        showPrevMonth={showPrevMonth}
        onDateClick={onDateClick}
        activeDate={activeDate}
        yearsRange={this.getYearsRange()}
        onPrevBtnClick={this.onPrevBtnClick}
        onNextBtnClick={this.onNextBtnClick} />
    );
  }

  handleDateChange = (e, { value }) => {
    const valid = !this.props.wrapperState.isDateDisabled(value);
    if (valid) {
      this.props.wrapperState.onDateChange(e, { value });
    } else {
      this.props.wrapperState.onDateChange(e, { value: '' });
    }
  }

  render() {
    const {
      icon,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(DateInput, this.props);
    
    const inputElement = (
      <Input
        { ...rest }
        value={value}
        onChange={this.handleDateChange}
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

DateInput.propTypes = {
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  popupPosition: CustomPropTypes.popupPosition,
  inline: PropTypes.bool,
  value: PropTypes.string,
  wrapperState: CustomPropTypes.wrapperState
};

DateInput.defaultProps = {
  icon: 'calendar',
  inline: false,
  value: ''
};

const WrappedDateInput = withStateInput(DateInput);

export default WrappedDateInput;
export {
  WrappedDateInput as DateInput
};