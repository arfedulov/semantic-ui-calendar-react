import React from 'react';
import { PickerHeader, TimePickerComponent } from '../';
import { DatePickerContent } from './DatePickerContent.js';

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
    onNextBtnClick
  } = props;
  const headerWidth = mode === 'minute'? '3' : mode === 'hour'? '4' : '7';
  if (mode !== 'hour' && mode !== 'minute') {
    return (
      <DatePickerContent
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
    <React.Fragment>
      <PickerHeader
        onDateClick={handleHeaderTimeClick}
        onNextBtnClick={showNextDay}
        onPrevBtnClick={showPrevDay}
        activeDate={activeDate}
        includeDay
        width={headerWidth} />
      <TimePickerComponent
        mode={mode}
        activeHour={activeHour}
        activeMinute={activeMinute}
        onHourClick={onHourClick}
        onMinuteClick={onMinuteClick} />
    </React.Fragment>
  );
}

export default DateTimePickerContent;
export {
  DateTimePickerContent
};