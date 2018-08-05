import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { PickerHeader, MonthPickerComponent } from '..';
import { CustomPropTypes } from '../../lib/customPropTypes';

function MonthMode(props) {
  const {
    handleHeaderDateClick,
    showNextYear,
    showPrevYear,
    dateToShow,
    onMonthChange,
    prevDisabled,
    nextDisabled,
    isDateDisabled,
  } = props;
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      <PickerHeader
        prevDisabled={prevDisabled.bind(null, 'month')}
        nextDisabled={nextDisabled.bind(null, 'month')}
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextYear}
        onPrevBtnClick={showPrevYear}
        activeYear={dateToShow.format('YYYY')}
        width="3" />
      <MonthPickerComponent
        isDateDisabled={isDateDisabled}
        activeMonth={dateToShow.format('MMM')}
        onMonthClick={onMonthChange} />
    </Table>
  );
}

MonthMode.propTypes = {
  handleHeaderDateClick: PropTypes.func,
  showNextYear: PropTypes.func,
  showPrevYear: PropTypes.func,
  dateToShow: CustomPropTypes.dateToShow,
  onMonthChange: PropTypes.func
};

export default MonthMode;
export {
  MonthMode
};