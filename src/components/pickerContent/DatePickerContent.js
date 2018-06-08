import React from 'react';
import { MonthMode } from '../pickerModes/MonthMode.js';
import { DayMode } from '../pickerModes/DayMode.js';
import { YearMode } from '../pickerModes/YearMode.js';

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
    onNextBtnClick
  } = props;
  if (mode === 'year') {
    const value = activeDate && activeDate.isValid()? activeDate.format('YYYY') : '';
    return (
      <YearMode
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
        handleHeaderDateClick={handleHeaderDateClick}
        showNextYear={showNextYear}
        showPrevYear={showPrevYear}
        dateToShow={dateToShow}
        onMonthChange={onMonthChange} />
    );
  }
  return (
    <DayMode
      handleHeaderDateClick={handleHeaderDateClick}
      showNextMonth={showNextMonth}
      showPrevMonth={showPrevMonth}
      dateToShow={dateToShow}
      onDateClick={onDateClick}
      activeDate={activeDate} />
  );
}

export default DatePickerContent;
export {
  DatePickerContent
};