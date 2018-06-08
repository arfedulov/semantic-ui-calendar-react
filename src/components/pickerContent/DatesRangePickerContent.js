import React from 'react';
import { PickerHeader, DatePickerComponent } from '../';

function DatesRangePickerContent(props) {
  const {
    handleHeaderDateClick,
    showNextMonth,
    showPrevMonth,
    dateToShow,
    datesRange,
    setDatesRange
  } = props;
  return (
    <React.Fragment>
      <PickerHeader
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextMonth}
        onPrevBtnClick={showPrevMonth}
        activeDate={dateToShow}
        activeDatesRange={datesRange}
        showWeeks
        width="7" />
      <DatePickerComponent
        datesRange={datesRange}
        onDateClick={setDatesRange}
        showedMonth={dateToShow} />
    </React.Fragment>
  );
}

export default DatesRangePickerContent;
export {
  DatesRangePickerContent
};