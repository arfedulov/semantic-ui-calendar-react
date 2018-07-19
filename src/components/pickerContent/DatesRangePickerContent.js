import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { PickerHeader, DatePickerComponent } from '..';
import { CustomPropTypes } from '../../lib/customPropTypes';

function DatesRangePickerContent(props) {
  const {
    handleHeaderDateClick,
    showNextMonth,
    showPrevMonth,
    dateToShow,
    datesRange,
    setDatesRange,
    isDateDisabled,
    prevDisabled,
    nextDisabled,
  } = props;
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      <PickerHeader
        prevDisabled={prevDisabled.bind(null, 'day')}
        nextDisabled={nextDisabled.bind(null, 'day')}
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextMonth}
        onPrevBtnClick={showPrevMonth}
        activeDate={dateToShow}
        activeDatesRange={datesRange}
        showWeeks
        width="7" />
      <DatePickerComponent
        isDateDisabled={isDateDisabled}
        datesRange={datesRange}
        onDateClick={setDatesRange}
        showedMonth={dateToShow} />
    </Table>
  );
}

DatesRangePickerContent.propTypes = {
  handleHeaderDateClick: PropTypes.func,
  showNextMonth: PropTypes.func,
  showPrevMonth: PropTypes.func,
  dateToShow: CustomPropTypes.dateToShow,
  datesRange: CustomPropTypes.datesRange,
  setDatesRange: PropTypes.func
};

export default DatesRangePickerContent;
export {
  DatesRangePickerContent
};