import React from 'react';
import PropTypes from 'prop-types';

import {
  MonthMode,
  DayMode,
  YearMode
} from '../pickerModes';
import { CustomPropTypes } from '../../lib/customPropTypes';

function DatePickerContent(props) {
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
    yearsRange,
    onPrevBtnClick,
    onNextBtnClick,
    isDateDisabled,
    nextDisabled,
    prevDisabled,
  } = props;
  if (mode === 'year') {
    const value = activeDate && activeDate.isValid()? activeDate.format('YYYY') : '';
    return (
      <YearMode
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        isDateDisabled={isDateDisabled}
        onHeaderDateClick={handleHeaderDateClick}
        yearsRange={yearsRange}
        onPrevBtnClick={onPrevBtnClick}
        onNextBtnClick={onNextBtnClick}
        onYearClick={onYearChange}
        value={value} />
    );
  }
  if (mode === 'month') {
    return (
      <MonthMode
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        isDateDisabled={isDateDisabled}
        handleHeaderDateClick={handleHeaderDateClick}
        showNextYear={showNextYear}
        showPrevYear={showPrevYear}
        dateToShow={dateToShow}
        onMonthChange={onMonthChange} />
    );
  }
  return (
    <DayMode
      prevDisabled={prevDisabled}
      nextDisabled={nextDisabled}
      isDateDisabled={isDateDisabled}
      handleHeaderDateClick={handleHeaderDateClick}
      showNextMonth={showNextMonth}
      showPrevMonth={showPrevMonth}
      dateToShow={dateToShow}
      onDateClick={onDateClick}
      activeDate={activeDate} />
  );
}

DatePickerContent.propTypes = {
  mode: PropTypes.string,
  handleHeaderDateClick: PropTypes.func,
  onYearChange: PropTypes.func,
  showNextYear: PropTypes.func,
  showPrevYear: PropTypes.func,
  dateToShow: CustomPropTypes.dateToShow,
  onMonthChange: PropTypes.func,
  showNextMonth: PropTypes.func,
  showPrevMonth: PropTypes.func,
  onDateClick: PropTypes.func,
  activeDate: CustomPropTypes.activeDate,
  yearsRange: CustomPropTypes.yearsRange,
  onPrevBtnClick: PropTypes.func,
  onNextBtnClick: PropTypes.func
};

export default DatePickerContent;
export {
  DatePickerContent
};