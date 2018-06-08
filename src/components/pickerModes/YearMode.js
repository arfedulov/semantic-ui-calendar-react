import React from 'react';
import { PickerHeader, YearPickerComponent } from '../';

function YearMode(props) {
  const {
    onHeaderDateClick,
    yearsRange,
    onPrevBtnClick,
    onNextBtnClick,
    onYearClick,
    value
  } = props;
  return (
    <React.Fragment>
      <PickerHeader
        width="3"
        onDateClick={onHeaderDateClick}
        activeYears={yearsRange}
        onPrevBtnClick={onPrevBtnClick}
        onNextBtnClick={onNextBtnClick} />
      <YearPickerComponent
        onYearClick={onYearClick}
        activeYear={value}
        yearsStart={yearsRange.start} />
    </React.Fragment>
  );
}

export default YearMode;
export {
  YearMode
};