import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

const YEAR_CALENDAR_ROW_WIDTH = '3';

function YearView(props) {
  const {
    years,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    onYearClick,
    hasNextPage,
    hasPrevPage,
    onHeaderClick,
    disabled,
    active,
  } = props;
  const headerTitle = `${_.first(years)} - ${_.last(years)}`;
  return (
    <Calendar>
      <Header
        title={headerTitle}
        onNextPageBtnClick={onNextPageBtnClick}
        onPrevPageBtnClick={onPrevPageBtnClick}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onHeaderClick={onHeaderClick}
        width={YEAR_CALENDAR_ROW_WIDTH}
        displayWeeks={false} />
      <Body
        width={YEAR_CALENDAR_ROW_WIDTH}
        data={years}
        onCellClick={onYearClick}
        active={active}
        disabled={disabled} />
    </Calendar>
  );
}

YearView.propTypes = {
  /** An array of years to fill a calendar with. */
  years: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on year. */
  onYearClick: PropTypes.func.isRequired,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool.isRequired,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool.isRequired,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of numbers that represent indexes of years in `years` array that should be displayed as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Index of a year in `years` array that should be displayed as active. */
  active: PropTypes.number,
};

export default YearView;
