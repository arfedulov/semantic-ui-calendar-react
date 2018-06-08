import React from 'react';
import { PickerHeader, MonthPickerComponent } from '../';

function MonthMode(props) {
  const {
    handleHeaderDateClick,
    showNextYear,
    showPrevYear,
    dateToShow,
    onMonthChange
  } = props;
  return (
    <React.Fragment>
      <PickerHeader
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextYear}
        onPrevBtnClick={showPrevYear}
        activeYear={dateToShow.format('YYYY')}
        width="3" />
      <MonthPickerComponent
        activeMonth={dateToShow.format('MMM')}
        onMonthClick={onMonthChange} />
    </React.Fragment>
  );
}

export default MonthMode;
export {
  MonthMode
};