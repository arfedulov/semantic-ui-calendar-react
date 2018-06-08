import React from 'react';
import { PickerHeader, DatePickerComponent } from '../';

function DayMode(props) {
  const {
    handleHeaderDateClick,
    showNextMonth,
    showPrevMonth,
    dateToShow,
    onDateClick,
    activeDate
  } = props;
  return (
    <React.Fragment>
      <PickerHeader
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextMonth}
        onPrevBtnClick={showPrevMonth}
        activeDate={dateToShow}
        showWeeks
        width="7" />
      <DatePickerComponent
        onDateClick={onDateClick}
        activeDate={activeDate}
        showedMonth={dateToShow} />
    </React.Fragment>
  );
}

export default DayMode;
export {
  DayMode
};

