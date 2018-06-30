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
    onMonthChange
  } = props;
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      <PickerHeader
        onDateClick={handleHeaderDateClick}
        onNextBtnClick={showNextYear}
        onPrevBtnClick={showPrevYear}
        activeYear={dateToShow.format('YYYY')}
        width="3" />
      <MonthPickerComponent
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