import React from 'react';
import PropTypes from 'prop-types';

import { TimePickerComponent } from '..';
import { DatePickerContent } from './DatePickerContent';
import { CustomPropTypes } from '../../lib/customPropTypes';

function DateTimePickerContent(props) {
  const {
    activeDate,
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
    dateToShow,
    onMonthChange,
    onDateClick,
    onHourClick,
    onMinuteClick,
    yearsRange,
    onPrevBtnClick,
    onNextBtnClick,
    isDateDisabled,
    prevDisabled,
    nextDisabled,
  } = props;
  if (mode !== 'hour' && mode !== 'minute') {
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
        yearsRange={yearsRange}
        onPrevBtnClick={onPrevBtnClick}
        onNextBtnClick={onNextBtnClick} />
    );
  }
  return (
    <TimePickerComponent
      mode={mode}
      showDate
      activeHour={activeHour}
      activeMinute={activeMinute}
      onHourClick={onHourClick}
      onMinuteClick={onMinuteClick}
      handleHeaderTimeClick={handleHeaderTimeClick}
      activeDate={activeDate}
      showNextDay={showNextDay}
      showPrevDay={showPrevDay} />
  );
}

DateTimePickerContent.propTypes = {
  activeDate: CustomPropTypes.activeDate,
  activeHour: PropTypes.string,
  activeMinute: PropTypes.string,
  mode: PropTypes.string,
  handleHeaderDateClick: PropTypes.func,
  handleHeaderTimeClick: PropTypes.func,
  onYearChange: PropTypes.func,
  showNextMonth: PropTypes.func,
  showPrevMonth: PropTypes.func,
  showNextYear: PropTypes.func,
  showPrevYear: PropTypes.func,
  showNextDay: PropTypes.func,
  showPrevDay: PropTypes.func,
  dateToShow: CustomPropTypes.dateToShow,
  onMonthChange: PropTypes.func,
  onDateClick: PropTypes.func,
  onHourClick: PropTypes.func,
  onMinuteClick: PropTypes.func,
  yearsRange: CustomPropTypes.yearsRange,
  onPrevBtnClick: PropTypes.func,
  onNextBtnClick: PropTypes.func
};

export default DateTimePickerContent;
export {
  DateTimePickerContent
};