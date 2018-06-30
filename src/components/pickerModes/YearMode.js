import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { PickerHeader, YearPickerComponent } from '..';
import { CustomPropTypes } from '../../lib/customPropTypes';

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
    <Table
      unstackable
      celled
      textAlign="center">
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
    </Table>
  );
}

YearMode.propTypes = {
  onHeaderDateClick: PropTypes.func,
  yearsRange: CustomPropTypes.yearsRange,
  onPrevBtnClick: PropTypes.func,
  onNextBtnClick: PropTypes.func,
  onYearClick: PropTypes.func,
  value: PropTypes.string
};

export default YearMode;
export {
  YearMode
};