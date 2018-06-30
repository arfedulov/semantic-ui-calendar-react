import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { PickerHeader, DatePickerComponent } from '..';
import { CustomPropTypes } from '../../lib/customPropTypes';

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
    <Table
      unstackable
      celled
      textAlign="center">
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
    </Table>
  );
}

DayMode.propTypes = {
  handleHeaderDateClick: PropTypes.func,
  showNextMonth: PropTypes.func,
  showPrevMonth: PropTypes.func,
  dateToShow: CustomPropTypes.dateToShow,
  onDateClick: PropTypes.func,
  activeDate: CustomPropTypes.activeDate
};

export default DayMode;
export {
  DayMode
};

